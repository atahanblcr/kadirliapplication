import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/pharmacy/data/repositories/pharmacy_repository.dart';
import 'package:kadirliapp/features/pharmacy/data/datasources/pharmacy_remote_datasource.dart';

class MockPharmacyRemoteDatasource implements PharmacyRemoteDatasource {
  Map<String, dynamic>? getCurrentPharmacyResponse;
  Map<String, dynamic>? getScheduleResponse;
  Map<String, dynamic>? getPharmaciesResponse;

  int getCurrentPharmacyCallCount = 0;
  int getScheduleCallCount = 0;
  int getPharmaciesCallCount = 0;

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);

  @override
  Future<Map<String, dynamic>> getCurrentPharmacy() async {
    getCurrentPharmacyCallCount++;
    return getCurrentPharmacyResponse ?? {};
  }

  @override
  Future<Map<String, dynamic>> getSchedule({
    required String startDate,
    required String endDate,
  }) async {
    getScheduleCallCount++;
    return getScheduleResponse ?? {};
  }

  @override
  Future<Map<String, dynamic>> getPharmacies({
    int page = 1,
    int limit = 20,
  }) async {
    getPharmaciesCallCount++;
    return getPharmaciesResponse ?? {};
  }
}

void main() {
  late PharmacyRepository repository;
  late MockPharmacyRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockPharmacyRemoteDatasource();
    repository = PharmacyRepository(datasource: mockDatasource);
  });

  group('PharmacyRepository Tests', () {
    test('getCurrentPharmacy returns PharmacyModel on success', () async {
      // Arrange
      mockDatasource.getCurrentPharmacyResponse = {
        'data': {
          'pharmacy': {
            'id': '1',
            'name': 'Merkez Eczanesi',
            'address': 'Atatürk Cd. No:1',
            'phone': '05551234567',
            'duty_hours': '18:00 - 08:00',
          }
        }
      };
      
      // Act
      final result = await repository.getCurrentPharmacy();

      // Assert
      expect(result, isNotNull);
      expect(result!.name, 'Merkez Eczanesi');
      expect(result.dutyHours, '18:00 - 08:00');
      expect(mockDatasource.getCurrentPharmacyCallCount, 1);
    });

    test('getCurrentPharmacy returns null if pharmacy is not in response', () async {
      // Arrange
      mockDatasource.getCurrentPharmacyResponse = {
        'data': {
          'pharmacy': null
        }
      };
      
      // Act
      final result = await repository.getCurrentPharmacy();

      // Assert
      expect(result, isNull);
      expect(mockDatasource.getCurrentPharmacyCallCount, 1);
    });

    test('getSchedule returns list of PharmacyScheduleModel on success', () async {
      // Arrange
      mockDatasource.getScheduleResponse = {
        'data': {
          'schedule': [
            {
              'date': '2026-03-01',
              'pharmacy': {
                'id': '1',
                'name': 'Merkez Eczanesi',
                'address': 'Atatürk Cd. No:1',
                'phone': '05551234567',
              }
            }
          ]
        }
      };

      // Act
      final result = await repository.getSchedule(startDate: '2026-03-01', endDate: '2026-03-31');

      // Assert
      expect(result.length, 1);
      expect(result[0].date, '2026-03-01');
      expect(result[0].pharmacy.name, 'Merkez Eczanesi');
      expect(mockDatasource.getScheduleCallCount, 1);
    });

    test('getPharmacies returns list of pharmacies and meta on success', () async {
      // Arrange
      mockDatasource.getPharmaciesResponse = {
        'data': {
          'pharmacies': [
            {
              'id': '1',
              'name': 'Merkez Eczanesi',
              'address': 'Atatürk Cd. No:1',
              'phone': '05551234567',
            }
          ],
          'meta': {
            'page': 1,
            'limit': 20,
            'has_next': false,
          }
        }
      };

      // Act
      final result = await repository.getPharmacies();

      // Assert
      expect(result['pharmacies'], isNotEmpty);
      expect(result['pharmacies'].first.name, 'Merkez Eczanesi');
      expect(result['meta']['has_next'], false);
      expect(mockDatasource.getPharmaciesCallCount, 1);
    });
  });
}
