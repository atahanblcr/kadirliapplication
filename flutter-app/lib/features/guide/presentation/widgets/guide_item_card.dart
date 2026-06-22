import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../data/models/guide_model.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';

class GuideItemCard extends StatelessWidget {
  final GuideItemModel item;

  const GuideItemCard({super.key, required this.item});

  Future<void> _launchPhone() async {
    final url = Uri.parse('tel:${item.phone}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Future<void> _launchMap() async {
    if (item.latitude != null && item.longitude != null) {
      final url = Uri.parse(
          'https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}');
      if (await canLaunchUrl(url)) {
        await launchUrl(url);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return AppCard(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      radius: AppSpacing.radiusXl,
      glowColor: AppColors.gGuide.first,
      padding: EdgeInsets.zero,
      child: Theme(
        // ExpansionTile'ın varsayılan ayraç çizgilerini gizle
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          iconColor: AppColors.primary,
          collapsedIconColor: cs.onSurfaceVariant,
          tilePadding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          leading: item.logoUrl != null
              ? CircleAvatar(
                  radius: 25,
                  backgroundImage: CachedNetworkImageProvider(item.logoUrl!),
                  backgroundColor: Colors.transparent,
                )
              : CircleAvatar(
                  radius: 25,
                  backgroundColor: AppColors.gGuide.first.withValues(alpha: 0.15),
                  child: Icon(Icons.business_rounded,
                      color: AppColors.gGuide.first, size: 24),
                ),
          title: Text(
            item.name,
            style: AppTextStyles.titleMedium.copyWith(
              color: cs.onSurface,
              fontWeight: FontWeight.w700,
            ),
          ),
          subtitle: Text(
            item.category?.name ?? '',
            style: AppTextStyles.bodySmall.copyWith(
              color: cs.onSurfaceVariant,
            ),
          ),
          childrenPadding: const EdgeInsets.fromLTRB(
            AppSpacing.md,
            0,
            AppSpacing.md,
            AppSpacing.md,
          ),
          expandedCrossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Divider(color: cs.outlineVariant, height: AppSpacing.md),
            if (item.description != null && item.description!.isNotEmpty) ...[
              Text(
                item.description!,
                style: AppTextStyles.bodyMedium.copyWith(color: cs.onSurface),
              ),
              const SizedBox(height: AppSpacing.smLg),
            ],
            _ActionRow(
              icon: Icons.phone_rounded,
              label: item.phone,
              color: AppColors.primary,
              onTap: _launchPhone,
            ),
            if (item.address != null && item.address!.isNotEmpty)
              _ActionRow(
                icon: Icons.location_on_rounded,
                label: item.address!,
                color: cs.onSurfaceVariant,
              ),
            if (item.workingHours != null && item.workingHours!.isNotEmpty)
              _ActionRow(
                icon: Icons.access_time_rounded,
                label: item.workingHours!,
                color: cs.onSurfaceVariant,
              ),
            if (item.latitude != null && item.longitude != null) ...[
              const SizedBox(height: AppSpacing.smLg),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: _launchMap,
                  icon: const Icon(Icons.map_rounded, size: 18),
                  label: const Text('Haritada Gör'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    side: BorderSide(
                      color: AppColors.primary.withValues(alpha: 0.4),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusLg),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ActionRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  const _ActionRow({
    required this.icon,
    required this.label,
    required this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final isAction = onTap != null;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 19),
            const SizedBox(width: AppSpacing.smLg),
            Expanded(
              child: Text(
                label,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: isAction ? color : cs.onSurface,
                  fontWeight: isAction ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
