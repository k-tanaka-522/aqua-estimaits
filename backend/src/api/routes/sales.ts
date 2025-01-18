import { Router } from 'express';
import {
  getAllSales,
  getSalesById,
  createSales,
  updateSales,
  deleteSales,
  getSalesByProduct,
  updateSalesStatus,
  getSalesAnalytics
} from '../controllers/salesController';

const router = Router();

// Get all sales plans
router.get('/', getAllSales);

// Get sales analytics
router.get('/analytics', getSalesAnalytics);

// Get sales plan by ID
router.get('/:id', getSalesById);

// Get sales by product
router.get('/product/:productId', getSalesByProduct);

// Create new sales plan
router.post('/', createSales);

// Update sales plan
router.put('/:id', updateSales);

// Update sales status
router.patch('/:id/status', updateSalesStatus);

// Delete sales plan
router.delete('/:id', deleteSales);

export default router;
