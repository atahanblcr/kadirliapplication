import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../constants/app_colors.dart';
import '../constants/app_spacing.dart';

/// Sıradan CircularProgressIndicator yerine kullanılan şık, dalgalı shimmer
/// placeholder'ı. Resim/içerik yüklenirken iskelet (skeleton) gösterir.
class ShimmerBox extends StatelessWidget {
  final double? width;
  final double? height;
  final double radius;
  final EdgeInsetsGeometry? margin;

  const ShimmerBox({
    super.key,
    this.width,
    this.height,
    this.radius = AppSpacing.radiusLg,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final base = isDark ? AppColors.surfaceVariantDark : AppColors.grey200;
    final highlight = isDark ? AppColors.surfaceElevatedDark : AppColors.grey100;

    return Shimmer.fromColors(
      baseColor: base,
      highlightColor: highlight,
      period: const Duration(milliseconds: 1400),
      child: Container(
        width: width,
        height: height,
        margin: margin,
        decoration: BoxDecoration(
          color: base,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}

/// Liste/kart skeleton stili.
enum ShimmerCardStyle {
  /// Yatay kart (solda görsel + sağda metin) — ilan / etkinlik listeleri.
  horizontal,

  /// Dikey kart (üstte geniş kapak + altta metin) — mekan listeleri.
  cover,
}

/// Bir liste yüklenirken gösterilen, tüm karta yayılan **tek dalga** shimmer
/// iskelet listesi. Kartların gerçek yerleşimini taklit ederek "içerik geliyor"
/// hissini premium şekilde verir.
class ShimmerList extends StatelessWidget {
  final int itemCount;
  final ShimmerCardStyle style;

  const ShimmerList({
    super.key,
    this.itemCount = 6,
    this.style = ShimmerCardStyle.horizontal,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final base = isDark ? AppColors.surfaceVariantDark : AppColors.grey200;
    final highlight = isDark ? AppColors.surfaceElevatedDark : AppColors.grey100;

    return Shimmer.fromColors(
      baseColor: base,
      highlightColor: highlight,
      period: const Duration(milliseconds: 1400),
      child: ListView.builder(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        itemCount: itemCount,
        itemBuilder: (_, __) => style == ShimmerCardStyle.cover
            ? const _ShimmerCoverItem()
            : const _ShimmerRowItem(),
      ),
    );
  }
}

/// Tek bir skeleton şekli (shimmer maskesi child'ın alfasına uygulandığı için
/// renk önemsiz; opak beyaz yeterli).
class _Box extends StatelessWidget {
  final double? width;
  final double height;
  final double radius;

  const _Box({this.width, required this.height, this.radius = 7});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}

class _ShimmerRowItem extends StatelessWidget {
  const _ShimmerRowItem();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      child: SizedBox(
        height: 96,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _Box(width: 92, height: 92, radius: AppSpacing.radiusXl),
            SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _Box(width: 70, height: 11),
                  SizedBox(height: 10),
                  _Box(width: double.infinity, height: 13),
                  SizedBox(height: 8),
                  _Box(width: 150, height: 13),
                  SizedBox(height: 12),
                  _Box(width: 100, height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ShimmerCoverItem extends StatelessWidget {
  const _ShimmerCoverItem();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Box(width: double.infinity, height: 158, radius: AppSpacing.radiusXxl),
          SizedBox(height: AppSpacing.smLg),
          _Box(width: double.infinity, height: 16),
          SizedBox(height: 8),
          _Box(width: 180, height: 13),
          SizedBox(height: 8),
          _Box(width: 120, height: 13),
        ],
      ),
    );
  }
}
