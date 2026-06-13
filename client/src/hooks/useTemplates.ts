import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Template } from '../types';

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => (await api.get<{ items: Template[] }>('/templates')).data.items,
  });
}
