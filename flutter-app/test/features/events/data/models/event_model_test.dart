import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/events/data/models/event_model.dart';

void main() {
  test('EventCategoryModel.fromJson parses correctly', () {
    final model = EventCategoryModel.fromJson({'id': '1', 'name': 'Concert', 'slug': 'concert'});
    expect(model.id, '1');
    expect(model.name, 'Concert');
    expect(model.slug, 'concert');
  });

  test('EventImageModel.fromJson parses correctly', () {
    final model = EventImageModel.fromJson({'id': '1', 'url': 'http://url', 'order': 1});
    expect(model.id, '1');
    expect(model.url, 'http://url');
    expect(model.order, 1);
  });

  test('EventModel.fromJson parses correctly', () {
    final model = EventModel.fromJson({
      'id': '1',
      'title': 'Party',
      'event_date': '2026-03-09',
      'event_time': '10:00',
      'venue_name': 'Arena',
      'is_free': true,
      'created_at': '2026-03-09T10:00:00Z',
      'category': {'id': '1', 'name': 'C', 'slug': 'c'}
    });
    expect(model.id, '1');
    expect(model.title, 'Party');
    expect(model.eventDate, '2026-03-09');
    expect(model.isFree, true);
    expect(model.category?.name, 'C');
  });
}
