import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/announcements_provider.dart';
import '../widgets/priority_badge.dart';
import '../../../../core/constants/app_spacing.dart';

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
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red[400],
              ),
              const SizedBox(height: 16),
              Text(
                'Duyuru yüklenemedi',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Text(
                error.toString(),
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[500]),
              ),
            ],
          ),
        ),
        data: (announcement) => SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Priority badge + type row
              Row(
                children: [
                  PriorityBadge(priority: announcement.priority),
                  const SizedBox(width: AppSpacing.md),
                  if (announcement.type != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.sm,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        announcement.type!.name,
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Title
              Text(
                announcement.title,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: AppSpacing.sm),

              // Date + view count
              Row(
                children: [
                  Icon(
                    Icons.calendar_today,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    _formatDate(announcement.createdAt),
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                  const Spacer(),
                  Icon(
                    Icons.visibility,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${announcement.viewCount} görüntüleme',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Divider
              const Divider(),
              const SizedBox(height: AppSpacing.lg),

              // Body (selectable text for copy)
              SelectableText(
                announcement.body,
                style: const TextStyle(
                  fontSize: 16,
                  height: 1.6,
                ),
              ),

              // Target neighborhoods (if exists)
              if (announcement.targetNeighborhoods != null &&
                  announcement.targetNeighborhoods!.isNotEmpty) ...[
                const SizedBox(height: AppSpacing.lg),
                Text(
                  'Hedef Mahalleler',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                const SizedBox(height: AppSpacing.sm),
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: announcement.targetNeighborhoods!
                      .map(
                        (neighborhood) => Chip(
                          label: Text(neighborhood),
                          avatar: const Icon(Icons.location_on, size: 16),
                        ),
                      )
                      .toList(),
                ),
              ],

              const SizedBox(height: AppSpacing.lg),

              // Action buttons
              if (announcement.hasPdf && announcement.pdfUrl != null) ...[
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.picture_as_pdf),
                    label: const Text('PDF Görüntüle'),
                    onPressed: () => _launchUrl(announcement.pdfUrl!),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],

              if (announcement.hasLink && announcement.externalLink != null) ...[
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.open_in_new),
                    label: const Text('Daha Fazla Bilgi'),
                    onPressed: () => _launchUrl(announcement.externalLink!),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
