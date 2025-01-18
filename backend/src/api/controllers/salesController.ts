import type { Request, Response } from 'express-serve-static-core';
import Sales, { ISales } from '../../models/Sales';

// Get all sales plans
export const getAllSales = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const sales = await Sales.find().populate('productId');
    return res.json(sales);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sales plans', error });
  }
};

// Get sales plan by ID
export const getSalesById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sales = await Sales.findById(req.params.id).populate('productId');
    if (!sales) {
      return res.status(404).json({ message: 'Sales plan not found' });
    }
    return res.json(sales);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sales plan', error });
  }
};

// Create new sales plan
export const createSales = async (req: Request, res: Response): Promise<Response> => {
  try {
    const salesData: ISales = req.body;
    const sales = new Sales(salesData);
    const savedSales = await sales.save();
    const populatedSales = await savedSales.populate('productId');
    return res.status(201).json(populatedSales);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating sales plan', error });
  }
};

// Update sales plan
export const updateSales = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedSales = await Sales.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('productId');
    
    if (!updatedSales) {
      return res.status(404).json({ message: 'Sales plan not found' });
    }
    return res.json(updatedSales);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating sales plan', error });
  }
};

// Delete sales plan
export const deleteSales = async (req: Request, res: Response): Promise<Response> => {
  try {
    const deletedSales = await Sales.findByIdAndDelete(req.params.id);
    if (!deletedSales) {
      return res.status(404).json({ message: 'Sales plan not found' });
    }
    return res.json({ message: 'Sales plan deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting sales plan', error });
  }
};

// Get sales plans by product
export const getSalesByProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { productId } = req.params;
    const sales = await Sales.find({ productId }).populate('productId');
    return res.json(sales);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sales plans for product', error });
  }
};

// Update sales status
export const updateSalesStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const sales = await Sales.findById(id);
    if (!sales) {
      return res.status(404).json({ message: 'Sales plan not found' });
    }

    sales.status = status;
    const updatedSales = await sales.save();
    const populatedSales = await updatedSales.populate('productId');
    
    return res.json(populatedSales);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating sales status', error });
  }
};

// Get sales analytics
export const getSalesAnalytics = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { startDate, endDate } = req.query;
    
    const query: any = {};
    if (startDate && endDate) {
      query['period.startDate'] = { $gte: new Date(startDate as string) };
      query['period.endDate'] = { $lte: new Date(endDate as string) };
    }

    const sales = await Sales.find(query).populate('productId');
    
    const analytics = {
      totalRevenue: sales.reduce((sum: number, sale: ISales) => sum + sale.actual.revenue, 0),
      totalQuantity: sales.reduce((sum: number, sale: ISales) => sum + sale.actual.quantity, 0),
      averageRevenue: sales.length > 0 
        ? sales.reduce((sum: number, sale: ISales) => sum + sale.actual.revenue, 0) / sales.length 
        : 0,
      targetAchievement: sales.length > 0
        ? (sales.reduce((sum: number, sale: ISales) => sum + sale.actual.revenue, 0) / 
           sales.reduce((sum: number, sale: ISales) => sum + sale.targets.revenue, 0)) * 100
        : 0
    };

    return res.json(analytics);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sales analytics', error });
  }
};
