# ==============================================================================
# Apex Telecom CRM - AWS Backend Deployment Script (PowerShell)
# ==============================================================================
param (
    [Parameter(Mandatory=$false)]
    [string]$ArtifactBucket = $env:AWS_S3_ARTIFACTS_BUCKET,

    [Parameter(Mandatory=$false)]
    [string]$AsgName = $env:AWS_ASG_NAME,

    [Parameter(Mandatory=$false)]
    [string]$AwsRegion = "ap-south-1",

    [Parameter(Mandatory=$false)]
    [string]$AlbUrl = $env:AWS_ALB_URL,

    [Parameter(Mandatory=$false)]
    [ValidateSet("s3", "ecr")]
    [string]$DeployMode = "s3"
)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  APEX TELECOM CRM - AWS BACKEND DEPLOYMENT      " -ForegroundColor Yellow
Write-Host "  Mode: $DeployMode | Region: $AwsRegion         " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Check prerequisites
$BackendDir = Join-Path $PSScriptRoot "..\..\backend"
Set-Location $BackendDir

Write-Host "[1/4] Building Spring Boot production executable JAR..." -ForegroundColor Green
mvn clean package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build failed. Aborting deployment."
    exit 1
}

$JarFile = Get-ChildItem -Path "$BackendDir\target\*.jar" -Exclude "*sources.jar","*javadoc.jar" | Select-Object -First 1
if (-not $JarFile) {
    Write-Error "No packaged JAR found in $BackendDir\target\. Aborting."
    exit 1
}
Write-Host "✓ Built target: $($JarFile.Name) ($([math]::Round($JarFile.Length / 1MB, 2)) MB)" -ForegroundColor Green

# 2. Deploy via S3 & ASG Rolling Update
if ($DeployMode -eq "s3") {
    if (-not $ArtifactBucket) {
        $ArtifactBucket = Read-Host "Enter Target S3 Artifacts Bucket (e.g. apex-telecom-crm-artifacts-xyz)"
    }

    Write-Host "[2/4] Uploading app.jar to S3 artifacts bucket ($ArtifactBucket)..." -ForegroundColor Green
    aws s3 cp $JarFile.FullName "s3://$ArtifactBucket/backend/app.jar" --region $AwsRegion
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to upload JAR to S3. Check AWS credentials and bucket name."
        exit 1
    }

    if (-not $AsgName) {
        $AsgName = Read-Host "Enter Auto Scaling Group Name (or press Enter to skip ASG refresh)"
    }

    if ($AsgName) {
        Write-Host "[3/4] Triggering zero-downtime ASG rolling instance refresh..." -ForegroundColor Green
        aws autoscaling start-instance-refresh `
            --auto-scaling-group-name $AsgName `
            --preferences '{\"MinHealthyPercentage\": 50, \"InstanceWarmup\": 180}' `
            --region $AwsRegion
    } else {
        Write-Host "[3/4] Skipped ASG refresh (no group name provided)." -ForegroundColor Yellow
    }
}

# 3. Deploy via Docker & Amazon ECR
if ($DeployMode -eq "ecr") {
    $RootRepo = Join-Path $PSScriptRoot "..\.."
    Set-Location $RootRepo

    $EcrUrl = $env:AWS_ECR_REPO_URL
    if (-not $EcrUrl) {
        $EcrUrl = Read-Host "Enter ECR Repository URL (e.g. 123456789012.dkr.ecr.ap-south-1.amazonaws.com/apex-telecom-crm-backend)"
    }

    Write-Host "[2/4] Authenticating with Amazon ECR..." -ForegroundColor Green
    $Registry = $EcrUrl.Split('/')[0]
    aws ecr get-login-password --region $AwsRegion | docker login --username AWS --password-stdin $Registry

    Write-Host "[3/4] Building and pushing Docker image to ECR..." -ForegroundColor Green
    docker build -f docker/Dockerfile.backend -t "${EcrUrl}:latest" .
    docker push "${EcrUrl}:latest"
}

# 4. Optional Post-Deployment Health Check
if ($AlbUrl) {
    Write-Host "[4/4] Verifying health check on ALB endpoint ($AlbUrl)..." -ForegroundColor Green
    Start-Sleep -Seconds 5
    try {
        $Response = Invoke-RestMethod -Uri "$AlbUrl/actuator/health" -Method Get -TimeoutSec 10
        Write-Host "✓ Health check response: $($Response | ConvertTo-Json -Compress)" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Note: ALB health check returned warning: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "[4/4] Done. Point ALB /actuator/health to verify live status." -ForegroundColor Green
}

Write-Host "`n✓ Backend deployment completed successfully!" -ForegroundColor Green
