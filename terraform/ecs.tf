###############################################
# ECS (Elastic Container Service) 設定
###############################################

# ECSクラスター
# -----------
# Fargateを使用したサーバーレスコンテナ実行環境
# - 環境ごとに独立したクラスター
# - Container Insightsによる監視有効化

resource "aws_ecs_cluster" "main" {
  name = "${var.project}-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-cluster"
    },
    var.tags
  )
}

# CloudWatch Logs
# -------------
# アプリケーションログの保存先
# - 30日間保持
# - 環境ごとに分離

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.project}-${var.environment}/backend"
  retention_in_days = 30

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-backend-logs"
    },
    var.tags
  )
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.project}-${var.environment}/frontend"
  retention_in_days = 30

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-frontend-logs"
    },
    var.tags
  )
}

# ECS Task Execution Role
# --------------------
# タスク実行に必要な権限
# - ECRからのイメージプル
# - CloudWatchへのログ出力
# - SSMパラメータの読み取り

resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project}-${var.environment}-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-task-execution-role"
    },
    var.tags
  )
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Role
# -----------
# タスク実行時のアプリケーション権限
# - DocumentDBへのアクセス
# - S3へのアクセス
# - SESによるメール送信

resource "aws_iam_role" "ecs_task" {
  name = "${var.project}-${var.environment}-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-task-role"
    },
    var.tags
  )
}

# タスク定義
# --------
# コンテナの実行定義
# - CPU/メモリ制限
# - ネットワークモード
# - ログ設定

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project}-${var.environment}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn           = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${aws_ecr_repository.backend.repository_url}:latest"
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = "ap-northeast-1"
          "awslogs-stream-prefix" = "backend"
        }
      }
    }
  ])

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-backend-task"
    },
    var.tags
  )
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project}-${var.environment}-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn           = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "frontend"
      image = "${aws_ecr_repository.frontend.repository_url}:latest"
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
          "awslogs-region"        = "ap-northeast-1"
          "awslogs-stream-prefix" = "frontend"
        }
      }
    }
  ])

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-frontend-task"
    },
    var.tags
  )
}

# ECRリポジトリ
# -----------
# コンテナイメージの保存先
# - イメージのライフサイクル管理
# - 脆弱性スキャン有効化

resource "aws_ecr_repository" "backend" {
  name = "${var.project}/${var.environment}/backend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-backend-repo"
    },
    var.tags
  )
}

resource "aws_ecr_repository" "frontend" {
  name = "${var.project}/${var.environment}/frontend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-frontend-repo"
    },
    var.tags
  )
}

# セキュリティグループ
# ----------------
# コンテナの通信制御
# - ALBからの通信のみ許可
# - 外部への通信は全て許可

resource "aws_security_group" "ecs_backend" {
  name        = "${var.project}-${var.environment}-backend"
  description = "Security group for backend ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-backend-sg"
    },
    var.tags
  )
}

resource "aws_security_group" "ecs_frontend" {
  name        = "${var.project}-${var.environment}-frontend"
  description = "Security group for frontend ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-frontend-sg"
    },
    var.tags
  )
}
