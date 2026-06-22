import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/places_provider.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/sliver_parallax_cover.dart';

class PlaceDetailPage extends ConsumerWidget {
  final String placeId;

  const PlaceDetailPage({Key? key, required this.placeId}) : super(key: key);

  Future<void> _launchMap(double lat, double lng) async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Widget _pill(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.13),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Text(
        text,
        style: AppTextStyles.labelMedium.copyWith(color: color),
      ),
    );
  }

  Widget _sectionTitle(BuildContext context, String text) {
    return Text(
      text,
      style: AppTextStyles.headlineSmall.copyWith(
        color: Theme.of(context).colorScheme.onSurface,
        fontWeight: FontWeight.w700,
      ),
    );
  }

  Widget _visitTile(
      BuildContext context, IconData icon, String title, String value) {
    final cs = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
            ),
            child: Icon(icon, color: AppColors.primary, size: 20),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: AppTextStyles.labelMedium
                        .copyWith(color: cs.onSurfaceVariant)),
                Text(value,
                    style: AppTextStyles.bodyMedium
                        .copyWith(color: cs.onSurface)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final placeAsync = ref.watch(placeDetailProvider(placeId));

    return Scaffold(
      body: placeAsync.when(
        data: (place) {
          final cs = Theme.of(context).colorScheme;
          return CustomScrollView(
            slivers: [
              SliverParallaxCover(
                title: 'Mekan Detayı',
                placeholderIcon: Icons.place_rounded,
                imageUrls: place.images.isNotEmpty
                    ? place.images.map((e) => e.imageUrl ?? '').toList()
                    : (place.coverImageUrl != null
                        ? [place.coverImageUrl!]
                        : const <String>[]),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Kategori ve ücret
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (place.category != null)
                            _pill(place.category!.name, AppColors.primary)
                          else
                            const SizedBox.shrink(),
                          _pill(
                            place.isFree
                                ? 'Ücretsiz'
                                : (place.entranceFee != null
                                    ? '₺${place.entranceFee!.toStringAsFixed(0)}'
                                    : 'Ücretli'),
                            place.isFree
                                ? AppColors.success
                                : AppColors.warning,
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Başlık
                      Text(
                        place.name,
                        style: AppTextStyles.displaySmall
                            .copyWith(color: cs.onSurface),
                      ),

                      // Uzaklık
                      if (place.distanceFromCenter != null) ...[
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          'Şehir merkezine ${place.distanceFromCenter} km uzaklıkta',
                          style: AppTextStyles.labelMedium
                              .copyWith(color: AppColors.accent),
                        ),
                      ],
                      const SizedBox(height: AppSpacing.lg),

                      // Adres ve harita
                      if (place.address != null ||
                          (place.latitude != null && place.longitude != null))
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: cs.surfaceContainerHighest,
                            borderRadius:
                                BorderRadius.circular(AppSpacing.radiusXl),
                          ),
                          child: Column(
                            children: [
                              if (place.address != null)
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Icon(Icons.location_on_rounded,
                                        color: AppColors.primary, size: 22),
                                    const SizedBox(width: AppSpacing.smLg),
                                    Expanded(
                                      child: Text(
                                        place.address!,
                                        style: AppTextStyles.bodyLarge
                                            .copyWith(color: cs.onSurface),
                                      ),
                                    ),
                                  ],
                                ),
                              if (place.address != null &&
                                  place.latitude != null &&
                                  place.longitude != null)
                                const SizedBox(height: AppSpacing.md),
                              if (place.latitude != null &&
                                  place.longitude != null)
                                SizedBox(
                                  width: double.infinity,
                                  child: FilledButton.icon(
                                    onPressed: () => _launchMap(
                                        place.latitude!, place.longitude!),
                                    icon: const Icon(Icons.map_rounded,
                                        size: 18),
                                    label: const Text('Yol Tarifi Al'),
                                  ),
                                ),
                            ],
                          ),
                        ),

                      const SizedBox(height: AppSpacing.lg),

                      // Ziyaret bilgileri
                      if (place.openingHours != null ||
                          place.bestSeason != null) ...[
                        _sectionTitle(context, 'Ziyaret Bilgileri'),
                        const SizedBox(height: AppSpacing.smLg),
                        if (place.openingHours != null)
                          _visitTile(context, Icons.access_time_rounded,
                              'Ziyaret Saatleri', place.openingHours!),
                        if (place.bestSeason != null)
                          _visitTile(context, Icons.wb_sunny_rounded,
                              'En İyi Mevsim', place.bestSeason!),
                        const SizedBox(height: AppSpacing.md),
                      ],

                      // Açıklama
                      if (place.description != null &&
                          place.description!.isNotEmpty) ...[
                        Divider(color: cs.outlineVariant),
                        const SizedBox(height: AppSpacing.md),
                        _sectionTitle(context, 'Mekan Hakkında'),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          place.description!,
                          style: AppTextStyles.bodyLarge
                              .copyWith(color: cs.onSurfaceVariant),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                      ],

                      // Nasıl gidilir
                      if (place.howToGetThere != null &&
                          place.howToGetThere!.isNotEmpty) ...[
                        Divider(color: cs.outlineVariant),
                        const SizedBox(height: AppSpacing.md),
                        _sectionTitle(context, 'Nasıl Gidilir?'),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          place.howToGetThere!,
                          style: AppTextStyles.bodyLarge
                              .copyWith(color: cs.onSurfaceVariant),
                        ),
                        const SizedBox(height: AppSpacing.xl),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          );
        },
        loading: () => const DetailStateView(
          title: 'Mekan Detayı',
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => DetailStateView(
          title: 'Mekan Detayı',
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: AppColors.error.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(AppSpacing.radius2xl),
                  ),
                  child: const Icon(Icons.error_outline_rounded,
                      size: 44, color: AppColors.error),
                ),
                const SizedBox(height: AppSpacing.lg),
                Text(
                  'Mekan detayları yüklenemedi.',
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                ElevatedButton(
                  onPressed: () => ref.refresh(placeDetailProvider(placeId)),
                  child: const Text('Tekrar Dene'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
