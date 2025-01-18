import { Router } from 'express';
import {
  getAllProductions,
  getProductionById,
  createProduction,
  updateProduction,
  deleteProduction,
  getProductionsByFacility,
  updateProductionStatus
} from '../controllers/productionController';

const router = Router();

// Get all production plans
router.get('/', getAllProductions);

// Get production plan by ID
router.get('/:id', getProductionById);

// Get productions by facility
router.get('/facility/:facilityId', getProductionsByFacility);

// Create new production plan
router.post('/', createProduction);

// Update production plan
router.put('/:id', updateProduction);

// Update production status
router.patch('/:id/status', updateProductionStatus);

// Delete production plan
router.delete('/:id', deleteProduction);

export default router;
