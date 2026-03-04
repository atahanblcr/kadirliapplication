import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/events/data/datasources/events_remote_datasource.dart';
import '../../../../helpers/mock_dio.dart';

void main() {
  late EventsRemoteDatasource datasource;
  late MockDioClient mockDioClient;

  setUp(() {
    mockDioClient = MockDioClient();
    datasource = EventsRemoteDatasource(dioClient: mockDioClient);
  });

  group('EventsRemoteDatasource', () {
    test('getEvents should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDioClient.get(
        any(),
        queryParameters: any(named: 'queryParameters'),
        options: any(named: 'options'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getEvents(page: 1, limit: 10, categoryId: '1', city: 'Kadirli');

      expect(result, {'data': 'test'});
      verify(() => mockDioClient.get(
        '/events',
        queryParameters: {
          'page': 1,
          'limit': 10,
          'category_id': '1',
          'city': 'Kadirli',
        },
        options: any(named: 'options'),
      )).called(1);
    });

    test('getEventDetail should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDioClient.get(
        any(),
        queryParameters: any(named: 'queryParameters'),
        options: any(named: 'options'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getEventDetail('1');

      expect(result, {'data': 'test'});
      verify(() => mockDioClient.get('/events/1', queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).called(1);
    });

    test('getCategories should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDioClient.get(
        any(),
        queryParameters: any(named: 'queryParameters'),
        options: any(named: 'options'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getCategories();

      expect(result, {'data': 'test'});
      verify(() => mockDioClient.get('/events/categories', queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).called(1);
    });
  });
}
