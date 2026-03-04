import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/ads/data/models/ad_model.dart';

void main() {
  group('AdModel', () {
    test('fromJson handles different price types and null fields', () {
      final json = {
        'id': 123,
        'title': 'Test',
        'price': '100.5',
        'created_at': '2026-03-01T10:00:00Z',
        'category': {'id': '1', 'name': 'C', 'slug': 's'},
        'is_own': true,
      };

      final model = AdModel.fromJson(json);

      expect(model.id, '123');
      expect(model.price, 100);
      expect(model.isOwn, true);
      expect(model.isFavorite, false);
    });

    test('fromJson handles double price', () {
      final json = {
        'price': 150.75,
        'category': {'id': '1'},
      };
      final model = AdModel.fromJson(json);
      expect(model.price, 150);
    });
  });
}
