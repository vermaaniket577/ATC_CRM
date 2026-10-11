terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Apex Telecom CRM"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Compliance  = "DoT-TRAI-DPDPA-2023"
    }
  }
}
