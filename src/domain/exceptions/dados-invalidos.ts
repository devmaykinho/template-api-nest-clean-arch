import { CustomException } from './exception-custom';
import { IErros } from './exception-custom.types';

export class DadosInvalidosDomainException extends CustomException {
  constructor(mensagem: IErros) {
    super('DADOS_INVALIDOS', mensagem);
    this.name = 'DadosInvalidosDomainException';
  }
}
