import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ControllerModule } from './app/controller.module';
import { AllExceptionsFilter } from './app/filters/custom-error-request.exception';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [ControllerModule],
})
export class AppModule {}
