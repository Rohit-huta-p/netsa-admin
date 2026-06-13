import { normalizePhone, normalizeInstagram, parseRawText } from '../services/importParser';

describe('normalizePhone', () => {
  it('keeps 12-digit intl as-is, prefixes 91 for 10-digit', () => {
    expect(normalizePhone('+91 98765 43210')).toBe('919876543210');
    expect(normalizePhone('9876543210')).toBe('919876543210');
    expect(normalizePhone('098765 43210')).toBe('919876543210');
  });
});

describe('normalizeInstagram', () => {
  it('strips @ and URL', () => {
    expect(normalizeInstagram('@aarav.dances')).toBe('aarav.dances');
    expect(normalizeInstagram('https://instagram.com/aarav.dances/')).toBe('aarav.dances');
  });
});

describe('parseRawText', () => {
  it('parses a headered CSV', () => {
    const rows = parseRawText('name,phone,city\nAarav,9876543210,Pune');
    expect(rows[0]).toMatchObject({ name: 'Aarav', phone: '919876543210', city: 'Pune' });
  });

  it('parses headerless lines heuristically', () => {
    const rows = parseRawText('Sanya Mehta, @sanya.act, 9000000000');
    expect(rows[0].name).toBe('Sanya Mehta');
    expect(rows[0].instagram).toBe('sanya.act');
    expect(rows[0].phone).toBe('919000000000');
  });

  it('flags rows with no name or contact', () => {
    const rows = parseRawText('JustAName');
    expect(rows[0]._error).toBe('No phone or instagram');
  });
});
