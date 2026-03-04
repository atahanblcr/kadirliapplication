import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/places/data/models/place_model.dart';

void main() {
  group('PlaceModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': '1',
        'name': 'Test',
        'latitude': '37.37',
        'longitude': 36.10,
        'is_free': true,
        'distance_from_center': 2.5,
      };

      final model = PlaceModel.fromJson(json);

      expect(model.id, '1');
      expect(model.latitude, 37.37);
      expect(model.distanceFromCenter, 2.5);
    });
  });

  group('PlaceDetailModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': '1',
        'name': 'Test',
        'latitude': '37.37',
        'longitude': 36.10,
        'entrance_fee': '10.5',
        'images': [
          {'id': 'img1', 'file': {'url': 'http://url'}}
        ]
      };

      final model = PlaceDetailModel.fromJson(json);

      expect(model.id, '1');
      expect(model.entranceFee, 10.5);
      expect(model.images.length, 1);
      expect(model.images.first.imageUrl, 'http://url');
    });
  });
}
