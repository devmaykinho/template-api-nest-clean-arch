import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HealthCheckController } from './health-check.controller';

describe('HealthCheckController - Teste unitário', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      imports: [HttpModule],
      providers: [],
    }).compile();

    app = module.createNestApplication();
    app.useLogger(false);
    app.enableVersioning();
    await app.init();
  });

  it('Deve retornar o status 200 quando requisitar /health', async () => {
    const resultado = await request(app.getHttpServer()).get(`/health`);

    expect(resultado.status).toEqual(200);
    expect(resultado.text).toEqual('UP');
  });
});
