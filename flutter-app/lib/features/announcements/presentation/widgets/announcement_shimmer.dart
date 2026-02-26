import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

/// Announcement list loading skeleton using Shimmer
class AnnouncementShimmer extends StatelessWidget {
  final int count;

  const AnnouncementShimmer({
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
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Left icon placeholder
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Content placeholder
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Type label
                          Container(
                            width: 60,
                            height: 12,
                            color: Colors.white,
                          ),
                          const SizedBox(height: 8),
                          // Title
                          Container(
                            width: double.infinity,
                            height: 16,
                            color: Colors.white,
                          ),
                          const SizedBox(height: 6),
                          // Body preview
                          Container(
                            width: double.infinity,
                            height: 12,
                            color: Colors.white,
                          ),
                          const SizedBox(height: 8),
                          // Meta (date + view count)
                          Row(
                            children: [
                              Container(
                                width: 100,
                                height: 12,
                                color: Colors.white,
                              ),
                              const Spacer(),
                              Container(
                                width: 80,
                                height: 12,
                                color: Colors.white,
                              ),
                            ],
                          ),
                        ],
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
