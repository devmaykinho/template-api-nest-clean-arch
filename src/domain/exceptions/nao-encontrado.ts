import { CustomException } from './exception-custom';
import { IErros } from './exception-custom.types';

export class NaoEncontradoDomainException extends CustomException {
  constructor(mensagem: IErros) {
    super('NAO_ENCONTRADO', mensagem);
    this.name = 'NaoEncontradoDomainException';
  }
}
