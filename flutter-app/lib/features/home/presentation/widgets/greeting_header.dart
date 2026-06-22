import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_shimmer.dart';
import '../../../../../../features/auth/presentation/providers/auth_provider.dart';

/// Premium karşılama başlığı: gradyan avatar, zamana duyarlı selam, ad ve
/// glass konum rozeti.
class GreetingHeader extends ConsumerWidget {
  const GreetingHeader({super.key});

  ({String text, String emoji}) _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 6) return (text: 'İyi geceler', emoji: '🌙');
    if (hour < 12) return (text: 'Günaydın', emoji: '☀️');
    if (hour < 18) return (text: 'İyi günler', emoji: '👋');
    return (text: 'İyi akşamlar', emoji: '🌆');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    final user = authState.user;

    if (authState.isLoading || user == null) {
      return const Padding(
        padding: EdgeInsets.fromLTRB(
          AppSpacing.lg,
          AppSpacing.md,
          AppSpacing.lg,
          AppSpacing.sm,
        ),
        child: Row(
          children: [
            ShimmerBox(width: 54, height: 54, radius: AppSpacing.radiusXl),
            SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ShimmerBox(width: 90, height: 13, radius: 6),
                  SizedBox(height: AppSpacing.sm),
                  ShimmerBox(width: 160, height: 20, radius: 8),
                ],
              ),
            ),
          ],
        ),
      );
    }

    final username = user.username ?? 'Kullanıcı';
    final neighborhood = user.primaryNeighborhood?.name ?? 'Kadirli';
    final greeting = _greeting();
    final initial = username.isNotEmpty ? username[0].toUpperCase() : '?';
    final isDark = theme.brightness == Brightness.dark;
    final chipColor = isDark ? AppColors.primaryLight : AppColors.primaryDark;

    return Padding(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.lg,
        AppSpacing.md,
        AppSpacing.lg,
        AppSpacing.sm,
      ),
      child: Row(
        children: [
          // Gradyan avatar + glow
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: AppColors.primaryGradient,
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
              boxShadow: AppColors.glow(AppColors.primary, strength: 0.4),
            ),
            alignment: Alignment.center,
            child: Text(
              initial,
              style: AppTextStyles.headlineMedium.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${greeting.text} ${greeting.emoji}',
                  style: AppTextStyles.labelMedium.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  username,
                  style: AppTextStyles.headlineLarge.copyWith(
                    color: theme.colorScheme.onSurface,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          // Glass konum rozeti
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.smLg,
              vertical: AppSpacing.sm,
            ),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
              border: Border.all(
                color: AppColors.primary.withValues(alpha: 0.22),
                width: 1,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.location_on_rounded,
                  size: 15,
                  color: chipColor,
                ),
                const SizedBox(width: 4),
                Text(
                  neighborhood,
                  style: AppTextStyles.labelMedium.copyWith(
                    color: chipColor,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
