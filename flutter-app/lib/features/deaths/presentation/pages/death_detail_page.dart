import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/deaths_provider.dart';
import '../widgets/death_card.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/utils/map_launcher.dart';
import '../../../../core/widgets/sliver_parallax_cover.dart';

class DeathDetailPage extends ConsumerWidget {
  final String id;

  const DeathDetailPage({required this.id, super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(deathDetailProvider(id));

    return Scaffold(
      body: detailAsync.when(
        data: (notice) {
          return CustomScrollView(
            slivers: [
              SliverParallaxCover(
                title: 'Vefat İlanı',
                placeholderIcon: Icons.local_florist_rounded,
                imageUrls:
                    notice.photo != null ? [notice.photo!.url] : const [],
                heroTag: DeathCard.heroTag(notice.id),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                const SizedBox(height: 8),
                // İsim & yaş
                Center(
                  child: Text(
                    notice.deceasedName,
                    style: AppTextStyles.displaySmall.copyWith(
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                if (notice.age != null)
                  Center(
                    child: Text(
                      '${notice.age} yaşında',
                      style: AppTextStyles.bodyLarge.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                const SizedBox(height: AppSpacing.xl),
                // Detaylar
                _sectionTitle(context, 'Cenaze Bilgileri'),
                Divider(color: Theme.of(context).colorScheme.outlineVariant),
                const SizedBox(height: AppSpacing.sm),
                _buildInfoRow(
                  context: context,
                  icon: Icons.event_rounded,
                  title: 'Tarih & Saat',
                  value: '${_formatDate(notice.funeralDate)} - ${notice.funeralTime}',
                ),
                if (notice.mosque != null)
                  _buildInfoRow(
                    context: context,
                    icon: Icons.location_city_rounded,
                    title: 'Camii',
                    value: notice.mosque!.name,
                    actionIcon: Icons.directions_rounded,
                    onActionTap: () => _launchDirections(
                        notice.mosque!.latitude,
                        notice.mosque!.longitude,
                        notice.mosque!.address ?? notice.mosque!.name),
                  ),
                if (notice.cemetery != null)
                  _buildInfoRow(
                    context: context,
                    icon: Icons.account_balance_rounded,
                    title: 'Mezarlık',
                    value: notice.cemetery!.name,
                    actionIcon: Icons.directions_rounded,
                    onActionTap: () => _launchDirections(
                        notice.cemetery!.latitude,
                        notice.cemetery!.longitude,
                        notice.cemetery!.address ?? notice.cemetery!.name),
                  ),
                if (notice.condolenceAddress != null && notice.condolenceAddress!.isNotEmpty) ...[
                  const SizedBox(height: AppSpacing.lg),
                  _sectionTitle(context, 'Taziye Adresi'),
                  Divider(color: Theme.of(context).colorScheme.outlineVariant),
                  const SizedBox(height: AppSpacing.sm),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.location_on_rounded,
                          color: AppColors.primary, size: 22),
                      const SizedBox(width: AppSpacing.smLg),
                      Expanded(
                        child: Text(
                          notice.condolenceAddress!,
                          style: AppTextStyles.bodyLarge.copyWith(
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
                ),
              ),
            ],
          );
        },
        loading: () => const DetailStateView(
          title: 'Vefat İlanı',
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => DetailStateView(
          title: 'Vefat İlanı',
          child: Text('Hata: $error'),
        ),
      ),
    );
  }

  Widget _buildInfoRow({
    required BuildContext context,
    required IconData icon, 
    required String title, 
    required String value,
    VoidCallback? onActionTap,
    IconData? actionIcon,
  }) {
    final cs = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppColors.primary, size: 22),
          const SizedBox(width: AppSpacing.smLg),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTextStyles.labelMedium
                      .copyWith(color: cs.onSurfaceVariant),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: cs.onSurface,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          if (onActionTap != null && actionIcon != null)
            IconButton(
              icon: Icon(actionIcon, color: AppColors.primary),
              onPressed: onActionTap,
            ),
        ],
      ),
    );
  }

  Widget _sectionTitle(BuildContext context, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Text(
        text,
        style: AppTextStyles.headlineSmall.copyWith(
          color: AppColors.primary,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd.MM.yyyy').format(date);
    } catch (e) {
      return dateString;
    }
  }

  void _launchDirections(double? lat, double? lng, String address) =>
      MapLauncher.openDirections(lat: lat, lng: lng, address: address);
}
