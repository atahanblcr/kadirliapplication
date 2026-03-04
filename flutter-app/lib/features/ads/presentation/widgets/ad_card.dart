import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../../data/models/ad_model.dart';
import '../../../../core/constants/app_spacing.dart';

/// Ad list item card
/// Shows: Image on left, Info on right
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

  /// Format price with ₺ symbol and grouping
  String _formatPrice(int price) {
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

  /// Format date to "2 saat önce" or "10 Şub"
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
    return Card(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Left Image
              ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(AppSpacing.radiusMd),
                  bottomLeft: Radius.circular(AppSpacing.radiusMd),
                ),
                child: SizedBox(
                  width: 120,
                  height: 120,
                  child: CachedNetworkImage(
                    imageUrl: ad.coverImage?.thumbnailUrl ?? '',
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: Colors.grey[200],
                      child: const Center(child: Icon(Icons.image_outlined, color: Colors.grey)),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: Colors.grey[200],
                      child: const Center(child: Icon(Icons.error_outline, color: Colors.grey)),
                    ),
                  ),
                ),
              ),
              // Right Info
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.smLg),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Category + Date Row
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              ad.category.name,
                              style: TextStyle(
                                fontSize: 11,
                                color: Colors.grey[600],
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Text(
                            _formatDate(ad.createdAt),
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[500],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xxs),
                      // Title
                      Text(
                        ad.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          height: 1.2,
                        ),
                      ),
                      const Spacer(),
                      // Price + Favorite Row
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Neighborhood (optional)
                              if (ad.neighborhood != null)
                                Row(
                                  children: [
                                    Icon(Icons.location_on_outlined, size: 12, color: Colors.grey[500]),
                                    const SizedBox(width: 2),
                                    Text(
                                      ad.neighborhood!['name'] as String? ?? '',
                                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                                    ),
                                  ],
                                ),
                              const SizedBox(height: 2),
                              // Price
                              Text(
                                _formatPrice(ad.price),
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Theme.of(context).primaryColor,
                                ),
                              ),
                            ],
                          ),
                          const Spacer(),
                          // Favorite Toggle
                          IconButton(
                            onPressed: onFavoriteTap,
                            icon: Icon(
                              ad.isFavorite ? Icons.favorite : Icons.favorite_border,
                              color: ad.isFavorite ? Colors.red : Colors.grey,
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
      ),
    );
  }
}
