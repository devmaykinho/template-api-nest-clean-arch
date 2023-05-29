import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TraceInterceptor } from '../trace/trace.interceptor';

@Controller('health')
@UseInterceptors(TraceInterceptor)
export class HealthCheckController {
  @Get()
  check() {
    return 'UP';
  }
}
