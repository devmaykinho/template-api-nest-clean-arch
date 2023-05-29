import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('/schedule')
export class ScheduleController {
  @Get()
  @HttpCode(HttpStatus.OK)
  async execute(): Promise<string> {
    return 'ok';
  }
}
