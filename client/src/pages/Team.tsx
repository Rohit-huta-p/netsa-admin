import { useState, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { AdminUser } from '../types';
import { Trash2 } from 'lucide-react';

export default function Team() {
  const qc = useQueryClient();
  const { data: admins = [] } = useQuery({ queryKey: ['admins'], queryFn: async () => (await api.get<{ items: AdminUser[] }>('/admins')).data.items });
  const create = useMutation({ mutationFn: (b: { email: string; name: string; password: string; role: string }) => api.post('/admins', b), onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }) });
  const remove = useMutation({ mutationFn: (id: string) => api.delete(`/admins/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }) });
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'member' });
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try { await create.mutateAsync(form); setForm({ email: '', name: '', password: '', role: 'member' }); }
    catch { setError('Could not add — email may already exist, or password under 8 chars'); }
  }

  return (
    <div className="p-4 max-w-xl">
      <h1 className="font-display text-2xl">Team</h1>
      <p className="text-sm text-zinc-500 mt-0.5 mb-4">People who can work the outreach list.</p>
      <div className="space-y-2 mb-6">
        {admins.map((a) => (
          <div key={a.id} className="flex items-center justify-between bg-ink-surface border border-ink-border rounded-md px-3 py-2">
            <div><span className="text-sm">{a.name}</span> <span className="text-xs text-zinc-500">· {a.email} · {a.role}</span></div>
            <button className="icon-btn text-red-400" onClick={() => remove.mutate(a.id)} aria-label={`Remove ${a.name}`}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="bg-ink-surface border border-ink-border rounded-lg p-4 grid grid-cols-2 gap-3">
        <div className="col-span-2 text-sm font-medium">Add a teammate</div>
        <input className="field" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        <input className="field" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        <input className="field" placeholder="Temp password (8+ chars)" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
        <select className="field" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}><option value="member">member</option><option value="owner">owner</option></select>
        {error && <p className="col-span-2 text-sm text-red-400">{error}</p>}
        <div className="col-span-2 flex justify-end"><button className="btn btn-primary" type="submit">Add teammate</button></div>
      </form>
    </div>
  );
}
