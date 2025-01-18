# 環境変数
variable "environment" {
  description = "環境名（dev/stg/prod）"
  type        = string
}

variable "project" {
  description = "プロジェクト名"
  type        = string
}

# ネットワーク変数
variable "vpc_cidr" {
  description = "VPCのCIDRブロック"
  type        = string
}

variable "azs" {
  description = "使用するアベイラビリティゾーンのリスト"
  type        = list(string)
}

# ECS変数
variable "ecs_task_cpu" {
  description = "ECSタスクのCPUユニット"
  type        = string
}

variable "ecs_task_memory" {
  description = "ECSタスクのメモリ(MB)"
  type        = string
}

variable "min_capacity" {
  description = "Auto Scalingの最小タスク数"
  type        = number
}

variable "max_capacity" {
  description = "Auto Scalingの最大タスク数"
  type        = number
}

# DocumentDB変数
variable "docdb_instance_class" {
  description = "DocumentDBのインスタンスクラス"
  type        = string
}

variable "docdb_instance_count" {
  description = "DocumentDBのインスタンス数"
  type        = number
}

# ALB変数
variable "health_check_path" {
  description = "ヘルスチェックのパス"
  type        = string
}

variable "domain_name" {
  description = "使用するドメイン名"
  type        = string
}

# タグ変数
variable "tags" {
  description = "リソースに付与するタグ"
  type        = map(string)
  default     = {}
}

# サブネット変数
locals {
  public_subnets = [
    for i, az in var.azs : cidrsubnet(var.vpc_cidr, 8, i)
  ]
  private_subnets = [
    for i, az in var.azs : cidrsubnet(var.vpc_cidr, 8, i + length(var.azs))
  ]
  database_subnets = [
    for i, az in var.azs : cidrsubnet(var.vpc_cidr, 8, i + 2 * length(var.azs))
  ]
}
