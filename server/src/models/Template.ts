import { Schema, model, Document, Types } from 'mongoose';

export interface ITemplate extends Document {
  key: string;
  label: string;
  channel: 'whatsapp' | 'instagram' | 'sms';
  body: string;
  updatedBy?: Types.ObjectId;
}

const templateSchema = new Schema<ITemplate>(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    channel: { type: String, enum: ['whatsapp', 'instagram', 'sms'], default: 'whatsapp' },
    body: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true }
);

export const Template = model<ITemplate>('Template', templateSchema);

export const DEFAULT_TEMPLATES = [
  {
    key: 'intro',
    label: 'Intro',
    channel: 'whatsapp' as const,
    body: "Hi {{firstName}}, I'm Rohit — I've spent 17 years in the performing-arts world and I'm building NETSA for {{city}}'s artists. Would love 15 minutes to hear your honest take. Free sometime this week?",
  },
  {
    key: 'follow_up',
    label: 'Follow-up',
    channel: 'whatsapp' as const,
    body: 'Hi {{firstName}}, just following up on my note about NETSA — still really keen to get your perspective. Any time that works for a quick chat?',
  },
  {
    key: 'meeting_request',
    label: 'Meeting request',
    channel: 'whatsapp' as const,
    body: 'Thanks {{firstName}}! Could we do a short call? I can do most evenings this week — what suits you best?',
  },
];

export async function seedTemplates(): Promise<void> {
  for (const t of DEFAULT_TEMPLATES) {
    await Template.updateOne({ key: t.key }, { $setOnInsert: t }, { upsert: true });
  }
}
