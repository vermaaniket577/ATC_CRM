#!/usr/bin/env bash
# ==============================================================================
# Apex Telecom CRM - AWS Frontend Deployment Script (Bash)
# ==============================================================================
set -e

S3_BUCKET=${1:-$AWS_S3_FRONTEND_BUCKET}
CLOUDFRONT_ID=${2:-$AWS_CLOUDFRONT_DIST_ID}
AWS_REGION=${3:-"ap-south-1"}

echo "================================================="
echo "  APEX TELECOM CRM - AWS FRONTEND DEPLOYMENT     "
echo "================================================="

if [ -z "$S3_BUCKET" ]; then
    read -p "Enter Target Amazon S3 Bucket Name: " S3_BUCKET
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../../frontend"

echo "[1/4] Building optimized React Vite distribution..."
npm ci
npm run build

echo "[2/4] Uploading hashed static assets to S3 (Cache: 1 Year)..."
aws s3 sync dist/ "s3://$S3_BUCKET/" --delete \
    --cache-control "max-age=31536000,public,immutable" \
    --exclude "index.html" \
    --region "$AWS_REGION"

echo "[3/4] Uploading index.html to S3 (No-Cache)..."
aws s3 cp dist/index.html "s3://$S3_BUCKET/index.html" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --region "$AWS_REGION"

if [ -n "$CLOUDFRONT_ID" ]; then
    echo "[4/4] Invalidating CloudFront edge caches..."
    aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*"
else
    echo "[4/4] Skipped CloudFront invalidation (Distribution ID not supplied)."
fi

echo "✓ Frontend deployment completed successfully!"
