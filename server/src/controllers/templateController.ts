import { Request, Response } from 'express';
import { Template } from '../models/Template';

export async function listTemplates(_req: Request, res: Response): Promise<void> {
  const items = await Template.find().sort({ key: 1 });
  res.json({ items });
}

export async function updateTemplate(req: Request, res: Response): Promise<void> {
  const { body, label } = req.body as { body?: string; label?: string };
  const update: Record<string, unknown> = { updatedBy: req.admin!.id };
  if (typeof body === 'string') update.body = body;
  if (typeof label === 'string') update.label = label;
  const template = await Template.findOneAndUpdate({ key: req.params.key }, update, { new: true });
  if (!template) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ template });
}
