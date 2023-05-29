import { CustomException } from './exception-custom';
import { IErros } from './exception-custom.types';

export class NaoAutorizadoDomainException extends CustomException {
  constructor(mensagem: IErros) {
    super('NAO_AUTORIZADO', mensagem);
    this.name = 'NaoAutorizadoDomainException';
  }
}
