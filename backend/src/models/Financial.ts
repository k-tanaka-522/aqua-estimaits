import mongoose, { Schema, Document } from 'mongoose';

export interface IFinancial extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const FinancialSchema: Schema = new Schema({
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  budget: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    categories: {
      operations: {
        type: Number,
        required: true,
        min: 0
      },
      maintenance: {
        type: Number,
        required: true,
        min: 0
      },
      labor: {
        type: Number,
        required: true,
        min: 0
      },
      materials: {
        type: Number,
        required: true,
        min: 0
      },
      marketing: {
        type: Number,
        required: true,
        min: 0
      },
      other: {
        type: Number,
        required: true,
        min: 0
      }
    }
  },
  actualExpenses: {
    total: {
      type: Number,
      default: 0,
      min: 0
    },
    categories: {
      operations: {
        type: Number,
        default: 0,
        min: 0
      },
      maintenance: {
        type: Number,
        default: 0,
        min: 0
      },
      labor: {
        type: Number,
        default: 0,
        min: 0
      },
      materials: {
        type: Number,
        default: 0,
        min: 0
      },
      marketing: {
        type: Number,
        default: 0,
        min: 0
      },
      other: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  revenue: {
    projected: {
      type: Number,
      required: true,
      min: 0
    },
    actual: {
      type: Number,
      default: 0,
      min: 0
    },
    breakdown: {
      productSales: {
        type: Number,
        default: 0,
        min: 0
      },
      services: {
        type: Number,
        default: 0,
        min: 0
      },
      other: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  cashFlow: {
    opening: {
      type: Number,
      required: true
    },
    closing: {
      type: Number,
      default: 0
    },
    netChange: {
      type: Number,
      default: 0
    }
  },
  profitability: {
    grossMargin: {
      type: Number,
      default: 0
    },
    netMargin: {
      type: Number,
      default: 0
    },
    roi: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'archived'],
    default: 'planning'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<IFinancial>('Financial', FinancialSchema);
