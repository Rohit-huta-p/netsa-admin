import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { isAuthed } from './AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return isAuthed() ? <>{children}</> : <Navigate to="/login" replace />;
}
