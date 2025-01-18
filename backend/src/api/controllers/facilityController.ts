import { Request, Response } from 'express';
import { Facility } from '../../models/Facility';

// すべての施設を取得
export const getAllFacilities = async (_req: Request, res: Response): Promise<void> => {
  try {
    const facilities = await Facility.find();
    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching facilities', error });
  }
};

// IDで施設を取得
export const getFacilityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const facility = await Facility.findById(req.params['id']);
    if (!facility) {
      res.status(404).json({ message: 'Facility not found' });
      return;
    }
    res.status(200).json(facility);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching facility', error });
  }
};

// 新しい施設を作成
export const createFacility = async (req: Request, res: Response): Promise<void> => {
  try {
    const facility = new Facility(req.body);
    const savedFacility = await facility.save();
    res.status(201).json(savedFacility);
  } catch (error) {
    res.status(500).json({ message: 'Error creating facility', error });
  }
};

// 施設を更新
export const updateFacility = async (req: Request, res: Response): Promise<void> => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params['id'],
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!facility) {
      res.status(404).json({ message: 'Facility not found' });
      return;
    }
    res.status(200).json(facility);
  } catch (error) {
    res.status(500).json({ message: 'Error updating facility', error });
  }
};

// 施設を削除
export const deleteFacility = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedFacility = await Facility.findByIdAndDelete(req.params['id']);
    if (!deletedFacility) {
      res.status(404).json({ message: 'Facility not found' });
      return;
    }
    res.status(200).json({ message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting facility', error });
  }
};
