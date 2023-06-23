import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Controller('/nestle')
export class ScheduleController {
  @Get()
  @HttpCode(HttpStatus.OK)
  async execute(): Promise<string> {
    const url =
      'https://integracaonestle.dataciss.com.br/cisspoder-auth/oauth/token'; // URL da API externa
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded', // Defina o Content-Type apropriado para a chamada POST
    };
    const data = {
      // Corpo da requisição x-www-form-urlencoded
      username: 'logshare',
      password: 'Ciss@123',
      grant_type: 'password',
      client_secret: 'poder7547',
      client_id: 'cisspoder-oauth',
    };

    try {
      console.log('incio da requisicao');
      const response = await axios.post(url, data, { headers, timeout: 3000 });

      await this.teste(response.data.access_token);

      return 'ok';
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao fazer a chamada para a API externa');
    }
  }

  private async teste(token: string): Promise<any> {
    const url = 'https://integracaonestle.dataciss.com.br/cisspoder-service/documentos_fiscais_saida';
    const requestBody = {
      clausulas: [
        // {
        //   campo: 'numnota',
        //   operadorlogico: 'AND',
        //   operador: 'IGUAL',
        //   valor: 183818,
        // },
        {
          campo: 'idempresa',
          operadorlogico: 'AND',
          operador: 'IGUAL',
          valor: 202,
        },
        {
          campo: 'dtemissao',
          operadorlogico: 'AND',
          operador: 'BETWEEN',
          valor: ['2023-06-10', '2023-06-30'],
        },
      ],
      ordenacoes: [
        {
          campo: 'numnota',
          direcao: 'ASC',
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const config: any = {
      method: 'POST',
      url: url,
      headers: headers,
      data: requestBody,
    };

    try {
      const response = await axios(config);
      console.log('NFE:::::::::::::', response.data);
    } catch (error) {
      console.error('ERRO NFE::::', error);
    }
  }
}
