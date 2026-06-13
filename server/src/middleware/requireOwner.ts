import { Request, Response, NextFunction } from 'express';

export function requireOwner(req: Request, res: Response, next: NextFunction): void {
  if (req.admin?.role !== 'owner') {
    res.status(403).json({ error: 'Owner only' });
    return;
  }
  next();
}
