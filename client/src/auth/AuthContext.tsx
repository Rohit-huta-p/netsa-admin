import { createContext, useContext, useState, ReactNode } from 'react';
import api from '../lib/api';
import { AdminUser } from '../types';

interface AuthState {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>(null as never);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('netsa_admin_token', res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem('netsa_admin_token');
    setUser(null);
    window.location.href = '/login';
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function isAuthed() {
  return !!localStorage.getItem('netsa_admin_token');
}
