import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/guide/data/datasources/guide_remote_datasource.dart';
import '../../../../helpers/mock_dio.dart';

void main() {
  late GuideRemoteDatasource datasource;
  late MockDio mockDio;

  setUp(() {
    mockDio = MockDio();
    datasource = GuideRemoteDatasource(mockDio: mockDio);
    setupDioMocks();
  });

  group('GuideRemoteDatasource', () {
    test('getCategories should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>('/guide/categories'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.getCategories();

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>('/guide/categories')).called(1);
    });

    test('getGuideItems should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>(
        '/guide',
        queryParameters: any(named: 'queryParameters'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getGuideItems(categoryId: '1', search: 'test');

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>(
        '/guide',
        queryParameters: {
          'category_id': '1',
          'search': 'test',
        },
      )).called(1);
    });
  });
}
