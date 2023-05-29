import { Usuario } from '../../domain/models/usuario.model';

export interface ContextoExecucao {
  traceId: string;
  token: string;
  perfil: string;
  usuario: Usuario;
}
