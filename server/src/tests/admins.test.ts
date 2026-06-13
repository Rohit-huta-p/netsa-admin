import request from 'supertest';
import { createApp } from '../app';
import { AdminUser, hashPassword } from '../models/AdminUser';

async function tokenForRole(role: 'owner' | 'member') {
  await AdminUser.create({ email: `${role}@b.in`, name: role, role, passwordHash: await hashPassword('pw12345') });
  const r = await request(createApp()).post('/api/auth/login').send({ email: `${role}@b.in`, password: 'pw12345' });
  return r.body.token as string;
}

describe('admins (team)', () => {
  it('forbids members from adding admins', async () => {
    const t = await tokenForRole('member');
    const res = await request(createApp()).post('/api/admins').set('Authorization', `Bearer ${t}`).send({ email: 'x@y.in', name: 'X', password: 'pw12345' });
    expect(res.status).toBe(403);
  });

  it('lets an owner add and list members', async () => {
    const t = await tokenForRole('owner');
    const auth = { Authorization: `Bearer ${t}` };
    const created = await request(createApp()).post('/api/admins').set(auth).send({ email: 'intern@y.in', name: 'Intern', password: 'pw12345', role: 'member' });
    expect(created.status).toBe(201);
    const list = await request(createApp()).get('/api/admins').set(auth);
    expect(list.body.items.length).toBe(2);
    expect(list.body.items[0].passwordHash).toBeUndefined();
  });
});
