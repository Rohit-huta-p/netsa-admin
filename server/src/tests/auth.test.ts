import { AdminUser, hashPassword } from '../models/AdminUser';

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
