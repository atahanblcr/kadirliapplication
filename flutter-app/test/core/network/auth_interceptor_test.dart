import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/network/auth_interceptor.dart';
import 'package:kadirliapp/core/storage/storage_service.dart';

class MockStorageService extends Mock implements StorageService {}
class MockRequestInterceptorHandler extends Mock implements RequestInterceptorHandler {}
class MockErrorInterceptorHandler extends Mock implements ErrorInterceptorHandler {}

void main() {
  late AuthInterceptor interceptor;
  late MockStorageService mockStorage;
  late MockRequestInterceptorHandler mockHandler;

  setUp(() {
    mockStorage = MockStorageService();
    interceptor = AuthInterceptor(mockStorage);
    mockHandler = MockRequestInterceptorHandler();
  });

  group('AuthInterceptor', () {
    test('onRequest adds token when available', () {
      final options = RequestOptions(path: '/test');
      when(() => mockStorage.getAccessToken()).thenReturn('test_token');

      interceptor.onRequest(options, mockHandler);

      expect(options.headers['Authorization'], 'Bearer test_token');
      verify(() => mockHandler.next(options)).called(1);
    });

    test('onRequest skips if Authorization already set', () {
      final options = RequestOptions(
        path: '/test',
        headers: {'Authorization': 'Bearer existing'},
      );

      interceptor.onRequest(options, mockHandler);

      expect(options.headers['Authorization'], 'Bearer existing');
      verify(() => mockHandler.next(options)).called(1);
      verifyNever(() => mockStorage.getAccessToken());
    });

    test('onRequest skips if no token', () {
      final options = RequestOptions(path: '/test');
      when(() => mockStorage.getAccessToken()).thenReturn(null);

      interceptor.onRequest(options, mockHandler);

      expect(options.headers.containsKey('Authorization'), false);
      verify(() => mockHandler.next(options)).called(1);
    });
  });

  group('AuthInterceptor.onError', () {
    late MockErrorInterceptorHandler mockErrorHandler;

    setUp(() {
      mockErrorHandler = MockErrorInterceptorHandler();
    });

    test('next if not 401', () async {
      final err = DioException(
        requestOptions: RequestOptions(path: '/'),
        response: Response(requestOptions: RequestOptions(path: '/'), statusCode: 400),
      );

      interceptor.onError(err, mockErrorHandler);

      verify(() => mockErrorHandler.next(err)).called(1);
    });

    test('next if 401 but no refresh token', () async {
      final err = DioException(
        requestOptions: RequestOptions(path: '/'),
        response: Response(requestOptions: RequestOptions(path: '/'), statusCode: 401),
      );
      when(() => mockStorage.getRefreshToken()).thenReturn(null);
      when(() => mockStorage.clearTokens()).thenAnswer((_) async {});

      interceptor.onError(err, mockErrorHandler);

      await Future.delayed(Duration.zero);
      verify(() => mockStorage.clearTokens()).called(1);
      verify(() => mockErrorHandler.next(err)).called(1);
    });

    test('next if 401 on auth path', () async {
      final err = DioException(
        requestOptions: RequestOptions(path: '/auth/request-otp'),
        response: Response(requestOptions: RequestOptions(path: '/'), statusCode: 401),
      );

      interceptor.onError(err, mockErrorHandler);

      verify(() => mockErrorHandler.next(err)).called(1);
    });
  });
}
