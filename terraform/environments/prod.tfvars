# 環境設定
environment = "prod"
project     = "aqua-estimaits"

# ネットワーク設定
vpc_cidr = "10.0.0.0/16"
azs      = ["ap-northeast-1a", "ap-northeast-1c", "ap-northeast-1d"]

# ECSクラスター設定
ecs_task_cpu    = "1024"
ecs_task_memory = "2048"
min_capacity    = 2
max_capacity    = 10

# DocumentDB設定
docdb_instance_class = "db.r5.large"
docdb_instance_count = 3

# ALB設定
health_check_path = "/health"
domain_name       = "aqua-estimaits.com"

# バックアップ設定
backup_retention_period = 7
enable_backup          = true

# モニタリング設定
enable_enhanced_monitoring = true
monitoring_interval       = 30

# パフォーマンス設定
performance_insights_enabled = true
auto_minor_version_upgrade  = true

# セキュリティ設定
enable_deletion_protection = true
enable_ssl                = true
enable_audit_logs         = true

# タグ設定
tags = {
  Environment = "production"
  Project     = "aqua-estimaits"
  ManagedBy   = "terraform"
  Owner       = "infrastructure-team"
  CostCenter  = "prod-001"
}

# スケーリング設定
scaling_cpu_threshold    = 70
scaling_memory_threshold = 70

# ログ設定
log_retention_days = 30

# メトリクス設定
detailed_monitoring_enabled = true

# ネットワークACL設定
enable_network_acls = true

# WAF設定
enable_waf = true
waf_rules = {
  ip_rate_limit = 2000
  request_size_limit = 10
}

# Route53設定
route53_zone_id = "ZXXXXXXXXXXXXX"
enable_dns_hostnames = true
enable_dns_support   = true

# CloudWatch設定
alarm_cpu_threshold    = 80
alarm_memory_threshold = 80
alarm_evaluation_periods = 2
alarm_period            = 300

# バックアップウィンドウ設定
preferred_backup_window      = "16:00-17:00"
preferred_maintenance_window = "sat:18:00-sat:19:00"

# DocumentDBクラスター設定
docdb_cluster_parameters = {
  tls                        = "enabled"
  audit_logs                 = "enabled"
  profiler                   = "enabled"
  ttl_monitor                = "enabled"
  change_stream_log_retention_hours = "24"
}

# ECSサービス設定
deployment_maximum_percent         = 200
deployment_minimum_healthy_percent = 100
health_check_grace_period_seconds = 60
enable_circuit_breaker           = true
enable_execute_command           = false

# ALBリスナー設定
https_ports = [443]
ssl_policy  = "ELBSecurityPolicy-FS-1-2-Res-2020-10"

# セキュリティグループ設定
allowed_cidr_blocks = [
  "10.0.0.0/8",    # VPC内部通信
  "172.16.0.0/12", # VPN接続
  "192.168.0.0/16" # オフィスネットワーク
]

# タスク実行ロール権限
task_execution_role_managed_policies = [
  "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
  "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
]

# コンテナインサイト設定
container_insights = "enabled"

# X-Ray設定
xray_tracing = "enabled"

# VPCエンドポイント設定
vpc_endpoints = [
  "ecr.api",
  "ecr.dkr",
  "logs",
  "ssm",
  "secretsmanager"
]

# バックアップ保持設定
snapshot_retention_limit = 35

# パフォーマンスインサイト設定
performance_insights_retention_period = 7

# オートスケーリング設定
target_tracking_policies = {
  cpu = {
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
  memory = {
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
}
