import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface IFinancialPlan {
  _id?: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  budget: {
    total: number;
    categories: {
      operations: number;
      maintenance: number;
      labor: number;
      materials: number;
      marketing: number;
      other: number;
    };
  };
  actualExpenses: {
    total: number;
    categories: {
      operations: number;
      maintenance: number;
      labor: number;
      materials: number;
      marketing: number;
      other: number;
    };
  };
  revenue: {
    projected: number;
    actual: number;
    breakdown: {
      productSales: number;
      services: number;
      other: number;
    };
  };
  cashFlow: {
    opening: number;
    closing: number;
    netChange: number;
  };
  profitability: {
    grossMargin: number;
    netMargin: number;
    roi: number;
  };
  status: 'planning' | 'active' | 'completed' | 'archived';
  notes: string;
}

export interface IFinancialSummary {
  totalBudget: number;
  totalExpenses: number;
  totalRevenue: number;
  averageGrossMargin: number;
  averageNetMargin: number;
  averageROI: number;
}

const financialService = {
  // 全ての財務計画を取得
  getAllFinancials: async (): Promise<IFinancialPlan[]> => {
    const response = await axios.get(`${API_URL}/api/financial`);
    return response.data;
  },

  // 特定の財務計画を取得
  getFinancialById: async (id: string): Promise<IFinancialPlan> => {
    const response = await axios.get(`${API_URL}/api/financial/${id}`);
    return response.data;
  },

  // 新しい財務計画を作成
  createFinancial: async (financialData: Omit<IFinancialPlan, '_id'>): Promise<IFinancialPlan> => {
    const response = await axios.post(`${API_URL}/api/financial`, financialData);
    return response.data;
  },

  // 財務計画を更新
  updateFinancial: async (id: string, financialData: Partial<IFinancialPlan>): Promise<IFinancialPlan> => {
    const response = await axios.put(`${API_URL}/api/financial/${id}`, financialData);
    return response.data;
  },

  // 財務計画を削除
  deleteFinancial: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/financial/${id}`);
  },

  // 期間指定で財務計画を取得
  getFinancialsByDateRange: async (startDate: Date, endDate: Date): Promise<IFinancialPlan[]> => {
    const response = await axios.get(`${API_URL}/api/financial/date-range`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response.data;
  },

  // 財務サマリーを取得
  getFinancialSummary: async (startDate?: Date, endDate?: Date): Promise<IFinancialSummary> => {
    const params: any = {};
    if (startDate && endDate) {
      params.startDate = startDate.toISOString();
      params.endDate = endDate.toISOString();
    }
    const response = await axios.get(`${API_URL}/api/financial/summary`, { params });
    return response.data;
  }
};

export default financialService;
