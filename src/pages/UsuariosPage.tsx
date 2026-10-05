import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Scale,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Plus,
  Pencil,
  Trash,
} from 'lucide-react';

import {
  alterarUsuario,
  excluirUsuario,
  inserirUsuario,
  pesquisarUsuarios,
  type Coleta,
} from '@/lib/api';

import UsuarioModal from '@/components/UsuarioModal';
import ConfirmarExclusaoModal from '@/components/ConfirmarExclusaoModal';

export default function UsuariosPage() {
  const [coletas, setColetas] = useState<Coleta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [coletaEdicao, setColetaEdicao] = useState<Coleta | null>(null);
  const [exclusaoAlvo, setExclusaoAlvo] = useState<Coleta | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await pesquisarUsuarios();
      setColetas(dados);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar as coletas.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const coletasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return coletas.filter((coleta) => {
      return (
        coleta.tipo.toLowerCase().includes(termo) ||
        coleta.bairro.toLowerCase().includes(termo)
      );
    });
  }, [coletas, busca]);

  const abrirModalNovo = () => {
    setColetaEdicao(null);
    setModalAberto(true);
  };

  const abrirModalEditar = (coleta: Coleta) => {
    setColetaEdicao(coleta);
    setModalAberto(true);
  };

  const handleSalvar = async (
    dados: Omit<Coleta, 'id'> & { id?: string }
  ) => {
    if (dados.id) {
      const atualizado = await alterarUsuario({
        id: dados.id,
        tipo: dados.tipo,
        peso: dados.peso,
        bairro: dados.bairro,
      });

      setColetas((prev) =>
        prev.map((coleta) =>
          coleta.id === dados.id ? atualizado : coleta
        )
      );
    } else {
      const criado = await inserirUsuario({
        tipo: dados.tipo,
        peso: dados.peso,
        bairro: dados.bairro,
      });

      setColetas((prev) => [...prev, criado]);
    }
  };

  const handleExcluir = async () => {
    if (!exclusaoAlvo) return;

    try {
      await excluirUsuario(exclusaoAlvo.id);

      setColetas((prev) =>
        prev.filter((coleta) => coleta.id !== exclusaoAlvo.id)
      );

      setExclusaoAlvo(null);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Não foi possível excluir a coleta.'
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

      {/* CABEÇALHO */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Coletas cadastradas
          </h1>

          <p className="text-sm text-slate-500">
            Coletas de materiais recicláveis cadastradas na plataforma.
          </p>
        </div>

        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </div>

      {/* BUSCA */}
      <div className="mt-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por tipo ou bairro..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="mt-6">

        {/* CARREGANDO */}
        {carregando && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-16 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando coletas...</span>
          </div>
        )}

        {/* ERRO */}
        {!carregando && erro && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-error-200 bg-error-50 py-16 text-center">
            <AlertCircle className="h-6 w-6 text-error-600" />

            <p className="max-w-sm text-sm text-error-700">
              {erro}
            </p>

            <button
              onClick={carregar}
              className="flex items-center gap-1.5 rounded-lg bg-error-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-error-700"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {/* NENHUMA COLETA */}
        {!carregando &&
          !erro &&
          coletasFiltradas.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500">

              <Trash2 className="h-6 w-6" />

              <p className="text-sm">
                Nenhuma coleta encontrada.
              </p>

              <button
                onClick={abrirModalNovo}
                className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Adicionar coleta
              </button>
            </div>
          )}

        {/* LISTA */}
        {!carregando &&
          !erro &&
          coletasFiltradas.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {coletasFiltradas.map((coleta) => (
                <div
                  key={coleta.id}
                  className="group rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                      <Trash2 className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold capitalize text-primary-700">
                      {coleta.tipo}
                    </span>

                  </div>

                  <h3 className="mt-4 font-bold capitalize text-slate-900">
                    {coleta.tipo}
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <Scale className="h-3.5 w-3.5" />
                    Peso: {coleta.peso} kg
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    Bairro: {coleta.bairro}
                  </p>

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">

                    <button
                      onClick={() => abrirModalEditar(coleta)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>

                    <button
                      onClick={() => setExclusaoAlvo(coleta)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-error-300 hover:bg-error-50 hover:text-error-600"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      Excluir
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}
      </div>

      <UsuarioModal
        aberto={modalAberto}
        coletaEdicao={coletaEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
      />

      <ConfirmarExclusaoModal
        aberto={!!exclusaoAlvo}
        nomeUsuario={
          exclusaoAlvo
            ? `${exclusaoAlvo.tipo} - ${exclusaoAlvo.bairro}`
            : ''
        }
        onCancelar={() => setExclusaoAlvo(null)}
        onConfirmar={handleExcluir}
      />

    </div>
  );
}