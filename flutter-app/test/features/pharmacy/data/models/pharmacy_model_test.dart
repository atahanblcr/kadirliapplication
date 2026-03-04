import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/pharmacy/data/models/pharmacy_model.dart';

void main() {
  group('PharmacyModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': '1',
        'name': 'Test',
        'address': 'Addr',
        'phone': '123',
        'latitude': '37.37',
        'longitude': 36.10,
      };

      final model = PharmacyModel.fromJson(json);

      expect(model.id, '1');
      expect(model.latitude, 37.37);
      expect(model.longitude, 36.10);
    });
  });

  group('PharmacyScheduleModel', () {
    test('fromJson works correctly', () {
      final json = {
        'date': '2026-03-01',
        'pharmacy': {
          'id': '1',
          'name': 'Test',
          'address': 'Addr',
          'phone': '123',
        }
      };

      final model = PharmacyScheduleModel.fromJson(json);

      expect(model.date, '2026-03-01');
      expect(model.pharmacy.name, 'Test');
    });
  });
}
