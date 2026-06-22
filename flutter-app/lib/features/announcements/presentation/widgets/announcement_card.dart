import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/models/announcement_model.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import 'priority_badge.dart';

/// Duyuru liste kartı — ikon, tür, başlık, önizleme, tarih, görüntülenme.
class AnnouncementCard extends StatelessWidget {
  final AnnouncementModel announcement;
  final VoidCallback onTap;

  const AnnouncementCard({
    required this.announcement,
    required this.onTap,
    super.key,
  });

  String _formatDate(DateTime date) {
    try {
      return DateFormat('d MMM yyyy', 'tr_TR').format(date);
    } catch (_) {
      return DateFormat('d/M/y').format(date);
    }
  }

  String _formatViewCount(int count) {
    if (count < 1000) return count.toString();
    if (count < 1000000) {
      return '${(count / 1000).toStringAsFixed(1)}K'.replaceAll('.0K', 'K');
    }
    return '${(count / 1000000).toStringAsFixed(1)}M'.replaceAll('.0M', 'M');
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final accent = announcement.type?.typeColor ?? AppColors.gAnnouncements.first;

    return Opacity(
      opacity: announcement.isViewed ? 0.6 : 1.0,
      child: AppCard(
        margin: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        radius: AppSpacing.radiusXl,
        glowColor: accent,
        onTap: onTap,
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // İkon chip — tür renginde yumuşak gradyan
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [accent, accent.withValues(alpha: 0.7)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
                boxShadow: AppColors.glow(accent, strength: 0.3),
              ),
              child: Center(
                child: Icon(
                  announcement.type?.iconData ?? Icons.campaign_rounded,
                  color: Colors.white,
                  size: 24,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          announcement.type?.name ?? 'Duyuru',
                          style: AppTextStyles.labelSmall.copyWith(
                            color: accent,
                            letterSpacing: 0.4,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      PriorityBadge(
                        priority: announcement.priority,
                        small: true,
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    announcement.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTextStyles.titleMedium.copyWith(
                      color: cs.onSurface,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    announcement.body,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: cs.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.smLg),
                  Row(
                    children: [
                      Icon(Icons.calendar_today_rounded,
                          size: 13, color: cs.onSurfaceVariant),
                      const SizedBox(width: 5),
                      Text(
                        _formatDate(announcement.createdAt),
                        style: AppTextStyles.labelSmall.copyWith(
                          color: cs.onSurfaceVariant,
                        ),
                      ),
                      const Spacer(),
                      Icon(Icons.visibility_rounded,
                          size: 13, color: cs.onSurfaceVariant),
                      const SizedBox(width: 5),
                      Text(
                        _formatViewCount(announcement.viewCount),
                        style: AppTextStyles.labelSmall.copyWith(
                          color: cs.onSurfaceVariant,
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
    );
  }
}
