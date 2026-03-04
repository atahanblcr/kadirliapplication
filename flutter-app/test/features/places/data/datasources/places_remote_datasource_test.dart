import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/places/data/datasources/places_remote_datasource.dart';
import '../../../../helpers/mock_dio.dart';

void main() {
  late PlacesRemoteDatasource datasource;
  late MockDio mockDio;

  setUp(() {
    mockDio = MockDio();
    datasource = PlacesRemoteDatasource(mockDio: mockDio);
    setupDioMocks();
  });

  group('PlacesRemoteDatasource', () {
    test('getPlaces should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>(
        '/places',
        queryParameters: any(named: 'queryParameters'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getPlaces(categoryId: '1', isFree: true, sort: 'name');

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>(
        '/places',
        queryParameters: {
          'category_id': '1',
          'is_free': true,
          'sort': 'name',
        },
      )).called(1);
    });

    test('getPlaceDetail should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>('/places/1'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.getPlaceDetail('1');

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>('/places/1')).called(1);
    });
  });
}
