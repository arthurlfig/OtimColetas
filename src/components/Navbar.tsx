import { Recycle, LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { View } from '@/App';

interface NavbarProps {
  view: View;
  onNavigate: (view: View) => void;
}

export default function Navbar({ view, onNavigate }: NavbarProps) {
  const { usuario, isAuthenticated, sair } = useAuth();

  const handleSair = () => {
    sair();
    onNavigate('login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-primary-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'login')}
          className="flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Recycle className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-slate-900">OtimColeta</span>
        </button>

        {isAuthenticated && (
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                view === 'dashboard'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Painel</span>
            </button>
            <button
              onClick={() => onNavigate('usuarios')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                view === 'usuarios'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Usuários</span>
            </button>

            <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight text-slate-900">{usuario?.nome}</p>
                <p className="text-xs capitalize leading-tight text-slate-500">{usuario?.tipoUsuario}</p>
              </div>
              <button
                onClick={handleSair}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-error-50 hover:text-error-600"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
