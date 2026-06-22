import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/announcements_provider.dart';
import '../widgets/priority_badge.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/app_error_state.dart';

/// Announcement detail page
/// Shows full announcement details with PDF/link buttons
class AnnouncementDetailPage extends ConsumerWidget {
  final String id;

  const AnnouncementDetailPage({
    required this.id,
    super.key,
  });

  /// Format date to Turkish format
  String _formatDate(DateTime date) {
    try {
      return DateFormat('d MMMM yyyy, HH:mm', 'tr_TR').format(date);
    } catch (_) {
      return DateFormat('d/M/y, HH:mm').format(date);
    }
  }

  /// Launch URL (PDF or external link)
  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        throw Exception('Bağlantı açılamadı');
      }
    } catch (e) {
      debugPrint('Error launching URL: $e');
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncAnnouncement = ref.watch(announcementDetailProvider(id));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Duyuru Detayları'),
        elevation: 0,
      ),
      body: asyncAnnouncement.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => AppErrorState(error: error),
        data: (announcement) {
          final cs = Theme.of(context).colorScheme;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Öncelik rozeti + tür
                Row(
                  children: [
                    PriorityBadge(priority: announcement.priority),
                    const SizedBox(width: AppSpacing.sm),
                    if (announcement.type != null)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: cs.surfaceContainerHighest,
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusFull),
                        ),
                        child: Text(
                          announcement.type!.name,
                          style: AppTextStyles.labelSmall
                              .copyWith(color: cs.onSurfaceVariant),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),

                // Başlık
                Text(
                  announcement.title,
                  style: AppTextStyles.headlineLarge.copyWith(
                    color: cs.onSurface,
                  ),
                ),
                const SizedBox(height: AppSpacing.smLg),

                // Tarih + görüntülenme
                Row(
                  children: [
                    Icon(Icons.calendar_today_rounded,
                        size: 15, color: cs.onSurfaceVariant),
                    const SizedBox(width: 5),
                    Text(
                      _formatDate(announcement.createdAt),
                      style: AppTextStyles.bodySmall
                          .copyWith(color: cs.onSurfaceVariant),
                    ),
                    const Spacer(),
                    Icon(Icons.visibility_rounded,
                        size: 15, color: cs.onSurfaceVariant),
                    const SizedBox(width: 5),
                    Text(
                      '${announcement.viewCount}',
                      style: AppTextStyles.bodySmall
                          .copyWith(color: cs.onSurfaceVariant),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                Divider(color: cs.outlineVariant),
                const SizedBox(height: AppSpacing.md),

                // Gövde
                SelectableText(
                  announcement.body,
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: cs.onSurface,
                    height: 1.65,
                  ),
                ),

                // Hedef mahalleler
                if (announcement.targetNeighborhoods != null &&
                    announcement.targetNeighborhoods!.isNotEmpty) ...[
                  const SizedBox(height: AppSpacing.lg),
                  Text(
                    'Hedef Mahalleler',
                    style: AppTextStyles.titleMedium.copyWith(
                      color: cs.onSurface,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Wrap(
                    spacing: AppSpacing.sm,
                    runSpacing: AppSpacing.sm,
                    children: announcement.targetNeighborhoods!
                        .map(
                          (neighborhood) => Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 7),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.10),
                              borderRadius:
                                  BorderRadius.circular(AppSpacing.radiusFull),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.location_on_rounded,
                                    size: 14, color: AppColors.primary),
                                const SizedBox(width: 4),
                                Text(
                                  neighborhood,
                                  style: AppTextStyles.labelMedium
                                      .copyWith(color: AppColors.primary),
                                ),
                              ],
                            ),
                          ),
                        )
                        .toList(),
                  ),
                ],

                const SizedBox(height: AppSpacing.lg),

                // Aksiyon butonları
                if (announcement.hasPdf && announcement.pdfUrl != null) ...[
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      icon: const Icon(Icons.picture_as_pdf_rounded, size: 18),
                      label: const Text('PDF Görüntüle'),
                      onPressed: () => _launchUrl(announcement.pdfUrl!),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],

                if (announcement.hasLink &&
                    announcement.externalLink != null) ...[
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.open_in_new_rounded, size: 18),
                      label: const Text('Daha Fazla Bilgi'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.primary,
                        side: BorderSide(
                            color: AppColors.primary.withValues(alpha: 0.4)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusXl),
                        ),
                      ),
                      onPressed: () => _launchUrl(announcement.externalLink!),
                    ),
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}
