import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UsuarioResponse } from '@/types';

interface AuthContextValue {
  usuario: UsuarioResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  entrar: (token: string, usuario: UsuarioResponse) => void;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'otimcoleta.sessao';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as { token: string; usuario: UsuarioResponse };
      setToken(parsed.token);
      setUsuario(parsed.usuario);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const entrar = (novoToken: string, novoUsuario: UsuarioResponse) => {
    setToken(novoToken);
    setUsuario(novoUsuario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: novoToken, usuario: novoUsuario }));
  };

  const sair = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, isAuthenticated: !!token, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
