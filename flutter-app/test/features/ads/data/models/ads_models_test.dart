import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/ads/data/models/image_model.dart';
import 'package:kadirliapp/features/ads/data/models/category_model.dart';

void main() {
  test('ImageModel.fromJson parses correctly', () {
    final json = {'id': '1', 'url': 'http://test.com/image.jpg'};
    final model = ImageModel.fromJson(json);
    expect(model.id, '1');
    expect(model.url, 'http://test.com/image.jpg');
  });

  test('CategoryModel.fromJson parses correctly', () {
    final json = {'id': '1', 'name': 'Electronics', 'icon': 'icon'};
    final model = CategoryModel.fromJson(json);
    expect(model.id, '1');
    expect(model.name, 'Electronics');
    expect(model.icon, 'icon');
  });
}
