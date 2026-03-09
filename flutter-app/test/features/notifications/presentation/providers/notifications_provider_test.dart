import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kadirliapp/features/notifications/data/models/notification_model.dart';
import 'package:kadirliapp/features/notifications/data/repositories/notifications_repository.dart';
import 'package:kadirliapp/features/notifications/presentation/providers/notifications_provider.dart';

class MockNotificationsRepository extends NotificationsRepository {
  @override
  Future<NotificationsResponse> getNotifications({int page = 1, int limit = 20, bool unreadOnly = false}) async {
    return NotificationsResponse(
      notifications: [
        NotificationModel(
          id: '1',
          title: 'Test',
          body: 'Body',
          type: 'Type',
          isRead: false,
          createdAt: DateTime.now(),
        ),
      ],
      unreadCount: 1,
      page: 1,
      totalPages: 1,
      hasNext: false,
    );
  }

  @override
  Future<void> markAsRead(String id) async {}

  @override
  Future<void> markAllAsRead() async {}
}

void main() {
  test('NotificationsNotifier fetches initial data', () async {
    final container = ProviderContainer(
      overrides: [
        notificationsRepositoryProvider.overrideWithValue(MockNotificationsRepository()),
      ],
    );
    addTearDown(container.dispose);

    // Read once to initialize
    container.read(notificationsProvider);

    // Give it time to fetch since it's called in constructor
    container.read(notificationsProvider);
    await Future.delayed(const Duration(milliseconds: 100));

    final state = container.read(notificationsProvider);
    expect(state.isLoading, false);
    expect(state.notifications.length, 1);
    expect(state.unreadCount, 1);
  });

  test('markAsRead updates state', () async {
    final container = ProviderContainer(
      overrides: [
        notificationsRepositoryProvider.overrideWithValue(MockNotificationsRepository()),
      ],
    );
    addTearDown(container.dispose);

    container.read(notificationsProvider);
    await Future.delayed(const Duration(milliseconds: 100));

    final notifier = container.read(notificationsProvider.notifier);
    await notifier.markAsRead('1');

    final state = container.read(notificationsProvider);
    expect(state.notifications.first.isRead, true);
    expect(state.unreadCount, 0);
  });

  test('markAllAsRead updates state', () async {
    final container = ProviderContainer(
      overrides: [
        notificationsRepositoryProvider.overrideWithValue(MockNotificationsRepository()),
      ],
    );
    addTearDown(container.dispose);

    container.read(notificationsProvider);
    await Future.delayed(const Duration(milliseconds: 100));

    final notifier = container.read(notificationsProvider.notifier);
    await notifier.markAllAsRead();

    final state = container.read(notificationsProvider);
    expect(state.notifications.every((n) => n.isRead), true);
    expect(state.unreadCount, 0);
  });
}
