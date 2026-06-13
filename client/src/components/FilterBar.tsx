const FILTERS: { key: string; label: string }[] = [
  { key: '', label: 'All' },
  { key: 'to_reach_out', label: 'To reach out' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'replied', label: 'Replied' },
  { key: 'meeting_scheduled', label: 'Meeting' },
  { key: 'met', label: 'Met' },
];

export function FilterBar({ active, onChange }: { active: string; onChange: (status: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap mt-3.5">
      {FILTERS.map((f) => (
        <button
          key={f.key || 'all'}
          onClick={() => onChange(f.key)}
          className={`text-xs px-2.5 py-1 rounded-full border ${active === f.key ? 'bg-netsa-orange text-[#3A1505] border-netsa-orange font-medium' : 'border-ink-border text-zinc-400 hover:text-zinc-200'}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
