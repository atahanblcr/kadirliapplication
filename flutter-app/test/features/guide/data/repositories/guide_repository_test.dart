import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/guide/data/repositories/guide_repository.dart';
import 'package:kadirliapp/features/guide/data/datasources/guide_remote_datasource.dart';
import 'package:kadirliapp/features/guide/data/models/guide_model.dart';

class MockGuideRemoteDatasource extends Mock implements GuideRemoteDatasource {}

void main() {
  late GuideRepository repository;
  late MockGuideRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockGuideRemoteDatasource();
    repository = GuideRepository(datasource: mockDatasource);
  });

  group('GuideRepository Tests', () {
    test('getCategories returns list of categories', () async {
      when(() => mockDatasource.getCategories()).thenAnswer((_) async => {
        'data': {
          'categories': [
            {'id': '1', 'name': 'Kurum', 'slug': 'kurum', 'items_count': 5}
          ]
        }
      });

      final result = await repository.getCategories();

      expect(result, isNotEmpty);
      expect(result.first.name, 'Kurum');
    });

    test('getGuideItems returns list of items', () async {
      when(() => mockDatasource.getGuideItems(
        categoryId: any(named: 'categoryId'),
        search: any(named: 'search'),
      )).thenAnswer((_) async => {
        'data': {
          'items': [
            {'id': '1', 'category_id': 'c1', 'name': 'Firma', 'phone': '123'}
          ]
        }
      });

      final result = await repository.getGuideItems();

      expect(result, isNotEmpty);
      expect(result.first.name, 'Firma');
    });

    group('Error Handling', () {
      test('getCategories should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getCategories()).thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getCategories(), throwsA(isA<UnknownException>()));
      });

      test('getGuideItems should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getGuideItems(
          categoryId: any(named: 'categoryId'),
          search: any(named: 'search'),
        )).thenAnswer((_) async => {'data': 'invalid'});
        expect(() => repository.getGuideItems(), throwsA(isA<UnknownException>()));
      });

      test('getCategories should rethrow DioException', () async {
        when(() => mockDatasource.getCategories()).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.getCategories(), throwsA(isA<DioException>()));
      });
    });
  });
}
