import { ProspectStatus } from '../types';

const MAP: Record<ProspectStatus, { label: string; cls: string }> = {
  to_reach_out: { label: 'To reach out', cls: 'bg-zinc-700/40 text-zinc-300' },
  contacted: { label: 'Contacted', cls: 'bg-blue-500/15 text-blue-300' },
  replied: { label: 'Replied', cls: 'bg-violet-500/15 text-violet-300' },
  meeting_scheduled: { label: 'Meeting', cls: 'bg-amber-500/15 text-amber-300' },
  met: { label: 'Met', cls: 'bg-green-500/15 text-green-300' },
  not_interested: { label: 'Not interested', cls: 'bg-red-500/15 text-red-300' },
};

export function StatusPill({ status }: { status: ProspectStatus }) {
  const m = MAP[status];
  return <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${m.cls}`}>{m.label}</span>;
}
