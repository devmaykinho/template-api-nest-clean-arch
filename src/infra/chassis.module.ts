import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckController } from './chassis/health-check/health-check.controller';
import { awsConfig } from './chassis/setup/configs/aws-config';
import { environment } from './chassis/setup/configs/environment.config';
import { root } from './chassis/setup/configs/root.config';
import { runtime } from './chassis/setup/configs/runtime.config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [root, environment, runtime, awsConfig],
    }),
  ],
  controllers: [HealthCheckController],
  exports: [],
})
export class ChassisModule {}
