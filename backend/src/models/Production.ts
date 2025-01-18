import mongoose, { Schema, Document } from 'mongoose';
import { IFacility } from './Facility';

export interface IProduction extends Document {
  facilityId: IFacility['_id'];
  species: string;
  quantity: {
    initial: number;
    current: number;
    loss: number;
  };
  period: {
    startDate: Date;
    expectedEndDate: Date;
    actualEndDate?: Date;
  };
  growth: {
    initialSize: number;
    currentSize: number;
    targetSize: number;
    growthRate: number;
  };
  feed: {
    type: string;
    dailyAmount: number;
    totalUsed: number;
    conversionRatio: number;
  };
  health: {
    status: 'healthy' | 'concerning' | 'critical';
    issues: string[];
    treatments: {
      date: Date;
      type: string;
      description: string;
    }[];
  };
  status: 'planning' | 'ongoing' | 'completed' | 'cancelled';
  costs: {
    feed: number;
    labor: number;
    maintenance: number;
    other: number;
    total: number;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductionSchema: Schema = new Schema({
  facilityId: {
    type: Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  species: {
    type: String,
    required: true
  },
  quantity: {
    initial: {
      type: Number,
      required: true,
      min: 0
    },
    current: {
      type: Number,
      required: true,
      min: 0
    },
    loss: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    expectedEndDate: {
      type: Date,
      required: true
    },
    actualEndDate: {
      type: Date
    }
  },
  growth: {
    initialSize: {
      type: Number,
      required: true,
      min: 0
    },
    currentSize: {
      type: Number,
      required: true,
      min: 0
    },
    targetSize: {
      type: Number,
      required: true,
      min: 0
    },
    growthRate: {
      type: Number,
      required: true,
      min: 0
    }
  },
  feed: {
    type: {
      type: String,
      required: true
    },
    dailyAmount: {
      type: Number,
      required: true,
      min: 0
    },
    totalUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    conversionRatio: {
      type: Number,
      required: true,
      min: 0
    }
  },
  health: {
    status: {
      type: String,
      enum: ['healthy', 'concerning', 'critical'],
      default: 'healthy'
    },
    issues: [{
      type: String
    }],
    treatments: [{
      date: {
        type: Date,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }]
  },
  status: {
    type: String,
    enum: ['planning', 'ongoing', 'completed', 'cancelled'],
    default: 'planning'
  },
  costs: {
    feed: {
      type: Number,
      default: 0,
      min: 0
    },
    labor: {
      type: Number,
      default: 0,
      min: 0
    },
    maintenance: {
      type: Number,
      default: 0,
      min: 0
    },
    other: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: function(this: any) {
        return this.costs.feed + this.costs.labor + this.costs.maintenance + this.costs.other;
      }
    }
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Production = mongoose.model<IProduction>('Production', ProductionSchema);
