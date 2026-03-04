import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../../../core/constants/app_spacing.dart';

/// Ad list loading skeleton
class AdShimmer extends StatelessWidget {
  final int count;

  const AdShimmer({
    this.count = 5,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: count,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: Colors.grey[300]!,
          highlightColor: Colors.grey[100]!,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm,
            ),
            child: Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
              ),
              child: SizedBox(
                height: 120,
                child: Row(
                  children: [
                    // Left image placeholder
                    Container(
                      width: 120,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(AppSpacing.radiusMd),
                          bottomLeft: Radius.circular(AppSpacing.radiusMd),
                        ),
                      ),
                    ),
                    // Right content placeholder
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(AppSpacing.smLg),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(width: 60, height: 10, color: Colors.white),
                                const Spacer(),
                                Container(width: 40, height: 10, color: Colors.white),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Container(width: double.infinity, height: 14, color: Colors.white),
                            const SizedBox(height: 6),
                            Container(width: 150, height: 14, color: Colors.white),
                            const Spacer(),
                            Row(
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(width: 80, height: 10, color: Colors.white),
                                    const SizedBox(height: 4),
                                    Container(width: 100, height: 18, color: Colors.white),
                                  ],
                                ),
                                const Spacer(),
                                Container(width: 24, height: 24, color: Colors.white),
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
          ),
        );
      },
    );
  }
}
