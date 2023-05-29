import { CustomException } from '../../domain/exceptions/exception-custom';
import { IErros } from '../../domain/exceptions/exception-custom.types';

export class ForbiddenHttpException extends CustomException {
  constructor(mensagem: IErros) {
    super('FORBIDDEN', mensagem);
    this.name = 'ForbiddenHttpException';
  }
}
