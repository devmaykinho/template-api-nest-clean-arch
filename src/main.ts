import * as cors from '@fastify/cors';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { contentParser } from 'fastify-multer';
import { AppModule } from './app.module';
import { awsConfig } from './infra/chassis/setup/configs/aws-config';

const start = async () => {
  awsConfig();
  const nestAdapter = new FastifyAdapter({
    logger: true,
  });
  const fastify = nestAdapter.getInstance();
  const nest = await NestFactory.create(AppModule, nestAdapter);

  nest.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  fastify.register(cors, {});
  fastify.register(contentParser);

  nest.enableVersioning({
    type: VersioningType.HEADER,
    header: 'x-perfil',
  });
  const configService = nest.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  fastify.ready(() => console.log('Servindo na porta: ' + port));
  await nest.listen(port, '0.0.0.0');
};

start();
