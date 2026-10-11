# ==============================================================================
# Apex Telecom CRM - Master AWS Deployment Orchestrator (PowerShell)
# ==============================================================================
param (
    [Parameter(Mandatory=$false)]
    [switch]$ApplyTerraform = $false,

    [Parameter(Mandatory=$false)]
    [string]$AwsRegion = "ap-south-1"
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  APEX TELECOM CRM - COMPLETE FULL-STACK AWS DEPLOYMENT          " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan

$TerraformDir = Join-Path $PSScriptRoot "..\terraform"
$ScriptsDir   = $PSScriptRoot

# 1. Optionally Apply Terraform Infrastructure
if ($ApplyTerraform) {
    Write-Host "`n[Step 1/3] Provisioning Cloud Infrastructure via Terraform..." -ForegroundColor Green
    Set-Location $TerraformDir
    terraform init
    terraform apply -auto-approve
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Terraform apply failed. Aborting."
        exit 1
    }
}

# 2. Retrieve outputs from Terraform or Environment
Set-Location $TerraformDir
try {
    $TfOutputs = terraform output -json | ConvertFrom-Json
    $S3Frontend  = $TfOutputs.s3_frontend_bucket.value
    $S3Artifacts = $TfOutputs.s3_artifacts_bucket.value
    $CloudFrontId = $TfOutputs.cloudfront_domain_name.value
    $AlbDns      = $TfOutputs.alb_dns_name.value
    $AsgName     = $TfOutputs.asg_name.value
} catch {
    Write-Host "Terraform state not locally found or outputs unavailable. Using environment variables." -ForegroundColor Yellow
    $S3Frontend  = $env:AWS_S3_FRONTEND_BUCKET
    $S3Artifacts = $env:AWS_S3_ARTIFACTS_BUCKET
    $CloudFrontId = $env:AWS_CLOUDFRONT_DIST_ID
    $AlbDns      = $env:AWS_ALB_URL
    $AsgName     = $env:AWS_ASG_NAME
}

# 3. Deploy Backend
Write-Host "`n[Step 2/3] Deploying Java 27 / Spring Boot Backend..." -ForegroundColor Green
& "$ScriptsDir\deploy-backend.ps1" -ArtifactBucket $S3Artifacts -AsgName $AsgName -AwsRegion $AwsRegion -AlbUrl "http://$AlbDns"

# 4. Deploy Frontend
Write-Host "`n[Step 3/3] Deploying React Vite Frontend to S3 & CloudFront..." -ForegroundColor Green
& "$ScriptsDir\deploy-frontend.ps1" -S3Bucket $S3Frontend -CloudFrontId $CloudFrontId -AwsRegion $AwsRegion

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host "✓ FULL-STACK AWS DEPLOYMENT COMPLETE!" -ForegroundColor Green
if ($CloudFrontId) {
    Write-Host "  Web Portal URL:  https://$CloudFrontId" -ForegroundColor Yellow
}
if ($AlbDns) {
    Write-Host "  REST API / ALB:  http://$AlbDns" -ForegroundColor Yellow
}
Write-Host "=================================================================" -ForegroundColor Cyan
