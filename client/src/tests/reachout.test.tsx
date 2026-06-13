import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import api from '../lib/api';
import ReachOut from '../pages/ReachOut';

vi.mock('../lib/api');

const mockProspect = {
  _id: '1', name: 'Aarav Kulkarni', category: 'dancer', city: 'Pune', phone: '919876543210',
  priority: 'high', status: 'replied', notes: [], createdAt: '', updatedAt: '',
};

beforeEach(() => {
  (api.get as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
    if (url === '/prospects') return Promise.resolve({ data: { items: [mockProspect] } });
    if (url === '/stats/funnel') return Promise.resolve({ data: { byStatus: { replied: 1 }, dueTodayCount: 0, overdueCount: 0 } });
    if (url === '/templates') return Promise.resolve({ data: { items: [{ key: 'intro', body: 'Hi {{firstName}}' }] } });
    return Promise.resolve({ data: {} });
  });
});

function renderPage() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter><ReachOut /></MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ReachOut page', () => {
  it('renders a prospect row from the query', async () => {
    renderPage();
    expect(await screen.findByText('Aarav Kulkarni')).toBeInTheDocument();
    expect(screen.getAllByText('Replied').length).toBeGreaterThan(0);
  });
});
