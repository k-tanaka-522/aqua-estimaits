import express from 'express';
import {
  getAllFinancials,
  getFinancialById,
  createFinancial,
  updateFinancial,
  deleteFinancial
} from '../controllers/financialController';
import { validateFinancial } from '../../middleware/validator';

const router = express.Router();

// すべての財務情報を取得
router.get('/', getAllFinancials);

// IDで財務情報を取得
router.get('/:id', getFinancialById);

// 新しい財務情報を作成
router.post('/', validateFinancial, createFinancial);

// 財務情報を更新
router.put('/:id', validateFinancial, updateFinancial);

// 財務情報を削除
router.delete('/:id', deleteFinancial);

export default router;
