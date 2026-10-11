# ==============================================================================
# Apex Telecom CRM - AWS Frontend Deployment Script (PowerShell)
# ==============================================================================
param (
    [Parameter(Mandatory=$false)]
    [string]$S3Bucket = $env:AWS_S3_FRONTEND_BUCKET,

    [Parameter(Mandatory=$false)]
    [string]$CloudFrontId = $env:AWS_CLOUDFRONT_DIST_ID,

    [Parameter(Mandatory=$false)]
    [string]$AwsRegion = "ap-south-1"
)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  APEX TELECOM CRM - AWS FRONTEND DEPLOYMENT     " -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Check prerequisites
if (-not $S3Bucket) {
    $S3Bucket = Read-Host "Enter Target Amazon S3 Bucket Name (e.g. apex-telecom-crm-frontend-xyz)"
}

# 2. Build React production distribution
$FrontendDir = Join-Path $PSScriptRoot "..\..\frontend"
Set-Location $FrontendDir

Write-Host "[1/4] Building optimized React Vite distribution..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "React build failed. Aborting deployment."
    exit 1
}

# 3. Sync static assets with long-lived cache
Write-Host "[2/4] Uploading hashed static assets to S3 (Cache: 1 Year)..." -ForegroundColor Green
aws s3 sync dist/ "s3://$S3Bucket/" --delete `
    --cache-control "max-age=31536000,public,immutable" `
    --exclude "index.html" `
    --region $AwsRegion

# 4. Upload index.html with no-cache policy for instant updates
Write-Host "[3/4] Uploading index.html to S3 (No-Cache)..." -ForegroundColor Green
aws s3 cp dist/index.html "s3://$S3Bucket/index.html" `
    --cache-control "no-cache, no-store, must-revalidate" `
    --region $AwsRegion

# 5. Invalidate CloudFront cache if distribution ID is provided
if ($CloudFrontId) {
    Write-Host "[4/4] Invalidating CloudFront edge caches..." -ForegroundColor Green
    aws cloudfront create-invalidation --distribution-id $CloudFrontId --paths "/*"
} else {
    Write-Host "[4/4] Skipped CloudFront invalidation (Distribution ID not supplied)." -ForegroundColor Yellow
}

Write-Host "`n✓ Frontend deployment completed successfully!" -ForegroundColor Green
