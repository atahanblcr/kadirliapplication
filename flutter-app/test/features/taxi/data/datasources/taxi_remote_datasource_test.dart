import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/taxi/data/datasources/taxi_remote_datasource.dart';
import '../../../../helpers/mock_dio.dart';

void main() {
  late TaxiRemoteDatasource datasource;
  late MockDio mockDio;

  setUp(() {
    mockDio = MockDio();
    datasource = TaxiRemoteDatasource(mockDio: mockDio);
    setupDioMocks();
  });

  group('TaxiRemoteDatasource', () {
    test('getDrivers should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>('/taxi/drivers'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.getDrivers();

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>('/taxi/drivers')).called(1);
    });

    test('callDriver should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.post<Map<String, dynamic>>('/taxi/drivers/1/call'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.callDriver('1');

      expect(result, {'data': 'test'});
      verify(() => mockDio.post<Map<String, dynamic>>('/taxi/drivers/1/call')).called(1);
    });
  });
}
