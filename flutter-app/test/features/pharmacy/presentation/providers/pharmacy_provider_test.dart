import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/pharmacy/presentation/providers/pharmacy_provider.dart';
import 'package:kadirliapp/features/pharmacy/data/repositories/pharmacy_repository.dart';
import 'package:kadirliapp/features/pharmacy/data/models/pharmacy_model.dart';

class MockPharmacyRepository extends Mock implements PharmacyRepository {}

void main() {
  group('Pharmacy Providers', () {
    late MockPharmacyRepository mockRepository;

    setUp(() {
      mockRepository = MockPharmacyRepository();
    });

    test('currentPharmacyProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          pharmacyRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getCurrentPharmacy()).thenAnswer((_) async => null);

      final result = await container.read(currentPharmacyProvider.future);

      expect(result, isNull);
      verify(() => mockRepository.getCurrentPharmacy()).called(1);
    });

    test('pharmacyScheduleProvider should call repository with correct dates', () async {
      final container = ProviderContainer(
        overrides: [
          pharmacyRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final month = DateTime(2026, 3);
      when(() => mockRepository.getSchedule(
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      )).thenAnswer((_) async => []);

      final result = await container.read(pharmacyScheduleProvider(month).future);

      expect(result, isEmpty);
      verify(() => mockRepository.getSchedule(
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      )).called(1);
    });

    test('PharmaciesListNotifier loadMore success', () async {
      final container = ProviderContainer(
        overrides: [
          pharmacyRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final pharmacy = PharmacyModel(id: '1', name: 'P', address: 'A', phone: '1', dutyHours: 'H');
      when(() => mockRepository.getPharmacies(page: 1)).thenAnswer((_) async => {
        'pharmacies': [pharmacy],
        'meta': {'has_next': true}
      });

      final notifier = container.read(pharmaciesListNotifierProvider.notifier);
      await notifier.loadMore(refresh: true);

      expect(container.read(pharmaciesListNotifierProvider).pharmacies.length, 1);
      expect(container.read(pharmaciesListNotifierProvider).hasNext, true);
    });

    test('PharmaciesListNotifier failure sets error', () async {
      final container = ProviderContainer(
        overrides: [
          pharmacyRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getPharmacies(page: 1)).thenThrow(Exception('error'));

      final notifier = container.read(pharmaciesListNotifierProvider.notifier);
      await notifier.loadMore(refresh: true);

      expect(container.read(pharmaciesListNotifierProvider).error, contains('error'));
    });

    test('PharmaciesListNotifier refresh success', () async {
      final container = ProviderContainer(
        overrides: [
          pharmacyRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getPharmacies(page: 1)).thenAnswer((_) async => {
        'pharmacies': <PharmacyModel>[],
        'meta': {'has_next': false}
      });

      await container.read(pharmaciesListNotifierProvider.notifier).refresh();

      verify(() => mockRepository.getPharmacies(page: 1)).called(greaterThanOrEqualTo(1));
    });
  });
}
