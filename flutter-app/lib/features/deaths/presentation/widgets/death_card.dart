import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/models/death_model.dart';
import '../pages/death_detail_page.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';

class DeathCard extends StatelessWidget {
  final DeathNoticeModel notice;

  const DeathCard({required this.notice, super.key});

  /// Liste kartı ile detay sayfasındaki fotoğrafın Hero geçişini eşleştiren etiket
  static String heroTag(String noticeId) => 'death-photo-$noticeId';

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return AppCard(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      radius: AppSpacing.radiusXl,
      glowColor: AppColors.gDeaths.first,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DeathDetailPage(id: notice.id),
          ),
        );
      },
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Fotoğraf
          Hero(
            tag: DeathCard.heroTag(notice.id),
            child: Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: cs.surfaceContainerHighest,
                shape: BoxShape.circle,
                image: notice.photoUrl != null
                    ? DecorationImage(
                        image: NetworkImage(notice.photoUrl!),
                        fit: BoxFit.cover,
                      )
                    : null,
              ),
              child: notice.photoUrl == null
                  ? Icon(Icons.person_rounded,
                      size: 36, color: AppColors.textHint)
                  : null,
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          // İçerik
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  notice.deceasedName,
                  style: AppTextStyles.titleLarge.copyWith(
                    color: cs.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                if (notice.age != null)
                  Text(
                    '${notice.age} yaşında',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: cs.onSurfaceVariant,
                    ),
                  ),
                const SizedBox(height: AppSpacing.sm),
                _infoRow(
                  context,
                  Icons.event_rounded,
                  'Cenaze: ${_formatDate(notice.funeralDate)} - ${notice.funeralTime}',
                  iconColor: AppColors.primary,
                ),
                if (notice.mosque != null) ...[
                  const SizedBox(height: AppSpacing.xs),
                  _infoRow(context, Icons.location_city_rounded,
                      notice.mosque!.name),
                ],
                if (notice.cemetery != null) ...[
                  const SizedBox(height: AppSpacing.xs),
                  _infoRow(context, Icons.account_balance_rounded,
                      notice.cemetery!.name),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoRow(BuildContext context, IconData icon, String text,
      {Color? iconColor}) {
    final cs = Theme.of(context).colorScheme;
    return Row(
      children: [
        Icon(icon, size: 15, color: iconColor ?? cs.onSurfaceVariant),
        const SizedBox(width: 5),
        Expanded(
          child: Text(
            text,
            style: AppTextStyles.bodySmall.copyWith(color: cs.onSurface),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
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
}
