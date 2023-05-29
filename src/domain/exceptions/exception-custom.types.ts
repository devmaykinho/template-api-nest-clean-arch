export type IErros = Array<Erro>;

export interface Erro {
  motivo: string;
  mensagem: string;
  dados?: { [key: string]: string };
}
