import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/deaths/presentation/providers/deaths_provider.dart';
import 'package:kadirliapp/features/deaths/data/repositories/deaths_repository.dart';
import 'package:kadirliapp/features/deaths/data/models/death_model.dart';

class MockDeathsRepository extends Mock implements DeathsRepository {}

void main() {
  group('Deaths Providers', () {
    late MockDeathsRepository mockRepository;

    setUp(() {
      mockRepository = MockDeathsRepository();
    });

    test('deathsProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          deathsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final filter = DeathsFilter(page: 1);
      when(() => mockRepository.getDeaths(page: 1)).thenAnswer((_) async => {'notices': [], 'meta': {}});

      final result = await container.read(deathsProvider(filter).future);

      expect(result['notices'], isEmpty);
      verify(() => mockRepository.getDeaths(page: 1)).called(1);
    });

    test('deathDetailProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          deathsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final notice = DeathNoticeDetailModel(
        id: '1',
        deceasedName: 'Test',
        funeralDate: '2026-03-03',
        funeralTime: '10:00',
        createdAt: DateTime.now(),
      );
      when(() => mockRepository.getDeathDetail('1')).thenAnswer((_) async => notice);

      final result = await container.read(deathDetailProvider('1').future);

      expect(result.id, '1');
      verify(() => mockRepository.getDeathDetail('1')).called(1);
    });

    test('cemeteriesProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          deathsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getCemeteries()).thenAnswer((_) async => []);

      final result = await container.read(cemeteriesProvider.future);

      expect(result, isEmpty);
      verify(() => mockRepository.getCemeteries()).called(1);
    });

    test('mosquesProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          deathsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getMosques()).thenAnswer((_) async => []);

      final result = await container.read(mosquesProvider.future);

      expect(result, isEmpty);
      verify(() => mockRepository.getMosques()).called(1);
    });
  });
}
