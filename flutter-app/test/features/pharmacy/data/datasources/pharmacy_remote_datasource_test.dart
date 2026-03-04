import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/pharmacy/data/datasources/pharmacy_remote_datasource.dart';
import '../../../../helpers/mock_dio.dart';

void main() {
  late PharmacyRemoteDatasource datasource;
  late MockDioClient mockDioClient;

  setUp(() {
    mockDioClient = MockDioClient();
    datasource = PharmacyRemoteDatasource(dioClient: mockDioClient);
  });

  group('PharmacyRemoteDatasource', () {
    test('getCurrentPharmacy should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDioClient.get(
        any(),
        queryParameters: any(named: 'queryParameters'),
        options: any(named: 'options'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getCurrentPharmacy();

      expect(result, {'data': 'test'});
      verify(() => mockDioClient.get('/pharmacy/current', queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).called(1);
    });

    test('getSchedule should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDioClient.get(
        any(),
        queryParameters: any(named: 'queryParameters'),
        options: any(named: 'options'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getSchedule(startDate: '2026-03-01', endDate: '2026-03-07');

      expect(result, {'data': 'test'});
      verify(() => mockDioClient.get(
        '/pharmacy/schedule',
        queryParameters: {
          'start_date': '2026-03-01',
          'end_date': '2026-03-07',
        },
        options: any(named: 'options'),
      )).called(1);
    });

    test('getPharmacies should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDioClient.get(
        any(),
        queryParameters: any(named: 'queryParameters'),
        options: any(named: 'options'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getPharmacies(page: 1, limit: 10);

      expect(result, {'data': 'test'});
      verify(() => mockDioClient.get(
        '/pharmacy/list',
        queryParameters: {
          'page': 1,
          'limit': 10,
        },
        options: any(named: 'options'),
      )).called(1);
    });
  });
}
