import { CustomException } from '../../domain/exceptions/exception-custom';
import { IErros } from '../../domain/exceptions/exception-custom.types';

export class BadRequestHttpException extends CustomException {
  constructor(mensagem: IErros) {
    super('BAD_REQUEST', mensagem);
    this.name = 'BadRequestHttpException';
  }
}
