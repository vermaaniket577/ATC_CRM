output "cloudfront_domain_name" {
  description = "CloudFront Distribution Domain Name (Point your DNS / CNAME here)"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "s3_frontend_bucket" {
  description = "Amazon S3 Bucket for frontend deployment"
  value       = aws_s3_bucket.frontend.id
}

output "s3_artifacts_bucket" {
  description = "Amazon S3 Bucket for backend application artifacts and releases"
  value       = aws_s3_bucket.artifacts.id
}

output "ecr_repository_url" {
  description = "Amazon ECR Repository URL for backend container images"
  value       = aws_ecr_repository.backend.repository_url
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name (Point your API CNAME or proxy here)"
  value       = aws_lb.main.dns_name
}

output "asg_name" {
  description = "Auto Scaling Group name for rolling updates"
  value       = aws_autoscaling_group.backend.name
}

output "rds_endpoint" {
  description = "Amazon RDS MySQL Endpoint (Private internal connection)"
  value       = aws_db_instance.mysql.endpoint
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group for regulatory audit logs"
  value       = aws_cloudwatch_log_group.app_logs.name
}
