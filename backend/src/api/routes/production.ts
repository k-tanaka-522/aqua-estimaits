import express from 'express';
import {
  getAllProductions,
  getProductionById,
  createProduction,
  updateProduction,
  deleteProduction,
  updateProductionStatus
} from '../controllers/productionController';
import { validateProduction } from '../../middleware/validator';

const router = express.Router();

// すべての生産情報を取得
router.get('/', getAllProductions);

// IDで生産情報を取得
router.get('/:id', getProductionById);

// 新しい生産情報を作成
router.post('/', validateProduction, createProduction);

// 生産情報を更新
router.put('/:id', validateProduction, updateProduction);

// 生産情報を削除
router.delete('/:id', deleteProduction);

// 生産ステータスを更新
router.patch('/:id/status', updateProductionStatus);

export default router;
