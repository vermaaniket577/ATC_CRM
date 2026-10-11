# DB Subnet Group across isolated Private DB subnets
resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-db-subnet-group"
  subnet_ids = [aws_subnet.private_db_1a.id, aws_subnet.private_db_1b.id]

  tags = {
    Name = "${var.app_name}-db-subnet-group"
  }
}

# MySQL 8.0 Parameter Group tuned for Telecom High-Throughput
resource "aws_db_parameter_group" "mysql8" {
  name   = "${var.app_name}-mysql8-params"
  family = "mysql8.0"

  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }

  parameter {
    name  = "collation_server"
    value = "utf8mb4_unicode_ci"
  }

  parameter {
    name  = "max_connections"
    value = "200"
  }

  parameter {
    name  = "time_zone"
    value = "+05:30"
  }
}

# Production Amazon RDS for MySQL Multi-AZ Deployment
resource "aws_db_instance" "mysql" {
  identifier        = "${var.app_name}-mysql-primary"
  engine            = "mysql"
  engine_version    = "8.0.36"
  instance_class    = var.rds_instance_class
  allocated_storage = 100
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  parameter_group_name   = aws_db_parameter_group.mysql8.name

  multi_az               = true # High Availability synchronous standby in AZ-1b
  publicly_accessible    = false
  skip_final_snapshot    = false
  final_snapshot_identifier = "${var.app_name}-final-snapshot"
  deletion_protection    = true

  backup_retention_period   = 30 # Retain automated daily backups for 30 days
  backup_window             = "21:00-22:00" # Overnight backup window (02:30-03:30 IST)
  maintenance_window        = "Sun:22:30-Sun:23:30"
  auto_minor_version_upgrade = true

  tags = {
    Name = "${var.app_name}-rds-mysql-multi-az"
  }
}
