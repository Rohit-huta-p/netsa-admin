import { useState } from 'react';
import { Plus, Upload, Search } from 'lucide-react';
import { useProspects } from '../hooks/useProspects';
import { useFunnel } from '../hooks/useFunnel';
import { useTemplates } from '../hooks/useTemplates';
import { DueTodayStrip } from '../components/DueTodayStrip';
import { FunnelBar } from '../components/FunnelBar';
import { FilterBar } from '../components/FilterBar';
import { ProspectTable } from '../components/ProspectTable';
import { AddProspectForm } from '../components/AddProspectForm';
import { ImportDialog } from '../components/ImportDialog';
import { ProspectDrawer } from '../components/ProspectDrawer';
import { Prospect } from '../types';

export default function ReachOut() {
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selected, setSelected] = useState<Prospect | null>(null);

  const filters: Record<string, string> = {};
  if (status) filters.status = status;
  if (q) filters.q = q;

  const { data: prospects = [] } = useProspects(filters);
  const { data: funnel } = useFunnel();
  const { data: templates = [] } = useTemplates();
  const intro = templates.find((t) => t.key === 'intro')?.body || 'Hi {{firstName}}, this is Rohit from NETSA.';

  return (
    <div className="p-4 max-w-full">
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl">Reach out</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{prospects.length} shown · Pune launch wedge</p>
        </div>
        <div className="flex gap-2 items-center">
          <button className="btn" onClick={() => setShowImport(true)}><Upload size={15} /> Import</button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={15} /> Add</button>
        </div>
      </div>

      <DueTodayStrip funnel={funnel} />
      <FunnelBar funnel={funnel} />

      <div className="flex items-center gap-2 mt-3.5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input className="field pl-8" placeholder="Search name…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <FilterBar active={status} onChange={setStatus} />

      <ProspectTable prospects={prospects} intro={intro} onRowClick={setSelected} />

      {showAdd && <AddProspectForm onClose={() => setShowAdd(false)} />}
      {showImport && <ImportDialog onClose={() => setShowImport(false)} />}
      {selected && <ProspectDrawer prospect={selected} intro={intro} onClose={() => setSelected(null)} />}
    </div>
  );
}
