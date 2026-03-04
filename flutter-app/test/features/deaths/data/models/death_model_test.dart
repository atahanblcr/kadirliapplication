import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/deaths/data/models/death_model.dart';

void main() {
  group('Death Models', () {
    test('DeathNoticeModel.fromJson', () {
      final json = {
        'id': '1',
        'deceased_name': 'Ahmet',
        'funeral_date': '2026-03-03',
        'funeral_time': '10:00',
        'created_at': '2026-03-01T10:00:00Z',
      };
      final model = DeathNoticeModel.fromJson(json);
      expect(model.deceasedName, 'Ahmet');
    });

    test('DeathNoticeDetailModel.fromJson', () {
      final json = {
        'id': '1',
        'deceased_name': 'Ahmet',
        'funeral_date': '2026-03-03',
        'funeral_time': '10:00',
        'created_at': '2026-03-01T10:00:00Z',
        'photo': {'id': 'p1', 'url': 'http://url'}
      };
      final model = DeathNoticeDetailModel.fromJson(json);
      expect(model.photo?.url, 'http://url');
    });

    test('DeathNoticeModel.fromJson with alternative photo fields', () {
      final json1 = {
        'id': '1', 'deceased_name': 'A', 'funeral_date': 'D', 'funeral_time': 'T', 'created_at': '2026-03-01T10:00:00Z',
        'photo_file': {'url': 'url1'}
      };
      expect(DeathNoticeModel.fromJson(json1).photoUrl, 'url1');

      final json2 = {
        'id': '1', 'deceased_name': 'A', 'funeral_date': 'D', 'funeral_time': 'T', 'created_at': '2026-03-01T10:00:00Z',
        'photo': {'url': 'url2'}
      };
      expect(DeathNoticeModel.fromJson(json2).photoUrl, 'url2');
    });

    test('DeathNoticeDetailModel.fromJson with alternative photo fields', () {
      final json = {
        'id': '1', 'deceased_name': 'A', 'funeral_date': 'D', 'funeral_time': 'T', 'created_at': '2026-03-01T10:00:00Z',
        'photo_file': {'id': 'p1', 'url': 'url3'}
      };
      expect(DeathNoticeDetailModel.fromJson(json).photo?.url, 'url3');
    });

    test('MosqueModel.fromJson', () {
      final json = {'id': '1', 'name': 'M', 'latitude': '37.37'};
      final model = MosqueModel.fromJson(json);
      expect(model.name, 'M');
      expect(model.latitude, 37.37);
    });
  });
}
