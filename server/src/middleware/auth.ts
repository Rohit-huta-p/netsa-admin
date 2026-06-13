import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminPayload {
  id: string;
  role: 'owner' | 'member';
  name: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET as string) as AdminPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
