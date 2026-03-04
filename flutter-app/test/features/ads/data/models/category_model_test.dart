import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/ads/data/models/category_model.dart';

void main() {
  group('CategoryModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': 'cat1',
        'name': 'Cat 1',
        'slug': 'cat-1',
        'icon': 'icon',
        'ads_count': 10,
        'parent': {
          'id': 'parent1',
          'name': 'Parent',
          'slug': 'parent'
        }
      };

      final model = CategoryModel.fromJson(json);

      expect(model.id, 'cat1');
      expect(model.name, 'Cat 1');
      expect(model.adsCount, 10);
      expect(model.parent?.name, 'Parent');
    });

    test('toString works correctly', () {
      final model = CategoryModel(id: '1', name: 'Test', slug: 'test');
      expect(model.toString(), contains('Test'));
    });
  });
}
