import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Prospect } from '../models/Prospect';
import { createProspectSchema, updateProspectSchema, addNoteSchema, contactedSchema } from '../validators/prospect';
import { normalizePhone, normalizeInstagram, parseRawText, importProspects } from '../services/importParser';
import { Channel, STATUSES, PRIORITIES, ProspectStatus, Priority } from '../types';

export async function listProspects(req: Request, res: Response): Promise<void> {
  const { status, priority, city, assignedTo, q } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (status && STATUSES.includes(status as ProspectStatus)) filter.status = status;
  if (priority && PRIORITIES.includes(priority as Priority)) filter.priority = priority;
  if (city) filter.city = city;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (q) filter.name = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const items = await Prospect.find(filter).sort({ followUpAt: 1, updatedAt: -1 }).limit(500);
  res.json({ items });
}

export async function createProspect(req: Request, res: Response): Promise<void> {
  const parsed = createProspectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid input' });
    return;
  }
  const d = parsed.data;
  const prospect = await Prospect.create({
    ...d,
    phone: d.phone ? normalizePhone(d.phone) : undefined,
    instagram: d.instagram ? normalizeInstagram(d.instagram) : undefined,
    email: d.email || undefined,
    createdBy: req.admin!.id,
  });
  res.status(201).json({ prospect });
}

export async function getProspect(req: Request, res: Response): Promise<void> {
  const p = await Prospect.findById(req.params.id);
  if (!p) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ prospect: p });
}

export async function updateProspect(req: Request, res: Response): Promise<void> {
  const parsed = updateProspectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid input' });
    return;
  }
  const d = { ...parsed.data } as Record<string, unknown>;
  if (d.phone) d.phone = normalizePhone(d.phone as string);
  if (d.instagram) d.instagram = normalizeInstagram(d.instagram as string);

  const setFields: Record<string, unknown> = {};
  const unsetFields: Record<string, number> = {};

  for (const [k, v] of Object.entries(d)) {
    if ((k === 'followUpAt' || k === 'meetingAt') && (v === null || v === '' || v === undefined)) {
      unsetFields[k] = 1;
    } else if (v !== undefined) {
      setFields[k] = v;
    }
  }
  // auto-set meeting_scheduled only when meetingAt is being set and no explicit status
  if (setFields.meetingAt && !setFields.status) {
    setFields.status = 'meeting_scheduled';
  }

  const updateOp: Record<string, unknown> = {};
  if (Object.keys(setFields).length) updateOp.$set = setFields;
  if (Object.keys(unsetFields).length) updateOp.$unset = unsetFields;

  if (!Object.keys(updateOp).length) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  const p = await Prospect.findByIdAndUpdate(req.params.id, updateOp, { new: true });
  if (!p) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ prospect: p });
}

export async function removeProspect(req: Request, res: Response): Promise<void> {
  const p = await Prospect.findByIdAndDelete(req.params.id);
  if (!p) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ ok: true });
}

export async function addNote(req: Request, res: Response): Promise<void> {
  const parsed = addNoteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const p = await Prospect.findByIdAndUpdate(
    req.params.id,
    { $push: { notes: { text: parsed.data.text, by: req.admin!.id, at: new Date() } } },
    { new: true }
  );
  if (!p) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ prospect: p });
}

export async function markContacted(req: Request, res: Response): Promise<void> {
  const parsed = contactedSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const channel = parsed.data.channel as Channel;
  const p = await Prospect.findById(req.params.id);
  if (!p) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  p.lastContactedAt = new Date();
  p.lastChannel = channel;
  if (p.status === 'to_reach_out') p.status = 'contacted';
  p.notes.push({ text: `Reached out via ${channel}`, by: new mongoose.Types.ObjectId(req.admin!.id), at: new Date() });
  await p.save();
  res.json({ prospect: p });
}

export async function importEndpoint(req: Request, res: Response): Promise<void> {
  const raw = typeof req.body?.rawText === 'string' ? req.body.rawText : '';
  if (!raw.trim()) {
    res.status(400).json({ error: 'No data' });
    return;
  }
  const result = await importProspects(parseRawText(raw), req.admin!.id);
  res.json(result);
}
