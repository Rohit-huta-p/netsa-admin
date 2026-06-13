import { describe, it, expect } from 'vitest';
import { buildWhatsAppUrl, buildInstagramDmUrl, buildTelUrl, buildSmsUrl, renderTemplate, channelsFor, firstName } from '../lib/contact';

describe('contact builders', () => {
  it('builds a wa.me url with encoded text', () => {
    expect(buildWhatsAppUrl('919876543210', 'Hi Aarav!')).toBe('https://wa.me/919876543210?text=Hi%20Aarav!');
  });
  it('builds an ig.me dm url, stripping @', () => {
    expect(buildInstagramDmUrl('@aarav.dances')).toBe('https://ig.me/m/aarav.dances');
  });
  it('builds tel + sms', () => {
    expect(buildTelUrl('919876543210')).toBe('tel:+919876543210');
    expect(buildSmsUrl('919876543210', 'yo')).toBe('sms:+919876543210?&body=yo');
  });
  it('renders template placeholders', () => {
    expect(renderTemplate('Hi {{firstName}} from {{city}}', { firstName: 'Aarav', city: 'Pune' })).toBe('Hi Aarav from Pune');
  });
  it('lists channels by available contact info', () => {
    expect(channelsFor({ phone: '91', instagram: 'x' })).toEqual(['whatsapp', 'instagram', 'call']);
    expect(channelsFor({ instagram: 'x' })).toEqual(['instagram']);
    expect(firstName('Aarav Kulkarni')).toBe('Aarav');
  });
});
