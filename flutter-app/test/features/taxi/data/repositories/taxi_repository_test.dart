import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/taxi/data/repositories/taxi_repository.dart';
import 'package:kadirliapp/features/taxi/data/datasources/taxi_remote_datasource.dart';
import 'package:kadirliapp/features/taxi/data/models/taxi_model.dart';

class MockTaxiRemoteDatasource extends Mock implements TaxiRemoteDatasource {}

void main() {
  late TaxiRepository repository;
  late MockTaxiRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockTaxiRemoteDatasource();
    repository = TaxiRepository(datasource: mockDatasource);
  });

  group('TaxiRepository Tests', () {
    test('getDrivers returns list of TaxiDriverModel', () async {
      when(() => mockDatasource.getDrivers()).thenAnswer((_) async => {
        'data': {
          'drivers': [
            {'id': '1', 'name': 'Ali', 'phone': '123', 'plaka': '80T1'}
          ]
        }
      });

      final result = await repository.getDrivers();

      expect(result, isNotEmpty);
      expect(result.first.name, 'Ali');
    });

    test('callDriver executes successfully', () async {
      when(() => mockDatasource.callDriver(any())).thenAnswer((_) async => {});

      await repository.callDriver('1');

      verify(() => mockDatasource.callDriver('1')).called(1);
    });

    group('Error Handling', () {
      test('getDrivers should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getDrivers()).thenAnswer((_) async => {'data': {'drivers': ['invalid']}});
        expect(() => repository.getDrivers(), throwsA(isA<UnknownException>()));
      });

      test('callDriver should throw UnknownException on parse error', () async {
        when(() => mockDatasource.callDriver(any())).thenThrow(Exception());
        expect(() => repository.callDriver('1'), throwsA(isA<UnknownException>()));
      });

      test('getDrivers should rethrow DioException', () async {
        when(() => mockDatasource.getDrivers()).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.getDrivers(), throwsA(isA<DioException>()));
      });
    });
  });
}
