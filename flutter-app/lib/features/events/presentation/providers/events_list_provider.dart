import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/event_model.dart';
import 'events_provider.dart';

class EventsListState {
  final List<EventModel> events;
  final bool isLoading;
  final bool hasNext;
  final String? error;
  final int page;
  final String? categoryId;
  final String? city;

  EventsListState({
    this.events = const [],
    this.isLoading = false,
    this.hasNext = true,
    this.error,
    this.page = 1,
    this.categoryId,
    this.city,
  });

  EventsListState copyWith({
    List<EventModel>? events,
    bool? isLoading,
    bool? hasNext,
    String? error,
    int? page,
    String? categoryId,
    String? city,
  }) {
    return EventsListState(
      events: events ?? this.events,
      isLoading: isLoading ?? this.isLoading,
      hasNext: hasNext ?? this.hasNext,
      error: error, // Intentional reset on success
      page: page ?? this.page,
      categoryId: categoryId ?? this.categoryId,
      city: city ?? this.city,
    );
  }
}

class EventsListNotifier extends StateNotifier<EventsListState> {
  final Ref ref;

  EventsListNotifier(this.ref) : super(EventsListState()) {
    loadMore();
  }

  void setFilters({String? categoryId, String? city}) {
    state = state.copyWith(
      categoryId: categoryId,
      city: city,
      page: 1,
      events: [],
      hasNext: true,
      error: null,
    );
    loadMore();
  }

  Future<void> loadMore({bool refresh = false}) async {
    if (state.isLoading || (!state.hasNext && !refresh)) return;

    if (refresh) {
      state = state.copyWith(
        isLoading: true,
        page: 1,
        hasNext: true,
        error: null,
      );
    } else {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final repository = ref.read(eventsRepositoryProvider);
      final response = await repository.getEvents(
        page: state.page,
        categoryId: state.categoryId,
        city: state.city,
      );
      
      final newEvents = response['events'] as List<EventModel>;
      final meta = response['meta'] as Map<String, dynamic>;
      final hasNext = meta['has_next'] ?? false;

      state = state.copyWith(
        events: refresh ? newEvents : [...state.events, ...newEvents],
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

final eventsListNotifierProvider = StateNotifierProvider.autoDispose<EventsListNotifier, EventsListState>((ref) {
  return EventsListNotifier(ref);
});
