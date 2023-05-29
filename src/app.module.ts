import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ControllerModule } from './app/controller.module';
import { AllExceptionsFilter } from './app/filters/custom-error-request.exception';
import { ChassisModule } from './infra/chassis.module';
import { InfraModule } from './infra/infra.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [InfraModule, ChassisModule, ControllerModule],
})
export class AppModule {}
