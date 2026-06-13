import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Channel, Prospect, ProspectUpdate } from '../types';

export function useProspectMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['prospects'] });
    qc.invalidateQueries({ queryKey: ['funnel'] });
  };

  const create = useMutation({ mutationFn: (body: Partial<Prospect>) => api.post('/prospects', body), onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProspectUpdate }) => api.patch(`/prospects/${id}`, body),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: (id: string) => api.delete(`/prospects/${id}`), onSuccess: invalidate });
  const addNote = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => api.post(`/prospects/${id}/notes`, { text }),
    onSuccess: invalidate,
  });
  const markContacted = useMutation({
    mutationFn: ({ id, channel }: { id: string; channel: Channel }) => api.post(`/prospects/${id}/contacted`, { channel }),
    onSuccess: invalidate,
  });
  const importText = useMutation({ mutationFn: (rawText: string) => api.post('/prospects/import', { rawText }), onSuccess: invalidate });

  return { create, update, remove, addNote, markContacted, importText };
}
