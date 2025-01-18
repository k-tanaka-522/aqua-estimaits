import { Router } from 'express';
import {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
} from '../controllers/facilityController';

const router = Router();

// Get all facilities
router.get('/', getAllFacilities);

// Get facility by ID
router.get('/:id', getFacilityById);

// Create new facility
router.post('/', createFacility);

// Update facility
router.put('/:id', updateFacility);

// Delete facility
router.delete('/:id', deleteFacility);

export default router;
