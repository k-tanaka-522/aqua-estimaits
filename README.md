# Aqua-Estimaits

水産養殖事業者向けの統合管理システム

## 概要

Aqua-Estimaitsは、水産養殖事業者向けの包括的な管理システムです。施設管理、生産計画、販売管理、財務管理などの機能を提供し、養殖事業の効率化と収益性の向上を支援します。

### 主な機能

- 施設管理
  - 養殖池の状態監視
  - 設備保守管理
  - センサーデータ分析

- 生産管理
  - 養殖計画の立案
  - 餌料管理
  - 生育状況トラッキング

- 販売管理
  - 受注管理
  - 在庫管理
  - 出荷計画

- 財務管理
  - 収支管理
  - 原価計算
  - 財務分析

## 技術スタック

### フロントエンド
- React 18.x
- TypeScript 4.x
- Material-UI
- React Query

### バックエンド
- Node.js 18.x
- Express 4.x
- TypeScript 4.x
- MongoDB (DocumentDB)

### インフラストラクチャ
- AWS
  - ECS (Fargate)
  - DocumentDB
  - Application Load Balancer
  - Route 53
  - CloudWatch

### 開発ツール
- Docker
- Terraform
- GitHub Actions

## 開発環境のセットアップ

### 前提条件
- Node.js 18.x
- Docker Desktop
- AWS CLI
- Terraform 1.0.0以上

### ローカル開発環境の構築

1. リポジトリのクローン
```bash
git clone https://github.com/your-organization/aqua-estimaits.git
cd aqua-estimaits
```

2. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して必要な環境変数を設定
```

3. 依存パッケージのインストール
```bash
# バックエンド
cd backend
npm install

# フロントエンド
cd ../frontend
npm install
```

4. ローカルでの実行
```bash
# プロジェクトルートで実行
docker-compose up --build
```

アプリケーションは以下のURLでアクセス可能です：
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000

### インフラストラクチャのデプロイ

1. AWS認証情報の設定
```bash
aws configure
```

2. Terraformの初期化
```bash
cd terraform
terraform init
```

3. 開発環境のデプロイ
```bash
terraform workspace new dev
terraform plan -var-file="environments/dev.tfvars"
terraform apply -var-file="environments/dev.tfvars"
```

## 開発フロー

### ブランチ戦略

- `main`: 本番環境用のブランチ
- `develop`: 開発環境用のブランチ
- `feature/*`: 機能開発用のブランチ
- `hotfix/*`: 緊急バグ修正用のブランチ

### コミットメッセージの規約

```
type(scope): 変更内容の要約

変更内容の詳細な説明
```

type:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: コードの意味に影響を与えない変更（空白、フォーマット等）
- refactor: バグ修正や機能追加を含まないコードの変更
- test: テストコードの追加・修正
- chore: ビルドプロセスやツールの変更

### CI/CD

GitHub Actionsを使用して以下の自動化を実現：

1. プルリクエスト時
   - コードのビルド
   - テストの実行
   - Lintチェック

2. developブランチへのマージ時
   - 開発環境へのデプロイ
   - E2Eテストの実行

3. mainブランチへのマージ時
   - 本番環境へのデプロイ
   - スモークテストの実行

## ドキュメント

詳細なドキュメントは`docs`ディレクトリを参照してください：

- [システム要件](docs/requirements/system-requirements.md)
- [基本設計書](docs/design/basic-design.md)
- [詳細設計書](docs/design/detailed-design.md)
- [API仕様書](docs/api/api-spec.md)

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 貢献

1. このリポジトリをフォーク
2. 機能開発用のブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: 素晴らしい機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## お問い合わせ

- Issue Tracker: https://github.com/your-organization/aqua-estimaits/issues
- Email: support@aqua-estimaits.com
