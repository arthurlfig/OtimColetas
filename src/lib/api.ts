import type {
  CadastroRequest,
  LoginRequest,
  LoginResponse,
  UsuarioResponse,
} from '@/types';

const AUTH_URL = 'https://mock.apidog.com/m1/1365776-1370016-1426599';
const CRUD_URL = 'https://otimcoleta-dhamcbg5f5eccah5.brazilsouth-01.azurewebsites.net/api';

async function request<T>(base: string, path: string, options?: RequestInit): Promise<T> {
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
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'mensagem' in data && (data as { mensagem?: string }).mensagem) ||
      (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error) ||
      'Ocorreu um erro. Tente novamente.';
    throw new Error(message);
  }

  return data as T;
}

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
  return request<UsuarioResponse[]>(AUTH_URL, '/usuarios', { method: 'GET' });
}

// ---- CRUD Azure Functions ----

export function pesquisarUsuarios(): Promise<UsuarioResponse[]> {
  return request<UsuarioResponse[]>(CRUD_URL, '/pesquisar', { method: 'GET' });
}

export function inserirUsuario(payload: Omit<UsuarioResponse, 'id'>): Promise<UsuarioResponse> {
  return request<UsuarioResponse>(CRUD_URL, '/inserir', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function alterarUsuario(payload: UsuarioResponse): Promise<UsuarioResponse> {
  return request<UsuarioResponse>(CRUD_URL, '/alterar', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function excluirUsuario(id: string): Promise<void> {
  return request<void>(CRUD_URL, '/excluir', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}
