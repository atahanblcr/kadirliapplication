import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/places/presentation/providers/places_provider.dart';
import 'package:kadirliapp/features/places/data/repositories/places_repository.dart';
import 'package:kadirliapp/features/places/data/models/place_model.dart';

class MockPlacesRepository extends Mock implements PlacesRepository {}

void main() {
  group('Places Providers', () {
    late MockPlacesRepository mockRepository;

    setUp(() {
      mockRepository = MockPlacesRepository();
    });

    test('placesProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          placesRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final filter = PlacesFilter();
      when(() => mockRepository.getPlaces(
        categoryId: any(named: 'categoryId'),
        isFree: any(named: 'isFree'),
        sort: any(named: 'sort'),
        userLat: any(named: 'userLat'),
        userLng: any(named: 'userLng'),
      )).thenAnswer((_) async => <PlaceModel>[]);

      final result = await container.read(placesProvider(filter).future);

      expect(result, isEmpty);
      verify(() => mockRepository.getPlaces(sort: 'name')).called(1);
    });

    test('placeDetailProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          placesRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final place = PlaceDetailModel(id: '1', name: 'Test');
      when(() => mockRepository.getPlaceDetail('1')).thenAnswer((_) async => place);

      final result = await container.read(placeDetailProvider('1').future);

      expect(result.id, '1');
      verify(() => mockRepository.getPlaceDetail('1')).called(1);
    });

    test('PlacesFilter equality and hashCode', () {
      final f1 = PlacesFilter(categoryId: '1', sort: 'name');
      final f2 = PlacesFilter(categoryId: '1', sort: 'name');
      final f3 = PlacesFilter(categoryId: '2', sort: 'name');

      expect(f1, f2);
      expect(f1.hashCode, f2.hashCode);
      expect(f1, isNot(f3));
    });

    test('placeDetailProvider should handle failure', () async {
      final container = ProviderContainer(
        overrides: [
          placesRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getPlaceDetail(any())).thenThrow(Exception('error'));

      expect(container.read(placeDetailProvider('1').future), throwsException);
    });
  });
}
