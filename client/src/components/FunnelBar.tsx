import { ChevronRight } from 'lucide-react';
import { Funnel, ProspectStatus } from '../types';

const ORDER: { key: ProspectStatus; label: string }[] = [
  { key: 'to_reach_out', label: 'To reach out' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'replied', label: 'Replied' },
  { key: 'meeting_scheduled', label: 'Meeting' },
  { key: 'met', label: 'Met' },
];

export function FunnelBar({ funnel }: { funnel?: Funnel }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap text-xs text-zinc-400 mt-3">
      <span className="text-zinc-600">Pipeline</span>
      {ORDER.map((s, i) => (
        <span key={s.key} className="flex items-center gap-1.5">
          <span>{s.label} <b className="font-medium text-zinc-200">{funnel?.byStatus[s.key] ?? 0}</b></span>
          {i < ORDER.length - 1 && <ChevronRight size={13} className="text-zinc-600" />}
        </span>
      ))}
    </div>
  );
}
