import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/ads_provider.dart';
import '../widgets/ad_card.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/sliver_parallax_cover.dart';
import '../../data/models/ad_model.dart';
import 'ad_edit_page.dart';

class AdDetailPage extends ConsumerWidget {
  final String adId;

  const AdDetailPage({required this.adId, super.key});

  /// Format price
  String _formatPrice(int? price) {
    if (price == null) return 'Fiyat belirtilmemiş';
    final formatter = NumberFormat.currency(
      locale: 'tr_TR',
      symbol: '₺',
      decimalDigits: 0,
    );
    return formatter.format(price);
  }

  /// Launch phone call
  Future<void> _launchPhone(String phone) async {
    final Uri url = Uri.parse('tel:$phone');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  /// Launch WhatsApp
  Future<void> _launchWhatsApp(String? whatsappUrl) async {
    if (whatsappUrl == null) return;
    final Uri url = Uri.parse(whatsappUrl);
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  /// Show Ad extension dialog
  void _showExtensionDialog(BuildContext context, WidgetRef ref, String id) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('İlan Süresini Uzat'),
        content: const Text(
          '3 kısa reklam izleyerek ilan sürenizi 3 gün uzatabilirsiniz.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (context) => const Center(
                  child: Card(
                    child: Padding(
                      padding: EdgeInsets.all(20),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(),
                          SizedBox(height: 16),
                          Text('Reklamlar izleniyor...'),
                        ],
                      ),
                    ),
                  ),
                ),
              );
              
              await Future.delayed(const Duration(seconds: 3));
              if (context.mounted) Navigator.pop(context);

              try {
                await ref.read(adsRepositoryProvider).extendAd(id, 3);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('İlan süreniz 3 gün uzatıldı!')),
                  );
                  ref.invalidate(adDetailProvider(id));
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Hata: $e')),
                  );
                }
              }
            },
            child: const Text('Reklam İzle ve Uzat'),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteAd(BuildContext context, WidgetRef ref, String id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('İlanı Sil'),
        content: const Text('Bu ilanı silmek istediğinize emin misiniz?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hayır')),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Evet, Sil'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final success = await ref.read(adsProvider.notifier).deleteAd(id);
      if (success && context.mounted) {
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final adAsync = ref.watch(adDetailProvider(adId));
    final favoriteList = ref.watch(favoritesProvider);
    final isFavorited = favoriteList.contains(adId);

    return Scaffold(
      body: adAsync.when(
        data: (ad) => CustomScrollView(
          slivers: [
            SliverParallaxCover(
              title: 'İlan Detayı',
              placeholderIcon: Icons.shopping_bag_rounded,
              imageUrls: (ad.images ?? []).map((e) => e.url).toList(),
              heroTag: AdCard.heroTag(ad.id),
              actions: [
                if (ad.isOwn) ...[
                  IconButton(
                    icon: const Icon(Icons.edit_outlined, color: Colors.white),
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => AdEditPage(ad: ad)),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline,
                        color: Color(0xFFFB5870)),
                    onPressed: () => _deleteAd(context, ref, adId),
                  ),
                  IconButton(
                    icon: const Icon(Icons.more_time, color: Colors.white),
                    onPressed: () => _showExtensionDialog(context, ref, adId),
                    tooltip: 'Süreyi Uzat',
                  ),
                ],
                IconButton(
                  icon: Icon(
                    isFavorited ? Icons.favorite : Icons.favorite_border,
                    color: isFavorited ? const Color(0xFFFB5870) : Colors.white,
                  ),
                  onPressed: () {
                    ref
                        .read(favoritesProvider.notifier)
                        .toggleFavorite(adId, isFavorited);
                  },
                ),
              ],
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      ad.title,
                      style: AppTextStyles.headlineMedium.copyWith(
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      _formatPrice(ad.price),
                      style: AppTextStyles.displaySmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Row(
                      children: [
                        _buildInfoChip(context, Icons.category_rounded, ad.category.name),
                        if (ad.neighborhood != null) ...[
                          const SizedBox(width: AppSpacing.sm),
                          _buildInfoChip(
                            context,
                            Icons.location_on_rounded,
                            ad.neighborhood!['name'] as String? ?? '',
                          ),
                        ],
                      ],
                    ),
                    const Divider(height: AppSpacing.xl),
                    _sectionTitle(context, 'Açıklama'),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      ad.description,
                      style: AppTextStyles.bodyLarge.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xl),
                    if (ad.properties != null && ad.properties!.isNotEmpty) ...[
                      _sectionTitle(context, 'Özellikler'),
                      const SizedBox(height: AppSpacing.sm),
                      _buildPropertiesGrid(context, ad.properties!),
                      const SizedBox(height: AppSpacing.xl),
                    ],
                    _buildSellerCard(context, ad),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
        loading: () => const DetailStateView(
          title: 'İlan Detayı',
          child: CircularProgressIndicator(),
        ),
        error: (error, _) => DetailStateView(
          title: 'İlan Detayı',
          child: Text('Hata: $error'),
        ),
      ),
      bottomSheet: adAsync.when(
        data: (ad) => _buildBottomActions(context, ad),
        loading: () => const SizedBox.shrink(),
        error: (_, __) => const SizedBox.shrink(),
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

  Widget _buildInfoChip(BuildContext context, IconData icon, String label) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: cs.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 15, color: AppColors.primary),
          const SizedBox(width: 6),
          Text(
            label,
            style: AppTextStyles.labelMedium.copyWith(color: cs.onSurface),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertiesGrid(
      BuildContext context, List<Map<String, dynamic>> properties) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        color: cs.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
      ),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: properties.length,
        separatorBuilder: (context, index) =>
            Divider(height: 1, color: cs.outlineVariant),
        itemBuilder: (context, index) {
          final prop = properties[index];
          return Padding(
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md, vertical: 13),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  prop['name'] as String? ?? '',
                  style: AppTextStyles.bodyMedium
                      .copyWith(color: cs.onSurfaceVariant),
                ),
                Text(
                  prop['value'] as String? ?? '',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: cs.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSellerCard(BuildContext context, AdModel ad) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: cs.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
      ),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: AppColors.primaryGradient,
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
            ),
            child: const Icon(Icons.person_rounded, color: Colors.white),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  ad.seller?['username'] as String? ?? 'Kullanıcı',
                  style: AppTextStyles.titleMedium.copyWith(
                    color: cs.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  'İlan Sahibi',
                  style: AppTextStyles.bodySmall
                      .copyWith(color: cs.onSurfaceVariant),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActions(BuildContext context, AdModel ad) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      padding: EdgeInsets.fromLTRB(
        AppSpacing.md,
        AppSpacing.md,
        AppSpacing.md,
        AppSpacing.md + MediaQuery.of(context).padding.bottom * 0.5,
      ),
      decoration: BoxDecoration(
        color: cs.surface,
        border: Border(top: BorderSide(color: cs.outlineVariant, width: 0.5)),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: FilledButton.icon(
                onPressed: () => _launchPhone(ad.contactPhone ?? ''),
                icon: const Icon(Icons.phone_rounded, size: 18),
                label: const Text('Ara'),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: FilledButton.icon(
                onPressed: () => _launchWhatsApp(ad.whatsappUrl),
                icon: const Icon(Icons.chat_bubble_rounded, size: 18),
                label: const Text('WhatsApp'),
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.success,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
