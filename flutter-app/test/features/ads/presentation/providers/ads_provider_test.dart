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

  group('AdsNotifier', () {
    test('initial state is correct', () {
      expect(notifier.state.items, isEmpty);
      expect(notifier.state.isLoading, false);
    });

    test('loadAds success', () async {
      final ads = [
        AdModel(
          id: '1',
          title: 'Test',
          description: 'Desc',
          price: 100,
          category: CategoryModel(id: '1', name: 'Cat', slug: 'cat'),
          imagesCount: 0,
          viewCount: 0,
          createdAt: DateTime.now(),
          expiresAt: DateTime.now(),
        )
      ];
      
      when(() => mockRepository.getAds(
        page: any(named: 'page'),
        limit: any(named: 'limit'),
        categoryId: any(named: 'categoryId'),
        minPrice: any(named: 'minPrice'),
        maxPrice: any(named: 'maxPrice'),
        search: any(named: 'search'),
        sort: any(named: 'sort'),
      )).thenAnswer((_) async => (items: ads, total: 1, totalPages: 1));

      await notifier.loadAds();

      expect(notifier.state.items.length, 1);
      expect(notifier.state.isLoading, false);
    });

    test('updateFilters changes state and reloads', () async {
      when(() => mockRepository.getAds(
        page: any(named: 'page'),
        limit: any(named: 'limit'),
        categoryId: any(named: 'categoryId'),
        minPrice: any(named: 'minPrice'),
        maxPrice: any(named: 'maxPrice'),
        search: any(named: 'search'),
        sort: any(named: 'sort'),
      )).thenAnswer((_) async => (items: <AdModel>[], total: 0, totalPages: 1));

      notifier.updateFilters(search: 'query');

      expect(notifier.state.search, 'query');
      verify(() => mockRepository.getAds(
        page: 1,
        limit: 20,
        search: 'query',
        categoryId: any(named: 'categoryId'),
        minPrice: any(named: 'minPrice'),
        maxPrice: any(named: 'maxPrice'),
        sort: any(named: 'sort'),
      )).called(1);
      });

      test('loadMore success', () async {
      notifier.state = notifier.state.copyWith(currentPage: 1, totalPages: 2);

      when(() => mockRepository.getAds(
        page: 2,
        limit: any(named: 'limit'),
        categoryId: any(named: 'categoryId'),
        minPrice: any(named: 'minPrice'),
        maxPrice: any(named: 'maxPrice'),
        search: any(named: 'search'),
        sort: any(named: 'sort'),
      )).thenAnswer((_) async => (items: <AdModel>[], total: 0, totalPages: 2));

      await notifier.loadMore();

      expect(notifier.state.currentPage, 2);
      expect(notifier.state.isLoadingMore, false);
      });

      test('loadAds failure sets error', () async {
      when(() => mockRepository.getAds(
        page: any(named: 'page'),
        limit: any(named: 'limit'),
        categoryId: any(named: 'categoryId'),
        minPrice: any(named: 'minPrice'),
        maxPrice: any(named: 'maxPrice'),
        search: any(named: 'search'),
        sort: any(named: 'sort'),
      )).thenThrow(Exception('error'));

      await notifier.loadAds();

      expect(notifier.state.error, contains('error'));
      expect(notifier.state.isLoading, false);
      });

      test('createAd success', () async {
      when(() => mockRepository.createAd(any())).thenAnswer((_) async => AdModel(
        id: '1', title: 'T', description: 'D', price: 1, 
        category: CategoryModel(id: '1', name: 'C', slug: 's'),
        imagesCount: 0, viewCount: 0, createdAt: DateTime.now(), expiresAt: DateTime.now()
      ));

      final result = await notifier.createAd({'title': 'test'});

      expect(result, true);
      expect(notifier.state.isSubmitting, false);
      expect(notifier.state.isSuccess, true);
      });

      test('updateAd success', () async {
      when(() => mockRepository.updateAd(any(), any())).thenAnswer((_) async => AdModel(
        id: '1', title: 'T', description: 'D', price: 1, 
        category: CategoryModel(id: '1', name: 'C', slug: 's'),
        imagesCount: 0, viewCount: 0, createdAt: DateTime.now(), expiresAt: DateTime.now()
      ));

      final result = await notifier.updateAd('1', {'title': 'test'});

      expect(result, true);
      expect(notifier.state.isSuccess, true);
      });

      test('deleteAd success', () async {
        when(() => mockRepository.deleteAd(any())).thenAnswer((_) async => true);

        final result = await notifier.deleteAd('1');

        expect(result, true);
        });

        test('createAd failure sets error', () async {
        when(() => mockRepository.createAd(any())).thenThrow(Exception('create error'));
        final result = await notifier.createAd({});
        expect(result, false);
        expect(notifier.state.error, contains('create error'));
        });

        test('updateAd failure sets error', () async {
        when(() => mockRepository.updateAd(any(), any())).thenThrow(Exception('update error'));
        final result = await notifier.updateAd('1', {});
        expect(result, false);
        expect(notifier.state.error, contains('update error'));
        });

        test('deleteAd failure sets error', () async {
        when(() => mockRepository.deleteAd(any())).thenThrow(Exception('delete error'));
        final result = await notifier.deleteAd('1');
        expect(result, false);
        expect(notifier.state.error, contains('delete error'));
        });

        group('FavoritesNotifier', () {      test('toggleFavorite adds/removes from state', () async {
        final favoritesNotifier = FavoritesNotifier(mockRepository);
        when(() => mockRepository.toggleFavorite(any(), any())).thenAnswer((_) async => true);

        await favoritesNotifier.toggleFavorite('1', false);
        expect(favoritesNotifier.state.contains('1'), true);

        await favoritesNotifier.toggleFavorite('1', true);
        expect(favoritesNotifier.state.contains('1'), false);
      });

      test('toggleFavorite handles error silently', () async {
        final favoritesNotifier = FavoritesNotifier(mockRepository);
        when(() => mockRepository.toggleFavorite(any(), any())).thenThrow(Exception());

        await favoritesNotifier.toggleFavorite('1', false);
        expect(favoritesNotifier.state.contains('1'), false);
      });
    });
  });
}
