# 環境設定
environment = "dev"
project     = "aqua-estimaits"

# ネットワーク設定
vpc_cidr = "10.0.0.0/16"
azs      = ["ap-northeast-1a", "ap-northeast-1c"]

# ECSクラスター設定
ecs_task_cpu    = "256"
ecs_task_memory = "512"
min_capacity    = 1
max_capacity    = 2

# DocumentDB設定
docdb_instance_class = "db.t3.medium"
docdb_instance_count = 1

# ALB設定
health_check_path = "/health"
domain_name       = "dev.aqua-estimaits.com"

# バックアップ設定
backup_retention_period = 1
enable_backup          = true

# モニタリング設定
enable_enhanced_monitoring = false
monitoring_interval       = 60

# パフォーマンス設定
performance_insights_enabled = false
auto_minor_version_upgrade  = true

# セキュリティ設定
enable_deletion_protection = false
enable_ssl                = true
enable_audit_logs         = true

# タグ設定
tags = {
  Environment = "development"
  Project     = "aqua-estimaits"
  ManagedBy   = "terraform"
  Owner       = "development-team"
  CostCenter  = "dev-001"
}

# スケーリング設定
scaling_cpu_threshold    = 80
scaling_memory_threshold = 80

# ログ設定
log_retention_days = 7

# メトリクス設定
detailed_monitoring_enabled = false

# ネットワークACL設定
enable_network_acls = false

# WAF設定
enable_waf = false
waf_rules = {
  ip_rate_limit = 5000
  request_size_limit = 20
}

# Route53設定
route53_zone_id = "ZXXXXXXXXXXXXX"
enable_dns_hostnames = true
enable_dns_support   = true

# CloudWatch設定
alarm_cpu_threshold    = 90
alarm_memory_threshold = 90
alarm_evaluation_periods = 3
alarm_period            = 300

# バックアップウィンドウ設定
preferred_backup_window      = "03:00-04:00"
preferred_maintenance_window = "sun:04:00-sun:05:00"

# DocumentDBクラスター設定
docdb_cluster_parameters = {
  tls                        = "enabled"
  audit_logs                 = "enabled"
  profiler                   = "disabled"
  ttl_monitor                = "enabled"
  change_stream_log_retention_hours = "12"
}

# ECSサービス設定
deployment_maximum_percent         = 200
deployment_minimum_healthy_percent = 50
health_check_grace_period_seconds = 30
enable_circuit_breaker           = true
enable_execute_command           = true

# ALBリスナー設定
https_ports = [443]
ssl_policy  = "ELBSecurityPolicy-2016-08"

# セキュリティグループ設定
allowed_cidr_blocks = [
  "10.0.0.0/8",    # VPC内部通信
  "0.0.0.0/0"      # 開発環境は外部からのアクセスを許可
]

# タスク実行ロール権限
task_execution_role_managed_policies = [
  "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
]

# コンテナインサイト設定
container_insights = "disabled"

# X-Ray設定
xray_tracing = "disabled"

# VPCエンドポイント設定
vpc_endpoints = [
  "ecr.api",
  "ecr.dkr",
  "logs"
]

# バックアップ保持設定
snapshot_retention_limit = 1

# パフォーマンスインサイト設定
performance_insights_retention_period = 0

# オートスケーリング設定
target_tracking_policies = {
  cpu = {
    target_value = 80.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
  memory = {
    target_value = 80.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
}
