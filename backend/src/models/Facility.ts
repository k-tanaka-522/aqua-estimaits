import mongoose, { Schema, Document } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  location: string;
  capacity: number;
  operatingCosts: number;
  maintenanceSchedule: string;
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  operatingCosts: {
    type: Number,
    required: true,
    min: 0
  },
  maintenanceSchedule: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model<IFacility>('Facility', FacilitySchema);
