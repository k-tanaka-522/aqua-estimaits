import mongoose, { Schema, Document } from 'mongoose';

export interface ISales extends Document {
  productId: mongoose.Types.ObjectId;
  period: {
    startDate: Date;
    endDate: Date;
  };
  targets: {
    quantity: number;
    revenue: number;
  };
  actual: {
    quantity: number;
    revenue: number;
  };
  marketAnalysis: {
    marketSize: number;
    competitorPrices: number[];
    targetMarketShare: number;
  };
  pricing: {
    basePrice: number;
    discounts: {
      bulk: number;
      seasonal: number;
    };
  };
  distribution: {
    channels: string[];
    costs: number;
  };
  status: 'draft' | 'active' | 'completed' | 'archived';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const SalesSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Production',
    required: true
  },
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
  targets: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    revenue: {
      type: Number,
      required: true,
      min: 0
    }
  },
  actual: {
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    revenue: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  marketAnalysis: {
    marketSize: {
      type: Number,
      required: true,
      min: 0
    },
    competitorPrices: [{
      type: Number,
      min: 0
    }],
    targetMarketShare: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    discounts: {
      bulk: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      seasonal: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    }
  },
  distribution: {
    channels: [{
      type: String,
      required: true
    }],
    costs: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<ISales>('Sales', SalesSchema);
