import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../../data/models/ad_model.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';

/// İlan liste kartı — solda kapak görseli, sağda bilgi.
class AdCard extends StatelessWidget {
  final AdModel ad;
  final VoidCallback onTap;
  final VoidCallback onFavoriteTap;

  const AdCard({
    required this.ad,
    required this.onTap,
    required this.onFavoriteTap,
    super.key,
  });

  /// Liste kartı ile detay sayfasındaki resmin Hero geçişini eşleştiren etiket
  static String heroTag(String adId) => 'ad-image-$adId';

  String _formatPrice(int? price) {
    if (price == null) return 'Fiyat belirtilmemiş';
    try {
      final formatter = NumberFormat.currency(
        locale: 'tr_TR',
        symbol: '₺',
        decimalDigits: 0,
      );
      return formatter.format(price);
    } catch (_) {
      return '$price ₺';
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes} dk önce';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} sa önce';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} gün önce';
    } else {
      return DateFormat('d MMM', 'tr_TR').format(date);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    Widget placeholder(IconData icon) => Container(
          color: cs.surfaceContainerHighest,
          child: Icon(icon, color: AppColors.textHint),
        );

    return AppCard(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      radius: AppSpacing.radiusXl,
      padding: EdgeInsets.zero,
      glowColor: AppColors.gAds.first,
      onTap: onTap,
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Hero(
              tag: AdCard.heroTag(ad.id),
              child: SizedBox(
                width: 116,
                child: CachedNetworkImage(
                  imageUrl: ad.coverImage?.thumbnailUrl ?? '',
                  fit: BoxFit.cover,
                  placeholder: (context, url) =>
                      placeholder(Icons.image_outlined),
                  errorWidget: (context, url, error) =>
                      placeholder(Icons.image_not_supported_outlined),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.smLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            ad.category.name.toUpperCase(),
                            style: AppTextStyles.labelSmall.copyWith(
                              color: AppColors.primary,
                              letterSpacing: 0.6,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Text(
                          _formatDate(ad.createdAt),
                          style: AppTextStyles.labelSmall.copyWith(
                            color: cs.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      ad.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyles.titleMedium.copyWith(
                        color: cs.onSurface,
                        fontWeight: FontWeight.w700,
                        height: 1.25,
                      ),
                    ),
                    const Spacer(),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (ad.neighborhood != null) ...[
                                Row(
                                  children: [
                                    Icon(Icons.location_on_rounded,
                                        size: 13, color: cs.onSurfaceVariant),
                                    const SizedBox(width: 2),
                                    Expanded(
                                      child: Text(
                                        ad.neighborhood!['name'] as String? ??
                                            '',
                                        style: AppTextStyles.bodySmall.copyWith(
                                          color: cs.onSurfaceVariant,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                              ],
                              Text(
                                _formatPrice(ad.price),
                                style: AppTextStyles.titleLarge.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: onFavoriteTap,
                          icon: Icon(
                            ad.isFavorite
                                ? Icons.favorite_rounded
                                : Icons.favorite_border_rounded,
                            color: ad.isFavorite
                                ? AppColors.error
                                : AppColors.textHint,
                            size: 22,
                          ),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
