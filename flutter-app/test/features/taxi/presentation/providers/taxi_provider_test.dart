import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/taxi/presentation/providers/taxi_provider.dart';
import 'package:kadirliapp/features/taxi/data/repositories/taxi_repository.dart';
import 'package:kadirliapp/features/taxi/data/models/taxi_model.dart';

class MockTaxiRepository extends Mock implements TaxiRepository {}

void main() {
  group('Taxi Providers', () {
    late MockTaxiRepository mockRepository;

    setUp(() {
      mockRepository = MockTaxiRepository();
    });

    test('taxiDriversProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          taxiRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getDrivers()).thenAnswer((_) async => <TaxiDriverModel>[]);

      final result = await container.read(taxiDriversProvider.future);

      expect(result, isEmpty);
      verify(() => mockRepository.getDrivers()).called(1);
    });
  });
}
