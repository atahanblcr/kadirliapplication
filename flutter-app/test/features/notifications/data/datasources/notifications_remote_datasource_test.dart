import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/notifications/data/datasources/notifications_remote_datasource.dart';

class MockDio extends Mock implements Dio {}

void main() {
  late NotificationsRemoteDatasource datasource;
  late MockDio mockDio;

  setUp(() {
    mockDio = MockDio();
    datasource = NotificationsRemoteDatasource(mockDio: mockDio);
  });

  group('NotificationsRemoteDatasource Tests', () {
    test('getNotifications returns data on success', () async {
      when(() => mockDio.get<Map<String, dynamic>>('/notifications', queryParameters: any(named: 'queryParameters')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                data: {'success': true, 'data': {}},
              ));

      final result = await datasource.getNotifications(page: 1, limit: 20);
      expect(result, isA<Map<String, dynamic>>());
      expect(result['success'], true);
    });

    test('returns empty map when data is null', () async {
      when(() => mockDio.get<Map<String, dynamic>>('/notifications', queryParameters: any(named: 'queryParameters')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                data: null,
              ));

      final result = await datasource.getNotifications();
      expect(result, isEmpty);
    });

    test('markAsRead executes patch successfully', () async {
      when(() => mockDio.patch(any()))
          .thenAnswer((_) async => Response(requestOptions: RequestOptions(path: '')));

      await datasource.markAsRead('1');
      verify(() => mockDio.patch('/notifications/1/read')).called(1);
    });

    test('markAllAsRead executes post successfully', () async {
      when(() => mockDio.post(any()))
          .thenAnswer((_) async => Response(requestOptions: RequestOptions(path: '')));

      await datasource.markAllAsRead();
      verify(() => mockDio.post('/notifications/read-all')).called(1);
    });
  });
}
