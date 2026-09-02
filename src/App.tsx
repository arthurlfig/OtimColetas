import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import LoginPage from '@/pages/LoginPage';
import CadastroPage from '@/pages/CadastroPage';
import DashboardPage from '@/pages/DashboardPage';
import UsuariosPage from '@/pages/UsuariosPage';

export type View = 'login' | 'cadastro' | 'dashboard' | 'usuarios';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<View>('login');

  if (!isAuthenticated) {
    return view === 'cadastro' ? (
      <CadastroPage onNavigate={setView} />
    ) : (
      <LoginPage onNavigate={setView} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar view={view} onNavigate={setView} />
      {view === 'usuarios' ? (
        <UsuariosPage />
      ) : (
        <DashboardPage onNavigate={setView} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
