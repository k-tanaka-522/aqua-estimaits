# ビルドステージ
FROM node:18-alpine AS builder

# 作業ディレクトリの設定
WORKDIR /app

# パッケージマネージャにyarnを使用
RUN npm install -g yarn

# 依存関係ファイルのコピー
COPY package.json yarn.lock ./

# 依存関係のインストール
RUN yarn install --frozen-lockfile

# ソースコードのコピー
COPY . .

# TypeScriptのビルド
RUN yarn build

# 本番ステージ
FROM node:18-alpine AS production

# Nginxのインストール
RUN apk add --no-cache nginx

# 作業ディレクトリの設定
WORKDIR /app

# ビルドステージからの成果物をコピー
COPY --from=builder /app/build /usr/share/nginx/html

# Nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ヘルスチェック用のツール
RUN apk add --no-cache curl

# 80番ポートを公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]

# 開発ステージ
FROM node:18-alpine AS development

# 作業ディレクトリの設定
WORKDIR /app

# パッケージマネージャにyarnを使用
RUN npm install -g yarn

# 依存関係ファイルのコピー
COPY package.json yarn.lock ./

# 開発用依存関係のインストール
RUN yarn install

# ヘルスチェック用のツール
RUN apk add --no-cache curl

# ソースコードのコピー
COPY . .

# 3000番ポートを公開
EXPOSE 3000

# 開発サーバーの起動
CMD ["yarn", "start"]
