#!/usr/bin/env bash
# ==============================================================================
# Apex Telecom CRM - AWS Backend Deployment Script (Bash)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/../../backend"
REPO_ROOT="${SCRIPT_DIR}/../.."

ARTIFACT_BUCKET="${1:-${AWS_S3_ARTIFACTS_BUCKET:-}}"
ASG_NAME="${2:-${AWS_ASG_NAME:-}}"
AWS_REGION="${3:-${AWS_REGION:-ap-south-1}}"
DEPLOY_MODE="${4:-${DEPLOY_MODE:-s3}}"

echo "================================================="
echo "  APEX TELECOM CRM - AWS BACKEND DEPLOYMENT      "
echo "  Mode: ${DEPLOY_MODE} | Region: ${AWS_REGION}   "
echo "================================================="

cd "${BACKEND_DIR}"
echo "[1/4] Building Spring Boot production executable JAR..."
mvn clean package -DskipTests

JAR_FILE=$(find target -maxdepth 1 -name "*.jar" ! -name "*sources.jar" ! -name "*javadoc.jar" | head -n 1)
if [ -z "${JAR_FILE}" ]; then
  echo "Error: No packaged JAR found in target/. Aborting." >&2
  exit 1
fi
echo "✓ Built target: ${JAR_FILE}"

if [ "${DEPLOY_MODE}" = "s3" ]; then
  if [ -z "${ARTIFACT_BUCKET}" ]; then
    read -rp "Enter Target S3 Artifacts Bucket: " ARTIFACT_BUCKET
  fi

  echo "[2/4] Uploading app.jar to S3 bucket (s3://${ARTIFACT_BUCKET}/backend/app.jar)..."
  aws s3 cp "${JAR_FILE}" "s3://${ARTIFACT_BUCKET}/backend/app.jar" --region "${AWS_REGION}"

  if [ -z "${ASG_NAME}" ]; then
    read -rp "Enter Auto Scaling Group Name (or press Enter to skip): " ASG_NAME || true
  fi

  if [ -n "${ASG_NAME}" ]; then
    echo "[3/4] Triggering zero-downtime ASG rolling instance refresh..."
    aws autoscaling start-instance-refresh \
      --auto-scaling-group-name "${ASG_NAME}" \
      --preferences '{"MinHealthyPercentage": 50, "InstanceWarmup": 180}' \
      --region "${AWS_REGION}"
  fi
elif [ "${DEPLOY_MODE}" = "ecr" ]; then
  cd "${REPO_ROOT}"
  ECR_URL="${AWS_ECR_REPO_URL:-}"
  if [ -z "${ECR_URL}" ]; then
    read -rp "Enter ECR Repository URL: " ECR_URL
  fi

  REGISTRY=$(echo "${ECR_URL}" | cut -d/ -f1)
  echo "[2/4] Authenticating with Amazon ECR..."
  aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${REGISTRY}"

  echo "[3/4] Building and pushing Docker container to ECR..."
  docker build -f docker/Dockerfile.backend -t "${ECR_URL}:latest" .
  docker push "${ECR_URL}:latest"
fi

echo "[4/4] Backend deployment successfully triggered!"
