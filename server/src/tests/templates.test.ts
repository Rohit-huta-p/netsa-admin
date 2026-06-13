import request from 'supertest';
import { createApp } from '../app';
import { AdminUser, hashPassword } from '../models/AdminUser';
import { seedTemplates } from '../models/Template';

async function token() {
  await AdminUser.create({ email: 'a@b.in', name: 'A', role: 'owner', passwordHash: await hashPassword('pw12345') });
  const r = await request(createApp()).post('/api/auth/login').send({ email: 'a@b.in', password: 'pw12345' });
  return r.body.token as string;
}

describe('templates', () => {
  it('lists seeded templates and edits one', async () => {
    await seedTemplates();
    const t = await token();
    const auth = { Authorization: `Bearer ${t}` };

    const list = await request(createApp()).get('/api/templates').set(auth);
    expect(list.body.items.length).toBeGreaterThanOrEqual(3);

    const patched = await request(createApp()).patch('/api/templates/intro').set(auth).send({ body: 'Hi {{firstName}}!' });
    expect(patched.body.template.body).toBe('Hi {{firstName}}!');
  });
});
