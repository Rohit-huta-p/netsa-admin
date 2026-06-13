import { useState, useEffect } from 'react';
import { useTemplates } from '../hooks/useTemplates';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { renderTemplate } from '../lib/contact';

export default function Templates() {
  const { data: templates = [] } = useTemplates();
  const qc = useQueryClient();
  const save = useMutation({
    mutationFn: ({ key, body }: { key: string; body: string }) => api.patch(`/templates/${key}`, { body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  useEffect(() => { setDrafts(Object.fromEntries(templates.map((t) => [t.key, t.body]))); }, [templates.length]);

  return (
    <div className="p-4 max-w-2xl">
      <h1 className="font-display text-2xl">Templates</h1>
      <p className="text-sm text-zinc-500 mt-0.5 mb-4">Placeholders: <code>{'{{firstName}}'}</code>, <code>{'{{name}}'}</code>, <code>{'{{city}}'}</code></p>
      {templates.map((t) => (
        <div key={t.key} className="bg-ink-surface border border-ink-border rounded-lg p-4 mb-4">
          <div className="text-sm font-medium mb-2">{t.label} <span className="text-xs text-zinc-500">· {t.channel}</span></div>
          <textarea className="field h-24" value={drafts[t.key] ?? t.body} onChange={(e) => setDrafts((d) => ({ ...d, [t.key]: e.target.value }))} />
          <div className="text-xs text-zinc-500 mt-2">Preview: {renderTemplate(drafts[t.key] ?? t.body, { firstName: 'Aarav', name: 'Aarav Kulkarni', city: 'Pune' })}</div>
          <div className="flex justify-end mt-2"><button className="btn btn-primary" onClick={() => save.mutate({ key: t.key, body: drafts[t.key] ?? t.body })}>Save</button></div>
        </div>
      ))}
    </div>
  );
}
