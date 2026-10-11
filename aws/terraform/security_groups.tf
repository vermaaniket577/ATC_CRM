# 1. ALB Security Group (Public facing)
resource "aws_security_group" "alb" {
  name        = "${var.app_name}-alb-sg"
  description = "Controls inbound traffic to Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP for redirect to HTTPS"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Forward to App Instances"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-alb-sg"
  }
}

# 2. Application Tier Security Group (Spring Boot Instances)
resource "aws_security_group" "app" {
  name        = "${var.app_name}-app-sg"
  description = "Restricts traffic strictly from ALB to Spring Boot port 8080"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow traffic from ALB on port 8080 only"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "Outbound to RDS and NAT Gateway"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-app-sg"
  }
}

# 3. Database Security Group (RDS MySQL)
resource "aws_security_group" "db" {
  name        = "${var.app_name}-db-sg"
  description = "Completely isolates MySQL 3306 to App instances only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow MySQL port 3306 from App SG only"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  tags = {
    Name = "${var.app_name}-db-sg"
  }
}
