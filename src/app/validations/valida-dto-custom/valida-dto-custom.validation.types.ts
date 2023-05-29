import { ClassConstructor } from 'class-transformer';

export interface Request<T> {
  body: T;
  headers: { 'x-perfil': string };
}

export interface Reply {
  status(statusCode: number): Reply;
  send(data: unknown): void;
}

export type Handler<T> = (request: Request<T>, reply: Reply) => Promise<void>;

export type Common = <T>(cls: ClassConstructor<T>) => Handler<T>;

export interface Erro {
  motivo: string;
  mensagem: string;
  [key: string]: unknown;
}

export interface Erros {
  erros: Erro[];
}

export interface Validacoes {
  campo: string;
  regra:
    | {
        [type: string]: string;
      }
    | undefined;
}

export type ValidarObjetoOutput<T> =
  | ValidarObjetoOutputSucesso<T>
  | ValidarObjetoOutputErro;

interface ValidarObjetoOutputSucesso<T> {
  resultado: 'SUCESSO';
  objeto: T;
}

interface ValidarObjetoOutputErro {
  resultado: 'ERRO';
  erros: Array<Erro>;
}
