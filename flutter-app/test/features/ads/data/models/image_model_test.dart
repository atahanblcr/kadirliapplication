import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/ads/data/models/image_model.dart';

void main() {
  group('ImageModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': '1',
        'url': 'http://test.com/img.jpg',
        'thumbnail_url': 'http://test.com/thumb.jpg',
        'is_cover': true,
        'order': 1,
      };

      final model = ImageModel.fromJson(json);

      expect(model.id, '1');
      expect(model.url, 'http://test.com/img.jpg');
      expect(model.thumbnailUrl, 'http://test.com/thumb.jpg');
      expect(model.isCover, true);
      expect(model.order, 1);
    });

    test('fromJson works with missing fields', () {
      final json = {
        'url': 'http://test.com/img.jpg',
      };

      final model = ImageModel.fromJson(json);

      expect(model.id, '');
      expect(model.url, 'http://test.com/img.jpg');
      expect(model.thumbnailUrl, 'http://test.com/img.jpg');
      expect(model.isCover, false);
      expect(model.order, 0);
    });
  });
}
