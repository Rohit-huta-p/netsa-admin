import { useState } from 'react';
import { X } from 'lucide-react';
import { useProspectMutations } from '../hooks/useMutations';

export function ImportDialog({ onClose }: { onClose: () => void }) {
  const { importText } = useProspectMutations();
  const [raw, setRaw] = useState('');
  const [result, setResult] = useState<{ inserted: number; skipped: number; errors: { reason: string }[] } | null>(null);

  async function run() {
    const res = await importText.mutateAsync(raw);
    setResult(res.data);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-ink-surface border border-ink-border rounded-xl p-5">
        <div className="flex justify-between items-center mb-2"><h2 className="font-display text-lg">Import list</h2><button onClick={onClose} className="icon-btn"><X size={16} /></button></div>
        <p className="text-xs text-zinc-500 mb-3">Paste rows. CSV with a header (name, phone, instagram, city, source) or just one person per line — handles like <code>@name</code> and phone numbers are detected automatically.</p>
        <textarea className="field h-40 font-mono text-xs" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder={'name,phone,instagram,city\nAarav,9876543210,@aarav.dances,Pune'} />
        {result && (
          <div className="text-sm mt-3 space-y-1">
            <div className="text-green-400">Added {result.inserted}</div>
            <div className="text-zinc-400">Skipped {result.skipped} (duplicates)</div>
            {result.errors.length > 0 && <div className="text-red-400">{result.errors.length} couldn't be read ({result.errors[0].reason}…)</div>}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn" onClick={onClose}>{result ? 'Done' : 'Cancel'}</button>
          <button className="btn btn-primary" onClick={run} disabled={!raw.trim()}>Import</button>
        </div>
      </div>
    </div>
  );
}
