import { ExecutionContext } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { TraceInterceptor } from './trace.interceptor';

const mockContext = mock<ExecutionContext>();
mockContext.switchToHttp.mockReturnValue({
  getRequest: jest.fn().mockReturnValue({
    headers: {},
  }),
  getResponse: jest.fn().mockReturnValue({
    header: jest.fn(),
  }),
  getNext: jest.fn(),
});

const mockNext = { handle: jest.fn() };

describe('TraceInterceptor', () => {
  let interceptor: TraceInterceptor;

  beforeEach(() => {
    interceptor = new TraceInterceptor();
  });

  it('Deve setar o x-trace-id header da response com o uuid gerado caso a request não tenha o header', async () => {
    const uuidRegex =
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
    const mockResponse = mockContext.switchToHttp().getResponse();
    const mockSetHeader = jest.spyOn(mockResponse, 'header');
    const expectedTraceId = expect.stringMatching(uuidRegex);

    await interceptor.intercept(mockContext, mockNext);

    expect(mockSetHeader).toHaveBeenCalledWith('x-trace-id', expectedTraceId);
  });

  it('Deve setar o x-trace-id header da response com o atual x-trace-id da request caso seja informado', async () => {
    const traceId = '123456';
    const mockNext = { handle: jest.fn() };
    const mockRequest = mockContext.switchToHttp().getRequest();
    mockRequest.headers['x-trace-id'] = traceId;
    const mockResponse = mockContext.switchToHttp().getResponse();
    const mockSetHeader = jest.spyOn(mockResponse, 'header');

    await interceptor.intercept(mockContext, mockNext);

    expect(mockSetHeader).toHaveBeenCalledWith('x-trace-id', traceId);
  });

  it('Deve chamar nex.handle()', async () => {
    const mockNext = { handle: jest.fn() };
    const handleSpy = jest.spyOn(mockNext, 'handle');

    await interceptor.intercept(mockContext, mockNext);

    expect(handleSpy).toHaveBeenCalled();
  });
});
