import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import facilityRoutes from './api/routes/facility';
import productionRoutes from './api/routes/production';
import salesRoutes from './api/routes/sales';
import financialRoutes from './api/routes/financial';

import { errorHandler, notFound } from './middleware/errorHandler';

// 環境変数の読み込み
dotenv.config();

// Express appの作成
const app = express();

// ポート設定
const PORT = process.env['PORT'] || 5000;

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  credentials: true
}));

// セキュリティ、パフォーマンス、ロギングの設定
app.use(helmet());
app.use(compression() as any);
app.use(morgan('dev'));

// ルートの設定
app.use('/api/facilities', facilityRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/financial', financialRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// エラーハンドリングミドルウェア
app.use(notFound);
app.use(errorHandler);

// データベース接続とサーバー起動
mongoose
  .connect(process.env['MONGODB_URI'] || 'mongodb://localhost:27017/aqua-estimaits')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env['NODE_ENV']} mode on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
