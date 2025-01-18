import mongoose, { Schema, Document } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  capacity: {
    total: number;
    used: number;
    available: number;
  };
  type: 'pond' | 'tank' | 'cage' | 'other';
  status: 'active' | 'maintenance' | 'inactive';
  waterQuality: {
    temperature: number;
    pH: number;
    oxygen: number;
    salinity: number;
  };
  maintenance: {
    lastCheck: Date;
    nextCheck: Date;
    status: 'good' | 'needsAttention' | 'urgent';
    notes: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  capacity: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    used: {
      type: Number,
      default: 0,
      min: 0
    },
    available: {
      type: Number,
      default: function(this: any) {
        return this.capacity.total - this.capacity.used;
      }
    }
  },
  type: {
    type: String,
    enum: ['pond', 'tank', 'cage', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  waterQuality: {
    temperature: {
      type: Number,
      required: true
    },
    pH: {
      type: Number,
      required: true
    },
    oxygen: {
      type: Number,
      required: true
    },
    salinity: {
      type: Number,
      required: true
    }
  },
  maintenance: {
    lastCheck: {
      type: Date,
      default: Date.now
    },
    nextCheck: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['good', 'needsAttention', 'urgent'],
      default: 'good'
    },
    notes: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

export const Facility = mongoose.model<IFacility>('Facility', FacilitySchema);
