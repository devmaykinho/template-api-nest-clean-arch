import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, ValidatorOptions, validate } from 'class-validator';
import {
  Erro,
  Validacoes,
  ValidarObjetoOutput,
} from './valida-dto-custom.validation.types';

const formataErros = (
  _atributo: string,
  constraints: { [key: string]: string } = {},
): Erro => {
  const entries = Object.entries(constraints);

  return entries.map(
    ([, mensagem]): Erro => ({
      motivo: 'PAYLOAD_INVALIDO',
      mensagem,
    }),
  )[0];
};

const normalizaValidacoes = (
  errosDeValidacao: ValidationError,
): Validacoes[] => {
  const validacoes: Array<Validacoes> = [];

  if (errosDeValidacao.children && errosDeValidacao.children.length > 0) {
    errosDeValidacao.children.forEach((child) =>
      normalizaValidacoes(child).forEach((err: Validacoes) => {
        validacoes.push({ campo: err.campo, regra: err.regra });
      }),
    );
  } else {
    validacoes.push({
      campo: errosDeValidacao.property,
      regra: errosDeValidacao.constraints,
    });
  }

  return validacoes;
};

export const validarDTOCustom = async <T>(
  cls: ClassConstructor<T>,
  objeto: object,
  validatorOptions?: ValidatorOptions,
): Promise<ValidarObjetoOutput<T>> => {
  const body = plainToClass(cls, objeto);
  const errosDeValidacao = await validate(
    body as unknown as object,
    validatorOptions,
  );

  if (errosDeValidacao.length > 0) {
    const errosEncontrados = errosDeValidacao
      .map((validation) => normalizaValidacoes(validation))
      .flat();

    const errosFormatados = errosEncontrados.map((erro) =>
      formataErros(erro.campo, erro.regra),
    );

    return {
      resultado: 'ERRO',
      erros: errosFormatados,
    };
  }

  return {
    resultado: 'SUCESSO',
    objeto: body,
  };
};
