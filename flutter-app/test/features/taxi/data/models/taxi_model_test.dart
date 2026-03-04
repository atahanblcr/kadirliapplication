import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/taxi/data/models/taxi_model.dart';

void main() {
  group('Taxi Models', () {
    test('TaxiDriverModel.fromJson', () {
      final json = {
        'id': '1',
        'name': 'Ali',
        'phone': '123',
        'plaka': '80T1',
        'total_calls': 10
      };
      final model = TaxiDriverModel.fromJson(json);
      expect(model.name, 'Ali');
      expect(model.totalCalls, 10);
    });
  });
}
