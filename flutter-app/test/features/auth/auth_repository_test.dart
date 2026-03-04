import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/auth/data/repositories/auth_repository.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import '../../helpers/mock_dio.dart';

void main() {
  late AuthRepository repository;
  late MockDioClient mockDioClient;

  setUp(() {
    mockDioClient = MockDioClient();
    repository = AuthRepository(client: mockDioClient);
    setupDioMocks();
  });

  group('AuthRepository', () {
    test('requestOtp success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'message': 'OTP sent',
          'expires_in': 300,
          'retry_after': 60,
        },
        statusCode: 200,
      );

      when(() => mockDioClient.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => mockResponse);

      final result = await repository.requestOtp('05551112233');

      expect(result.message, 'OTP sent');
      expect(result.expiresIn, 300);
    });

    test('verifyOtp success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'is_new_user': false,
          'access_token': 'access',
          'refresh_token': 'refresh',
        },
        statusCode: 200,
      );

      when(() => mockDioClient.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => mockResponse);

      final result = await repository.verifyOtp('05551112233', '123456');

      expect(result.isNewUser, false);
      expect(result.accessToken, 'access');
    });

    test('register success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'access_token': 'access',
          'refresh_token': 'refresh',
          'expires_in': 3600,
          'user': {
            'id': '1',
            'phone': '05551112233',
          }
        },
        statusCode: 200,
      );

      when(() => mockDioClient.post(
        any(),
        data: any(named: 'data'),
        options: any(named: 'options'),
      )).thenAnswer((_) async => mockResponse);

      final result = await repository.register(
        tempToken: 'temp',
        username: 'test',
        age: 25,
        locationType: 'center',
        primaryNeighborhoodId: '1',
        acceptTerms: true,
      );

      expect(result.accessToken, 'access');
      expect(result.user.id, '1');
    });

    test('refreshToken success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'access_token': 'new_access',
          'expires_in': 3600,
        },
        statusCode: 200,
      );

      when(() => mockDioClient.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => mockResponse);

      final result = await repository.refreshToken('old_refresh');

      expect(result.accessToken, 'new_access');
    });

    test('logout success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {'success': true},
        statusCode: 200,
      );

      when(() => mockDioClient.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => mockResponse);

      await repository.logout(fcmToken: 'fcm');

      verify(() => mockDioClient.post(any(), data: {'fcm_token': 'fcm'})).called(1);
    });

    test('getNeighborhoods success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'data': {
            'neighborhoods': [
              {'id': '1', 'name': 'Merkez', 'type': 'mahalle'}
            ]
          }
        },
        statusCode: 200,
      );

      when(() => mockDioClient.get(any())).thenAnswer((_) async => mockResponse);

      final result = await repository.getNeighborhoods();

      expect(result.length, 1);
      expect(result.first.name, 'Merkez');
    });

    group('Error handling', () {
      test('handle 400 ValidationException', () async {
        final mockErrorResponse = Response(
          requestOptions: RequestOptions(path: ''),
          data: {'message': 'Invalid input'},
          statusCode: 400,
        );

        when(() => mockDioClient.post(any(), data: any(named: 'data')))
            .thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: mockErrorResponse,
          type: DioExceptionType.badResponse,
        ));

        expect(
          () => repository.requestOtp('phone'),
          throwsA(isA<ValidationException>()),
        );
      });

      test('handle 401 UnauthorizedException', () async {
        final mockErrorResponse = Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 401,
        );

        when(() => mockDioClient.post(any(), data: any(named: 'data')))
            .thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: mockErrorResponse,
          type: DioExceptionType.badResponse,
        ));

        expect(
          () => repository.requestOtp('phone'),
          throwsA(isA<UnauthorizedException>()),
        );
      });

      test('handle 403 ForbiddenException', () async {
        when(() => mockDioClient.post(any(), data: any(named: 'data'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 403),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.requestOtp('phone'), throwsA(isA<ForbiddenException>()));
      });

      test('handle 404 NotFoundException', () async {
        when(() => mockDioClient.post(any(), data: any(named: 'data'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 404),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.requestOtp('phone'), throwsA(isA<NotFoundException>()));
      });

      test('handle 409 ValidationException', () async {
        when(() => mockDioClient.post(any(), data: any(named: 'data'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 409, data: {'message': 'conflict'}),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.requestOtp('phone'), throwsA(predicate((e) => e is ValidationException && e.message == 'conflict')));
      });

      test('handle 429 RateLimit', () async {
        when(() => mockDioClient.post(any(), data: any(named: 'data'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 429),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.requestOtp('phone'), throwsA(isA<ValidationException>()));
      });

      test('handle 500 ServerException', () async {
        when(() => mockDioClient.post(any(), data: any(named: 'data'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 500),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.requestOtp('phone'), throwsA(isA<ServerException>()));
      });

      test('handle generic UnknownException', () async {
        when(() => mockDioClient.post(any(), data: any(named: 'data'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 418), // I'm a teapot
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.requestOtp('phone'), throwsA(isA<UnknownException>()));
      });

      test('handle timeout', () async {
        when(() => mockDioClient.post(any(), data: any(named: 'data')))
            .thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.connectionTimeout,
        ));

        expect(
          () => repository.requestOtp('phone'),
          throwsA(isA<TimeoutException>()),
        );
      });
    });
  });
}
