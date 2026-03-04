import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/deaths/data/datasources/deaths_remote_datasource.dart';
import '../../../../helpers/mock_dio.dart';

void main() {
  late DeathsRemoteDatasource datasource;
  late MockDio mockDio;

  setUp(() {
    mockDio = MockDio();
    datasource = DeathsRemoteDatasource(mockDio: mockDio);
    setupDioMocks();
  });

  group('DeathsRemoteDatasource', () {
    test('getDeaths should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>(
        '/deaths',
        queryParameters: any(named: 'queryParameters'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getDeaths(page: 1, limit: 10, funeralDate: '2026-03-03');

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>(
        '/deaths',
        queryParameters: {
          'page': 1,
          'limit': 10,
          'funeral_date': '2026-03-03',
        },
      )).called(1);
    });

    test('getDeathDetail should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>('/deaths/1'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.getDeathDetail('1');

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>('/deaths/1')).called(1);
    });

    test('getCemeteries should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>('/deaths/cemeteries'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.getCemeteries();

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>('/deaths/cemeteries')).called(1);
    });

    test('getMosques should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>('/deaths/mosques'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.getMosques();

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>('/deaths/mosques')).called(1);
    });
  });
}
