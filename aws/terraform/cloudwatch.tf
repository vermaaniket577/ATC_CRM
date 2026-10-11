# CloudWatch Log Group with 730-day Retention for DoT/TRAI Telecom Licensing Compliance
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/aws/${var.app_name}/production"
  retention_in_days = 730

  tags = {
    Compliance = "DoT-TRAI-Log-Retention-2Years"
  }
}

# SNS Alert Topic for DevOps On-Call
resource "aws_sns_topic" "alerts" {
  name = "${var.app_name}-production-alerts"
}

# Metric Alarm: EC2 High CPU (>80% for 5 mins)
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.app_name}-high-cpu-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80.0
  alarm_description   = "Triggered when backend cluster average CPU exceeds 80%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.backend.name
  }
}

# Metric Alarm: ALB Target 5XX Error Rate
resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.app_name}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 10.0
  alarm_description   = "Triggered when application throws more than 10 5XX errors within 1 minute"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.backend.arn_suffix
  }
}
