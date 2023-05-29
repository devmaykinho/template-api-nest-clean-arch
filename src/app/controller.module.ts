import { Module } from '@nestjs/common';
import { InfraModule } from '../infra/infra.module';
import { ScheduleController } from './controllers/schedule.controller';

@Module({
  controllers: [ScheduleController],
  providers: [],
  imports: [InfraModule],
})
export class ControllerModule {}
