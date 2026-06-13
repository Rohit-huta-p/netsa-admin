import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import Login from './pages/Login';
import ReachOut from './pages/ReachOut';
import Templates from './pages/Templates';
import Team from './pages/Team';
import { Sidebar } from './components/Sidebar';

const queryClient = new QueryClient();

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Shell><ReachOut /></Shell></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><Shell><Templates /></Shell></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Shell><Team /></Shell></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
