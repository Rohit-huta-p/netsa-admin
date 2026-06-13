import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Prospect } from '../types';

export function useProspects(filters: Record<string, string>) {
  return useQuery({
    queryKey: ['prospects', filters],
    queryFn: async () => (await api.get<{ items: Prospect[] }>('/prospects', { params: filters })).data.items,
  });
}
