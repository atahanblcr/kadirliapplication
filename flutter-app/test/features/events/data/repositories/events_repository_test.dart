import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/events/data/repositories/events_repository.dart';
import 'package:kadirliapp/features/events/data/datasources/events_remote_datasource.dart';
import 'package:kadirliapp/features/events/data/models/event_model.dart';

class MockEventsRemoteDatasource extends Mock implements EventsRemoteDatasource {}

void main() {
  late EventsRepository repository;
  late MockEventsRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockEventsRemoteDatasource();
    repository = EventsRepository(datasource: mockDatasource);
  });

  group('EventsRepository Tests', () {
    test('getEvents returns list of events and meta', () async {
      when(() => mockDatasource.getEvents(
        page: any(named: 'page'),
        limit: any(named: 'limit'),
        categoryId: any(named: 'categoryId'),
        city: any(named: 'city'),
      )).thenAnswer((_) async => {
        'data': {
          'events': [
            {
              'id': '1',
              'title': 'Konser',
              'event_date': '2026-03-10',
              'event_time': '20:00',
              'venue_name': 'Park',
              'created_at': '2026-03-01T10:00:00Z',
            }
          ],
          'meta': {'total': 1}
        }
      });

      final result = await repository.getEvents();

      expect(result['events'], isNotEmpty);
      expect(result['events'].first.title, 'Konser');
    });

    test('getEventDetail returns EventDetailModel', () async {
      when(() => mockDatasource.getEventDetail(any())).thenAnswer((_) async => {
        'data': {
          'event': {
            'id': '1',
            'title': 'Konser',
            'event_date': '2026-03-10',
            'event_time': '20:00',
            'venue_name': 'Park',
            'created_at': '2026-03-01T10:00:00Z',
          }
        }
      });

      final result = await repository.getEventDetail('1');

      expect(result.id, '1');
      expect(result.title, 'Konser');
    });

    test('getCategories returns list of categories', () async {
      when(() => mockDatasource.getCategories()).thenAnswer((_) async => {
        'data': {
          'categories': [
            {'id': '1', 'name': 'Müzik', 'slug': 'muzik'},
            {'id': '2', 'name': 'Tiyatro', 'slug': 'tiyatro'}
          ]
        }
      });

      final result = await repository.getCategories();

      expect(result.length, 2);
      expect(result[0].name, 'Müzik');
    });

    group('Error Handling', () {
      test('getEvents should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getEvents(
          page: any(named: 'page'),
          limit: any(named: 'limit'),
          categoryId: any(named: 'categoryId'),
          city: any(named: 'city'),
        )).thenAnswer((_) async => {'data': 'invalid'});
        
        expect(() => repository.getEvents(), throwsA(isA<UnknownException>()));
      });

      test('getEventDetail should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getEventDetail(any())).thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getEventDetail('1'), throwsA(isA<UnknownException>()));
      });

      test('getCategories should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getCategories()).thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getCategories(), throwsA(isA<UnknownException>()));
      });

      test('getEvents should rethrow DioException', () async {
        when(() => mockDatasource.getEvents(
          page: any(named: 'page'),
          limit: any(named: 'limit'),
          categoryId: any(named: 'categoryId'),
          city: any(named: 'city'),
        )).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        
        expect(() => repository.getEvents(), throwsA(isA<DioException>()));
      });
    });
  });
}
