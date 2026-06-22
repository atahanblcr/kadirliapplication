import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:share_plus/share_plus.dart';
import '../providers/events_provider.dart';
import '../../data/models/event_model.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/sliver_parallax_cover.dart';

class EventDetailPage extends ConsumerWidget {
  final String eventId;

  const EventDetailPage({super.key, required this.eventId});

  Future<void> _openMap(double lat, double lng, String name) async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Future<void> _openUrl(String urlString) async {
    final url = Uri.parse(urlString);
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventAsyncValue = ref.watch(eventDetailProvider(eventId));

    return Scaffold(
      body: eventAsyncValue.when(
        data: (event) => _buildDetail(context, event),
        loading: () => const DetailStateView(
          title: 'Etkinlik Detayı',
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => DetailStateView(
          title: 'Etkinlik Detayı',
          child: Text('Hata: $error'),
        ),
      ),
    );
  }

  Widget _buildDetail(BuildContext context, EventDetailModel event) {
    final cs = Theme.of(context).colorScheme;
    final onSurface = cs.onSurface;
    return CustomScrollView(
      slivers: [
        SliverParallaxCover(
          title: 'Etkinlik Detayı',
          placeholderIcon: Icons.celebration_rounded,
          imageUrls: event.images.map((e) => e.url).toList(),
          actions: [
            IconButton(
              icon: const Icon(Icons.share, color: Colors.white),
              onPressed: () {
                Share.share(
                    'Bu etkinliğe göz at: https://kadirliapp.com/events/$eventId');
              },
            ),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (event.category != null)
                  _pill(event.category!.name, AppColors.primary, filled: true),
                const SizedBox(height: AppSpacing.smLg),
                Text(
                  event.title,
                  style: AppTextStyles.headlineLarge.copyWith(color: onSurface),
                ),
                const SizedBox(height: AppSpacing.md),

                _infoRow(context, Icons.calendar_today_rounded,
                    '${event.eventDate} - ${event.eventTime}'),
                if (event.durationMinutes != null) ...[
                  const SizedBox(height: AppSpacing.sm),
                  _infoRow(context, Icons.timer_rounded,
                      'Süre: ${event.durationMinutes} dakika'),
                ],
                const SizedBox(height: AppSpacing.sm),
                _infoRow(
                  context,
                  Icons.location_on_rounded,
                  event.venueName,
                  subtitle: event.venueAddress,
                ),
                if (event.latitude != null && event.longitude != null) ...[
                  const SizedBox(height: AppSpacing.smLg),
                  OutlinedButton.icon(
                    onPressed: () => _openMap(
                        event.latitude!, event.longitude!, event.venueName),
                    icon: const Icon(Icons.map_rounded, size: 18),
                    label: const Text('Haritada Gör'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      side: BorderSide(
                          color: AppColors.primary.withValues(alpha: 0.4)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
                      ),
                    ),
                  ),
                ],

                Divider(height: AppSpacing.xl, color: cs.outlineVariant),

                if (event.organizer != null) ...[
                  Text(
                    'Düzenleyen: ${event.organizer}',
                    style: AppTextStyles.titleMedium.copyWith(
                      color: onSurface,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.smLg),
                ],

                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: [
                    if (event.isFree)
                      _pill('Ücretsiz', AppColors.success, filled: true)
                    else if (event.ticketPrice != null)
                      _pill('Bilet: ${event.ticketPrice} ₺', AppColors.primary),
                    if (event.capacity != null)
                      _pill('Kapasite: ${event.capacity}', AppColors.warning),
                    if (event.ageRestriction != null)
                      _pill('Yaş Sınırı: ${event.ageRestriction}',
                          AppColors.accent),
                  ],
                ),

                if (event.websiteUrl != null) ...[
                  const SizedBox(height: AppSpacing.md),
                  FilledButton.icon(
                    onPressed: () => _openUrl(event.websiteUrl!),
                    icon: const Icon(Icons.link_rounded, size: 18),
                    label: const Text('Etkinlik Web Sitesi'),
                    style: FilledButton.styleFrom(
                      minimumSize: const Size(double.infinity, 50),
                    ),
                  ),
                ],

                const SizedBox(height: AppSpacing.lg),
                Text(
                  'Açıklama',
                  style: AppTextStyles.headlineSmall.copyWith(
                    color: onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  event.description ?? 'Açıklama bulunmuyor.',
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: cs.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _infoRow(BuildContext context, IconData icon, String text,
      {String? subtitle}) {
    final cs = Theme.of(context).colorScheme;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 19, color: AppColors.primary),
        const SizedBox(width: AppSpacing.smLg),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                text,
                style: AppTextStyles.bodyLarge.copyWith(
                  color: cs.onSurface,
                  fontWeight: FontWeight.w600,
                ),
              ),
              if (subtitle != null)
                Text(
                  subtitle,
                  style: AppTextStyles.bodySmall
                      .copyWith(color: cs.onSurfaceVariant),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _pill(String text, Color color, {bool filled = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: filled ? color : color.withValues(alpha: 0.13),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Text(
        text,
        style: AppTextStyles.labelMedium.copyWith(
          color: filled ? Colors.white : color,
        ),
      ),
    );
  }
}
