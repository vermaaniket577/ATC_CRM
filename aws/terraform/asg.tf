# IAM Role for EC2 Instances (SSM, CloudWatch, Secrets Manager)
resource "aws_iam_role" "ec2" {
  name = "${var.app_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "cw" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy" "s3_and_ecr" {
  name = "${var.app_name}-s3-artifacts-ecr-policy"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.artifacts.arn,
          "${aws_s3_bucket.artifacts.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.app_name}-ec2-instance-profile"
  role = aws_iam_role.ec2.name
}

# Latest Amazon Linux 2023 AMI for ARM64 Graviton
data "aws_ami" "al2023_arm64" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-kernel-6.1-arm64"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }
}

# EC2 Launch Template with Graviton & UserData
resource "aws_launch_template" "backend" {
  name_prefix   = "${var.app_name}-lt-"
  image_id      = data.aws_ami.al2023_arm64.id
  instance_type = var.ec2_instance_type

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2.name
  }

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.app.id]
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              dnf update -y
              dnf install -y java-21-amazon-corretto-devel awslogs amazon-cloudwatch-agent aws-cli

              mkdir -p /opt/telecom-crm
              cat << 'EOT' > /opt/telecom-crm/env.sh
              export SPRING_PROFILES_ACTIVE=aws
              export RDS_ENDPOINT=${aws_db_instance.mysql.address}
              export DB_NAME=${var.db_name}
              export DB_USER=${var.db_username}
              export DB_PASSWORD='${var.db_password}'
              export JWT_SECRET='${var.jwt_secret}'
              EOT

              # Download backend JAR from S3 artifacts bucket if already staged
              aws s3 cp s3://${aws_s3_bucket.artifacts.id}/backend/app.jar /opt/telecom-crm/app.jar || true

              # Configure systemd service
              cat << 'EOT' > /etc/systemd/system/telecom-crm.service
              [Unit]
              Description=Apex Telecom CRM Enterprise Backend
              After=network.target

              [Service]
              Type=simple
              User=ec2-user
              EnvironmentFile=/opt/telecom-crm/env.sh
              ExecStart=/usr/bin/java -Xms1024m -Xmx2048m -XX:+UseG1GC -jar /opt/telecom-crm/app.jar
              Restart=always
              RestartSec=10

              [Install]
              WantedBy=multi-user.target
              EOT

              systemctl daemon-reload
              if [ -f /opt/telecom-crm/app.jar ]; then
                chown ec2-user:ec2-user /opt/telecom-crm/app.jar
                systemctl enable telecom-crm
                systemctl start telecom-crm
              fi
              EOF
  )

  tags = {
    Name = "${var.app_name}-launch-template"
  }
}

# Auto Scaling Group (Min 2 instances across 2 Availability Zones for High Availability)
resource "aws_autoscaling_group" "backend" {
  name_prefix         = "${var.app_name}-asg-"
  vpc_zone_identifier = [aws_subnet.private_app_1a.id, aws_subnet.private_app_1b.id]
  target_group_arns   = [aws_lb_target_group.backend.arn]

  min_size         = 2
  max_size         = 6
  desired_capacity = 2

  health_check_type         = "ELB"
  health_check_grace_period = 300

  launch_template {
    id      = aws_launch_template.backend.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.app_name}-backend-instance"
    propagate_at_launch = true
  }
}

# Target Tracking Auto-Scaling Policy based on Average CPU Utilization
resource "aws_autoscaling_policy" "cpu" {
  name                   = "${var.app_name}-cpu-target-policy"
  autoscaling_group_name = aws_autoscaling_group.backend.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
