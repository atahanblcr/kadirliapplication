import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/guide/presentation/providers/guide_provider.dart';
import 'package:kadirliapp/features/guide/data/repositories/guide_repository.dart';
import 'package:kadirliapp/features/guide/data/models/guide_model.dart';

class MockGuideRepository extends Mock implements GuideRepository {}

void main() {
  group('Guide Providers', () {
    late MockGuideRepository mockRepository;

    setUp(() {
      mockRepository = MockGuideRepository();
    });

    test('guideCategoriesProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          guideRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getCategories()).thenAnswer((_) async => <GuideCategoryModel>[]);

      final result = await container.read(guideCategoriesProvider.future);

      expect(result, isEmpty);
      verify(() => mockRepository.getCategories()).called(1);
    });

    test('guideItemsProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          guideRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final filter = GuideFilter(categoryId: '1', search: 'test');
      when(() => mockRepository.getGuideItems(
        categoryId: '1',
        search: 'test',
      )).thenAnswer((_) async => <GuideItemModel>[]);

      final result = await container.read(guideItemsProvider(filter).future);

      expect(result, isEmpty);
      verify(() => mockRepository.getGuideItems(categoryId: '1', search: 'test')).called(1);
    });

    test('guideItemsProvider should handle failure', () async {
      final container = ProviderContainer(
        overrides: [
          guideRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final filter = GuideFilter();
      when(() => mockRepository.getGuideItems()).thenThrow(Exception('error'));

      expect(container.read(guideItemsProvider(filter).future), throwsException);
    });
  });
}
