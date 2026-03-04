import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/network/dio_client.dart';
import '../../helpers/mock_dio.dart';

void main() {
  late DioClient client;
  late MockDio mockDio;

  setUp(() {
    client = DioClient();
    mockDio = MockDio();
    client.dio = mockDio;
    setupDioMocks();
  });

  group('DioClient', () {
    test('get calls dio.get', () async {
      when(() => mockDio.get<dynamic>(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options')))
          .thenAnswer((_) async => Response(requestOptions: RequestOptions(path: '')));

      await client.get('/test');

      verify(() => mockDio.get<dynamic>('/test', queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).called(1);
    });

    test('post calls dio.post', () async {
      when(() => mockDio.post<dynamic>(any(), data: any(named: 'data'), queryParameters: any(named: 'queryParameters'), options: any(named: 'options')))
          .thenAnswer((_) async => Response(requestOptions: RequestOptions(path: '')));

      await client.post('/test', data: {'key': 'val'});

      verify(() => mockDio.post<dynamic>('/test', data: {'key': 'val'}, queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).called(1);
    });

    test('put calls dio.put', () async {
      when(() => mockDio.put<dynamic>(any(), data: any(named: 'data'), queryParameters: any(named: 'queryParameters'), options: any(named: 'options')))
          .thenAnswer((_) async => Response(requestOptions: RequestOptions(path: '')));

      await client.put('/test', data: {'key': 'val'});

      verify(() => mockDio.put<dynamic>('/test', data: {'key': 'val'}, queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).called(1);
    });

    test('patch calls dio.patch', () async {
      when(() => mockDio.patch<dynamic>(any(), data: any(named: 'data'), queryParameters: any(named: 'queryParameters'), options: any(named: 'options')))
          .thenAnswer((_) async => Response(requestOptions: RequestOptions(path: '')));

      await client.patch('/test', data: {'key': 'val'});

      verify(() => mockDio.patch<dynamic>('/test', data: {'key': 'val'}, queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).called(1);
    });

    test('delete calls dio.delete', () async {
      when(() => mockDio.delete<dynamic>(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options')))
          .thenAnswer((_) async => Response(requestOptions: RequestOptions(path: '')));

      await client.delete('/test');

      verify(() => mockDio.delete<dynamic>('/test', queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).called(1);
    });
  });
}
