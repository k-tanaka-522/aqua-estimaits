###############################################
# ALB (Application Load Balancer) 設定
###############################################

# ALB
# ---
# フロントエンドへのトラフィック分散
# - パブリックサブネットに配置
# - SSL/TLS終端
# - ヘルスチェック

resource "aws_lb" "main" {
  name               = "${var.project}-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = var.environment == "prod" ? true : false

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-alb"
    },
    var.tags
  )
}

# セキュリティグループ
# ----------------
# ALBの通信制御
# - インターネットからの80/443ポート許可
# - バックエンドへの通信許可

resource "aws_security_group" "alb" {
  name        = "${var.project}-${var.environment}-alb"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-alb-sg"
    },
    var.tags
  )
}

# HTTPリスナー
# ----------
# HTTPSへのリダイレクト
# - 本番環境は必須
# - 開発環境は任意

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = var.environment == "prod" ? "redirect" : "forward"

    dynamic "redirect" {
      for_each = var.environment == "prod" ? [1] : []
      content {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }

    dynamic "forward" {
      for_each = var.environment != "prod" ? [1] : []
      content {
        target_group_arn = aws_lb_target_group.frontend.arn
      }
    }
  }
}

# HTTPSリスナー（本番環境のみ）
# --------------------------
# SSL/TLS終端
# - ACM証明書使用
# - セキュアな通信

resource "aws_lb_listener" "https" {
  count             = var.environment == "prod" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# バックエンドターゲットグループ
# ------------------------
# バックエンドサービスの転送先
# - ヘルスチェック設定
# - Fargateタスクをターゲットに

resource "aws_lb_target_group" "backend" {
  name        = "${var.project}-${var.environment}-backend"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher            = "200"
    path               = var.health_check_path
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 2
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-backend-tg"
    },
    var.tags
  )
}

# フロントエンドターゲットグループ
# --------------------------
# フロントエンドサービスの転送先
# - ヘルスチェック設定
# - Fargateタスクをターゲットに

resource "aws_lb_target_group" "frontend" {
  name        = "${var.project}-${var.environment}-frontend"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher            = "200"
    path               = "/"
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 2
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-frontend-tg"
    },
    var.tags
  )
}

# バックエンドリスナールール
# ----------------------
# APIリクエストのルーティング
# - パスベースルーティング
# - プライオリティ設定

resource "aws_lb_listener_rule" "backend" {
  listener_arn = var.environment == "prod" ? aws_lb_listener.https[0].arn : aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
