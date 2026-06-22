import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/notifications_provider.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/app_shimmer.dart';
import '../../../../core/widgets/app_empty_state.dart';
import '../../../../core/widgets/app_error_state.dart';

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
      return const ShimmerList();
    }

    if (state.error != null && state.notifications.isEmpty) {
      return AppErrorState(
        error: state.error!,
        onRetry: () => ref
            .read(notificationsProvider.notifier)
            .fetchNotifications(refresh: true),
      );
    }

    if (state.notifications.isEmpty) {
      return const AppEmptyState(
        icon: Icons.notifications_off_rounded,
        title: 'Hiç bildiriminiz yok',
        subtitle: 'Yeni bir şey olduğunda burada göreceksiniz.',
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        await ref
            .read(notificationsProvider.notifier)
            .fetchNotifications(refresh: true);
      },
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        itemCount: state.notifications.length + (state.isLoadingMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == state.notifications.length) {
            return const Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Center(child: CircularProgressIndicator()),
            );
          }

          final notification = state.notifications[index];
          return _NotificationTile(
            notification: notification,
            onTap: () {
              if (!notification.isRead) {
                ref
                    .read(notificationsProvider.notifier)
                    .markAsRead(notification.id);
              }
            },
          );
        },
      ),
    );
  }
}

/// Bildirim türüne göre ikon ve renk.
({IconData icon, Color color}) _notificationStyle(String type) {
  switch (type) {
    case 'ad_approved':
    case 'ad_rejected':
      return (icon: Icons.storefront_rounded, color: AppColors.gAds.first);
    case 'announcement':
      return (
        icon: Icons.campaign_rounded,
        color: AppColors.gAnnouncements.first
      );
    case 'death':
      return (
        icon: Icons.local_florist_rounded,
        color: AppColors.gDeaths.first
      );
    case 'campaign':
      return (
        icon: Icons.local_offer_rounded,
        color: AppColors.gCampaigns.first
      );
    default:
      return (icon: Icons.notifications_rounded, color: AppColors.primary);
  }
}

class _NotificationTile extends StatelessWidget {
  final dynamic notification;
  final VoidCallback onTap;

  const _NotificationTile({required this.notification, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final read = notification.isRead as bool;
    final style = _notificationStyle(notification.type as String);

    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.smLg,
        ),
        decoration: BoxDecoration(
          color: read ? null : AppColors.primary.withValues(alpha: 0.05),
          border: Border(
            bottom: BorderSide(color: cs.outlineVariant, width: 0.5),
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: style.color.withValues(alpha: read ? 0.10 : 0.16),
                borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              ),
              child: Icon(style.icon,
                  color: read ? AppColors.textHint : style.color, size: 22),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    notification.title as String,
                    style: AppTextStyles.titleMedium.copyWith(
                      color: cs.onSurface,
                      fontWeight: read ? FontWeight.w600 : FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    notification.body as String,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTextStyles.bodySmall
                        .copyWith(color: cs.onSurfaceVariant),
                  ),
                ],
              ),
            ),
            if (!read) ...[
              const SizedBox(width: AppSpacing.sm),
              Container(
                margin: const EdgeInsets.only(top: 6),
                width: 9,
                height: 9,
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
