import { useState } from 'react';
import { X } from 'lucide-react';
import { Prospect, ProspectStatus } from '../types';
import { StatusPill } from './StatusPill';
import { ContactButtons } from './ContactButtons';
import { useProspectMutations } from '../hooks/useMutations';
import { STATUS_OPTIONS } from '../lib/statusOptions';

export function ProspectDrawer({ prospect, intro, onClose }: { prospect: Prospect; intro: string; onClose: () => void }) {
  const { update, addNote, remove } = useProspectMutations();
  const [note, setNote] = useState('');
  const [meeting, setMeeting] = useState(prospect.meetingAt ? prospect.meetingAt.slice(0, 16) : '');

  return (
    <div className="fixed inset-0 z-20 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-ink-deep border-l border-ink-border h-full overflow-y-auto p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-display text-xl">{prospect.name}</h2>
            <p className="text-sm text-zinc-500">{[prospect.category, prospect.city].filter(Boolean).join(' · ')}</p>
            {prospect.addedByName && <p className="text-xs text-zinc-600 mt-0.5">Added by {prospect.addedByName}</p>}
          </div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="flex items-center gap-2 mt-3"><StatusPill status={prospect.status} /><ContactButtons p={prospect} intro={intro} /></div>

        <label className="text-xs text-zinc-400 mt-4 block">Status</label>
        <select className="field mt-1" defaultValue={prospect.status} onChange={(e) => update.mutate({ id: prospect._id, body: { status: e.target.value as ProspectStatus } })}>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <label className="text-xs text-zinc-400 mt-4 block">Meeting</label>
        <div className="flex gap-2 mt-1">
          <input type="datetime-local" className="field" value={meeting} onChange={(e) => setMeeting(e.target.value)} />
          <button className="btn" onClick={() => update.mutate({ id: prospect._id, body: { meetingAt: meeting ? new Date(meeting).toISOString() : null, status: 'meeting_scheduled' } })}>Save</button>
        </div>

        <label className="text-xs text-zinc-400 mt-5 block">Notes</label>
        <div className="flex gap-2 mt-1">
          <input className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" />
          <button className="btn" onClick={() => { if (note.trim()) { addNote.mutate({ id: prospect._id, text: note }); setNote(''); } }}>Add</button>
        </div>
        <div className="mt-3 space-y-2">
          {[...prospect.notes].reverse().map((n, i) => (
            <div key={i} className="text-sm border-l-2 border-ink-border pl-3"><div className="text-zinc-300">{n.text}</div><div className="text-[11px] text-zinc-600">{new Date(n.at).toLocaleString()}</div></div>
          ))}
        </div>

        <button className="text-xs text-red-400 mt-6" onClick={() => { remove.mutate(prospect._id); onClose(); }}>Delete prospect</button>
      </div>
    </div>
  );
}
