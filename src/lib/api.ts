import type {
  CadastroRequest,
  LoginRequest,
  LoginResponse,
  UsuarioResponse,
} from '@/types';

const BASE_URL = 'https://mock.apidog.com/m1/1365776-1370016-1426599';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
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
      'Ocorreu um erro. Tente novamente.';
    throw new Error(message);
  }

  return data as T;
}

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function cadastrar(payload: CadastroRequest): Promise<UsuarioResponse> {
  return request<UsuarioResponse>('/cadastro', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function listarUsuarios(): Promise<UsuarioResponse[]> {
  return request<UsuarioResponse[]>('/usuarios', { method: 'GET' });
}
