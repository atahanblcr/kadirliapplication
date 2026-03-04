import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/ad_model.dart';
import '../../data/models/category_model.dart';
import '../../data/repositories/ads_repository.dart';

/// Ads list state with filters, pagination and CRUD status
class AdsState {
  final List<AdModel> items;
  final bool isLoading;
  final bool isLoadingMore;
  final bool isSubmitting;
  final bool isSuccess;
  final String? error;
  final int currentPage;
  final int totalPages;
  
  // Filters
  final String? categoryId;
  final int? minPrice;
  final int? maxPrice;
  final String? search;
  final String? sort;

  AdsState({
    required this.items,
    required this.isLoading,
    required this.isLoadingMore,
    this.isSubmitting = false,
    this.isSuccess = false,
    this.error,
    required this.currentPage,
    required this.totalPages,
    this.categoryId,
    this.minPrice,
    this.maxPrice,
    this.search,
    this.sort,
  });

  bool get hasMore => currentPage < totalPages;

  AdsState copyWith({
    List<AdModel>? items,
    bool? isLoading,
    bool? isLoadingMore,
    bool? isSubmitting,
    bool? isSuccess,
    String? error,
    int? currentPage,
    int? totalPages,
    String? categoryId,
    int? minPrice,
    int? maxPrice,
    String? search,
    String? sort,
    bool clearCategoryId = false,
    bool clearMinPrice = false,
    bool clearMaxPrice = false,
    bool clearSearch = false,
    bool clearSort = false,
  }) {
    return AdsState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      isSuccess: isSuccess ?? this.isSuccess,
      error: error ?? this.error,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      categoryId: clearCategoryId ? null : (categoryId ?? this.categoryId),
      minPrice: clearMinPrice ? null : (minPrice ?? this.minPrice),
      maxPrice: clearMaxPrice ? null : (maxPrice ?? this.maxPrice),
      search: clearSearch ? null : (search ?? this.search),
      sort: clearSort ? null : (sort ?? this.sort),
    );
  }
}

/// Ads state notifier - handles list, pagination, filters, and CRUD
class AdsNotifier extends StateNotifier<AdsState> {
  final AdsRepository _repository;

  AdsNotifier(this._repository)
      : super(
          AdsState(
            items: [],
            isLoading: false,
            isLoadingMore: false,
            error: null,
            currentPage: 1,
            totalPages: 1,
          ),
        );

  /// Initial load or filter change
  Future<void> loadAds({int page = 1}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final result = await _repository.getAds(
        page: page,
        limit: 20,
        categoryId: state.categoryId,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        search: state.search,
        sort: state.sort,
      );
      state = state.copyWith(
        items: result.items,
        isLoading: false,
        currentPage: page,
        totalPages: result.totalPages,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Load more (pagination)
  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore) return;

    state = state.copyWith(isLoadingMore: true);
    try {
      final nextPage = state.currentPage + 1;
      final result = await _repository.getAds(
        page: nextPage,
        limit: 20,
        categoryId: state.categoryId,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        search: state.search,
        sort: state.sort,
      );
      state = state.copyWith(
        items: [...state.items, ...result.items],
        isLoadingMore: false,
        currentPage: nextPage,
        totalPages: result.totalPages,
      );
    } catch (e) {
      state = state.copyWith(isLoadingMore: false);
    }
  }

  /// Create Ad
  Future<bool> createAd(Map<String, dynamic> data) async {
    state = state.copyWith(isSubmitting: true, error: null, isSuccess: false);
    try {
      await _repository.createAd(data);
      state = state.copyWith(isSubmitting: false, isSuccess: true);
      refresh();
      return true;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, error: e.toString());
      return false;
    }
  }

  /// Update Ad
  Future<bool> updateAd(String id, Map<String, dynamic> data) async {
    state = state.copyWith(isSubmitting: true, error: null, isSuccess: false);
    try {
      await _repository.updateAd(id, data);
      state = state.copyWith(isSubmitting: false, isSuccess: true);
      refresh();
      return true;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, error: e.toString());
      return false;
    }
  }

  /// Delete Ad
  Future<bool> deleteAd(String id) async {
    try {
      await _repository.deleteAd(id);
      refresh();
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }

  /// Update filters and reload
  void updateFilters({
    String? categoryId,
    int? minPrice,
    int? maxPrice,
    String? search,
    String? sort,
    bool clearCategoryId = false,
    bool clearMinPrice = false,
    bool clearMaxPrice = false,
    bool clearSearch = false,
    bool clearSort = false,
  }) {
    state = state.copyWith(
      categoryId: categoryId,
      minPrice: minPrice,
      maxPrice: maxPrice,
      search: search,
      sort: sort,
      clearCategoryId: clearCategoryId,
      clearMinPrice: clearMinPrice,
      clearMaxPrice: clearMaxPrice,
      clearSearch: clearSearch,
      clearSort: clearSort,
    );
    loadAds(page: 1);
  }

  Future<void> refresh() async {
    await loadAds(page: 1);
  }

  void resetStatus() {
    state = state.copyWith(isSubmitting: false, isSuccess: false, error: null);
  }
}

// Providers

final adsRepositoryProvider = Provider<AdsRepository>((ref) {
  return AdsRepository();
});

final adsProvider = StateNotifierProvider<AdsNotifier, AdsState>((ref) {
  final repository = ref.watch(adsRepositoryProvider);
  return AdsNotifier(repository);
});

final adDetailProvider = FutureProvider.autoDispose.family<AdModel, String>((ref, id) async {
  final repository = ref.watch(adsRepositoryProvider);
  return repository.getAdById(id);
});

final adCategoriesProvider = FutureProvider.autoDispose<List<CategoryModel>>((ref) async {
  final repository = ref.watch(adsRepositoryProvider);
  return repository.getCategories();
});

/// Category properties provider
final categoryPropertiesProvider = FutureProvider.autoDispose.family<({CategoryModel category, List<Map<String, dynamic>> properties}), String>((ref, categoryId) async {
  final repository = ref.watch(adsRepositoryProvider);
  return repository.getCategoryProperties(categoryId);
});

/// Simple favorites notifier for detail page toggle
class FavoritesNotifier extends StateNotifier<Set<String>> {
  final AdsRepository _repository;

  FavoritesNotifier(this._repository) : super({});

  Future<void> toggleFavorite(String id, bool isCurrentlyFavorite) async {
    try {
      await _repository.toggleFavorite(id, !isCurrentlyFavorite);
      if (isCurrentlyFavorite) {
        state = {...state}..remove(id);
      } else {
        state = {...state}..add(id);
      }
    } catch (e) {
      // Handle error
    }
  }

  void setFavorites(Set<String> ids) {
    state = ids;
  }
}

final favoritesProvider = StateNotifierProvider<FavoritesNotifier, Set<String>>((ref) {
  final repository = ref.watch(adsRepositoryProvider);
  return FavoritesNotifier(repository);
});
