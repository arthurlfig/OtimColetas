import { Truck, Trash2, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { View } from '@/App';

interface DashboardPageProps {
  onNavigate: (view: View) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { usuario } = useAuth();
  const isCatador = usuario?.tipoUsuario === 'catador';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-2xl bg-primary-900">
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/36046086/pexels-photo-36046086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Coleta de resíduos em área urbana"
            className="h-48 w-full object-cover opacity-40 sm:h-56"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
            <p className="text-sm font-medium text-primary-200">
              Bem-vindo(a) de volta,
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
              {usuario?.nome}
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              isCatador ? 'bg-secondary-100 text-secondary-700' : 'bg-accent-100 text-accent-700'
            }`}
          >
            {isCatador ? <Truck className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            {isCatador ? 'Perfil: Catador independente' : 'Perfil: Gerador de resíduos'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {isCatador
              ? 'Fique atento aos geradores cadastrados na plataforma para organizar suas rotas de coleta de materiais recicláveis.'
              : 'Cadastre seus resíduos recicláveis e encontre catadores independentes disponíveis para fazer a coleta.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">Diretório de usuários</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Veja todos os catadores e geradores já cadastrados na plataforma OtimColeta.
          </p>
          <button
            onClick={() => onNavigate('usuarios')}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Ver usuários
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
