import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/guide/data/models/guide_model.dart';

void main() {
  group('Guide Models', () {
    test('GuideCategoryModel.fromJson', () {
      final json = {'id': '1', 'name': 'Kurum', 'slug': 'kurum', 'items_count': 5};
      final model = GuideCategoryModel.fromJson(json);
      expect(model.itemsCount, 5);
    });

    test('GuideItemModel.fromJson works correctly', () {
      final json = {
        'id': '1',
        'category_id': 'c1',
        'name': 'Firma',
        'phone': '123',
        'latitude': 37.37,
        'logo': {'url': 'http://url'}
      };
      final model = GuideItemModel.fromJson(json);
      expect(model.logoUrl, 'http://url');
      expect(model.latitude, 37.37);
    });

    test('GuideItemModel.fromJson handles string coordinates', () {
      final json = {
        'id': '1', 'category_id': 'c1', 'name': 'F', 'phone': '1',
        'latitude': '37.37', 'longitude': '36.10'
      };
      final model = GuideItemModel.fromJson(json);
      expect(model.latitude, 37.37);
      expect(model.longitude, 36.10);
    });
  });
}
