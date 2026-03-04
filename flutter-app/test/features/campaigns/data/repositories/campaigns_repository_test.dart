import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/campaigns/data/repositories/campaigns_repository.dart';
import 'package:kadirliapp/features/campaigns/data/datasources/campaigns_remote_datasource.dart';
import 'package:kadirliapp/features/campaigns/data/models/campaign_model.dart';

class MockCampaignsRemoteDatasource extends Mock implements CampaignsRemoteDatasource {}

void main() {
  late CampaignsRepository repository;
  late MockCampaignsRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockCampaignsRemoteDatasource();
    repository = CampaignsRepository(datasource: mockDatasource);
  });

  group('CampaignsRepository Tests', () {
    test('getCampaigns returns campaigns list and meta', () async {
      when(() => mockDatasource.getCampaigns(
        page: any(named: 'page'),
        limit: any(named: 'limit'),
        categoryId: any(named: 'categoryId'),
        activeOnly: any(named: 'activeOnly'),
      )).thenAnswer((_) async => {
        'data': {
          'campaigns': [
            {'id': '1', 'title': 'Test'}
          ],
          'meta': {'has_next': false}
        }
      });
      
      final result = await repository.getCampaigns(page: 1, limit: 20);

      expect(result['campaigns'], isNotEmpty);
      expect(result['meta']['has_next'], false);
    });

    test('getCampaignDetail returns CampaignDetailModel', () async {
      when(() => mockDatasource.getCampaignDetail(any())).thenAnswer((_) async => {
        'data': {
          'campaign': {'id': '1', 'title': 'Test'}
        }
      });

      final result = await repository.getCampaignDetail('1');

      expect(result.id, '1');
    });

    test('viewCode returns data', () async {
      when(() => mockDatasource.viewCode(any())).thenAnswer((_) async => {
        'data': {'discount_code': 'CODE'}
      });

      final result = await repository.viewCode('1');

      expect(result['discount_code'], 'CODE');
    });

    group('Error Handling', () {
      test('getCampaigns should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getCampaigns(
          page: any(named: 'page'),
          limit: any(named: 'limit'),
          categoryId: any(named: 'categoryId'),
          activeOnly: any(named: 'activeOnly'),
        )).thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getCampaigns(), throwsA(isA<UnknownException>()));
      });

      test('getCampaignDetail should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getCampaignDetail(any())).thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getCampaignDetail('1'), throwsA(isA<UnknownException>()));
      });

      test('viewCode should throw UnknownException on parse error', () async {
        when(() => mockDatasource.viewCode(any())).thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.viewCode('1'), throwsA(isA<UnknownException>()));
      });

      test('getCampaigns should rethrow DioException', () async {
        when(() => mockDatasource.getCampaigns(
          page: any(named: 'page'),
          limit: any(named: 'limit'),
          categoryId: any(named: 'categoryId'),
          activeOnly: any(named: 'activeOnly'),
        )).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.getCampaigns(), throwsA(isA<DioException>()));
      });
    });
  });
}
