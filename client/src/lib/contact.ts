import { Channel } from '../types';

export interface ContactInfo {
  phone?: string;
  instagram?: string;
}

export function renderTemplate(body: string, vars: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : `{{${key}}}`));
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildInstagramDmUrl(handle: string): string {
  return `https://ig.me/m/${handle.replace(/^@/, '')}`;
}

export function buildTelUrl(phone: string): string {
  return `tel:+${phone}`;
}

export function buildSmsUrl(phone: string, message: string): string {
  return `sms:+${phone}?&body=${encodeURIComponent(message)}`;
}

export function channelsFor(p: ContactInfo): Channel[] {
  const channels: Channel[] = [];
  if (p.phone) channels.push('whatsapp');
  if (p.instagram) channels.push('instagram');
  if (p.phone) channels.push('call');
  return channels;
}

export function firstName(name: string): string {
  return (name || '').trim().split(/\s+/)[0] || '';
}
