#!/usr/bin/env bash
# ==============================================================================
# Apex Telecom CRM - Master AWS Deployment Orchestrator (Bash)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="${SCRIPT_DIR}/../terraform"
AWS_REGION="${1:-ap-south-1}"

echo "================================================================="
echo "  APEX TELECOM CRM - COMPLETE FULL-STACK AWS DEPLOYMENT          "
echo "================================================================="

# Retrieve Terraform Outputs if available
cd "${TERRAFORM_DIR}"
S3_FRONTEND=$(terraform output -raw s3_frontend_bucket 2>/dev/null || echo "${AWS_S3_FRONTEND_BUCKET:-}")
S3_ARTIFACTS=$(terraform output -raw s3_artifacts_bucket 2>/dev/null || echo "${AWS_S3_ARTIFACTS_BUCKET:-}")
CF_DOMAIN=$(terraform output -raw cloudfront_domain_name 2>/dev/null || echo "${AWS_CLOUDFRONT_DOMAIN:-}")
ALB_DNS=$(terraform output -raw alb_dns_name 2>/dev/null || echo "${AWS_ALB_URL:-}")
ASG_NAME=$(terraform output -raw asg_name 2>/dev/null || echo "${AWS_ASG_NAME:-}")

# 1. Deploy Backend
echo ""
echo "[Step 1/2] Deploying Java 27 / Spring Boot Backend..."
bash "${SCRIPT_DIR}/deploy-backend.sh" "${S3_ARTIFACTS}" "${ASG_NAME}" "${AWS_REGION}" "s3"

# 2. Deploy Frontend
echo ""
echo "[Step 2/2] Deploying React Vite Frontend to S3 & CloudFront..."
bash "${SCRIPT_DIR}/deploy-frontend.sh" "${S3_FRONTEND}" "${CF_DOMAIN}" "${AWS_REGION}"

echo ""
echo "================================================================="
echo "✓ FULL-STACK AWS DEPLOYMENT COMPLETE!"
if [ -n "${CF_DOMAIN}" ]; then
  echo "  Web Portal URL:  https://${CF_DOMAIN}"
fi
if [ -n "${ALB_DNS}" ]; then
  echo "  REST API / ALB:  http://${ALB_DNS}"
fi
echo "================================================================="
