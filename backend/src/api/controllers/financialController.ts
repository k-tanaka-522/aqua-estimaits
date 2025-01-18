import { Request, Response } from 'express';
import { Financial } from '../../models/Financial';

// すべての財務情報を取得
export const getAllFinancials = async (_req: Request, res: Response): Promise<void> => {
  try {
    const financials = await Financial.find();
    res.status(200).json(financials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financials', error });
  }
};

// IDで財務情報を取得
export const getFinancialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const financial = await Financial.findById(req.params.id);
    if (!financial) {
      res.status(404).json({ message: 'Financial not found' });
      return;
    }
    res.status(200).json(financial);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial', error });
  }
};

// 新しい財務情報を作成
export const createFinancial = async (req: Request, res: Response): Promise<void> => {
  try {
    const financial = new Financial(req.body);
    const savedFinancial = await financial.save();
    res.status(201).json(savedFinancial);
  } catch (error) {
    res.status(500).json({ message: 'Error creating financial', error });
  }
};

// 財務情報を更新
export const updateFinancial = async (req: Request, res: Response): Promise<void> => {
  try {
    const financial = await Financial.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!financial) {
      res.status(404).json({ message: 'Financial not found' });
      return;
    }
    res.status(200).json(financial);
  } catch (error) {
    res.status(500).json({ message: 'Error updating financial', error });
  }
};

// 財務情報を削除
export const deleteFinancial = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedFinancial = await Financial.findByIdAndDelete(req.params.id);
    if (!deletedFinancial) {
      res.status(404).json({ message: 'Financial not found' });
      return;
    }
    res.status(200).json({ message: 'Financial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting financial', error });
  }
};
