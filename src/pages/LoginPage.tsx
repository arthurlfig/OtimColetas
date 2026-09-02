import { useState, type FormEvent } from 'react';
import { Recycle, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Truck, Leaf } from 'lucide-react';
import { login } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { View } from '@/App';

interface LoginPageProps {
  onNavigate: (view: View) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const resposta = await login({ email, senha });
      entrar(resposta.token, resposta.usuario);
      onNavigate('dashboard');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.pexels.com/photos/14370984/pexels-photo-14370984.png?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Catador organizando materiais recicláveis"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-900/50 to-primary-900/20" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
              <Recycle className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold">OtimColeta</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">
              Conectando quem gera resíduos a quem faz a coleta.
            </h1>
            <p className="mt-4 max-w-md text-primary-50/90">
              Uma plataforma simples para aproximar geradores de resíduos recicláveis de catadores
              independentes, tornando a coleta mais justa e eficiente.
            </p>
            <div className="mt-8 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span>Sustentável</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Coleta ágil</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Recycle className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold text-slate-900">OtimColeta</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Entrar na conta</h2>
          <p className="mt-1 text-sm text-slate-500">
            Acesse sua conta para gerenciar suas coletas.
          </p>

          {erro && (
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 p-3 text-sm text-error-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Ainda não tem uma conta?{' '}
            <button
              onClick={() => onNavigate('cadastro')}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
