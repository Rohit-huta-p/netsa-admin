import mongoose from 'mongoose';
import { Prospect } from '../models/Prospect';

describe('Prospect model', () => {
  it('applies defaults', async () => {
    const p = await Prospect.create({ name: 'Aarav', phone: '919876543210', createdBy: new mongoose.Types.ObjectId() });
    expect(p.status).toBe('to_reach_out');
    expect(p.priority).toBe('medium');
    expect(p.city).toBe('Pune');
    expect(p.notes).toEqual([]);
  });
});
