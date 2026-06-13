import { MessageCircle, Instagram, Phone } from 'lucide-react';
import { Prospect } from '../types';
import { buildWhatsAppUrl, buildInstagramDmUrl, buildTelUrl, renderTemplate, firstName } from '../lib/contact';
import { useProspectMutations } from '../hooks/useMutations';

export function ContactButtons({ p, intro }: { p: Prospect; intro: string }) {
  const { markContacted } = useProspectMutations();
  const message = renderTemplate(intro, { name: p.name, firstName: firstName(p.name), city: p.city });

  return (
    <div className="flex gap-1 justify-end">
      {p.phone && (
        <a
          className="icon-btn text-green-400"
          href={buildWhatsAppUrl(p.phone, message)}
          target="_blank"
          rel="noreferrer"
          title="WhatsApp"
          aria-label={`WhatsApp ${p.name}`}
          onClick={() => markContacted.mutate({ id: p._id, channel: 'whatsapp' })}
        >
          <MessageCircle size={16} />
        </a>
      )}
      {p.instagram && (
        <button
          className="icon-btn text-pink-400"
          title="Instagram DM (message copied)"
          aria-label={`Instagram DM ${p.name}`}
          onClick={async () => {
            try { await navigator.clipboard.writeText(message); } catch { /* clipboard may be blocked */ }
            window.open(buildInstagramDmUrl(p.instagram as string), '_blank');
            markContacted.mutate({ id: p._id, channel: 'instagram' });
          }}
        >
          <Instagram size={16} />
        </button>
      )}
      {p.phone && (
        <a
          className="icon-btn text-zinc-300"
          href={buildTelUrl(p.phone)}
          title="Call"
          aria-label={`Call ${p.name}`}
          onClick={() => markContacted.mutate({ id: p._id, channel: 'call' })}
        >
          <Phone size={16} />
        </a>
      )}
    </div>
  );
}
