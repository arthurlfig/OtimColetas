import { useEffect, useState, type FormEvent } from 'react';
import {
  X,
  Loader2,
  AlertCircle,
  Trash2,
  Scale,
  MapPin,
} from 'lucide-react';

import type { Coleta } from '@/lib/api';

interface UsuarioModalProps {
  aberto: boolean;
  coletaEdicao: Coleta | null;
  onFechar: () => void;
  onSalvar: (
    dados: Omit<Coleta, 'id'> & { id?: string }
  ) => Promise<void>;
}

export default function UsuarioModal({
  aberto,
  coletaEdicao,
  onFechar,
  onSalvar,
}: UsuarioModalProps) {

  const [tipo, setTipo] = useState('');
  const [peso, setPeso] = useState('');
  const [bairro, setBairro] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (coletaEdicao) {
      setTipo(coletaEdicao.tipo);
      setPeso(String(coletaEdicao.peso));
      setBairro(coletaEdicao.bairro);
    } else {
      setTipo('');
      setPeso('');
      setBairro('');
    }

    setErro(null);
  }, [coletaEdicao, aberto]);

  if (!aberto) return null;

  const isEdicao = !!coletaEdicao;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setErro(null);
    setCarregando(true);

    try {
      await onSalvar({
        ...(isEdicao ? { id: coletaEdicao.id } : {}),
        tipo: tipo.trim(),
        peso: Number(peso),
        bairro: bairro.trim(),
      });

      onFechar();
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar a coleta.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

          <h2 className="text-lg font-bold text-slate-900">
            {isEdicao
              ? 'Editar coleta'
              : 'Adicionar coleta'}
          </h2>

          <button
            onClick={onFechar}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* ERRO */}
        {erro && (
          <div className="mx-6 mt-4 flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 p-3 text-sm text-error-700">

            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />

            <span>{erro}</span>

          </div>
        )}

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 px-6 py-5"
        >

          {/* TIPO */}
          <div>

            <label
              htmlFor="modal-tipo"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Tipo de material
            </label>

            <div className="relative">

              <Trash2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="modal-tipo"
                required
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ex.: plástico"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />

            </div>

          </div>

          {/* PESO */}
          <div>

            <label
              htmlFor="modal-peso"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Peso (kg)
            </label>

            <div className="relative">

              <Scale className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="modal-peso"
                required
                type="number"
                min="0"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ex.: 5.2"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />

            </div>

          </div>

          {/* BAIRRO */}
          <div>

            <label
              htmlFor="modal-bairro"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Bairro
            </label>

            <div className="relative">

              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="modal-bairro"
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex.: Batel"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />

            </div>

          </div>

          {/* BOTÕES */}
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

              {carregando && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {carregando
                ? 'Salvando...'
                : isEdicao
                  ? 'Salvar alterações'
                  : 'Adicionar'}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}