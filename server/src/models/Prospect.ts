import { Schema, model, Document, Types } from 'mongoose';
import { ProspectStatus, Priority, Category, Channel, STATUSES, PRIORITIES, CATEGORIES, CHANNELS } from '../types';

export interface INote {
  text: string;
  by: Types.ObjectId;
  at: Date;
}

export interface IProspect extends Document {
  name: string;
  category?: Category;
  city: string;
  instagram?: string;
  phone?: string;
  email?: string;
  source?: string;
  priority: Priority;
  status: ProspectStatus;
  assignedTo?: Types.ObjectId;
  notes: INote[];
  followUpAt?: Date;
  meetingAt?: Date;
  lastContactedAt?: Date;
  lastChannel?: Channel;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    text: { type: String, required: true },
    by: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const prospectSchema = new Schema<IProspect>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: CATEGORIES },
    city: { type: String, default: 'Pune', trim: true },
    instagram: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    source: { type: String, trim: true },
    priority: { type: String, enum: PRIORITIES, default: 'medium' },
    status: { type: String, enum: STATUSES, default: 'to_reach_out' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    notes: { type: [noteSchema], default: [] },
    followUpAt: Date,
    meetingAt: Date,
    lastContactedAt: Date,
    lastChannel: { type: String, enum: CHANNELS },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  },
  { timestamps: true }
);

prospectSchema.index({ status: 1 });
prospectSchema.index({ priority: 1 });
prospectSchema.index({ followUpAt: 1 });
prospectSchema.index({ assignedTo: 1 });
prospectSchema.index({ city: 1 });
prospectSchema.index({ name: 'text' });

export const Prospect = model<IProspect>('Prospect', prospectSchema);
