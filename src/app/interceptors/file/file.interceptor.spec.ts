import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { of } from 'rxjs';
import { FastifyFileInterceptor } from './file.interceptor';

const mockContext = mock<ExecutionContext>();
const requestMock = {
  body: {},
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  raw: {
    body: {},
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
};

describe('FastifyFileInterceptor', () => {
  let interceptor: NestInterceptor;
  const fieldName = 'file';
  const localOptions = { dest: 'uploads/' };

  const mockCallHandler: CallHandler = {
    handle: jest.fn(() => of('')),
  } as any;

  beforeEach(() => {
    const FileInterceptor = FastifyFileInterceptor(fieldName, localOptions);
    interceptor = new FileInterceptor();
  });

  it('Deve chamar next.handle() ao executar a função intercept() com sucesso', async () => {
    mockContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue(requestMock),
      getResponse: jest.fn(),
      getNext: jest.fn(),
    });
    await interceptor.intercept(mockContext, mockCallHandler);

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});
