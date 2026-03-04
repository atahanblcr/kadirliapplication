import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/places/data/repositories/places_repository.dart';
import 'package:kadirliapp/features/places/data/datasources/places_remote_datasource.dart';
import 'package:kadirliapp/features/places/data/models/place_model.dart';

class MockPlacesRemoteDatasource extends Mock implements PlacesRemoteDatasource {}

void main() {
  late PlacesRepository repository;
  late MockPlacesRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockPlacesRemoteDatasource();
    repository = PlacesRepository(datasource: mockDatasource);
  });

  group('PlacesRepository Tests', () {
    test('getPlaces returns list of PlaceModel', () async {
      when(() => mockDatasource.getPlaces(
        categoryId: any(named: 'categoryId'),
        isFree: any(named: 'isFree'),
        sort: any(named: 'sort'),
        userLat: any(named: 'userLat'),
        userLng: any(named: 'userLng'),
      )).thenAnswer((_) async => {
        'places': [
          {'id': '1', 'name': 'Place'}
        ]
      });

      final result = await repository.getPlaces();

      expect(result, isNotEmpty);
      expect(result.first.name, 'Place');
    });

    test('getPlaceDetail returns PlaceDetailModel', () async {
      when(() => mockDatasource.getPlaceDetail(any())).thenAnswer((_) async => {
        'place': {'id': '1', 'name': 'Place'}
      });

      final result = await repository.getPlaceDetail('1');

      expect(result.id, '1');
    });

    group('Error Handling', () {
      test('getPlaces should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getPlaces(
          categoryId: any(named: 'categoryId'),
          isFree: any(named: 'isFree'),
          sort: any(named: 'sort'),
          userLat: any(named: 'userLat'),
          userLng: any(named: 'userLng'),
        )).thenAnswer((_) async => {'places': 'invalid'});
        expect(() => repository.getPlaces(), throwsA(isA<UnknownException>()));
      });

      test('getPlaceDetail should throw UnknownException on parse error', () async {
        when(() => mockDatasource.getPlaceDetail(any())).thenAnswer((_) async => {'place': 'invalid'});
        expect(() => repository.getPlaceDetail('1'), throwsA(isA<UnknownException>()));
      });

      test('getPlaces should rethrow DioException', () async {
        when(() => mockDatasource.getPlaces(
          categoryId: any(named: 'categoryId'),
          isFree: any(named: 'isFree'),
          sort: any(named: 'sort'),
          userLat: any(named: 'userLat'),
          userLng: any(named: 'userLng'),
        )).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.getPlaces(), throwsA(isA<DioException>()));
      });
    });
  });
}
