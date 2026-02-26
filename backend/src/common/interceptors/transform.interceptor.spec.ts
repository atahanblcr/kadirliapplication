import { Test, TestingModule } from '@nestjs/testing';
import { TransformInterceptor, ApiResponse } from './transform.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;
  let mockContext: any;
  let mockRequest: any;
  let mockHandler: CallHandler;

  beforeEach(() => {
    interceptor = new TransformInterceptor();

    mockRequest = {
      url: '/api/users',
      method: 'GET',
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    mockHandler = {
      handle: jest.fn(),
    } as unknown as CallHandler;
  });

  afterEach(() => jest.clearAllMocks());

  it('should wrap response with success: true and meta', (done) => {
    const testData = { id: 1, name: 'Test User' };
    mockHandler.handle = jest.fn().mockReturnValue(of(testData));

    interceptor.intercept(mockContext, mockHandler).subscribe((result) => {
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: testData,
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            path: '/api/users',
          }),
        }),
      );
      done();
    });
  });

  it('should include ISO timestamp in meta', (done) => {
    const testData = { id: 1 };
    mockHandler.handle = jest.fn().mockReturnValue(of(testData));

    interceptor.intercept(mockContext, mockHandler).subscribe((result: ApiResponse<any>) => {
      expect(result.meta.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      done();
    });
  });

  it('should include request path in meta', (done) => {
    const testData = { id: 1 };
    mockRequest.url = '/api/products/123';
    mockHandler.handle = jest.fn().mockReturnValue(of(testData));

    interceptor.intercept(mockContext, mockHandler).subscribe((result: ApiResponse<any>) => {
      expect(result.meta.path).toBe('/api/products/123');
      done();
    });
  });

  it('should handle null data', (done) => {
    mockHandler.handle = jest.fn().mockReturnValue(of(null));

    interceptor.intercept(mockContext, mockHandler).subscribe((result: ApiResponse<any>) => {
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: null,
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            path: '/api/users',
          }),
        }),
      );
      done();
    });
  });

  it('should handle undefined data', (done) => {
    mockHandler.handle = jest.fn().mockReturnValue(of(undefined));

    interceptor.intercept(mockContext, mockHandler).subscribe((result: ApiResponse<any>) => {
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: undefined,
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            path: '/api/users',
          }),
        }),
      );
      done();
    });
  });

  it('should handle array data', (done) => {
    const testData = [{ id: 1 }, { id: 2 }];
    mockHandler.handle = jest.fn().mockReturnValue(of(testData));

    interceptor.intercept(mockContext, mockHandler).subscribe((result: ApiResponse<any>) => {
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: testData,
        }),
      );
      done();
    });
  });

  it('should handle complex nested data', (done) => {
    const testData = {
      user: { id: 1, name: 'John' },
      meta: { page: 1, total: 100 },
      items: [{ id: 1 }, { id: 2 }],
    };
    mockHandler.handle = jest.fn().mockReturnValue(of(testData));

    interceptor.intercept(mockContext, mockHandler).subscribe((result: ApiResponse<any>) => {
      expect(result.data).toEqual(testData);
      expect(result.success).toBe(true);
      done();
    });
  });

  it('should call next.handle() once', (done) => {
    mockHandler.handle = jest.fn().mockReturnValue(of({ id: 1 }));

    interceptor.intercept(mockContext, mockHandler).subscribe(() => {
      expect(mockHandler.handle).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should preserve response type in generic', (done) => {
    interface UserResponse {
      id: number;
      name: string;
    }

    const testData: UserResponse = { id: 1, name: 'John' };
    mockHandler.handle = jest.fn().mockReturnValue(of(testData));

    const interceptorTyped = new TransformInterceptor<UserResponse>();
    interceptorTyped.intercept(mockContext, mockHandler).subscribe((result) => {
      expect(result.data.id).toBe(1);
      expect(result.data.name).toBe('John');
      done();
    });
  });
});
