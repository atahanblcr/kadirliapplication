import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/death_model.dart';
import 'deaths_provider.dart';

class DeathsListState {
  final List<DeathNoticeModel> notices;
  final bool isLoading;
  final bool hasNext;
  final String? error;
  final int page;

  DeathsListState({
    this.notices = const [],
    this.isLoading = false,
    this.hasNext = true,
    this.error,
    this.page = 1,
  });

  DeathsListState copyWith({
    List<DeathNoticeModel>? notices,
    bool? isLoading,
    bool? hasNext,
    String? error,
    int? page,
  }) {
    return DeathsListState(
      notices: notices ?? this.notices,
      isLoading: isLoading ?? this.isLoading,
      hasNext: hasNext ?? this.hasNext,
      error: error ?? this.error,
      page: page ?? this.page,
    );
  }
}

class DeathsListNotifier extends StateNotifier<DeathsListState> {
  final Ref ref;

  DeathsListNotifier(this.ref) : super(DeathsListState()) {
    loadMore();
  }

  Future<void> loadMore({bool refresh = false}) async {
    if (state.isLoading || (!state.hasNext && !refresh)) return;

    if (refresh) {
      state = DeathsListState(isLoading: true);
    } else {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final repository = ref.read(deathsRepositoryProvider);
      final response = await repository.getDeaths(page: state.page);
      
      final newNotices = response['notices'] as List<DeathNoticeModel>;
      final meta = response['meta'] as Map<String, dynamic>;
      final hasNext = meta['has_next'] ?? false;

      state = state.copyWith(
        notices: refresh ? newNotices : [...state.notices, ...newNotices],
        isLoading: false,
        hasNext: hasNext,
        page: state.page + 1,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refresh() => loadMore(refresh: true);
}

final deathsListNotifierProvider = StateNotifierProvider.autoDispose<DeathsListNotifier, DeathsListState>((ref) {
  return DeathsListNotifier(ref);
});
