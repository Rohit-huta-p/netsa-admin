import mongoose from 'mongoose';
import request from 'supertest';
import { Prospect } from '../models/Prospect';
import { createApp } from '../app';
import { AdminUser, hashPassword } from '../models/AdminUser';

describe('Prospect model', () => {
  it('applies defaults', async () => {
    const p = await Prospect.create({ name: 'Aarav', phone: '919876543210', createdBy: new mongoose.Types.ObjectId() });
    expect(p.status).toBe('to_reach_out');
    expect(p.priority).toBe('medium');
    expect(p.city).toBe('Pune');
    expect(p.notes).toEqual([]);
  });
});

async function tokenFor() {
  await AdminUser.create({ email: 'a@b.in', name: 'A', role: 'owner', passwordHash: await hashPassword('pw12345') });
  const res = await request(createApp()).post('/api/auth/login').send({ email: 'a@b.in', password: 'pw12345' });
  return res.body.token as string;
}

describe('prospect CRUD', () => {
  it('rejects create without phone or instagram', async () => {
    const token = await tokenFor();
    const res = await request(createApp()).post('/api/prospects').set('Authorization', `Bearer ${token}`).send({ name: 'No Contact' });
    expect(res.status).toBe(400);
  });

  it('creates, lists, filters, updates, deletes', async () => {
    const token = await tokenFor();
    const app = createApp();
    const auth = { Authorization: `Bearer ${token}` };

    const created = await request(app).post('/api/prospects').set(auth).send({ name: 'Aarav', phone: '9876543210', priority: 'high' });
    expect(created.status).toBe(201);
    expect(created.body.prospect.phone).toBe('919876543210');
    const id = created.body.prospect._id;

    const list = await request(app).get('/api/prospects').set(auth);
    expect(list.body.items).toHaveLength(1);

    const filtered = await request(app).get('/api/prospects?status=met').set(auth);
    expect(filtered.body.items).toHaveLength(0);

    const updated = await request(app).patch(`/api/prospects/${id}`).set(auth).send({ status: 'replied' });
    expect(updated.body.prospect.status).toBe('replied');

    const del = await request(app).delete(`/api/prospects/${id}`).set(auth);
    expect(del.body.ok).toBe(true);
  });
});

describe('prospect import endpoint', () => {
  it('imports new rows, skips duplicates, reports errors', async () => {
    const token = await tokenFor();
    const app = createApp();
    const auth = { Authorization: `Bearer ${token}` };
    await request(app).post('/api/prospects').set(auth).send({ name: 'Existing', phone: '9876543210' });
    const raw = 'name,phone\nNewPerson,9000000001\nDupPerson,9876543210\nNoContactPerson,';
    const res = await request(app).post('/api/prospects/import').set(auth).send({ rawText: raw });
    expect(res.status).toBe(200);
    expect(res.body.inserted).toBe(1);
    expect(res.body.skipped).toBe(1);
    expect(res.body.errors.length).toBe(1);
  });
});
