import { Request, Response } from 'express';
import { z } from 'zod';
import { AdminUser, hashPassword } from '../models/AdminUser';

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(7),
  role: z.enum(['owner', 'member']).optional(),
});

export async function listAdmins(_req: Request, res: Response): Promise<void> {
  const items = await AdminUser.find().select('-passwordHash').sort({ createdAt: 1 });
  res.json({ items });
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const { email, name, password, role } = parsed.data;
  if (await AdminUser.findOne({ email: email.toLowerCase() })) {
    res.status(409).json({ error: 'Email already exists' });
    return;
  }
  const user = await AdminUser.create({ email: email.toLowerCase(), name, role: role || 'member', passwordHash: await hashPassword(password) });
  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}

export async function removeAdmin(req: Request, res: Response): Promise<void> {
  if (req.params.id === req.admin!.id) {
    res.status(400).json({ error: 'Cannot remove yourself' });
    return;
  }
  const removed = await AdminUser.findByIdAndDelete(req.params.id);
  if (!removed) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ ok: true });
}
