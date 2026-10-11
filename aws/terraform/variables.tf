variable "aws_region" {
  description = "Primary AWS deployment region (Mumbai, India for DoT/TRAI data residency)"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Target deployment environment"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name prefix for AWS resources"
  type        = string
  default     = "apex-telecom-crm"
}

variable "vpc_cidr" {
  description = "CIDR block for the dedicated Telecom VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "ec2_instance_type" {
  description = "EC2 instance size for Spring Boot (AWS Graviton architecture recommended)"
  type        = string
  default     = "t4g.medium"
}

variable "rds_instance_class" {
  description = "Amazon RDS instance type for MySQL Multi-AZ"
  type        = string
  default     = "db.t4g.medium"
}

variable "db_name" {
  description = "MySQL database name"
  type        = string
  default     = "telecom_crm"
}

variable "db_username" {
  description = "Master database username"
  type        = string
  default     = "telecom_app"
}

variable "db_password" {
  description = "Master database password"
  type        = string
  sensitive   = true
  default     = "SecureTelecomPass2026!#"
}

variable "jwt_secret" {
  description = "Base64 HMAC 256/512 bit secret for JWT token issuance"
  type        = string
  sensitive   = true
  default     = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
}

variable "certificate_arn" {
  description = "AWS Certificate Manager (ACM) SSL/TLS certificate ARN for HTTPS"
  type        = string
  default     = ""
}
