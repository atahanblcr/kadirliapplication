import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/models/announcement_model.dart';
import '../../../../core/constants/app_spacing.dart';
import 'priority_badge.dart';

/// Announcement list item card
/// Shows: icon, type, title, body preview, date, view count
class AnnouncementCard extends StatelessWidget {
  final AnnouncementModel announcement;
  final VoidCallback onTap;

  const AnnouncementCard({
    required this.announcement,
    required this.onTap,
    super.key,
  });

  /// Format date to Turkish format (e.g., "10 Şub 2026")
  String _formatDate(DateTime date) {
    try {
      return DateFormat('d MMM yyyy', 'tr_TR').format(date);
    } catch (_) {
      return DateFormat('d/M/y').format(date);
    }
  }

  /// Format view count (1234 → "1.2K")
  String _formatViewCount(int count) {
    if (count < 1000) return count.toString();
    if (count < 1000000) {
      return '${(count / 1000).toStringAsFixed(1)}K'.replaceAll('.0K', 'K');
    }
    return '${(count / 1000000).toStringAsFixed(1)}M'.replaceAll('.0M', 'M');
  }

  @override
  Widget build(BuildContext context) {
    // Reduce opacity if viewed
    final opacity = announcement.isViewed ? 0.65 : 1.0;

    return Opacity(
      opacity: opacity,
      child: Card(
        margin: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Left icon container
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: announcement.type?.typeColor ?? Colors.blue,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Icon(
                      announcement.type?.iconData ?? Icons.campaign,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Type name + priority badge row
                      Row(
                        children: [
                          Text(
                            announcement.type?.name ?? 'Duyuru',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          PriorityBadge(
                            priority: announcement.priority,
                            small: true,
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      // Title
                      Text(
                        announcement.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      // Body preview
                      Text(
                        announcement.body,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      // Meta: date + view count
                      Row(
                        children: [
                          Icon(
                            Icons.calendar_today,
                            size: 14,
                            color: Colors.grey[500],
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _formatDate(announcement.createdAt),
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[500],
                            ),
                          ),
                          const Spacer(),
                          Icon(
                            Icons.visibility,
                            size: 14,
                            color: Colors.grey[500],
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _formatViewCount(announcement.viewCount),
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[500],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
