import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_spacing.dart';
import '../constants/app_text_styles.dart';
import '../exceptions/app_exception.dart';

/// Shared error-state placeholder for list pages.
/// Pass the raw caught error; it is converted to a Turkish message via
/// [appErrorMessage] so pages never show a raw exception/stack string.
class AppErrorState extends StatelessWidget {
  final Object error;
  final VoidCallback? onRetry;

  const AppErrorState({
    required this.error,
    this.onRetry,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: AppSpacing.xxl, color: AppColors.error),
            const SizedBox(height: AppSpacing.md),
            Text(
              appErrorMessage(error),
              textAlign: TextAlign.center,
              style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textPrimary),
            ),
            if (onRetry != null) ...[
              const SizedBox(height: AppSpacing.md),
              ElevatedButton(onPressed: onRetry, child: const Text('Tekrar Dene')),
            ],
          ],
        ),
      ),
    );
  }
}
