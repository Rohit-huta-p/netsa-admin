import { Prospect } from '../models/Prospect';
import { CATEGORIES } from '../types';

export interface ParsedRow {
  name?: string;
  category?: string;
  city?: string;
  instagram?: string;
  phone?: string;
  email?: string;
  source?: string;
  priority?: string;
  _error?: string;
}

const HEADERS = ['name', 'category', 'city', 'instagram', 'phone', 'email', 'source', 'priority'];

export function normalizePhone(raw: string): string {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = '91' + digits.slice(1);
  if (digits.length === 10) digits = '91' + digits;
  return digits;
}

export function normalizeInstagram(raw: string): string {
  let s = (raw || '').trim();
  const m = s.match(/instagram\.com\/([^/?#\s]+)/i);
  if (m) s = m[1];
  return s.replace(/^@/, '').trim();
}

function parseLine(line: string, headerCols: string[] | null): ParsedRow {
  const cells = line.split(',').map((c) => c.trim());
  const row: ParsedRow = {};
  if (headerCols) {
    headerCols.forEach((h, i) => {
      if (HEADERS.includes(h) && cells[i]) (row as Record<string, string>)[h] = cells[i];
    });
  } else {
    for (const cell of cells) {
      if (!cell) continue;
      if (/instagram\.com\//i.test(cell) || cell.startsWith('@')) row.instagram = cell;
      else if ((cell.match(/\d/g) || []).length >= 10) row.phone = cell;
      else if (/@/.test(cell) && /\.[a-z]{2,}$/i.test(cell)) row.email = cell;
      else if (!row.name) row.name = cell;
      else if (!row.category) row.category = cell;
    }
  }
  if (row.phone) row.phone = normalizePhone(row.phone);
  if (row.instagram) row.instagram = normalizeInstagram(row.instagram);
  if (!row.name) row._error = 'Missing name';
  else if (!row.phone && !row.instagram) row._error = 'No phone or instagram';
  return row;
}

export function parseRawText(raw: string): ParsedRow[] {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const first = lines[0].toLowerCase();
  const hasHeader = HEADERS.some((h) => first.split(',').map((c) => c.trim()).includes(h));
  let headerCols: string[] | null = null;
  let dataLines = lines;
  if (hasHeader) {
    headerCols = lines[0].split(',').map((c) => c.trim().toLowerCase());
    dataLines = lines.slice(1);
  }
  return dataLines.map((line) => parseLine(line, headerCols));
}

export interface ImportResult {
  inserted: number;
  skipped: number;
  errors: { row: ParsedRow; reason: string }[];
}

export async function importProspects(rows: ParsedRow[], createdBy: string): Promise<ImportResult> {
  let inserted = 0;
  let skipped = 0;
  const errors: { row: ParsedRow; reason: string }[] = [];
  for (const r of rows) {
    if (r._error) {
      errors.push({ row: r, reason: r._error });
      continue;
    }
    const or: Record<string, string>[] = [];
    if (r.phone) or.push({ phone: r.phone });
    if (r.instagram) or.push({ instagram: r.instagram });
    const dup = or.length ? await Prospect.findOne({ $or: or }) : null;
    if (dup) {
      skipped++;
      continue;
    }
    const cat = (r.category || '').toLowerCase();
    try {
      await Prospect.create({
        name: r.name,
        category: (CATEGORIES as string[]).includes(cat) ? cat : undefined,
        city: r.city || 'Pune',
        instagram: r.instagram,
        phone: r.phone,
        email: r.email,
        source: r.source,
        priority: ['high', 'medium', 'low'].includes((r.priority || '').toLowerCase()) ? (r.priority as string).toLowerCase() : 'medium',
        createdBy,
      });
      inserted++;
    } catch (err: unknown) {
      errors.push({ row: r, reason: err instanceof Error ? err.message : 'DB error' });
    }
  }
  return { inserted, skipped, errors };
}
