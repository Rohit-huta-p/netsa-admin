import request from 'supertest';
import { createApp } from '../app';
import { AdminUser, hashPassword } from '../models/AdminUser';

async function setup() {
  await AdminUser.create({ email: 'a@b.in', name: 'A', role: 'owner', passwordHash: await hashPassword('pw12345') });
  const login = await request(createApp()).post('/api/auth/login').send({ email: 'a@b.in', password: 'pw12345' });
  const token = login.body.token as string;
  const auth = { Authorization: `Bearer ${token}` };
  const created = await request(createApp()).post('/api/prospects').set(auth).send({ name: 'Aarav', phone: '9876543210' });
  return { auth, id: created.body.prospect._id as string };
}

describe('contacted + notes', () => {
  it('stamps channel, adds an auto-note, bumps to_reach_out -> contacted', async () => {
    const { auth, id } = await setup();
    const res = await request(createApp()).post(`/api/prospects/${id}/contacted`).set(auth).send({ channel: 'whatsapp' });
    expect(res.status).toBe(200);
    expect(res.body.prospect.status).toBe('contacted');
    expect(res.body.prospect.lastChannel).toBe('whatsapp');
    expect(res.body.prospect.notes[0].text).toBe('Reached out via whatsapp');
  });

  it('does not downgrade an advanced status', async () => {
    const { auth, id } = await setup();
    await request(createApp()).patch(`/api/prospects/${id}`).set(auth).send({ status: 'met' });
    const res = await request(createApp()).post(`/api/prospects/${id}/contacted`).set(auth).send({ channel: 'call' });
    expect(res.body.prospect.status).toBe('met');
  });

  it('appends a manual note', async () => {
    const { auth, id } = await setup();
    const res = await request(createApp()).post(`/api/prospects/${id}/notes`).set(auth).send({ text: 'Said yes to a call' });
    expect(res.body.prospect.notes.at(-1).text).toBe('Said yes to a call');
  });
});
