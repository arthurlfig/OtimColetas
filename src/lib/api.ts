import type {
  CadastroRequest,
  LoginRequest,
  LoginResponse,
  UsuarioResponse,
} from '@/types';

const AUTH_URL = 'https://mock.apidog.com/m1/1365776-1370016-1426599';

const CRUD_URL =
  'https://otimcoletas-c2bddzf7cbgncghj.brazilsouth-01.azurewebsites.net/api';

export interface Coleta {
  id: string;
  tipo: string;
  peso: number;
  bairro: string;
}

interface ColetaMongo {
  _id: string;
  tipo: string;
  peso: number;
  bairro: string;
}

async function request<T>(
  base: string,
  path: string,
  options?: RequestInit
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique sua conexão.'
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data &&
        typeof data === 'object' &&
        'mensagem' in data &&
        (data as { mensagem?: string }).mensagem) ||
      (data &&
        typeof data === 'object' &&
        'error' in data &&
        (data as { error?: string }).error) ||
      'Ocorreu um erro. Tente novamente.';

    throw new Error(message);
  }

  return data as T;
}

// ---------------- AUTH ----------------

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>(AUTH_URL, '/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function cadastrar(payload: CadastroRequest): Promise<UsuarioResponse> {
  return request<UsuarioResponse>(AUTH_URL, '/cadastro', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function listarUsuarios(): Promise<UsuarioResponse[]> {
  return request<UsuarioResponse[]>(AUTH_URL, '/usuarios', {
    method: 'GET',
  });
}

// ---------------- CRUD COLETAS ----------------

export async function pesquisarUsuarios(): Promise<Coleta[]> {
  const dados = await request<ColetaMongo[]>(
    CRUD_URL,
    '/GetColetas',
    {
      method: 'GET',
    }
  );

  return dados.map((coleta) => ({
    id: coleta._id,
    tipo: coleta.tipo,
    peso: coleta.peso,
    bairro: coleta.bairro,
  }));
}

export async function inserirUsuario(
  payload: Omit<Coleta, 'id'>
): Promise<Coleta> {
  const resposta = await request<{ insertedId: string }>(
    CRUD_URL,
    '/InsertColeta',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return {
    id: resposta.insertedId,
    ...payload,
  };
}

export async function alterarUsuario(
  payload: Coleta
): Promise<Coleta> {
  await request<{ modifiedCount: number }>(
    CRUD_URL,
    '/UpdateColeta',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  return payload;
}

export async function excluirUsuario(id: string): Promise<void> {
  await request(
    CRUD_URL,
    `/DeleteColeta?id=${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    }
  );
}