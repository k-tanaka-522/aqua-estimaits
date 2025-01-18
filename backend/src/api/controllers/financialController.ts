import { Request, Response } from 'express';
import Financial, { IFinancial } from '../../models/Financial';

// Get all financial plans
export const getAllFinancials = async (req: Request, res: Response) => {
  try {
    const financials = await Financial.find();
    res.json(financials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial plans', error });
  }
};

// Get financial plan by ID
export const getFinancialById = async (req: Request, res: Response) => {
  try {
    const financial = await Financial.findById(req.params.id);
    if (!financial) {
      return res.status(404).json({ message: 'Financial plan not found' });
    }
    res.json(financial);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial plan', error });
  }
};

// Create new financial plan
export const createFinancial = async (req: Request, res: Response) => {
  try {
    const financialData: IFinancial = req.body;
    const financial = new Financial(financialData);
    const savedFinancial = await financial.save();
    res.status(201).json(savedFinancial);
  } catch (error) {
    res.status(500).json({ message: 'Error creating financial plan', error });
  }
};

// Update financial plan
export const updateFinancial = async (req: Request, res: Response) => {
  try {
    const updatedFinancial = await Financial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedFinancial) {
      return res.status(404).json({ message: 'Financial plan not found' });
    }
    res.json(updatedFinancial);
  } catch (error) {
    res.status(500).json({ message: 'Error updating financial plan', error });
  }
};

// Delete financial plan
export const deleteFinancial = async (req: Request, res: Response) => {
  try {
    const deletedFinancial = await Financial.findByIdAndDelete(req.params.id);
    if (!deletedFinancial) {
      return res.status(404).json({ message: 'Financial plan not found' });
    }
    res.json({ message: 'Financial plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting financial plan', error });
  }
};

// Get financial plans by date range
export const getFinancialsByDateRange = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query: any = {};
    if (startDate && endDate) {
      query['period.startDate'] = { $gte: new Date(startDate as string) };
      query['period.endDate'] = { $lte: new Date(endDate as string) };
    }

    const financials = await Financial.find(query);
    res.json(financials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial plans', error });
  }
};

// Get financial summary
export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query: any = {};
    if (startDate && endDate) {
      query['period.startDate'] = { $gte: new Date(startDate as string) };
      query['period.endDate'] = { $lte: new Date(endDate as string) };
    }

    const financials = await Financial.find(query);
    
    const summary = {
      totalBudget: financials.reduce((sum: number, fin: IFinancial) => sum + fin.budget.total, 0),
      totalExpenses: financials.reduce((sum: number, fin: IFinancial) => sum + fin.actualExpenses.total, 0),
      totalRevenue: financials.reduce((sum: number, fin: IFinancial) => sum + fin.revenue.actual, 0),
      averageGrossMargin: financials.length > 0
        ? financials.reduce((sum: number, fin: IFinancial) => sum + fin.profitability.grossMargin, 0) / financials.length
        : 0,
      averageNetMargin: financials.length > 0
        ? financials.reduce((sum: number, fin: IFinancial) => sum + fin.profitability.netMargin, 0) / financials.length
        : 0,
      averageROI: financials.length > 0
        ? financials.reduce((sum: number, fin: IFinancial) => sum + fin.profitability.roi, 0) / financials.length
        : 0
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial summary', error });
  }
};
