import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { useProspectMutations } from '../hooks/useMutations';
import { useAuth } from '../auth/AuthContext';
import { Category, Priority } from '../types';

const CATEGORIES: Category[] = ['dancer', 'actor', 'choreographer', 'musician', 'organizer', 'other'];

export function AddProspectForm({ onClose }: { onClose: () => void }) {
  const { create } = useProspectMutations();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', category: '', city: 'Pune', instagram: '', phone: '', source: '', priority: 'medium' as Priority, addedByName: '' });
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.phone.trim() && !form.instagram.trim()) { setError('Add a phone or Instagram'); return; }
    await create.mutateAsync({ ...form, category: (form.category || undefined) as Category });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} className="w-full max-w-md bg-ink-surface border border-ink-border rounded-xl p-5">
        <div className="flex justify-between items-center mb-4"><h2 className="font-display text-lg">Add prospect</h2><button type="button" onClick={onClose} className="icon-btn"><X size={16} /></button></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className="text-xs text-zinc-400">Name</label><input className="field mt-1" value={form.name} onChange={(e) => set('name', e.target.value)} required /></div>
          <div><label className="text-xs text-zinc-400">Category</label>
            <select className="field mt-1" value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">—</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></div>
          <div><label className="text-xs text-zinc-400">City</label><input className="field mt-1" value={form.city} onChange={(e) => set('city', e.target.value)} /></div>
          <div><label className="text-xs text-zinc-400">Instagram</label><input className="field mt-1" placeholder="@handle" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} /></div>
          <div><label className="text-xs text-zinc-400">Phone</label><input className="field mt-1" placeholder="+91…" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
          <div><label className="text-xs text-zinc-400">Source</label><input className="field mt-1" placeholder="referral, IG…" value={form.source} onChange={(e) => set('source', e.target.value)} /></div>
          <div className="col-span-2"><label className="text-xs text-zinc-400">Added by</label><input className="field mt-1" placeholder="Your name" value={form.addedByName} onChange={(e) => set('addedByName', e.target.value)} /></div>
          <div><label className="text-xs text-zinc-400">Priority</label>
            <select className="field mt-1" value={form.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
              <option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
            </select></div>
        </div>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        <div className="flex justify-end gap-2 mt-4"><button type="button" className="btn" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Add</button></div>
      </form>
    </div>
  );
}
