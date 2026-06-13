import { NavLink } from 'react-router-dom';
import { Send, MessageSquare, Users, User, Briefcase, CreditCard, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm ${isActive ? 'bg-ink-surface text-white' : 'text-zinc-400 hover:text-zinc-200'}`;

export function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="w-[160px] shrink-0 bg-ink-deep border-r border-ink-border p-3 flex flex-col gap-0.5">
      <div className="flex items-center gap-2 px-1.5 pb-3">
        <div className="w-6 h-6 rounded-md bg-netsa-orange text-[#3A1505] flex items-center justify-center font-display font-bold text-sm">N</div>
        <div className="leading-tight"><div className="text-sm font-medium">NETSA</div><div className="text-[11px] text-zinc-500">admin</div></div>
      </div>
      <NavLink to="/" className={linkCls}><Send size={17} /> Reach out</NavLink>
      <NavLink to="/templates" className={linkCls}><MessageSquare size={17} /> Templates</NavLink>
      {user?.role === 'owner' && <NavLink to="/team" className={linkCls}><Users size={17} /> Team</NavLink>}
      <div className="text-[11px] tracking-wide text-zinc-600 px-2 pt-3 pb-1">Product · soon</div>
      {[['Users', User], ['Gigs', Briefcase], ['Payments', CreditCard], ['Analytics', BarChart3]].map(([label, Icon]) => {
        const I = Icon as typeof User;
        return <div key={label as string} className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-zinc-600 opacity-50"><I size={17} /> {label as string}</div>;
      })}
      <button onClick={logout} className="mt-auto flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-200 border-t border-ink-border pt-3">
        <LogOut size={16} /> {user?.name || 'Sign out'}
      </button>
    </aside>
  );
}
