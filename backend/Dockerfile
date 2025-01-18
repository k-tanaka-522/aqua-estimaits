# ベースイメージとして Node.js 18を使用
FROM node:18-alpine AS base

# 作業ディレクトリの設定
WORKDIR /app

# パッケージマネージャにyarnを使用
RUN npm install -g yarn

# 開発環境
FROM base AS development

# 開発用の依存関係をインストール
COPY package.json yarn.lock ./
RUN yarn install

# TypeScriptのインストール
RUN yarn add typescript @types/node @types/express -D

# ソースコードのコピー
COPY . .

# 開発サーバーの起動
CMD ["yarn", "dev"]

# ビルドステージ
FROM base AS builder

# 本番用の依存関係をインストール
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ソースコードのコピー
COPY . .

# TypeScriptのビルド
RUN yarn build

# 本番環境
FROM node:18-alpine AS production

# 必要なツールのインストール
RUN apk add --no-cache curl

# 作業ディレクトリの設定
WORKDIR /app

# パッケージマネージャにyarnを使用
RUN npm install -g yarn

# 本番用の依存関係のみをインストール
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# ビルド成果物のコピー
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# 環境変数の設定
ENV NODE_ENV=production
ENV PORT=5000

# ヘルスチェック設定
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# アプリケーションの起動
CMD ["yarn", "start"]

# 開発環境用の設定
FROM base AS dev

# 開発用の依存関係をインストール
COPY package.json yarn.lock ./
RUN yarn install

# nodemonのインストール
RUN yarn add -D nodemon ts-node

# ソースコードのコピー
COPY . .

# TypeScriptの監視コンパイル
CMD ["yarn", "dev"]

# マルチステージビルドのデフォルトターゲット
FROM development as default

# ポートの公開
EXPOSE 5000

# ヘルスチェック設定
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# 環境変数の設定
ENV NODE_ENV=development
ENV PORT=5000
ENV MONGODB_URI=mongodb://mongodb:27017/aqua-estimaits
ENV JWT_SECRET=development-secret
ENV CORS_ORIGIN=http://localhost:3000

# ボリュームの設定
VOLUME ["/app/node_modules"]
VOLUME ["/app/src"]

# アプリケーションの起動
CMD ["yarn", "dev"]
