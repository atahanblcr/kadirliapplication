import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/events/data/repositories/events_repository.dart';
import 'package:kadirliapp/features/events/data/datasources/events_remote_datasource.dart';

class MockEventsRemoteDatasource implements EventsRemoteDatasource {
  Map<String, dynamic>? getEventsResponse;
  Map<String, dynamic>? getEventDetailResponse;
  Map<String, dynamic>? getCategoriesResponse;

  int getEventsCallCount = 0;
  int getEventDetailCallCount = 0;
  int getCategoriesCallCount = 0;

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);

  @override
  Future<Map<String, dynamic>> getEvents({
    int page = 1,
    int limit = 20,
    String? categoryId,
    String? city,
  }) async {
    getEventsCallCount++;
    return getEventsResponse ?? {};
  }

  @override
  Future<Map<String, dynamic>> getEventDetail(String id) async {
    getEventDetailCallCount++;
    return getEventDetailResponse ?? {};
  }

  @override
  Future<Map<String, dynamic>> getCategories() async {
    getCategoriesCallCount++;
    return getCategoriesResponse ?? {};
  }
}

void main() {
  late EventsRepository repository;
  late MockEventsRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockEventsRemoteDatasource();
    repository = EventsRepository(datasource: mockDatasource);
  });

  group('EventsRepository Tests', () {
    test('getEvents returns events list and meta on success', () async {
      // Arrange
      mockDatasource.getEventsResponse = {
        'data': {
          'events': [
            {
              'id': '1',
              'title': 'Konser Etkinliği',
              'event_date': '2026-03-10',
              'event_time': '20:00',
              'venue_name': 'Kadirli Kent Meydanı',
              'is_free': true,
              'created_at': '2026-03-01T10:00:00Z',
            }
          ],
          'meta': {
            'page': 1,
            'limit': 20,
            'has_next': false,
          }
        }
      };
      
      // Act
      final result = await repository.getEvents(page: 1, limit: 20);

      // Assert
      expect(result['events'], isNotEmpty);
      expect(result['events'].first.title, 'Konser Etkinliği');
      expect(result['meta']['has_next'], false);
      expect(mockDatasource.getEventsCallCount, 1);
    });

    test('getEventDetail returns EventDetailModel on success', () async {
      // Arrange
      mockDatasource.getEventDetailResponse = {
        'data': {
          'event': {
            'id': '1',
            'title': 'Konser Etkinliği',
            'description': 'Büyük yaz konseri.',
            'event_date': '2026-03-10',
            'event_time': '20:00',
            'venue_name': 'Kadirli Kent Meydanı',
            'is_free': true,
            'created_at': '2026-03-01T10:00:00Z',
          }
        }
      };

      // Act
      final result = await repository.getEventDetail('1');

      // Assert
      expect(result.id, '1');
      expect(result.title, 'Konser Etkinliği');
      expect(result.isFree, true);
      expect(result.description, 'Büyük yaz konseri.');
      expect(mockDatasource.getEventDetailCallCount, 1);
    });

    test('getCategories returns list of EventCategoryModel on success', () async {
      // Arrange
      mockDatasource.getCategoriesResponse = {
        'data': {
          'categories': [
            {'id': 'cat1', 'name': 'Müzik', 'slug': 'muzik', 'events_count': 5},
            {'id': 'cat2', 'name': 'Tiyatro', 'slug': 'tiyatro', 'events_count': 2}
          ]
        }
      };

      // Act
      final result = await repository.getCategories();

      // Assert
      expect(result.length, 2);
      expect(result[0].name, 'Müzik');
      expect(result[1].slug, 'tiyatro');
      expect(mockDatasource.getCategoriesCallCount, 1);
    });
  });
}
