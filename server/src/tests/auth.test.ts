import request from 'supertest';
import { AdminUser, hashPassword } from '../models/AdminUser';
import { createApp } from '../app';

describe('AdminUser model', () => {
  it('hashes and verifies a password', async () => {
    const user = await AdminUser.create({
      email: 'Test@Example.com',
      name: 'Tester',
      role: 'owner',
      passwordHash: await hashPassword('secret123'),
    });
    expect(user.email).toBe('test@example.com'); // lowercased
    expect(user.passwordHash).not.toBe('secret123');
    expect(await user.comparePassword('secret123')).toBe(true);
    expect(await user.comparePassword('wrong')).toBe(false);
  });
});

async function seedUser() {
  return AdminUser.create({ email: 'me@netsa.in', name: 'Me', role: 'owner', passwordHash: await hashPassword('pw12345') });
}

describe('auth routes', () => {
  it('logs in with correct credentials', async () => {
    await seedUser();
    const res = await request(createApp()).post('/api/auth/login').send({ email: 'me@netsa.in', password: 'pw12345' });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user.email).toBe('me@netsa.in');
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('rejects wrong password with 401', async () => {
    await seedUser();
    const res = await request(createApp()).post('/api/auth/login').send({ email: 'me@netsa.in', password: 'nope' });
    expect(res.status).toBe(401);
  });

  it('blocks /me without a token', async () => {
    const res = await request(createApp()).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the admin on /me with a token', async () => {
    await seedUser();
    const login = await request(createApp()).post('/api/auth/login').send({ email: 'me@netsa.in', password: 'pw12345' });
    const res = await request(createApp()).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Me');
  });
});
