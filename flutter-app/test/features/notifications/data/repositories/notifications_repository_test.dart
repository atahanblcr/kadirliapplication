import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/notifications/data/repositories/notifications_repository.dart';
import 'package:kadirliapp/features/notifications/data/datasources/notifications_remote_datasource.dart';

class MockNotificationsRemoteDatasource extends Mock implements NotificationsRemoteDatasource {}

void main() {
  late NotificationsRepository repository;
  late MockNotificationsRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockNotificationsRemoteDatasource();
    repository = NotificationsRepository(datasource: mockDatasource);
  });

  group('NotificationsRepository Tests', () {
    test('getNotifications returns parsed response', () async {
      when(() => mockDatasource.getNotifications(
            page: any(named: 'page'),
            limit: any(named: 'limit'),
            unreadOnly: any(named: 'unreadOnly'),
          )).thenAnswer((_) async => {
            'data': {
              'notifications': [
                {'id': '1', 'title': 'Test'}
              ],
              'unread_count': 5,
              'meta': {
                'page': 1,
                'total_pages': 2,
                'has_next': true
              }
            }
          });

      final result = await repository.getNotifications();
      expect(result.notifications, isNotEmpty);
      expect(result.notifications.first.title, 'Test');
      expect(result.unreadCount, 5);
      expect(result.page, 1);
      expect(result.totalPages, 2);
      expect(result.hasNext, true);
    });

    test('markAsRead calls datasource successfully', () async {
      when(() => mockDatasource.markAsRead(any())).thenAnswer((_) async => {});
      await repository.markAsRead('1');
      verify(() => mockDatasource.markAsRead('1')).called(1);
    });

    test('markAllAsRead calls datasource successfully', () async {
      when(() => mockDatasource.markAllAsRead()).thenAnswer((_) async => {});
      await repository.markAllAsRead();
      verify(() => mockDatasource.markAllAsRead()).called(1);
    });

    group('Error Handling', () {
      test('getNotifications throws UnknownException on parse error', () async {
        when(() => mockDatasource.getNotifications(
              page: any(named: 'page'),
              limit: any(named: 'limit'),
              unreadOnly: any(named: 'unreadOnly'),
            )).thenAnswer((_) async => {
              'data': {
                'notifications': ['invalid']
              }
            });
        expect(() => repository.getNotifications(), throwsA(isA<UnknownException>()));
      });

      test('getNotifications rethrows DioException', () async {
        when(() => mockDatasource.getNotifications(
              page: any(named: 'page'),
              limit: any(named: 'limit'),
              unreadOnly: any(named: 'unreadOnly'),
            )).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.getNotifications(), throwsA(isA<DioException>()));
      });

      test('markAsRead rethrows DioException', () async {
        when(() => mockDatasource.markAsRead(any()))
            .thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.markAsRead('1'), throwsA(isA<DioException>()));
      });

      test('markAllAsRead throws UnknownException on unknown error', () async {
        when(() => mockDatasource.markAllAsRead()).thenThrow(Exception('Unknown Error'));
        expect(() => repository.markAllAsRead(), throwsA(isA<UnknownException>()));
      });
    });
  });
}
