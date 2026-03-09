import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/notification_model.dart';
import '../../data/repositories/notifications_repository.dart';

final notificationsRepositoryProvider = Provider<NotificationsRepository>((ref) {
  return NotificationsRepository();
});

class NotificationsState {
  final bool isLoading;
  final String? error;
  final List<NotificationModel> notifications;
  final int unreadCount;
  final int currentPage;
  final bool hasNext;
  final bool isLoadingMore;

  NotificationsState({
    this.isLoading = false,
    this.error,
    this.notifications = const [],
    this.unreadCount = 0,
    this.currentPage = 1,
    this.hasNext = false,
    this.isLoadingMore = false,
  });

  NotificationsState copyWith({
    bool? isLoading,
    String? error,
    List<NotificationModel>? notifications,
    int? unreadCount,
    int? currentPage,
    bool? hasNext,
    bool? isLoadingMore,
  }) {
    return NotificationsState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      notifications: notifications ?? this.notifications,
      unreadCount: unreadCount ?? this.unreadCount,
      currentPage: currentPage ?? this.currentPage,
      hasNext: hasNext ?? this.hasNext,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    );
  }
}

class NotificationsNotifier extends StateNotifier<NotificationsState> {
  final NotificationsRepository _repository;

  NotificationsNotifier(this._repository) : super(NotificationsState()) {
    fetchNotifications();
  }

  Future<void> fetchNotifications({bool refresh = false}) async {
    if (state.isLoading || state.isLoadingMore) return;

    if (refresh) {
      state = state.copyWith(isLoading: true, error: null, currentPage: 1, hasNext: false);
    } else if (!state.hasNext && state.notifications.isNotEmpty) {
      return;
    } else if (state.notifications.isEmpty) {
      state = state.copyWith(isLoading: true, error: null);
    } else {
      state = state.copyWith(isLoadingMore: true, error: null);
    }

    try {
      final response = await _repository.getNotifications(
        page: state.currentPage,
      );

      final isFirstPage = state.currentPage == 1;

      state = state.copyWith(
        isLoading: false,
        isLoadingMore: false,
        notifications: isFirstPage
            ? response.notifications
            : [...state.notifications, ...response.notifications],
        unreadCount: response.unreadCount,
        hasNext: response.hasNext,
        currentPage: isFirstPage ? 2 : state.currentPage + 1,
      );
    } catch (e) {
      print('Error fetching notifications: $e');
      state = state.copyWith(
        isLoading: false,
        isLoadingMore: false,
        error: e.toString(),
      );
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _repository.markAsRead(id);
      final index = state.notifications.indexWhere((n) => n.id == id);
      if (index != -1 && !state.notifications[index].isRead) {
        final updatedNotifications = [...state.notifications];
        updatedNotifications[index] = updatedNotifications[index].copyWith(isRead: true);
        state = state.copyWith(
          notifications: updatedNotifications,
          unreadCount: (state.unreadCount - 1).clamp(0, 9999),
        );
      }
    } catch (e) {
      // Handle error gracefully, maybe a snackbar in UI
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _repository.markAllAsRead();
      final updatedNotifications = state.notifications.map((n) => n.copyWith(isRead: true)).toList();
      state = state.copyWith(
        notifications: updatedNotifications,
        unreadCount: 0,
      );
    } catch (e) {
      // Handle error gracefully
    }
  }
}

final notificationsProvider =
    StateNotifierProvider<NotificationsNotifier, NotificationsState>((ref) {
  final repository = ref.watch(notificationsRepositoryProvider);
  return NotificationsNotifier(repository);
});
