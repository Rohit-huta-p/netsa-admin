import { Funnel } from '../types';

function Metric({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-ink-surface rounded-md px-3 py-2.5">
      <div className={`text-2xl font-medium leading-none ${color || ''}`}>{value}</div>
      <div className="text-xs text-zinc-400 mt-1">{label}</div>
    </div>
  );
}

export function DueTodayStrip({ funnel }: { funnel?: Funnel }) {
  return (
    <div className="grid gap-2.5 mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(108px, 1fr))' }}>
      <Metric label="Due today" value={funnel?.dueTodayCount ?? 0} color="text-netsa-orange" />
      <Metric label="Overdue" value={funnel?.overdueCount ?? 0} color="text-red-400" />
      <Metric label="Replied" value={funnel?.byStatus.replied ?? 0} />
      <Metric label="Met" value={funnel?.byStatus.met ?? 0} color="text-green-400" />
    </div>
  );
}
