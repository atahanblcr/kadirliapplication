import 'package:flutter/material.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_card.dart';
import '../providers/home_provider.dart';

/// Widget for displaying a single module card
class ModuleCard extends StatelessWidget {
  final ModuleItem module;
  final VoidCallback? onTap;

  const ModuleCard({
    super.key,
    required this.module,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Icon container
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: module.color,
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
            ),
            child: Center(
              child: Icon(
                module.icon,
                size: AppSpacing.iconXl,
                color: AppColors.white,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          // Title
          Text(
            module.title,
            textAlign: TextAlign.center,
            style: AppTextStyles.bodyMedium.copyWith(
              color: Theme.of(context).colorScheme.onSurface,
              fontWeight: FontWeight.w500,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
