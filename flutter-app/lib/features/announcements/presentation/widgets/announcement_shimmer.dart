import 'package:flutter/material.dart';
import '../../../../core/widgets/app_shimmer.dart';

/// Duyuru listesi yükleme iskeleti. Ortak [ShimmerList] (yatay) bileşenine
/// devreder.
class AnnouncementShimmer extends StatelessWidget {
  final int count;

  const AnnouncementShimmer({
    this.count = 5,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ShimmerList(itemCount: count, style: ShimmerCardStyle.horizontal);
  }
}
