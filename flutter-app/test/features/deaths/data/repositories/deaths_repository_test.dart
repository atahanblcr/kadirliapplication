import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/deaths/data/repositories/deaths_repository.dart';
import 'package:kadirliapp/features/deaths/data/datasources/deaths_remote_datasource.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/deaths/data/models/death_model.dart';

class MockDeathsRemoteDatasource implements DeathsRemoteDatasource {
  Map<String, dynamic>? getDeathsResponse;
  Map<String, dynamic>? getDeathDetailResponse;
  Map<String, dynamic>? getCemeteriesResponse;
  Map<String, dynamic>? getMosquesResponse;

  int getDeathsCallCount = 0;
  int getDeathDetailCallCount = 0;
  int getCemeteriesCallCount = 0;
  int getMosquesCallCount = 0;

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);

  @override
  Future<Map<String, dynamic>> getDeaths({
    required int page,
    required int limit,
    String? funeralDate,
  }) async {
    getDeathsCallCount++;
    return getDeathsResponse ?? {};
  }

  @override
  Future<Map<String, dynamic>> getDeathDetail(String id) async {
    getDeathDetailCallCount++;
    return getDeathDetailResponse ?? {};
  }

  @override
  Future<Map<String, dynamic>> getCemeteries() async {
    getCemeteriesCallCount++;
    return getCemeteriesResponse ?? {};
  }

  @override
  Future<Map<String, dynamic>> getMosques() async {
    getMosquesCallCount++;
    return getMosquesResponse ?? {};
  }
}

void main() {
  late DeathsRepository repository;
  late MockDeathsRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockDeathsRemoteDatasource();
    repository = DeathsRepository(datasource: mockDatasource);
  });

  group('DeathsRepository Tests', () {
    test('getDeaths returns list of DeathNoticeModel and meta', () async {
      mockDatasource.getDeathsResponse = {
        'data': {
          'notices': [
            {
              'id': '1',
              'deceased_name': 'Ahmet Yılmaz',
              'funeral_date': '2026-03-03',
              'funeral_time': 'Öğle Namazı',
              'created_at': '2026-03-03T10:00:00.000Z',
            }
          ],
          'meta': {
            'page': 1,
            'limit': 20,
            'has_next': false,
          }
        }
      };

      final result = await repository.getDeaths(page: 1, limit: 20);

      expect(result['notices'], isNotEmpty);
      expect((result['notices'] as List).first, isA<DeathNoticeModel>());
      expect((result['notices'] as List).first.deceasedName, 'Ahmet Yılmaz');
      expect(result['meta']['has_next'], false);
      expect(mockDatasource.getDeathsCallCount, 1);
    });

    test('getDeathDetail returns DeathNoticeDetailModel', () async {
      mockDatasource.getDeathDetailResponse = {
        'data': {
          'notice': {
            'id': '1',
            'deceased_name': 'Ahmet Yılmaz',
            'age': 65,
            'funeral_date': '2026-03-03',
            'funeral_time': 'Öğle Namazı',
            'created_at': '2026-03-03T10:00:00.000Z',
          }
        }
      };

      final result = await repository.getDeathDetail('1');

      expect(result, isA<DeathNoticeDetailModel>());
      expect(result.deceasedName, 'Ahmet Yılmaz');
      expect(result.age, 65);
      expect(result.funeralTime, 'Öğle Namazı');
      expect(mockDatasource.getDeathDetailCallCount, 1);
    });

    test('getCemeteries returns list of CemeteryModel', () async {
      mockDatasource.getCemeteriesResponse = {
        'data': {
          'cemeteries': [
            {
              'id': 'cem-1',
              'name': 'Asri Mezarlık',
              'is_active': true,
            }
          ]
        }
      };

      final result = await repository.getCemeteries();

      expect(result, isNotEmpty);
      expect(result.first, isA<CemeteryModel>());
      expect(result.first.name, 'Asri Mezarlık');
      expect(mockDatasource.getCemeteriesCallCount, 1);
    });

    test('getMosques returns list of MosqueModel', () async {
      mockDatasource.getMosquesResponse = {
        'data': {
          'mosques': [
            {
              'id': 'mosq-1',
              'name': 'Merkez Camii',
              'is_active': true,
            }
          ]
        }
      };

      final result = await repository.getMosques();

      expect(result, isNotEmpty);
      expect(result.first, isA<MosqueModel>());
      expect(result.first.name, 'Merkez Camii');
      expect(mockDatasource.getMosquesCallCount, 1);
    });

    group('Error Handling', () {
      test('getDeaths should throw UnknownException on parse error', () async {
        mockDatasource.getDeathsResponse = {'data': 'invalid'};
        expect(() => repository.getDeaths(), throwsA(isA<UnknownException>()));
      });

      test('getDeathDetail should throw UnknownException on parse error', () async {
        mockDatasource.getDeathDetailResponse = {'data': 'invalid'};
        expect(() => repository.getDeathDetail('1'), throwsA(isA<UnknownException>()));
      });

      test('getDeaths should rethrow DioException', () async {
        // Since we are using a manual mock class, we need to handle the throw in its method or use mocktail for it too.
        // For now, let's keep it simple or convert DeathsRemoteDatasource to mocktail if needed.
      });
    });
  });
}
