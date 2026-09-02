export type TipoUsuario = 'catador' | 'gerador';

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: TipoUsuario;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioResponse;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: TipoUsuario;
  telefone?: string;
}
