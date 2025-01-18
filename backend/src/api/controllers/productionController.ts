import { Request, Response } from 'express';
import Production, { IProduction } from '../../models/Production';

// Get all production plans
export const getAllProductions = async (req: Request, res: Response) => {
  try {
    const productions = await Production.find().populate('facilityId');
    res.json(productions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching production plans', error });
  }
};

// Get production plan by ID
export const getProductionById = async (req: Request, res: Response) => {
  try {
    const production = await Production.findById(req.params.id).populate('facilityId');
    if (!production) {
      return res.status(404).json({ message: 'Production plan not found' });
    }
    res.json(production);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching production plan', error });
  }
};

// Create new production plan
export const createProduction = async (req: Request, res: Response) => {
  try {
    const productionData: IProduction = req.body;
    const production = new Production(productionData);
    const savedProduction = await production.save();
    const populatedProduction = await savedProduction.populate('facilityId');
    res.status(201).json(populatedProduction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating production plan', error });
  }
};

// Update production plan
export const updateProduction = async (req: Request, res: Response) => {
  try {
    const updatedProduction = await Production.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('facilityId');
    
    if (!updatedProduction) {
      return res.status(404).json({ message: 'Production plan not found' });
    }
    res.json(updatedProduction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating production plan', error });
  }
};

// Delete production plan
export const deleteProduction = async (req: Request, res: Response) => {
  try {
    const deletedProduction = await Production.findByIdAndDelete(req.params.id);
    if (!deletedProduction) {
      return res.status(404).json({ message: 'Production plan not found' });
    }
    res.json({ message: 'Production plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting production plan', error });
  }
};

// Get production plans by facility
export const getProductionsByFacility = async (req: Request, res: Response) => {
  try {
    const { facilityId } = req.params;
    const productions = await Production.find({ facilityId }).populate('facilityId');
    res.json(productions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching production plans for facility', error });
  }
};

// Update production status
export const updateProductionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const production = await Production.findById(id);
    if (!production) {
      return res.status(404).json({ message: 'Production plan not found' });
    }

    production.status = status;
    const updatedProduction = await production.save();
    const populatedProduction = await updatedProduction.populate('facilityId');
    
    res.json(populatedProduction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating production status', error });
  }
};
