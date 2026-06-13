import { z } from 'zod';
import { STATUSES, PRIORITIES, CATEGORIES, CHANNELS } from '../types';

const statusEnum = z.enum(STATUSES as [string, ...string[]]);
const priorityEnum = z.enum(PRIORITIES as [string, ...string[]]);
const categoryEnum = z.enum(CATEGORIES as [string, ...string[]]);

export const createProspectSchema = z
  .object({
    name: z.string().min(1),
    category: categoryEnum.optional(),
    city: z.string().optional(),
    instagram: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    source: z.string().optional(),
    priority: priorityEnum.optional(),
  })
  .refine((d) => !!(d.phone && d.phone.trim()) || !!(d.instagram && d.instagram.trim()), {
    message: 'Need a phone or instagram',
  });

export const updateProspectSchema = z.object({
  name: z.string().min(1).optional(),
  category: categoryEnum.optional(),
  city: z.string().optional(),
  instagram: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  source: z.string().optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  assignedTo: z.string().optional(),
  followUpAt: z.string().optional().nullable(),
  meetingAt: z.string().optional().nullable(),
});

export const addNoteSchema = z.object({ text: z.string().min(1) });
export const contactedSchema = z.object({ channel: z.enum(CHANNELS as [string, ...string[]]) });
