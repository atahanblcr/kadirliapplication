import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import {
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: any;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    // Mock Response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Request
    mockRequest = {
      url: '/api/test',
      method: 'GET',
    };

    // Mock ArgumentsHost
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };
  });

  describe('catch - HttpException handling', () => {
    it('should handle BadRequestException (400) with VALIDATION_ERROR code', () => {
      const exception = new BadRequestException('Invalid input');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
          }),
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            path: '/api/test',
          }),
        }),
      );
    });

    it('should handle NotFoundException (404) with NOT_FOUND code', () => {
      const exception = new NotFoundException('Resource not found');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          }),
        }),
      );
    });

    it('should handle UnauthorizedException (401) with UNAUTHORIZED code', () => {
      const exception = new UnauthorizedException('Invalid token');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'UNAUTHORIZED',
            message: 'Invalid token',
          }),
        }),
      );
    });

    it('should handle ForbiddenException (403) with FORBIDDEN code', () => {
      const exception = new ForbiddenException('Access denied');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'FORBIDDEN',
            message: 'Access denied',
          }),
        }),
      );
    });

    it('should handle InternalServerErrorException (500) with INTERNAL_ERROR code', () => {
      const exception = new InternalServerErrorException('Server error');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'INTERNAL_ERROR',
            message: 'Server error',
          }),
        }),
      );
    });

    it('should handle HttpException with object response containing message and errors', () => {
      const exception = new HttpException(
        {
          message: 'Validation failed',
          errors: [{ field: 'email', reason: 'invalid' }],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: [{ field: 'email', reason: 'invalid' }],
          }),
        }),
      );
    });

    it('should handle array message by taking first element', () => {
      const exception = new BadRequestException(['error1', 'error2', 'error3']);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'error1',
          }),
        }),
      );
    });

    it('should include meta with timestamp and path', () => {
      const exception = new BadRequestException('Test error');

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            path: '/api/test',
          }),
        }),
      );
    });

    it('should handle string message from HttpException', () => {
      const exception = new HttpException('String message error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'String message error',
          }),
        }),
      );
    });
  });

  describe('catch - Non-HttpException handling', () => {
    it('should handle plain Error with INTERNAL_ERROR (500)', () => {
      const exception = new Error('Unexpected error');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'INTERNAL_ERROR',
            message: 'Bir hata oluştu',
          }),
        }),
      );
    });

    it('should use default message when no specific message provided', () => {
      const exception = new Error('');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Bir hata oluştu',
          }),
        }),
      );
    });
  });

  describe('getErrorCode', () => {
    it('should return CONFLICT for 409 status', () => {
      const exception = new HttpException('Conflict', HttpStatus.CONFLICT);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'CONFLICT',
          }),
        }),
      );
    });

    it('should return UNPROCESSABLE_ENTITY for 422 status', () => {
      const exception = new HttpException('Unprocessable', HttpStatus.UNPROCESSABLE_ENTITY);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'UNPROCESSABLE_ENTITY',
          }),
        }),
      );
    });

    it('should return RATE_LIMIT_EXCEEDED for 429 status', () => {
      const exception = new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'RATE_LIMIT_EXCEEDED',
          }),
        }),
      );
    });

    it('should return UNKNOWN_ERROR for unmapped status codes', () => {
      const exception = new HttpException('Unknown error', 418); // I'm a teapot

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'UNKNOWN_ERROR',
          }),
        }),
      );
    });
  });
});
