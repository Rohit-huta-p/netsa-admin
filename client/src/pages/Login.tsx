import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-ink-surface border border-ink-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-md bg-netsa-orange text-[#3A1505] flex items-center justify-center font-display font-bold">N</div>
          <div>
            <div className="font-medium">NETSA</div>
            <div className="text-xs text-zinc-500">admin</div>
          </div>
        </div>
        <label className="text-xs text-zinc-400">Email</label>
        <input className="field mt-1 mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="text-xs text-zinc-400">Password</label>
        <input className="field mt-1 mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        <button className="btn btn-primary w-full justify-center" type="submit">Sign in</button>
      </form>
    </div>
  );
}
