import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { validarDTOCustom } from './valida-dto-custom.validation';

class MockValidacaoFilho {
  @IsEnum(['LINK', 'ARQUIVO'], {
    message: 'O atributo $property deve ser LINK ou ARQUIVO',
  })
  tipo: 'LINK' | 'ARQUIVO';
}
class MockValidacao {
  @IsEnum(['LINK', 'ARQUIVO'], {
    message: 'O atributo $property deve ser LINK ou ARQUIVO',
  })
  tipo: 'LINK' | 'ARQUIVO';

  @IsNotEmpty({ message: 'O atributo $property não pode estar vazio' })
  url: string;

  @ValidateNested()
  @IsNotEmpty({ message: 'O atributo $property não pode estar vazio' })
  @Type(() => MockValidacaoFilho)
  tipoObjeto: MockValidacaoFilho;
}

describe('validarDTOCustom testes de integração', () => {
  it('Deve retornar um array com os erros no objeto', async () => {
    const objetoParaSerValidado = {
      tipo: 'NAO_VALIDO',
      tipoObjeto: {},
    };

    const resultado = await validarDTOCustom(
      MockValidacao,
      objetoParaSerValidado,
    );

    expect(resultado).toEqual({
      resultado: 'ERRO',
      erros: [
        {
          mensagem: 'O atributo tipo deve ser LINK ou ARQUIVO',
          motivo: 'PAYLOAD_INVALIDO',
        },
        {
          mensagem: 'O atributo url não pode estar vazio',
          motivo: 'PAYLOAD_INVALIDO',
        },
        {
          mensagem: 'O atributo tipo deve ser LINK ou ARQUIVO',
          motivo: 'PAYLOAD_INVALIDO',
        },
      ],
    });
  });

  it('Deve retornar sucesso', async () => {
    const objetoParaSerValidado = {
      tipo: 'LINK',
      url: 'www.google.com',
      tipoObjeto: {
        tipo: 'LINK',
      },
    };

    const resultado = await validarDTOCustom(
      MockValidacao,
      objetoParaSerValidado,
    );

    expect(resultado).toEqual({
      resultado: 'SUCESSO',
      objeto: {
        tipo: 'LINK',
        url: 'www.google.com',
        tipoObjeto: {
          tipo: 'LINK',
        },
      },
    });
  });
});
