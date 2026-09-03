import { useState, type FormEvent } from 'react';
import { X, Loader2, AlertCircle, Trash2, Truck } from 'lucide-react';
import type { TipoUsuario, UsuarioResponse } from '@/types';

interface UsuarioModalProps {
  aberto: boolean;
  usuarioEdicao: UsuarioResponse | null;
  onFechar: () => void;
  onSalvar: (dados: Omit<UsuarioResponse, 'id'> & { id?: string }) => Promise<void>;
}

export default function UsuarioModal({ aberto, usuarioEdicao, onFechar, onSalvar }: UsuarioModalProps) {
  const [nome, setNome] = useState(usuarioEdicao?.nome ?? '');
  const [email, setEmail] = useState(usuarioEdicao?.email ?? '');
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(usuarioEdicao?.tipoUsuario ?? 'gerador');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) return null;

  const isEdicao = !!usuarioEdicao;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await onSalvar({ nome, email, tipoUsuario, ...(isEdicao ? { id: usuarioEdicao!.id } : {}) });
      onFechar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdicao ? 'Editar usuário' : 'Adicionar usuário'}
          </h2>
          <button
            onClick={onFechar}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {erro && (
          <div className="mx-6 mt-4 flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 p-3 text-sm text-error-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="modal-nome" className="mb-1.5 block text-sm font-medium text-slate-700">
              Nome completo
            </label>
            <input
              id="modal-nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label htmlFor="modal-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="modal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de usuário</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoUsuario('gerador')}
                className={`flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-3 text-sm font-medium transition-colors ${
                  tipoUsuario === 'gerador'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Trash2 className="h-5 w-5" />
                Gerador
              </button>
              <button
                type="button"
                onClick={() => setTipoUsuario('catador')}
                className={`flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-3 text-sm font-medium transition-colors ${
                  tipoUsuario === 'catador'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Truck className="h-5 w-5" />
                Catador
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
              {carregando ? 'Salvando...' : isEdicao ? 'Salvar alterações' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
