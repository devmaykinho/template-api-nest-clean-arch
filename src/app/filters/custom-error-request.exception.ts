import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomException } from '../../domain/exceptions/exception-custom';
import { IErros } from '../../domain/exceptions/exception-custom.types';

interface CustomErrorRequest {
  erros: IErros;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private obterStatusCode(exceptionName: string) {
    const statusCode: { [key: string]: HttpStatus } = {
      NaoEncontradoDomainException: HttpStatus.NOT_FOUND,
      NaoAutorizadoDomainException: HttpStatus.UNAUTHORIZED,
      DadosInvalidosDomainException: HttpStatus.BAD_REQUEST,
      BadRequestHttpException: HttpStatus.BAD_REQUEST,
      ForbiddenHttpException: HttpStatus.FORBIDDEN,
    };

    return statusCode[exceptionName] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  catch(
    exception: CustomException | HttpException | Error,
    host: ArgumentsHost,
  ): void {
    const { httpAdapter } = this.httpAdapterHost;
    const switchHttp = host.switchToHttp();

    if (exception instanceof CustomException) {
      const statusCode = this.obterStatusCode(exception.name);
      const responseBody: CustomErrorRequest = {
        erros: exception.mensagem,
      };

      httpAdapter.reply(switchHttp.getResponse(), responseBody, statusCode);
      return;
    }

    httpAdapter.reply(
      switchHttp.getResponse(),
      {
        erros: [
          { motivo: 'ERRO_DESCONHECIDO', mensagem: 'Ocorreu um erro interno' },
        ],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
