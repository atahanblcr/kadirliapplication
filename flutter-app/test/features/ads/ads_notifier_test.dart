import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/ads/presentation/providers/ads_provider.dart';
import 'package:kadirliapp/features/ads/data/repositories/ads_repository.dart';
import 'package:kadirliapp/features/ads/data/models/ad_model.dart';
import 'package:kadirliapp/features/ads/data/models/category_model.dart';

class MockAdsRepository extends Mock implements AdsRepository {}

void main() {
  late AdsNotifier notifier;
  late MockAdsRepository mockRepository;

  setUp(() {
    mockRepository = MockAdsRepository();
    notifier = AdsNotifier(mockRepository);
  });

  group('AdsNotifier Tests', () {
    final mockAd = AdModel(
      id: '1',
      title: 'Test Ad',
      description: 'Desc',
      price: 100,
      category: CategoryModel(id: 'c1', name: 'Cat', slug: 'cat'),
      imagesCount: 0,
      viewCount: 0,
      createdAt: DateTime.now(),
      expiresAt: DateTime.now(),
    );

    test('initial state should be empty and not loading', () {
      expect(notifier.state.items, isEmpty);
      expect(notifier.state.isLoading, false);
    });

    test('loadAds should update state with items', () async {
      when(() => mockRepository.getAds(
            page: any(named: 'page'),
            limit: any(named: 'limit'),
            categoryId: any(named: 'categoryId'),
            search: any(named: 'search'),
            sort: any(named: 'sort'),
          )).thenAnswer((_) async => (items: [mockAd], total: 1, totalPages: 1));

      await notifier.loadAds();

      expect(notifier.state.items.length, 1);
      expect(notifier.state.isLoading, false);
      expect(notifier.state.items.first.title, 'Test Ad');
    });

    test('createAd success should update success state', () async {
      when(() => mockRepository.createAd(any())).thenAnswer((_) async => mockAd);
      when(() => mockRepository.getAds(
            page: any(named: 'page'),
            limit: any(named: 'limit'),
          )).thenAnswer((_) async => (items: [mockAd], total: 1, totalPages: 1));

      final result = await notifier.createAd({'title': 'New'});

      expect(result, true);
      expect(notifier.state.isSuccess, true);
    });
  });
}
