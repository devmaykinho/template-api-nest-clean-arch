import { HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { DadosInvalidosDomainException } from '../../domain/exceptions/dados-invalidos';
import { NaoAutorizadoDomainException } from '../../domain/exceptions/nao-autorizado';
import { NaoEncontradoDomainException } from '../../domain/exceptions/nao-encontrado';
import { BadRequestHttpException } from './bad-request-http.exception';
import { AllExceptionsFilter } from './custom-error-request.exception';
import { ForbiddenHttpException } from './forbidden-http.exception';

const replayMock = jest.fn().mockImplementation(() => undefined);
const switchToHttpMock = jest.fn().mockReturnThis();
const getRequestMock = jest.fn().mockReturnValue({});
const getResponseMock = jest.fn().mockReturnValue({});

class MockHttpAdapterHost implements HttpAdapterHost {
  httpAdapter: any;

  constructor() {
    this.httpAdapter = { reply: replayMock };
  }
}

describe('AllExceptionsFilter - Testes unitários', () => {
  let filter: AllExceptionsFilter;
  let mockArgumentsHost: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        {
          provide: HttpAdapterHost,
          useClass: MockHttpAdapterHost,
        },
      ],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
    module.get<HttpAdapterHost>(HttpAdapterHost);

    mockArgumentsHost = {
      switchToHttp: switchToHttpMock,
      getRequest: getRequestMock,
      getResponse: getResponseMock,
    };
  });

  it('Deve retornar um erro custom do tipo "NaoEncontrado"', () => {
    const error = new NaoEncontradoDomainException([
      {
        mensagem: 'Registro não encontrado',
        motivo: 'NAO_ENCONTRADO',
      },
    ]);

    filter.catch(error, mockArgumentsHost);

    expect(replayMock).toHaveBeenCalledTimes(1);
    expect(replayMock).toHaveBeenCalledWith(
      {},
      {
        erros: [
          { motivo: 'NAO_ENCONTRADO', mensagem: 'Registro não encontrado' },
        ],
      },
      HttpStatus.NOT_FOUND,
    );
  });

  it('Deve retornar um erro custom do tipo "NaoAutorizado"', () => {
    const error = new NaoAutorizadoDomainException([
      {
        mensagem: 'Não autorizado',
        motivo: 'NAO_AUTORIZADO',
      },
    ]);

    filter.catch(error, mockArgumentsHost);

    expect(replayMock).toHaveBeenCalledTimes(1);
    expect(replayMock).toHaveBeenCalledWith(
      {},
      {
        erros: [{ motivo: 'NAO_AUTORIZADO', mensagem: 'Não autorizado' }],
      },
      HttpStatus.UNAUTHORIZED,
    );
  });

  it('Deve retornar um erro custom do tipo "DadosInvalidos"', () => {
    const error = new DadosInvalidosDomainException([
      {
        mensagem: 'Dados invalido',
        motivo: 'DADOS_INVALIDOS',
      },
    ]);

    filter.catch(error, mockArgumentsHost);

    expect(replayMock).toHaveBeenCalledTimes(1);
    expect(replayMock).toHaveBeenCalledWith(
      {},
      {
        erros: [{ motivo: 'DADOS_INVALIDOS', mensagem: 'Dados invalido' }],
      },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('Deve retornar um erro custom do tipo "BadRequest"', () => {
    const error = new BadRequestHttpException([
      {
        mensagem: 'Dados invalido',
        motivo: 'DADOS_INVALIDOS',
      },
    ]);

    filter.catch(error, mockArgumentsHost);

    expect(replayMock).toHaveBeenCalledTimes(1);
    expect(replayMock).toHaveBeenCalledWith(
      {},
      {
        erros: [{ motivo: 'DADOS_INVALIDOS', mensagem: 'Dados invalido' }],
      },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('Deve retornar um erro custom do tipo "Forbidden"', () => {
    const error = new ForbiddenHttpException([
      {
        mensagem: 'Sem permissão',
        motivo: 'SEM_PERMISSAO',
      },
    ]);

    filter.catch(error, mockArgumentsHost);

    expect(replayMock).toHaveBeenCalledTimes(1);
    expect(replayMock).toHaveBeenCalledWith(
      {},
      {
        erros: [{ motivo: 'SEM_PERMISSAO', mensagem: 'Sem permissão' }],
      },
      HttpStatus.FORBIDDEN,
    );
  });

  it('Deve retornar um erro desconhecido quando ocorrer um erro não tratado', () => {
    const error = new Error('Erro desconhecido');

    filter.catch(error, mockArgumentsHost);

    expect(replayMock).toHaveBeenCalledTimes(1);
    expect(replayMock).toHaveBeenCalledWith(
      {},
      {
        erros: [
          { motivo: 'ERRO_DESCONHECIDO', mensagem: 'Ocorreu um erro interno' },
        ],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
