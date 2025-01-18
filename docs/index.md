# Aqua-Estimaits ドキュメント

## 1. ドキュメント構成

### 1.1 要件定義
- [システム要件定義書](requirements/system-requirements.md)
  - システム概要
  - 機能要件
  - 非機能要件
  - 開発要件

### 1.2 設計書
- [基本設計書](design/basic-design.md)
  - システムアーキテクチャ
  - コンポーネント設計
  - セキュリティ設計
  - 監視設計
  - バックアップ設計
  - 運用設計

- [詳細設計書](design/detailed-design.md)
  - システム構成図の説明
  - ネットワーク構成図の説明
  - データフロー図の説明
  - デプロイメントフロー図の説明
  - 実装上の注意点

### 1.3 システム構成図
- [システムアーキテクチャ図](diagrams/system-architecture.drawio)
  - システム全体構成図
  - ネットワーク構成図

- [データ・デプロイメントフロー図](diagrams/data-deployment-flow.drawio)
  - データフロー図
  - デプロイメントフロー図

## 2. 開発環境

### 2.1 必要なツール
- Docker Desktop
- Node.js v18
- AWS CLI
- Terraform

### 2.2 ローカル開発手順
```bash
# リポジトリのクローン
git clone https://github.com/your-org/aqua-estimaits.git
cd aqua-estimaits

# 依存関係のインストール
cd frontend && npm install
cd ../backend && npm install

# 開発サーバーの起動
docker-compose up --build
```

## 3. デプロイメント

### 3.1 自動デプロイ
- mainブランチへのマージ → 本番環境にデプロイ
- developブランチへのプッシュ → 開発環境にデプロイ

### 3.2 手動デプロイ
```bash
# Terraformの初期化
cd terraform
terraform init

# 開発環境のデプロイ
terraform plan -var-file="environments/dev.tfvars"
terraform apply -var-file="environments/dev.tfvars"

# 本番環境のデプロイ
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"
```

## 4. 運用・保守

### 4.1 監視項目
- アプリケーションログ
- メトリクス監視
- アラート設定

### 4.2 バックアップ
- 日次バックアップ
- スナップショット
- リストア手順

### 4.3 セキュリティ
- 脆弱性管理
- パッチ管理
- インシデント対応

## 5. 問い合わせ先

### 5.1 開発チーム
- 開発担当: dev-team@example.com
- インフラ担当: infra-team@example.com

### 5.2 運用チーム
- 運用担当: ops-team@example.com
- 監視担当: monitoring@example.com

### 5.3 緊急連絡先
- 緊急時: emergency@example.com
- オンコール: oncall@example.com
