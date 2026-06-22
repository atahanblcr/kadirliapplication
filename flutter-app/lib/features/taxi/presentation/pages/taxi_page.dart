import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/taxi_provider.dart';
import '../../data/models/taxi_model.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_shimmer.dart';
import '../../../../core/widgets/app_empty_state.dart';
import '../../../../core/widgets/app_error_state.dart';

class TaxiPage extends ConsumerWidget {
  const TaxiPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final driversAsync = ref.watch(taxiDriversProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Taksi')),
      body: RefreshIndicator(
        onRefresh: () async {
          // ignore: unused_result
          ref.refresh(taxiDriversProvider);
        },
        child: driversAsync.when(
          data: (drivers) {
            if (drivers.isEmpty) {
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.7,
                    child: const AppEmptyState(
                      icon: Icons.local_taxi_rounded,
                      title: 'Şu an aktif taksi yok',
                      subtitle: 'Daha sonra tekrar kontrol edebilirsiniz.',
                    ),
                  ),
                ],
              );
            }
            return ListView.builder(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
              itemCount: drivers.length,
              itemBuilder: (context, index) =>
                  _TaxiCard(driver: drivers[index]),
            );
          },
          loading: () => const ShimmerList(),
          error: (error, stack) => AppErrorState(
            error: error,
            onRetry: () {
              // ignore: unused_result
              ref.refresh(taxiDriversProvider);
            },
          ),
        ),
      ),
    );
  }
}

class _TaxiCard extends ConsumerWidget {
  final TaxiDriverModel driver;

  const _TaxiCard({required this.driver});

  Future<void> _callDriver(BuildContext context, WidgetRef ref) async {
    try {
      final repository = ref.read(taxiRepositoryProvider);
      await repository.callDriver(driver.id);
    } catch (e) {
      debugPrint('Taksi çağrısı kaydedilemedi: $e');
    }

    final url = Uri.parse('tel:${driver.phone}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cs = Theme.of(context).colorScheme;
    final hasPlaka = driver.plaka != null && driver.plaka!.isNotEmpty;

    return AppCard(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      radius: AppSpacing.radiusXl,
      glowColor: AppColors.gTaxi.first,
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Row(
        children: [
          // Gradyan taksi ikonu
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: AppColors.gTaxi,
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              boxShadow: AppColors.glow(AppColors.gTaxi.first, strength: 0.3),
            ),
            child: const Icon(Icons.local_taxi_rounded,
                color: Colors.white, size: 28),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  driver.name,
                  style: AppTextStyles.titleLarge.copyWith(
                    color: cs.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                if (hasPlaka) ...[
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: cs.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                      border: Border.all(color: cs.outlineVariant),
                    ),
                    child: Text(
                      driver.plaka!,
                      style: AppTextStyles.labelMedium.copyWith(
                        color: cs.onSurface,
                        letterSpacing: 1.5,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
                if (driver.vehicleInfo != null &&
                    driver.vehicleInfo!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    driver.vehicleInfo!,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: cs.onSurfaceVariant,
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          // Ara butonu — yeşil gradyan
          GestureDetector(
            onTap: () => _callDriver(context, ref),
            child: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.success, Color(0xFF15803D)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
                boxShadow: AppColors.glow(AppColors.success, strength: 0.35),
              ),
              child: const Icon(Icons.phone_rounded,
                  color: Colors.white, size: 22),
            ),
          ),
        ],
      ),
    );
  }
}
