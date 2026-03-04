import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/pharmacy/data/repositories/pharmacy_repository.dart';
import 'package:kadirliapp/features/pharmacy/data/datasources/pharmacy_remote_datasource.dart';
import 'package:kadirliapp/features/pharmacy/data/models/pharmacy_model.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';

class MockPharmacyRemoteDatasource extends Mock implements PharmacyRemoteDatasource {}

void main() {
  late PharmacyRepository repository;
  late MockPharmacyRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockPharmacyRemoteDatasource();
    repository = PharmacyRepository(datasource: mockDatasource);
  });

  group('PharmacyRepository Tests', () {
    test('getCurrentPharmacy returns PharmacyModel on success', () async {
      when(() => mockDatasource.getCurrentPharmacy()).thenAnswer((_) async => {
        'data': {
          'pharmacy': {
            'id': '1',
            'name': 'Merkez Eczanesi',
            'address': 'Atatürk Cd. No:1',
            'phone': '05551234567',
            'duty_hours': '18:00 - 08:00',
          }
        }
      });
      
      final result = await repository.getCurrentPharmacy();

      expect(result, isNotNull);
      expect(result!.name, 'Merkez Eczanesi');
    });

    test('getSchedule returns list of PharmacyScheduleModel on success', () async {
      when(() => mockDatasource.getSchedule(
        startDate: any(named: 'startDate'),
        endDate: any(named: 'endDate'),
      )).thenAnswer((_) async => {
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
      });

      final result = await repository.getSchedule(startDate: '2026-03-01', endDate: '2026-03-31');

      expect(result.length, 1);
      expect(result[0].date, '2026-03-01');
    });

    test('getPharmacies returns list of pharmacies and meta on success', () async {
      when(() => mockDatasource.getPharmacies(
        page: any(named: 'page'),
        limit: any(named: 'limit'),
      )).thenAnswer((_) async => {
        'data': {
          'pharmacies': [
            {
              'id': '1',
              'name': 'Merkez Eczanesi',
              'address': 'Atatürk Cd. No:1',
              'phone': '05551234567',
            }
          ],
          'meta': {'has_next': false}
        }
      });

      final result = await repository.getPharmacies();

      expect(result['pharmacies'], isNotEmpty);
      expect(result['meta']['has_next'], false);
    });

    group('Error Handling', () {
      test('getCurrentPharmacy should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getCurrentPharmacy()).thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getCurrentPharmacy(), throwsA(isA<UnknownException>()));
      });

      test('getSchedule should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getSchedule(startDate: any(named: 'startDate'), endDate: any(named: 'endDate')))
            .thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getSchedule(startDate: '', endDate: ''), throwsA(isA<UnknownException>()));
      });

      test('getPharmacies should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getPharmacies(page: any(named: 'page'), limit: any(named: 'limit')))
            .thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getPharmacies(), throwsA(isA<UnknownException>()));
      });

      test('getCurrentPharmacy should rethrow DioException', () async {
        when(() => mockDatasource.getCurrentPharmacy()).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.getCurrentPharmacy(), throwsA(isA<DioException>()));
      });
    });
  });
}
