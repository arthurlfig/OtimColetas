import { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmarExclusaoModalProps {
  aberto: boolean;
  nomeUsuario: string;
  onCancelar: () => void;
  onConfirmar: () => Promise<void>;
}

export default function ConfirmarExclusaoModal({
  aberto,
  nomeUsuario,
  onCancelar,
  onConfirmar,
}: ConfirmarExclusaoModalProps) {
  const [carregando, setCarregando] = useState(false);

  if (!aberto) return null;

  const handleConfirmar = async () => {
    setCarregando(true);
    try {
      await onConfirmar();
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Excluir usuário</h2>
          <button
            onClick={onCancelar}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-error-100 text-error-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Tem certeza que deseja excluir <strong className="font-semibold text-slate-900">{nomeUsuario}</strong>?
              Esta ação não pode ser desfeita.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancelar}
              disabled={carregando}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              disabled={carregando}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-error-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-error-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
              {carregando ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
