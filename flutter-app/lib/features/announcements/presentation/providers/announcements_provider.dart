import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/announcement_model.dart';
import '../../data/repositories/announcements_repository.dart';

/// Announcements list state
class AnnouncementsState {
  final List<AnnouncementModel> items;
  final bool isLoading; // Initial load
  final bool isLoadingMore; // Pagination
  final String? error;
  final int currentPage;
  final int totalPages;

  AnnouncementsState({
    required this.items,
    required this.isLoading,
    required this.isLoadingMore,
    this.error,
    required this.currentPage,
    required this.totalPages,
  });

  /// Check if there are more pages to load
  bool get hasMore => currentPage < totalPages;

  /// Copy with method for immutable updates
  AnnouncementsState copyWith({
    List<AnnouncementModel>? items,
    bool? isLoading,
    bool? isLoadingMore,
    String? error,
    int? currentPage,
    int? totalPages,
  }) {
    return AnnouncementsState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: error ?? this.error,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
    );
  }
}

/// Announcements state notifier - handles list pagination
class AnnouncementsNotifier extends StateNotifier<AnnouncementsState> {
  final AnnouncementsRepository _repository;

  AnnouncementsNotifier(this._repository)
      : super(
          AnnouncementsState(
            items: [],
            isLoading: false,
            isLoadingMore: false,
            error: null,
            currentPage: 1,
            totalPages: 1,
          ),
        );

  /// Load announcements (initial load)
  Future<void> loadAnnouncements({int page = 1}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final result = await _repository.getAnnouncements(page: page, limit: 20);
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

  /// Load more announcements (infinite scroll)
  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore) return;

    state = state.copyWith(isLoadingMore: true);
    try {
      final nextPage = state.currentPage + 1;
      final result = await _repository.getAnnouncements(
        page: nextPage,
        limit: 20,
      );
      state = state.copyWith(
        items: [...state.items, ...result.items],
        isLoadingMore: false,
        currentPage: nextPage,
        totalPages: result.totalPages,
      );
    } catch (e) {
      state = state.copyWith(isLoadingMore: false);
      // Error silently - show loading indicator only
    }
  }

  /// Refresh announcements (pull-to-refresh)
  Future<void> refresh() async {
    await loadAnnouncements(page: 1);
  }

  /// Clear error
  void clearError() {
    state = state.copyWith(error: null);
  }
}

// Providers

/// Repository provider
final announcementsRepositoryProvider =
    Provider<AnnouncementsRepository>((ref) {
  return AnnouncementsRepository();
});

/// State notifier provider - list state + pagination
final announcementsProvider =
    StateNotifierProvider<AnnouncementsNotifier, AnnouncementsState>((ref) {
  final repository = ref.watch(announcementsRepositoryProvider);
  return AnnouncementsNotifier(repository);
});

/// Detail provider - single announcement by ID
/// Uses autoDispose to clean up when page is closed
/// Uses family to cache based on ID
final announcementDetailProvider =
    FutureProvider.autoDispose.family<AnnouncementModel, String>((ref, id) async {
  final repository = ref.watch(announcementsRepositoryProvider);
  return repository.getAnnouncementById(id);
});
