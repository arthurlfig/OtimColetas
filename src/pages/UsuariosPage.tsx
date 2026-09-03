import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Truck,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Mail,
  UsersRound,
  Plus,
  Pencil,
  Trash,
} from 'lucide-react';
import { alterarUsuario, excluirUsuario, inserirUsuario, pesquisarUsuarios } from '@/lib/api';
import type { TipoUsuario, UsuarioResponse } from '@/types';
import UsuarioModal from '@/components/UsuarioModal';
import ConfirmarExclusaoModal from '@/components/ConfirmarExclusaoModal';

type Filtro = 'todos' | TipoUsuario;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEdicao, setUsuarioEdicao] = useState<UsuarioResponse | null>(null);
  const [exclusaoAlvo, setExclusaoAlvo] = useState<UsuarioResponse | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await pesquisarUsuarios();
      setUsuarios(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const combinaFiltro = filtro === 'todos' || usuario.tipoUsuario === filtro;
      const combinaBusca = usuario.nome.toLowerCase().includes(busca.toLowerCase().trim());
      return combinaFiltro && combinaBusca;
    });
  }, [usuarios, busca, filtro]);

  const abrirModalNovo = () => {
    setUsuarioEdicao(null);
    setModalAberto(true);
  };

  const abrirModalEditar = (usuario: UsuarioResponse) => {
    setUsuarioEdicao(usuario);
    setModalAberto(true);
  };

  const handleSalvar = async (dados: Omit<UsuarioResponse, 'id'> & { id?: string }) => {
    if (dados.id) {
      const atualizado = await alterarUsuario({ id: dados.id, nome: dados.nome, email: dados.email, tipoUsuario: dados.tipoUsuario });
      setUsuarios((prev) => prev.map((u) => (u.id === dados.id ? atualizado : u)));
    } else {
      const criado = await inserirUsuario({ nome: dados.nome, email: dados.email, tipoUsuario: dados.tipoUsuario });
      setUsuarios((prev) => [...prev, criado]);
    }
  };

  const handleExcluir = async () => {
    if (!exclusaoAlvo) return;
    await excluirUsuario(exclusaoAlvo.id);
    setUsuarios((prev) => prev.filter((u) => u.id !== exclusaoAlvo.id));
    setExclusaoAlvo(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuários cadastrados</h1>
          <p className="text-sm text-slate-500">Catadores e geradores cadastrados na plataforma.</p>
        </div>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['todos', 'gerador', 'catador'] as const).map((opcao) => (
            <button
              key={opcao}
              onClick={() => setFiltro(opcao)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
                filtro === opcao
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opcao}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {carregando && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-16 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando usuários...</span>
          </div>
        )}

        {!carregando && erro && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-error-200 bg-error-50 py-16 text-center">
            <AlertCircle className="h-6 w-6 text-error-600" />
            <p className="max-w-sm text-sm text-error-700">{erro}</p>
            <button
              onClick={carregar}
              className="flex items-center gap-1.5 rounded-lg bg-error-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-error-700"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {!carregando && !erro && usuariosFiltrados.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500">
            <UsersRound className="h-6 w-6" />
            <p className="text-sm">Nenhum usuário encontrado.</p>
            <button
              onClick={abrirModalNovo}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Adicionar usuário
            </button>
          </div>
        )}

        {!carregando && !erro && usuariosFiltrados.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {usuariosFiltrados.map((usuario) => {
              const isCatador = usuario.tipoUsuario === 'catador';
              return (
                <div
                  key={usuario.id}
                  className="group rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isCatador ? 'bg-secondary-100 text-secondary-700' : 'bg-accent-100 text-accent-700'
                      }`}
                    >
                      {isCatador ? <Truck className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        isCatador
                          ? 'bg-secondary-100 text-secondary-700'
                          : 'bg-accent-100 text-accent-700'
                      }`}
                    >
                      {usuario.tipoUsuario}
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900">{usuario.nome}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <Mail className="h-3.5 w-3.5" />
                    {usuario.email}
                  </p>

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => abrirModalEditar(usuario)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => setExclusaoAlvo(usuario)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-error-300 hover:bg-error-50 hover:text-error-600"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <UsuarioModal
        aberto={modalAberto}
        usuarioEdicao={usuarioEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
      />

      <ConfirmarExclusaoModal
        aberto={!!exclusaoAlvo}
        nomeUsuario={exclusaoAlvo?.nome ?? ''}
        onCancelar={() => setExclusaoAlvo(null)}
        onConfirmar={handleExcluir}
      />
    </div>
  );
}
