import mongoose, { Schema, Document } from 'mongoose';

export interface IProduction extends Document {
  facilityId: mongoose.Types.ObjectId;
  productName: string;
  targetQuantity: number;
  actualQuantity: number;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  resourceAllocation: {
    labor: number;
    materials: number;
    equipment: number;
  };
  qualityMetrics: {
    targetQuality: number;
    actualQuality?: number;
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
  productName: {
    type: String,
    required: true,
    trim: true
  },
  targetQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  actualQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  resourceAllocation: {
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
    equipment: {
      type: Number,
      required: true,
      min: 0
    }
  },
  qualityMetrics: {
    targetQuality: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    actualQuality: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<IProduction>('Production', ProductionSchema);
