import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const traceId = request.headers['x-trace-id'] || uuid();
    const response = http.getResponse<Response>();

    response.header('x-trace-id', traceId);

    return next.handle();
  }
}
