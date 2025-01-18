###############################################
# DocumentDB 設定
###############################################

# サブネットグループ
# --------------
# データベースの配置先
# - プライベートサブネット
# - マルチAZ構成（本番環境）

resource "aws_docdb_subnet_group" "main" {
  name       = "${var.project}-${var.environment}"
  subnet_ids = aws_subnet.database[*].id

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-docdb-subnet"
    },
    var.tags
  )
}

# パラメータグループ
# --------------
# データベースの設定
# - 文字コード
# - タイムゾーン
# - 監査ログ

resource "aws_docdb_cluster_parameter_group" "main" {
  family = "docdb4.0"
  name   = "${var.project}-${var.environment}"

  parameter {
    name  = "tls"
    value = "enabled"
  }

  parameter {
    name  = "audit_logs"
    value = "enabled"
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-docdb-params"
    },
    var.tags
  )
}

# セキュリティグループ
# ----------------
# データベースの通信制御
# - バックエンドからの27017ポート許可
# - 外部からの直接アクセス禁止

resource "aws_security_group" "documentdb" {
  name        = "${var.project}-${var.environment}-documentdb"
  description = "Security group for DocumentDB cluster"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_backend.id]
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-docdb-sg"
    },
    var.tags
  )
}

# クラスター
# --------
# データベースクラスターの定義
# - インスタンスタイプ
# - バックアップ設定
# - 暗号化設定

resource "aws_docdb_cluster" "main" {
  cluster_identifier      = "${var.project}-${var.environment}"
  engine                 = "docdb"
  master_username        = "admin"
  master_password        = var.docdb_master_password
  db_subnet_group_name   = aws_docdb_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.documentdb.id]

  skip_final_snapshot     = var.environment != "prod"
  deletion_protection     = var.environment == "prod"
  backup_retention_period = var.environment == "prod" ? 7 : 1

  enabled_cloudwatch_logs_exports = ["audit"]

  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-docdb-cluster"
    },
    var.tags
  )
}

# クラスターインスタンス
# ------------------
# データベースインスタンスの定義
# - インスタンス数（環境による）
# - インスタンスクラス
# - 自動マイナーバージョンアップグレード

resource "aws_docdb_cluster_instance" "main" {
  count              = var.docdb_instance_count
  identifier         = "${var.project}-${var.environment}-${count.index + 1}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.docdb_instance_class

  auto_minor_version_upgrade = true

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-docdb-instance-${count.index + 1}"
    },
    var.tags
  )
}

# CloudWatch アラーム
# ----------------
# データベースの監視設定
# - CPU使用率
# - メモリ使用率
# - 接続数

resource "aws_cloudwatch_metric_alarm" "docdb_cpu" {
  alarm_name          = "${var.project}-${var.environment}-docdb-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/DocDB"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors DocumentDB CPU utilization"
  alarm_actions       = []

  dimensions = {
    DBClusterIdentifier = aws_docdb_cluster.main.cluster_identifier
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-docdb-cpu-alarm"
    },
    var.tags
  )
}

# Parameter Store
# -------------
# データベース認証情報の管理
# - マスターパスワード
# - 接続情報

resource "aws_ssm_parameter" "docdb_password" {
  name        = "/${var.project}/${var.environment}/docdb/password"
  description = "DocumentDB master password"
  type        = "SecureString"
  value       = var.docdb_master_password

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-docdb-password"
    },
    var.tags
  )
}

resource "aws_ssm_parameter" "docdb_connection" {
  name        = "/${var.project}/${var.environment}/docdb/connection"
  description = "DocumentDB connection string"
  type        = "String"
  value       = "mongodb://${aws_docdb_cluster.main.master_username}:${var.docdb_master_password}@${aws_docdb_cluster.main.endpoint}:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-docdb-connection"
    },
    var.tags
  )
}
