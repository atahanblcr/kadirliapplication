import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/notifications_provider.dart';

class NotificationsPage extends ConsumerStatefulWidget {
  const NotificationsPage({Key? key}) : super(key: key);

  @override
  ConsumerState<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends ConsumerState<NotificationsPage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      final state = ref.read(notificationsProvider);
      if (!state.isLoading && !state.isLoadingMore && state.hasNext) {
        ref.read(notificationsProvider.notifier).fetchNotifications();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(notificationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bildirimler'),
        actions: [
          if (state.unreadCount > 0)
            IconButton(
              icon: const Icon(Icons.done_all),
              tooltip: 'Tümünü Okundu İşaretle',
              onPressed: () {
                ref.read(notificationsProvider.notifier).markAllAsRead();
              },
            ),
        ],
      ),
      body: _buildBody(state),
    );
  }

  Widget _buildBody(NotificationsState state) {
    if (state.isLoading && state.notifications.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.error != null && state.notifications.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: Colors.red, size: 48),
            const SizedBox(height: 16),
            Text(state.error!),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                ref.read(notificationsProvider.notifier).fetchNotifications(refresh: true);
              },
              child: const Text('Tekrar Dene'),
            ),
          ],
        ),
      );
    }

    if (state.notifications.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.notifications_off, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'Hiç bildiriminiz yok',
              style: TextStyle(color: Colors.grey, fontSize: 16),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        await ref.read(notificationsProvider.notifier).fetchNotifications(refresh: true);
      },
      child: ListView.builder(
        controller: _scrollController,
        itemCount: state.notifications.length + (state.isLoadingMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == state.notifications.length) {
            return const Padding(
              padding: EdgeInsets.all(16.0),
              child: Center(child: CircularProgressIndicator()),
            );
          }

          final notification = state.notifications[index];
          return ListTile(
            leading: CircleAvatar(
              backgroundColor: notification.isRead ? Colors.grey[200] : Colors.blue[100],
              child: Icon(
                _getIconForType(notification.type),
                color: notification.isRead ? Colors.grey : Colors.blue,
              ),
            ),
            title: Text(
              notification.title,
              style: TextStyle(
                fontWeight: notification.isRead ? FontWeight.normal : FontWeight.bold,
              ),
            ),
            subtitle: Text(
              notification.body,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            onTap: () {
              if (!notification.isRead) {
                ref.read(notificationsProvider.notifier).markAsRead(notification.id);
              }
              // Gelecekte relatedType'a göre ilgili sayfaya yönlendirme yapılabilir
            },
          );
        },
      ),
    );
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'ad_approved':
      case 'ad_rejected':
        return Icons.shopping_bag;
      case 'announcement':
        return Icons.campaign;
      case 'death':
        return Icons.sentiment_very_dissatisfied;
      case 'campaign':
        return Icons.local_offer;
      default:
        return Icons.notifications;
    }
  }
}
