import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Funnel } from '../types';

export function useFunnel() {
  return useQuery({
    queryKey: ['funnel'],
    queryFn: async () => (await api.get<Funnel>('/stats/funnel')).data,
  });
}
