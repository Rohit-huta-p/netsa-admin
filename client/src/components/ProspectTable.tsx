import { Instagram, Phone } from 'lucide-react';
import { Prospect } from '../types';
import { StatusPill } from './StatusPill';
import { PriorityDot } from './PriorityDot';
import { ContactButtons } from './ContactButtons';

const CATEGORY_LABEL: Record<string, string> = {
  dancer: 'Dancer', actor: 'Actor', choreographer: 'Choreographer', musician: 'Musician', organizer: 'Organizer', other: 'Artist',
};

function followUpLabel(p: Prospect): { text: string; cls: string } {
  if (!p.followUpAt) return { text: '—', cls: 'text-zinc-600' };
  const due = new Date(p.followUpAt);
  const startToday = new Date(); startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(); endToday.setHours(23, 59, 59, 999);
  if (due < startToday) return { text: 'Overdue', cls: 'text-red-400' };
  if (due <= endToday) return { text: 'Today', cls: 'text-netsa-orange' };
  return { text: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), cls: 'text-zinc-400' };
}

export function ProspectTable({ prospects, intro, onRowClick }: { prospects: Prospect[]; intro: string; onRowClick: (p: Prospect) => void }) {
  if (prospects.length === 0) {
    return <div className="text-sm text-zinc-500 py-10 text-center border border-dashed border-ink-border rounded-lg mt-3">No prospects yet. Add someone or import your list.</div>;
  }
  return (
    <table className="w-full mt-2" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
      <colgroup><col style={{ width: '42%' }} /><col style={{ width: '24%' }} /><col style={{ width: '17%' }} /><col style={{ width: '17%' }} /></colgroup>
      <thead>
        <tr className="text-left text-[11px] text-zinc-500">
          <th className="py-2 px-1.5 font-medium">Name</th><th className="py-2 px-1.5 font-medium">Status</th><th className="py-2 px-1.5 font-medium">Follow-up</th><th></th>
        </tr>
      </thead>
      <tbody>
        {prospects.map((p) => {
          const fu = followUpLabel(p);
          return (
            <tr key={p._id} className="border-t border-ink-border hover:bg-ink-surface cursor-pointer" onClick={() => onRowClick(p)}>
              <td className="py-2.5 px-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <PriorityDot priority={p.priority} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="truncate text-xs text-zinc-500 flex items-center gap-1.5">
                      <span>{[CATEGORY_LABEL[p.category || 'other'], p.city].filter(Boolean).join(' · ')}</span>
                      {p.instagram && <Instagram size={12} />}
                      {p.phone && <Phone size={12} />}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-2.5 px-1.5"><StatusPill status={p.status} /></td>
              <td className={`py-2.5 px-1.5 text-sm ${fu.cls}`}>{fu.text}</td>
              <td className="py-2.5 px-1.5" onClick={(e) => e.stopPropagation()}><ContactButtons p={p} intro={intro} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
