import { Request, Response } from 'express';
import { Production } from '../../models/Production';

// すべての生産情報を取得
export const getAllProductions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const productions = await Production.find().populate('facilityId');
    res.status(200).json(productions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching productions', error });
  }
};

// IDで生産情報を取得
export const getProductionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const production = await Production.findById(req.params['id']).populate('facilityId');
    if (!production) {
      res.status(404).json({ message: 'Production not found' });
      return;
    }
    res.status(200).json(production);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching production', error });
  }
};

// 新しい生産情報を作成
export const createProduction = async (req: Request, res: Response): Promise<void> => {
  try {
    const production = new Production(req.body);
    const savedProduction = await production.save();
    await savedProduction.populate('facilityId');
    res.status(201).json(savedProduction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating production', error });
  }
};

// 生産情報を更新
export const updateProduction = async (req: Request, res: Response): Promise<void> => {
  try {
    const production = await Production.findByIdAndUpdate(
      req.params['id'],
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('facilityId');

    if (!production) {
      res.status(404).json({ message: 'Production not found' });
      return;
    }
    res.status(200).json(production);
  } catch (error) {
    res.status(500).json({ message: 'Error updating production', error });
  }
};

// 生産情報を削除
export const deleteProduction = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduction = await Production.findByIdAndDelete(req.params['id']);
    if (!deletedProduction) {
      res.status(404).json({ message: 'Production not found' });
      return;
    }
    res.status(200).json({ message: 'Production deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting production', error });
  }
};

// 生産ステータスを更新
export const updateProductionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const production = await Production.findByIdAndUpdate(
      req.params['id'],
      { $set: { status } },
      { new: true, runValidators: true }
    ).populate('facilityId');

    if (!production) {
      res.status(404).json({ message: 'Production not found' });
      return;
    }
    res.status(200).json(production);
  } catch (error) {
    res.status(500).json({ message: 'Error updating production status', error });
  }
};
