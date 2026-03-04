import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/events/data/models/event_model.dart';

void main() {
  group('EventModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': '1',
        'title': 'Test',
        'event_date': '2026-03-10',
        'event_time': '20:00',
        'venue_name': 'Venue',
        'is_free': true,
        'created_at': '2026-03-01T10:00:00Z',
      };

      final model = EventModel.fromJson(json);

      expect(model.id, '1');
      expect(model.title, 'Test');
      expect(model.isFree, true);
    });

    test('EventModel.fromJson with category and coverImage', () {
      final json = {
        'id': '1', 'title': 'T', 'event_date': 'D', 'event_time': 'T', 'venue_name': 'V',
        'created_at': '2026-03-01T10:00:00Z',
        'category': {'id': 'c1', 'name': 'Cat', 'slug': 's'},
        'cover_image': {'id': 'i1', 'url': 'url1'}
      };
      final model = EventModel.fromJson(json);
      expect(model.category?.name, 'Cat');
      expect(model.coverImage?.url, 'url1');
    });
  });

  group('EventDetailModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': '1',
        'title': 'Test',
        'event_date': '2026-03-10',
        'event_time': '20:00',
        'venue_name': 'Venue',
        'latitude': '37.37',
        'longitude': 36.10,
        'ticket_price': 50.0,
        'created_at': '2026-03-01T10:00:00Z',
      };

      final model = EventDetailModel.fromJson(json);

      expect(model.id, '1');
      expect(model.latitude, 37.37);
      expect(model.longitude, 36.10);
      expect(model.ticketPrice, 50.0);
    });
  });
}
