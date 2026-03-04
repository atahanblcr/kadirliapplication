import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/campaigns/data/datasources/campaigns_remote_datasource.dart';
import '../../../../helpers/mock_dio.dart';

void main() {
  late CampaignsRemoteDatasource datasource;
  late MockDio mockDio;

  setUp(() {
    mockDio = MockDio();
    datasource = CampaignsRemoteDatasource(mockDio: mockDio);
  });

  group('CampaignsRemoteDatasource', () {
    test('getCampaigns should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>(
        '/campaigns',
        queryParameters: any(named: 'queryParameters'),
      )).thenAnswer((_) async => mockResponse);

      final result = await datasource.getCampaigns(page: 1, limit: 10, categoryId: 'cat-1');

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>(
        '/campaigns',
        queryParameters: {
          'page': 1,
          'limit': 10,
          'active_only': true,
          'category_id': 'cat-1',
        },
      )).called(1);
    });

    test('getCampaignDetail should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.get<Map<String, dynamic>>('/campaigns/1'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.getCampaignDetail('1');

      expect(result, {'data': 'test'});
      verify(() => mockDio.get<Map<String, dynamic>>('/campaigns/1')).called(1);
    });

    test('viewCode should return data on success', () async {
      final mockResponse = MockResponse<Map<String, dynamic>>();
      when(() => mockResponse.data).thenReturn({'data': 'test'});
      when(() => mockDio.post<Map<String, dynamic>>('/campaigns/1/view-code'))
          .thenAnswer((_) async => mockResponse);

      final result = await datasource.viewCode('1');

      expect(result, {'data': 'test'});
      verify(() => mockDio.post<Map<String, dynamic>>('/campaigns/1/view-code')).called(1);
    });
  });
}
