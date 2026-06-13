import { Priority } from '../types';

const COLOR: Record<Priority, string> = { high: 'bg-netsa-orange', medium: 'bg-amber-500', low: 'bg-zinc-500' };

export function PriorityDot({ priority }: { priority: Priority }) {
  return <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${COLOR[priority]}`} title={`${priority} priority`} />;
}
