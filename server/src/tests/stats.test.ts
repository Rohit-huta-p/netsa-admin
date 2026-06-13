import request from 'supertest';
import { createApp } from '../app';
import { AdminUser, hashPassword } from '../models/AdminUser';
import { Prospect } from '../models/Prospect';
import mongoose from 'mongoose';

async function token() {
  await AdminUser.create({ email: 'a@b.in', name: 'A', role: 'owner', passwordHash: await hashPassword('pw12345') });
  const r = await request(createApp()).post('/api/auth/login').send({ email: 'a@b.in', password: 'pw12345' });
  return r.body.token as string;
}

describe('funnel stats', () => {
  it('counts by status and overdue follow-ups', async () => {
    const t = await token();
    const by = new mongoose.Types.ObjectId();
    const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
    await Prospect.create({ name: 'A', phone: '911111111111', status: 'to_reach_out', followUpAt: yesterday, createdBy: by });
    await Prospect.create({ name: 'B', phone: '912222222222', status: 'met', createdBy: by });

    const res = await request(createApp()).get('/api/stats/funnel').set('Authorization', `Bearer ${t}`);
    expect(res.status).toBe(200);
    expect(res.body.byStatus.to_reach_out).toBe(1);
    expect(res.body.byStatus.met).toBe(1);
    expect(res.body.overdueCount).toBe(1);
  });
});
