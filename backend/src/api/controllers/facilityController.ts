import { Request, Response } from 'express';
import Facility, { IFacility } from '../../models/Facility';

// Get all facilities
export const getAllFacilities = async (req: Request, res: Response) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching facilities', error });
  }
};

// Get facility by ID
export const getFacilityById = async (req: Request, res: Response) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    res.json(facility);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching facility', error });
  }
};

// Create new facility
export const createFacility = async (req: Request, res: Response) => {
  try {
    const facilityData: IFacility = req.body;
    const facility = new Facility(facilityData);
    const savedFacility = await facility.save();
    res.status(201).json(savedFacility);
  } catch (error) {
    res.status(500).json({ message: 'Error creating facility', error });
  }
};

// Update facility
export const updateFacility = async (req: Request, res: Response) => {
  try {
    const updatedFacility = await Facility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFacility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    res.json(updatedFacility);
  } catch (error) {
    res.status(500).json({ message: 'Error updating facility', error });
  }
};

// Delete facility
export const deleteFacility = async (req: Request, res: Response) => {
  try {
    const deletedFacility = await Facility.findByIdAndDelete(req.params.id);
    if (!deletedFacility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting facility', error });
  }
};
