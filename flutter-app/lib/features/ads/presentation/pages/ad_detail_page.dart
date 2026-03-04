import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/ads_provider.dart';
import '../widgets/image_carousel.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../data/models/ad_model.dart';
import 'ad_edit_page.dart';

class AdDetailPage extends ConsumerWidget {
  final String adId;

  const AdDetailPage({required this.adId, super.key});

  /// Format price
  String _formatPrice(int price) {
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
            style: TextButton.styleFrom(foregroundColor: Colors.red),
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
      appBar: AppBar(
        title: const Text('İlan Detayı'),
        actions: adAsync.when(
          data: (ad) => [
            if (ad.isOwn) ...[
              IconButton(
                icon: const Icon(Icons.edit_outlined),
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => AdEditPage(ad: ad)),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, color: Colors.red),
                onPressed: () => _deleteAd(context, ref, adId),
              ),
              IconButton(
                icon: const Icon(Icons.more_time),
                onPressed: () => _showExtensionDialog(context, ref, adId),
                tooltip: 'Süreyi Uzat',
              ),
            ],
            IconButton(
              icon: Icon(
                isFavorited ? Icons.favorite : Icons.favorite_border,
                color: isFavorited ? Colors.red : null,
              ),
              onPressed: () {
                ref.read(favoritesProvider.notifier).toggleFavorite(adId, isFavorited);
              },
            ),
          ],
          loading: () => [],
          error: (_, __) => [],
        ),
      ),
      body: adAsync.when(
        data: (ad) => SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ImageCarousel(images: ad.images ?? []),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      ad.title,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      _formatPrice(ad.price),
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).primaryColor,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Row(
                      children: [
                        _buildInfoChip(context, Icons.category_outlined, ad.category.name),
                        if (ad.neighborhood != null) ...[
                          const SizedBox(width: AppSpacing.sm),
                          _buildInfoChip(
                            context,
                            Icons.location_on_outlined,
                            ad.neighborhood!['name'] as String? ?? '',
                          ),
                        ],
                      ],
                    ),
                    const Divider(height: AppSpacing.xl),
                    Text(
                      'Açıklama',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      ad.description,
                      style: const TextStyle(fontSize: 16, height: 1.5),
                    ),
                    const SizedBox(height: AppSpacing.xl),
                    if (ad.properties != null && ad.properties!.isNotEmpty) ...[
                      Text(
                        'Özellikler',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      _buildPropertiesGrid(ad.properties!),
                      const SizedBox(height: AppSpacing.xl),
                    ],
                    _buildSellerCard(context, ad),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Hata: $error')),
      ),
      bottomSheet: adAsync.when(
        data: (ad) => _buildBottomActions(context, ad),
        loading: () => const SizedBox.shrink(),
        error: (_, __) => const SizedBox.shrink(),
      ),
    );
  }

  Widget _buildInfoChip(BuildContext context, IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.grey[700]),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(fontSize: 13, color: Colors.grey[700], fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertiesGrid(List<Map<String, dynamic>> properties) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[200]!),
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
      ),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: properties.length,
        separatorBuilder: (context, index) => Divider(height: 1, color: Colors.grey[200]),
        itemBuilder: (context, index) {
          final prop = properties[index];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  prop['name'] as String? ?? '',
                  style: const TextStyle(color: Colors.grey, fontSize: 15),
                ),
                Text(
                  prop['value'] as String? ?? '',
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSellerCard(BuildContext context, AdModel ad) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
            child: Icon(Icons.person, color: Theme.of(context).primaryColor),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  ad.seller?['username'] as String? ?? 'Kullanıcı',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const Text(
                  'İlan Sahibi',
                  style: TextStyle(color: Colors.grey, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActions(BuildContext context, AdModel ad) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () => _launchPhone(ad.contactPhone ?? ''),
              icon: const Icon(Icons.phone),
              label: const Text('Ara'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () => _launchWhatsApp(ad.whatsappUrl),
              icon: const Icon(Icons.chat_bubble_outline),
              label: const Text('WhatsApp'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
