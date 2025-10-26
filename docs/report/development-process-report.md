# AquaGrow開発プロセスレポート

**作成日:** 2025-10-27
**プロジェクト:** AquaGrow - アクアポニクス経営シミュレーター

---

## 📋 プロジェクト概要

### 目的
- 新潟県の600㎡農地でアクアポニクス事業を始めるための経営シミュレーションアプリ
- 土地登録、魚・野菜選択、収益シミュレーション機能

### 技術スタック
- **フロントエンド:** Flutter Web 3.35.7
- **バックエンド:** .NET 9.0 Web API
- **開発DB:** SQLite
- **本番DB:** PostgreSQL 16
- **その他:** Docker Compose, Redis, pgAdmin

---

## 🎯 開発フェーズと進捗

### Phase 1: 企画・要件定義 ✅
- ✅ システム要件定義書作成
- ✅ 機能要件定義（Phase1）
- ✅ 画面遷移図作成

### Phase 2: 設計 ✅
- ✅ ワイヤーフレーム作成（スマホ版・PC版）
- ✅ ERダイアグラム設計
- ✅ 技術アーキテクチャ設計
- ✅ データベーススキーマ設計

### Phase 3: プロトタイプ実装 ✅
- ✅ Flutter環境構築
- ✅ モックデータでのUI実装
  - ホーム画面
  - 土地一覧画面
  - 土地登録画面（GPS連携）
  - シミュレーター画面
  - 結果画面（動的調整機能付き）

### Phase 4: バックエンド実装 ✅
- ✅ .NET 9.0プロジェクト作成
- ✅ Entity Framework Core + SQLite設定
- ✅ データモデル実装（Land, Simulation）
- ✅ REST APIコントローラー実装
- ✅ Swagger/OpenAPI統合

### Phase 5: 統合（進行中）
- ⏳ FlutterからAPI接続
- ⏳ 実データでの動作確認
- ⏳ 本番環境デプロイ準備

---

## 🛠️ 使用したツールと手法

### 1. 設計ドキュメント作成

#### ワイヤーフレーム
**ツール:** HTML + CSS
**アプローチ:**
```html
<!-- シンプルなHTMLで画面イメージを作成 -->
<!-- ブラウザで即座に確認できる -->
<!-- モバイル・PC両対応で作成 -->
```

**メリット:**
- ✅ ブラウザで即座に確認可能
- ✅ レスポンシブデザインの検証が簡単
- ✅ 実装イメージが具体的になる
- ✅ クライアントとの認識合わせに有効

**成果物:**
- `docs/design/01_wireframe-land-registration.html` - 土地登録（スマホ）
- `docs/design/01_wireframe-land-registration-pc.html` - 土地登録（PC）
- `docs/design/02_wireframe-simulator.html` - シミュレーター（スマホ）
- `docs/design/02_wireframe-simulator-pc.html` - シミュレーター（PC）
- `docs/design/03_wireframe-simulation-result.html` - 結果画面（スマホ）
- `docs/design/03_wireframe-simulation-result-pc.html` - 結果画面（PC）

#### ERダイアグラム・画面遷移図
**ツール:** Draw.io (XML形式)
**ファイル:**
- `docs/design/database-er-diagram.drawio`
- `docs/design/screen-transition-diagram.drawio`
- `docs/design/wireframes.drawio`

**メリット:**
- ✅ XMLファイルでGit管理可能
- ✅ VSCodeで編集・プレビュー可能
- ✅ 図の変更履歴が追跡できる
- ✅ 無料で高機能

**使い方:**
```bash
# VSCode拡張機能 "Draw.io Integration" をインストール
# .drawioファイルをクリックで編集可能
```

### 2. プロトタイプ開発

#### モックデータアプローチ
**戦略:** 「張りぼてのフロント」優先

**実装手順:**
1. データモデル定義（Dart）
2. MockDataクラス作成
3. UI実装（モックデータで動作）
4. バックエンドAPI実装
5. API接続に置き換え

**メリット:**
- ✅ UIの早期確認
- ✅ クライアントフィードバックが早い
- ✅ フロント・バックエンド並行開発可能
- ✅ デザイン変更のコストが低い

**コード例:**
```dart
// frontend/lib/data/mock/mock_data.dart
class MockData {
  static final List<FishMaster> fishMasters = [
    FishMaster(id: 'fish-001', name: 'ティラピア', ...),
    // ...
  ];
}
```

### 3. 開発環境構築

#### Flutter環境
**ツール:** Flutter 3.35.7 + Git Bash (Windows)

**セットアップスクリプト:**
```bash
# setup-flutter.sh
export PATH="/c/src/flutter/bin:$PATH"
cd frontend
flutter pub get
```

**ポイント:**
- Windows環境でもGit Bash使用
- PATHの一時設定方法を記録
- 再現性のあるスクリプト化

#### .NET環境
**ツール:** .NET 9.0 SDK

**プロジェクト作成:**
```bash
dotnet new webapi -n AquaGrow.Api -o backend --use-controllers
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Swashbuckle.AspNetCore
```

### 4. データベース設計

#### SQLiteでの開発
**アプローチ:** 開発時はSQLite、本番はPostgreSQL

**理由:**
- ✅ セットアップ不要
- ✅ ファイルベースで軽量
- ✅ EF Coreで接続文字列変更だけで切替可能

**実装:**
```csharp
// Program.cs
var dbPath = Path.Combine(AppContext.BaseDirectory, "aquagrow.db");
options.UseSqlite($"Data Source={dbPath}");

// 本番環境では:
// options.UseNpgsql(connectionString);
```

#### マイグレーション戦略
**方法:** Code First + Auto Migration

```csharp
// 起動時に自動でDBテーブル作成
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AquaGrowDbContext>();
    dbContext.Database.EnsureCreated();
}
```

### 5. API設計

#### REST API設計原則
- リソース指向（/api/lands, /api/simulations）
- 標準HTTPメソッド（GET, POST, PUT, DELETE）
- JSONレスポンス
- CORS設定（Flutter Web対応）

#### Swagger/OpenAPI統合
**URL:** http://localhost:5171/swagger

**メリット:**
- ✅ 自動ドキュメント生成
- ✅ ブラウザでAPI即座テスト可能
- ✅ リクエスト/レスポンス確認
- ✅ クライアント実装の参考になる

**設定:**
```csharp
builder.Services.AddSwaggerGen();
app.UseSwagger();
app.UseSwaggerUI();
```

---

## 💡 効果的だった手法

### 1. HTMLワイヤーフレーム
**効果:** ⭐⭐⭐⭐⭐

**理由:**
- ブラウザで即座に表示確認
- レスポンシブデザインの検証
- 実装イメージが明確
- クライアントとの認識合わせが早い

**テンプレート例:**
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 400px; margin: 0 auto; }
        .card { border: 1px solid #ddd; padding: 16px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>土地登録</h1>
        <!-- UI要素 -->
    </div>
</body>
</html>
```

### 2. Draw.io XML図
**効果:** ⭐⭐⭐⭐⭐

**理由:**
- Git管理可能
- VSCodeで編集可能
- 変更履歴追跡
- 無料

**推奨設定:**
```
ファイル > エクスポート形式 > XML
ファイル拡張子: .drawio
```

### 3. モックデータ駆動開発
**効果:** ⭐⭐⭐⭐⭐

**理由:**
- フロントエンド実装が早い
- バックエンド待たずに開発可能
- UI/UXの早期検証
- デザイン変更が容易

**実装パターン:**
```dart
// 1. モデル定義
class Land { ... }

// 2. モックデータ
class MockData {
  static List<Land> lands = [...];
}

// 3. 後でAPI呼び出しに置き換え
// final lands = await api.getLands();
```

### 4. Todo管理による可視化
**効果:** ⭐⭐⭐⭐

**使用ツール:** TodoWrite

**メリット:**
- タスクの進捗が明確
- やり残しがない
- ユーザーへの進捗報告が簡単

---

## 📊 開発メトリクス

### 作成ファイル数
- **ドキュメント:** 15ファイル
- **フロントエンド:** 12ファイル（Flutter）
- **バックエンド:** 8ファイル（.NET）
- **インフラ:** 3ファイル（Docker, DB）

### 開発時間配分（推定）
- 要件定義・設計: 30%
- ワイヤーフレーム作成: 15%
- フロントエンド実装: 35%
- バックエンド実装: 15%
- 環境構築・設定: 5%

### コード行数
- **Flutter:** 約2,500行
- **.NET:** 約800行
- **SQL:** 約300行

---

## 🎓 学んだベストプラクティス

### 1. プロトタイプファースト
**教訓:** モックデータで先にUIを作ると、クライアントフィードバックが早く得られる

**次回への適用:**
- 全プロジェクトでモックデータアプローチ採用
- HTMLワイヤーフレームを標準化

### 2. ツールの選定
**教訓:** Git管理可能な形式を選ぶ（HTMLワイヤーフレーム、Draw.io XML）

**次回への適用:**
- バイナリ形式（.psd, .sketch）を避ける
- テキストベース・XML形式を優先

### 3. 段階的実装
**教訓:** SQLite→PostgreSQLのように、シンプルから始めて後で切り替え

**次回への適用:**
- 開発環境は軽量に
- 本番環境は堅牢に
- 抽象化レイヤー（EF Core）で切替容易に

### 4. ドキュメント自動生成
**教訓:** Swaggerで手動ドキュメント不要

**次回への適用:**
- すべてのAPIプロジェクトにSwagger導入
- OpenAPI定義を自動生成

---

## 🚀 次のステップ

### 短期（今週）
1. ✅ バックエンドAPI完成
2. ⏳ FlutterからAPI接続
3. ⏳ 実データでの動作確認
4. ⏳ 認証機能追加

### 中期（来週）
1. E2Eテスト実装
2. Docker Compose統合
3. CI/CD設定（GitHub Actions）
4. ステージング環境デプロイ

### 長期（今月）
1. 本番環境デプロイ（AWS/GCP）
2. パフォーマンス最適化
3. モニタリング設定
4. ユーザーフィードバック収集

---

## 📚 参考リソース

### 公式ドキュメント
- [Flutter Web](https://docs.flutter.dev/platform-integration/web)
- [.NET 9.0](https://learn.microsoft.com/dotnet/)
- [EF Core](https://learn.microsoft.com/ef/core/)

### ツール
- [Draw.io](https://app.diagrams.net/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [PostgreSQL](https://www.postgresql.org/)

### VSCode拡張機能
- Draw.io Integration
- Flutter
- C# Dev Kit
- SQLite Viewer

---

## 📝 まとめ

このプロジェクトでは、**プロトタイプファースト**のアプローチと、**Git管理可能なドキュメント形式**（HTML、Draw.io XML）の組み合わせが非常に効果的でした。

特に、HTMLワイヤーフレームは即座に確認でき、Draw.io XMLは変更履歴が追跡できるため、チーム開発でも威力を発揮します。

モックデータ駆動開発により、バックエンド完成前にフロントエンドを進められたことも、開発速度向上に大きく貢献しました。

---

**レポート作成者:** Claude (Anthropic)
**プロジェクト開始日:** 2025-10-26
**最終更新:** 2025-10-27
