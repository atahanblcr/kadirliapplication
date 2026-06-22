import 'package:flutter/material.dart';
import '../../../../core/widgets/app_shimmer.dart';

/// İlan listesi yükleme iskeleti. Premium, tek-dalga shimmer için ortak
/// [ShimmerList]'e devreder (yatay kart stili).
class AdShimmer extends StatelessWidget {
  final int count;

  const AdShimmer({
    this.count = 5,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ShimmerList(itemCount: count, style: ShimmerCardStyle.horizontal);
  }
}
