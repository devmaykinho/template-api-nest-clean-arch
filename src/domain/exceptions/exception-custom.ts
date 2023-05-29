import { IErros } from './exception-custom.types';

export class CustomException extends Error {
  constructor(
    readonly motivo: string,
    readonly mensagem: IErros,
    readonly dados?: { [key: string]: string },
  ) {
    super();
  }
}
