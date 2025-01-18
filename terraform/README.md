# Aqua-Estimaits Infrastructure

Aqua-Estimaitsのインフラストラクチャ定義

## アーキテクチャ概要

このTerraformコードは、Aqua-Estimaitsの以下のインフラストラクチャを管理します：

- ネットワーク (VPC, サブネット, ルートテーブル)
- コンピューティング (ECS Fargate)
- データベース (Amazon DocumentDB)
- ロードバランサー (Application Load Balancer)
- 監視 (CloudWatch)

### 環境分離

- 開発環境 (`dev`)
- 本番環境 (`prod`)

各環境は独立したTerraformワークスペースとして管理されます。

## 前提条件

- Terraform 1.0.0以上
- AWS CLI
- AWS認証情報の設定
- S3バケット（Terraformの状態管理用）

## ディレクトリ構造

```
terraform/
├── README.md
├── main.tf          # プロバイダー設定、VPC定義
├── variables.tf     # 変数定義
├── ecs.tf          # ECSクラスター、タスク定義
├── alb.tf          # ロードバランサー設定
├── documentdb.tf    # DocumentDB設定
├── services.tf      # ECSサービス定義
├── environments/
│   ├── dev.tfvars  # 開発環境変数
│   └── prod.tfvars # 本番環境変数
└── modules/        # 共通モジュール（必要に応じて）
```

## セットアップ手順

### 1. 初期化

```bash
# S3バケットの作成（初回のみ）
aws s3api create-bucket \
  --bucket aqua-estimaits-tfstate \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# バケットのバージョニング有効化
aws s3api put-bucket-versioning \
  --bucket aqua-estimaits-tfstate \
  --versioning-configuration Status=Enabled

# Terraformの初期化
terraform init \
  -backend-config="bucket=aqua-estimaits-tfstate" \
  -backend-config="key=terraform.tfstate" \
  -backend-config="region=ap-northeast-1"
```

### 2. 開発環境のデプロイ

```bash
# 開発環境ワークスペースの作成と選択
terraform workspace new dev
terraform workspace select dev

# 開発環境の計画確認
terraform plan -var-file="environments/dev.tfvars"

# 開発環境のデプロイ
terraform apply -var-file="environments/dev.tfvars"
```

### 3. 本番環境のデプロイ

```bash
# 本番環境ワークスペースの作成と選択
terraform workspace new prod
terraform workspace select prod

# 本番環境の計画確認
terraform plan -var-file="environments/prod.tfvars"

# 本番環境のデプロイ
terraform apply -var-file="environments/prod.tfvars"
```

## 環境変数

### 共通変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| project | プロジェクト名 | aqua-estimaits |
| environment | 環境名（dev/prod） | - |
| vpc_cidr | VPCのCIDRブロック | 10.0.0.0/16 |
| azs | 使用するAZ | ["ap-northeast-1a", "ap-northeast-1c"] |

### 環境固有の変数（dev.tfvars, prod.tfvars）

| 変数名 | 開発環境 | 本番環境 |
|--------|----------|----------|
| ecs_task_cpu | 256 | 512 |
| ecs_task_memory | 512 | 1024 |
| min_capacity | 1 | 2 |
| max_capacity | 2 | 4 |
| docdb_instance_class | db.t3.medium | db.r5.large |
| docdb_instance_count | 1 | 2 |

## リソース管理

### 新しいリソースの追加

1. 適切な.tfファイルを選択または作成
2. リソース定義を追加
3. 変数が必要な場合は`variables.tf`に追加
4. 環境固有の値は各環境の.tfvarsファイルに追加

### リソースの削除

```bash
# 特定のリソースの削除
terraform destroy -target=aws_ecs_service.backend -var-file="environments/dev.tfvars"

# 環境全体の削除
terraform destroy -var-file="environments/dev.tfvars"
```

## セキュリティ考慮事項

- 本番環境のクレデンシャルは厳重に管理
- セキュリティグループは最小権限の原則に従う
- 機密情報はAWS Systems Managerパラメータストアで管理
- VPCエンドポイントを使用してAWSサービスにプライベートにアクセス

## 運用管理

### 状態ファイルの管理

- 状態ファイルはS3で管理
- バージョニングを有効化して変更履歴を保持
- 状態ファイルのロックにはDynamoDBを使用

### バックアップ

- DocumentDBは自動バックアップを設定
- ECSタスク定義は履歴を保持
- CloudWatchログは30日間保持

### モニタリング

- CloudWatchメトリクスでリソース使用率を監視
- アラームを設定して異常を検知
- CloudTrailで操作ログを記録

## トラブルシューティング

### よくある問題

1. Terraform実行エラー
```
# 状態ファイルのリフレッシュ
terraform refresh

# プロバイダーのクリーンアップ
rm -rf .terraform
terraform init
```

2. リソース作成失敗
```
# 詳細なログの確認
TF_LOG=DEBUG terraform apply

# 特定のリソースの再作成
terraform taint aws_ecs_service.backend
terraform apply
```

3. 状態ファイルの不整合
```
# 状態のインポート
terraform import aws_ecs_service.backend service_id

# 状態の確認
terraform show
```

### サポート

問題が解決しない場合は以下を確認：

1. [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
2. [AWS Documentation](https://docs.aws.amazon.com/)
3. プロジェクトのIssue Tracker
