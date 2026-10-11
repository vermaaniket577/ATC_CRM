# AWS Cloud Deployment Architecture & Production Operations Guide

## 1. Executive Summary & Topology Overview

This document specifies the enterprise AWS deployment architecture for the **Apex Telecom CRM System**, engineered to support 50–100 concurrent internal telecom operators, managers, executives, and field technicians with 99.95% availability, sub-150ms internal API latency, and compliance with the **DoT (Department of Telecommunications)**, **TRAI**, and **Digital Personal Data Protection Act (DPDPA 2023)**.

### Target Deployment Region
- **Primary AWS Region**: `ap-south-1` (Mumbai, India) to maintain Indian data residency obligations for telecommunications customer data and billing records.
- **Availability Zones**: Multi-AZ deployment across `ap-south-1a` and `ap-south-1b`.

---

## 2. Infrastructure Architecture Diagram

```
                              [Internet / CRM Staff / Branches]
                                              │
                                     (HTTPS Port 443)
                                              │
                       ┌──────────────────────┴──────────────────────┐
                       │                                             │
               [CloudFront CDN]                              [AWS Route 53]
            (SSL Termination via ACM)                        (DNS & Failover)
                       │                                             │
                       ▼                                             ▼
             [Amazon S3 Bucket]                        [Application Load Balancer (ALB)]
          (Static React Single Page App)                 (Multi-AZ Public Subnets)
                                                                     │
                                                   ┌─────────────────┴─────────────────┐
                                                   │ (HTTP 8080 forwarded internally)  │
                                                   ▼                                   ▼
                                       [EC2 Instance 1 (AZ-1a)]            [EC2 Instance 2 (AZ-1b)]
                                       (Spring Boot / Java 27)             (Spring Boot / Java 27)
                                       (Private App Subnet)                (Private App Subnet)
                                                   │                                   │
                                                   └─────────────────┬─────────────────┘
                                                                     │
                                                       (MySQL Port 3306 Internal Only)
                                                                     │
                                                   ┌─────────────────┴─────────────────┐
                                                   ▼                                   ▼
                                       [Amazon RDS MySQL 8.0]              [RDS Standby Replica]
                                        (Primary - AZ-1a)                   (Synchronous - AZ-1b)
                                       (Private DB Subnet)                 (Private DB Subnet)
```

---

## 3. Network Architecture & Subnet Segmentation

A dedicated Virtual Private Cloud (VPC) `10.0.0.0/16` is partitioned into three isolated tiers across two Availability Zones:

| Tier | Subnet Name | CIDR Block | AZ | Route Table Target | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Public Tier** | `telecom-pub-sub-1a` | `10.0.1.0/24` | `ap-south-1a` | Internet Gateway (IGW) | Application Load Balancer & NAT Gateway 1 |
| **Public Tier** | `telecom-pub-sub-1b` | `10.0.2.0/24` | `ap-south-1b` | Internet Gateway (IGW) | Application Load Balancer & NAT Gateway 2 |
| **App Tier** | `telecom-app-sub-1a` | `10.0.10.0/24` | `ap-south-1a` | NAT Gateway 1 | EC2 / Spring Boot Backend Instance 1 |
| **App Tier** | `telecom-app-sub-1b` | `10.0.11.0/24` | `ap-south-1b` | NAT Gateway 2 | EC2 / Spring Boot Backend Instance 2 |
| **DB Tier** | `telecom-db-sub-1a` | `10.0.20.0/24` | `ap-south-1a` | Isolated (No Internet) | Amazon RDS MySQL Primary Node |
| **DB Tier** | `telecom-db-sub-1b` | `10.0.21.0/24` | `ap-south-1b` | Isolated (No Internet) | Amazon RDS MySQL Standby Replica |

---

## 4. Security Group Configurations (Principle of Least Privilege)

### 4.1. ALB Security Group (`sg-telecom-alb`)
- **Inbound**:
  - `HTTPS (443)`: `0.0.0.0/0` (or restricted to corporate VPN / office static CIDR blocks).
  - `HTTP (80)`: `0.0.0.0/0` (Redirects immediately to HTTPS 443 with 301).
- **Outbound**:
  - `Custom TCP (8080)`: Destination `sg-telecom-app` (Only to backend instances).

### 4.2. Application Security Group (`sg-telecom-app`)
- **Inbound**:
  - `Custom TCP (8080)`: Source `sg-telecom-alb` (Strictly ALB only; direct internet access blocked).
  - `SSH (22)`: Source `sg-telecom-bastion` (Only from AWS Systems Manager / Bastion host).
- **Outbound**:
  - `MySQL (3306)`: Destination `sg-telecom-db`.
  - `HTTPS (443)`: Destination `0.0.0.0/0` via NAT Gateway (For AWS Secrets Manager, CloudWatch, and payment webhook verification).

### 4.3. Database Security Group (`sg-telecom-db`)
- **Inbound**:
  - `MySQL (3306)`: Source `sg-telecom-app` only.
- **Outbound**:
  - Deny all outbound traffic (completely isolated database layer).

---

## 5. High Availability & Disaster Recovery (DR)

### 5.1. Multi-AZ Compute & Auto-Scaling
- **EC2 Sizing**: 2x `t4g.medium` instances (2 vCPUs, 4 GiB Memory, AWS Graviton2/3 processor architecture for superior price-performance).
- **Target Tracking Scaling**: Auto Scaling Group (ASG) minimum 2 instances, maximum 6 instances, triggered when ALB Average Request Count per Target exceeds 1,200 requests/minute or CPU utilization exceeds 70%.

### 5.2. Multi-AZ Database
- **RDS Engine**: Amazon RDS for MySQL 8.0 with `db.t4g.medium` (2 vCPUs, 4 GiB RAM, 100 GiB GP3 storage with 3,000 baseline IOPS).
- **Multi-AZ Replication**: Synchronous block-level replication to standby instance in `ap-south-1b`. Automatic failover in under 60 seconds without data loss.

### 5.3. Backup & Recovery Targets
- **Automated RDS Backups**: Daily snapshots retained for 30 days with Point-In-Time-Recovery (PITR) up to the past 5 minutes.
- **Recovery Point Objective (RPO)**: < 5 minutes.
- **Recovery Time Objective (RTO)**: < 15 minutes.

---

## 6. CloudWatch Monitoring, Auditing & Alarms

1. **System Health Metrics**:
   - `CPUUtilization > 80%` for 5 consecutive minutes (Triggers SNS alert to DevOps on-call).
   - `DatabaseConnections > 80` (Alert for connection pool saturation).
   - `HTTPCode_Target_5XX_Count > 10` per minute (Triggers high-priority incident).
2. **Regulatory Audit Logging**:
   - Spring Boot logs shipped via AWS CloudWatch Logs Agent to `/aws/telecom-crm/audit-logs`.
   - Log retention configured for **730 days (2 years)** in compliance with TRAI / DoT telecom licensing standards.
   - CloudTrail enabled across all regions with S3 Log file integrity validation enabled.

---

## 7. Estimated Monthly Cloud Cost Breakdown (in INR)

*Exchange Rate Assumption: 1 USD = ₹84.50 INR. Sized for 50–100 active concurrent enterprise users.*

| Component | AWS Resource Details | Quantity | Monthly Cost (USD) | Monthly Cost (INR) |
| :--- | :--- | :---: | :---: | :---: |
| **Frontend CDN** | Amazon CloudFront (100 GB transfer + 1M requests) | 1 | $10.00 | ₹845 |
| **Frontend Storage** | Amazon S3 Standard (10 GB SPA assets & assets) | 1 | $0.25 | ₹21 |
| **Application Load Balancer** | AWS ALB (720 hrs + 5 LCU) | 1 | $24.50 | ₹2,070 |
| **Backend Compute (EC2)** | 2x `t4g.medium` (Reserved 1-yr / On-Demand) | 2 | $48.20 | ₹4,073 |
| **Database (RDS)** | `db.t4g.medium` Multi-AZ, 100 GB GP3 Storage | 1 | $78.50 | ₹6,633 |
| **Automated Backups** | RDS Backup Storage (100 GB snapshots) | 1 | $9.50 | ₹803 |
| **NAT Gateways** | 2x NAT Gateway (AZ-1a & AZ-1b, 50 GB data processed) | 2 | $68.00 | ₹5,746 |
| **CloudWatch & Logs** | Detailed monitoring + 50 GB log ingestion (730-day retention) | 1 | $28.00 | ₹2,366 |
| **Data Transfer Out** | Internet Egress (~100 GB/month) | 1 | $9.00 | ₹760 |
| **Route 53 & ACM** | Hosted Zone + Public TLS Certificate | 1 | $0.50 | ₹42 |
| **AWS Shield Standard** | DDoS Protection baseline | Incl. | $0.00 | ₹0 |
| **Enterprise Support (Basic)** | AWS Basic Support Plan | Incl. | $0.00 | ₹0 |
| **Total Estimated Cost** | **Production High-Availability Setup** | | **$276.45** | **₹23,359 / month** |

### Cost Optimization Notes:
- Substituting 2 NAT Gateways with 1 NAT Gateway for dev/staging saves ₹2,873/month.
- 1-Year Reserved Instances for EC2 and RDS yield up to 38% cost reduction (~₹18,500/month).

---

## 8. Infrastructure as Code (Terraform Setup)

The entire production AWS architecture is codified in [`aws/terraform/`](file:///d:/ATC_CRM/aws/terraform):

| File | AWS Resources Provisioned |
| :--- | :--- |
| [`vpc.tf`](file:///d:/ATC_CRM/aws/terraform/vpc.tf) | Dedicated VPC `10.0.0.0/16`, 2 Public Subnets, 2 Private App Subnets, 2 Isolated DB Subnets, IGW, NAT Gateways & Route Tables |
| [`security_groups.tf`](file:///d:/ATC_CRM/aws/terraform/security_groups.tf) | Strict ingress/egress boundaries for ALB, EC2 App instances, and RDS MySQL |
| [`rds.tf`](file:///d:/ATC_CRM/aws/terraform/rds.tf) | Amazon RDS MySQL 8.0 Multi-AZ (`db.t4g.medium`), 100 GB GP3, Automated Backups (30 days), custom parameter group |
| [`asg.tf`](file:///d:/ATC_CRM/aws/terraform/asg.tf) | Graviton ARM64 Launch Template, IAM Instance Profile, Auto Scaling Group (Min 2, Max 6), CPU Target Tracking Policy |
| [`alb.tf`](file:///d:/ATC_CRM/aws/terraform/alb.tf) | Application Load Balancer, Target Group with `/actuator/health` checks, dynamic HTTP-to-HTTPS redirect |
| [`s3_cloudfront.tf`](file:///d:/ATC_CRM/aws/terraform/s3_cloudfront.tf) | Private S3 bucket for React SPA, CloudFront OAC distribution, SPA error route rewrite (404/403 -> index.html) |
| [`artifacts_bucket.tf`](file:///d:/ATC_CRM/aws/terraform/artifacts_bucket.tf) | Dedicated private S3 bucket for Spring Boot backend `app.jar` artifact releases |
| [`ecr.tf`](file:///d:/ATC_CRM/aws/terraform/ecr.tf) | Amazon Elastic Container Registry with automated image vulnerability scanning & lifecycle retention |
| [`cloudwatch.tf`](file:///d:/ATC_CRM/aws/terraform/cloudwatch.tf) | Log group (730-day retention for TRAI/DoT compliance), SNS alerts topic, High CPU alarm, ALB 5XX error alarm |
| [`variables.tf`](file:///d:/ATC_CRM/aws/terraform/variables.tf) | Configurable variables with sensible defaults for Mumbai `ap-south-1` region |
| [`outputs.tf`](file:///d:/ATC_CRM/aws/terraform/outputs.tf) | Exports CloudFront domain, S3 buckets, ALB DNS, ASG name, RDS endpoint, and Log Group |

### 8.1. Initializing & Provisioning AWS Infrastructure
```bash
# Navigate to Terraform workspace
cd aws/terraform

# 1. Initialize AWS providers and modules
terraform init

# 2. Preview resources to be provisioned
terraform plan -out=tfplan

# 3. Apply infrastructure to AWS (creates VPC, RDS Multi-AZ, ALB, ASG, S3 & CloudFront)
terraform apply tfplan
```

Upon completion, Terraform prints output values that feed directly into deployment scripts:
```
Outputs:
alb_dns_name            = "apex-telecom-crm-alb-182938491.ap-south-1.elb.amazonaws.com"
asg_name                = "apex-telecom-crm-asg-20261011"
cloudfront_domain_name  = "d1234abcd5678.cloudfront.net"
ecr_repository_url      = "123456789012.dkr.ecr.ap-south-1.amazonaws.com/apex-telecom-crm-backend"
rds_endpoint            = "apex-telecom-crm-mysql-primary.cx9876.ap-south-1.rds.amazonaws.com:3306"
s3_artifacts_bucket     = "apex-telecom-crm-artifacts-202610111234"
s3_frontend_bucket      = "apex-telecom-crm-frontend-202610111234"
```

---

## 9. Turnkey Deployment Scripts

Turnkey scripts are located in [`aws/scripts/`](file:///d:/ATC_CRM/aws/scripts) for both Windows (PowerShell) and Linux/macOS (Bash).

### 9.1. One-Click Full-Stack Deployment
```powershell
# Windows PowerShell
.\aws\scripts\deploy-all.ps1
```
```bash
# Linux / macOS / WSL
bash aws/scripts/deploy-all.sh
```

### 9.2. Backend Deployment Only
```powershell
# Deploy Spring Boot JAR via S3 with Auto Scaling Group rolling refresh:
.\aws\scripts\deploy-backend.ps1 -ArtifactBucket "apex-telecom-crm-artifacts-xyz" -AsgName "apex-telecom-crm-asg-xyz" -AlbUrl "http://<ALB_DNS>"

# Deploy Docker Container via Amazon ECR:
.\aws\scripts\deploy-backend.ps1 -DeployMode "ecr" -AwsRegion "ap-south-1"
```

### 9.3. Frontend Deployment Only
```powershell
# Deploy React build to S3 and invalidate CloudFront edge caches:
.\aws\scripts\deploy-frontend.ps1 -S3Bucket "apex-telecom-crm-frontend-xyz" -CloudFrontId "E1234567890ABC"
```

---

## 10. Automated GitHub Actions CI/CD Pipeline

The repository includes a production CI/CD workflow at [`.github/workflows/aws-deploy.yml`](file:///d:/ATC_CRM/.github/workflows/aws-deploy.yml).

### Pipeline Flow:
```
[Push to main/master]
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
[Backend CI: JDK 21]             [Frontend CI: Node 20]
mvn clean package (Tests pass)   npm ci && npm run build
       │                                 │
       └────────────────┬────────────────┘
                        ▼
               [Deploy to AWS Job]
                        │
       ├────────────────┴────────────────┐
       ▼                                 ▼
[Frontend S3 Sync]               [Backend S3 / ECR Upload]
[CloudFront Cache Invalidation]   [ASG Instance Refresh (Zero-Downtime)]
       │                                 │
       └────────────────┬────────────────┘
                        ▼
             [ALB Live Health Check]
```

### Required GitHub Repository Secrets:
Configure the following secrets under **Settings > Secrets and variables > Actions**:
- `AWS_ACCESS_KEY_ID`: IAM user access key with deployment privileges.
- `AWS_SECRET_ACCESS_KEY`: IAM user secret access key.
- `AWS_S3_FRONTEND_BUCKET`: Target S3 bucket for the React Single Page App.
- `AWS_S3_ARTIFACTS_BUCKET`: Target S3 bucket for `app.jar` releases.
- `AWS_CLOUDFRONT_DIST_ID`: CloudFront distribution ID for cache invalidation.
- `AWS_ASG_NAME`: Target Auto Scaling Group name for zero-downtime refresh.
- `AWS_ALB_URL`: ALB DNS name for automated health verification ping.

---

## 11. Custom Domain & SSL/TLS Configuration (Route 53 & ACM)

To link custom corporate domains (e.g., `crm.apextelecom.in` and `api.apextelecom.in`):

1. **Request Certificates in AWS Certificate Manager (ACM)**:
   - For CloudFront frontend: Request public certificate in **`us-east-1`** (N. Virginia is required for CloudFront).
   - For Application Load Balancer: Request public certificate in **`ap-south-1`** (Mumbai).
2. **Configure Terraform Variables**:
   In `aws/terraform/terraform.tfvars`:
   ```hcl
   certificate_arn = "arn:aws:acm:ap-south-1:123456789012:certificate/abc-123-def"
   ```
3. **Route 53 Alias Records**:
   - `crm.apextelecom.in` -> CloudFront distribution domain (`d1234abcd5678.cloudfront.net`).
   - `api.apextelecom.in` -> ALB DNS name (`apex-telecom-crm-alb-182938491.ap-south-1.elb.amazonaws.com`).

---

## 12. Rollback & Failover Procedures

1. **Frontend Rollback**:
   - Re-deploy previous timestamped S3 directory or re-run `aws s3 sync` from previous release artifact. Invalidate CloudFront in `< 2 minutes`.
2. **Backend Rollback**:
   - Revert Auto Scaling Group target image/JAR to previous release tag.
   - Run `aws autoscaling start-instance-refresh` to roll back to the healthy version.
3. **Database Failover & Point-In-Time Recovery**:
   - To trigger manual failover to the Multi-AZ standby node:
     ```bash
     aws rds reboot-db-instance --db-instance-identifier apex-telecom-crm-mysql-primary --force-failover
     ```
   - Failover completes in under 60 seconds with zero data loss.

