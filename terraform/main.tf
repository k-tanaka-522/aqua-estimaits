###############################################
# Aqua-Estimaits インフラストラクチャ設計
###############################################

# プロバイダー設定
provider "aws" {
  region = "ap-northeast-1"
}

# Terraform設定
terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "aqua-estimaits-tfstate"
    key    = "terraform.tfstate"
    region = "ap-northeast-1"
  }
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-vpc"
    },
    var.tags
  )
}

# インターネットゲートウェイ
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-igw"
    },
    var.tags
  )
}

# パブリックサブネット
resource "aws_subnet" "public" {
  count             = length(var.azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.public_subnets[count.index]
  availability_zone = var.azs[count.index]

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-public-${var.azs[count.index]}"
    },
    var.tags
  )
}

# プライベートサブネット
resource "aws_subnet" "private" {
  count             = length(var.azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.private_subnets[count.index]
  availability_zone = var.azs[count.index]

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-private-${var.azs[count.index]}"
    },
    var.tags
  )
}

# データベースサブネット
resource "aws_subnet" "database" {
  count             = length(var.azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.database_subnets[count.index]
  availability_zone = var.azs[count.index]

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-database-${var.azs[count.index]}"
    },
    var.tags
  )
}

# パブリックルートテーブル
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-public-rt"
    },
    var.tags
  )
}

# プライベートルートテーブル
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    {
      Name = "${var.project}-${var.environment}-private-rt"
    },
    var.tags
  )
}

# パブリックサブネットのルートテーブル関連付け
resource "aws_route_table_association" "public" {
  count          = length(var.azs)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# プライベートサブネットのルートテーブル関連付け
resource "aws_route_table_association" "private" {
  count          = length(var.azs)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# データベースサブネットのルートテーブル関連付け
resource "aws_route_table_association" "database" {
  count          = length(var.azs)
  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.private.id
}
