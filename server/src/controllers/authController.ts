import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser';
import { loginSchema } from '../validators/auth';

const DUMMY_HASH = bcrypt.hashSync('netsa-constant-time-guard', 10);

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const { email, password } = parsed.data;
  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  let valid = false;
  if (user) {
    valid = await user.comparePassword(password);
  } else {
    await bcrypt.compare(password, DUMMY_HASH); // constant-time guard against email enumeration
  }
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign(
    { id: user!.id, role: user!.role, name: user!.name },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user!.id, name: user!.name, email: user!.email, role: user!.role } });
}

export async function me(req: Request, res: Response): Promise<void> {
  res.json({ user: { id: req.admin?.id, role: req.admin?.role, name: req.admin?.name } });
}
