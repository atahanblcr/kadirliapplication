import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/auth/data/models/user_model.dart';

void main() {
  group('UserModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': '1',
        'phone': '0555',
        'username': 'test',
        'role': 'user',
        'age': 25,
        'profile_photo_url': 'http://url',
        'primary_neighborhood': {
          'id': 'n1',
          'name': 'Neighborhood',
          'type': 'mahalle'
        }
      };

      final model = UserModel.fromJson(json);

      expect(model.id, '1');
      expect(model.username, 'test');
      expect(model.primaryNeighborhood?.name, 'Neighborhood');
    });

    test('toJson works correctly', () {
      final model = UserModel(
        id: '1',
        phone: '0555',
        username: 'test',
        role: 'user',
        age: 25,
        profilePhotoUrl: 'http://url',
      );

      final json = model.toJson();

      expect(json['id'], '1');
      expect(json['phone'], '0555');
      expect(json['username'], 'test');
    });
  });

  group('NeighborhoodModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': 'n1',
        'name': 'Neighborhood',
        'type': 'mahalle'
      };

      final model = NeighborhoodModel.fromJson(json);

      expect(model.id, 'n1');
      expect(model.name, 'Neighborhood');
      expect(model.type, 'mahalle');
    });
  });
}
