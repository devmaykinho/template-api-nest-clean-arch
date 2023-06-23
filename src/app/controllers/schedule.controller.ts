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
      console.log('incio da requisicao');
      console.log('RESULTADO=========', response.data); // Você pode fazer algo com a resposta da API externa aqui
      return 'ok';
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao fazer a chamada para a API externa');
    }
  }
}
