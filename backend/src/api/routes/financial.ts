import { Router } from 'express';
import {
  getAllFinancials,
  getFinancialById,
  createFinancial,
  updateFinancial,
  deleteFinancial,
  getFinancialsByDateRange,
  getFinancialSummary
} from '../controllers/financialController';

const router = Router();

// Get all financial plans
router.get('/', getAllFinancials);

// Get financial summary
router.get('/summary', getFinancialSummary);

// Get financials by date range
router.get('/date-range', getFinancialsByDateRange);

// Get financial plan by ID
router.get('/:id', getFinancialById);

// Create new financial plan
router.post('/', createFinancial);

// Update financial plan
router.put('/:id', updateFinancial);

// Delete financial plan
router.delete('/:id', deleteFinancial);

export default router;
