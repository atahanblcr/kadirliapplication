import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/campaigns_provider.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/sliver_parallax_cover.dart';

class CampaignDetailPage extends ConsumerStatefulWidget {
  final String campaignId;

  const CampaignDetailPage({Key? key, required this.campaignId}) : super(key: key);

  @override
  ConsumerState<CampaignDetailPage> createState() => _CampaignDetailPageState();
}

class _CampaignDetailPageState extends ConsumerState<CampaignDetailPage> {
  bool _isLoadingCode = false;
  String? _discountCode;
  String? _terms;
  String? _errorMessage;

  Future<void> _viewCode() async {
    setState(() {
      _isLoadingCode = true;
      _errorMessage = null;
    });

    try {
      final repository = ref.read(campaignsRepositoryProvider);
      final result = await repository.viewCode(widget.campaignId);
      
      setState(() {
        _discountCode = result['discount_code'];
        _terms = result['terms'];
        _isLoadingCode = false;
      });
      
      // Detay sayfasını yenileyerek görüntülenme sayısını güncelle
      ref.invalidate(campaignDetailProvider(widget.campaignId));
    } catch (e) {
      setState(() {
        _isLoadingCode = false;
        if (e is AppException) {
          _errorMessage = e.message;
        } else {
          _errorMessage = 'Kod alınırken bir hata oluştu.';
        }
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(_errorMessage!)),
        );
      }
    }
  }

  Future<void> _launchMap(double lat, double lng) async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Future<void> _launchPhone(String phone) async {
    final url = Uri.parse('tel:$phone');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
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

  Widget _kvRow(BuildContext context, IconData icon, String text) {
    final cs = Theme.of(context).colorScheme;
    return Row(
      children: [
        Icon(icon, size: 19, color: AppColors.primary),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          child: Text(
            text,
            style: AppTextStyles.bodyMedium.copyWith(color: cs.onSurface),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final campaignAsync = ref.watch(campaignDetailProvider(widget.campaignId));

    return Scaffold(
      body: campaignAsync.when(
        data: (campaign) {
          final cs = Theme.of(context).colorScheme;
          // Kalan gün hesaplama
          String remainingDays = '';
          if (campaign.endDate != null) {
            final endDate = DateTime.tryParse(campaign.endDate!);
            if (endDate != null) {
              final now = DateTime.now();
              final diff = endDate.difference(now).inDays;
              if (diff < 0) {
                remainingDays = 'Süresi Doldu';
              } else if (diff == 0) {
                remainingDays = 'Son Gün!';
              } else {
                remainingDays = 'Son $diff gün';
              }
            }
          }

          return CustomScrollView(
            slivers: [
              SliverParallaxCover(
                title: 'Kampanya Detayı',
                placeholderIcon: Icons.local_offer_rounded,
                imageUrls: campaign.images.isNotEmpty
                    ? campaign.images.map((e) => e.imageUrl ?? '').toList()
                    : (campaign.coverImageUrl != null
                        ? [campaign.coverImageUrl!]
                        : const <String>[]),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // İşletme ve süre
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (campaign.business != null)
                            Expanded(
                              child: Text(
                                campaign.business!.name.toUpperCase(),
                                style: AppTextStyles.labelMedium.copyWith(
                                  color: AppColors.primary,
                                  letterSpacing: 0.6,
                                ),
                              ),
                            ),
                          if (remainingDays.isNotEmpty)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.error.withValues(alpha: 0.12),
                                borderRadius:
                                    BorderRadius.circular(AppSpacing.radiusFull),
                              ),
                              child: Text(
                                remainingDays,
                                style: AppTextStyles.labelSmall
                                    .copyWith(color: AppColors.error),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.smLg),

                      // Başlık
                      Text(
                        campaign.title,
                        style: AppTextStyles.headlineLarge
                            .copyWith(color: cs.onSurface),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // İndirim ve görüntülenme
                      Row(
                        children: [
                          if (campaign.discountPercentage != null) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 7),
                              decoration: BoxDecoration(
                                color:
                                    AppColors.success.withValues(alpha: 0.12),
                                borderRadius:
                                    BorderRadius.circular(AppSpacing.radiusFull),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.percent_rounded,
                                      size: 16, color: AppColors.success),
                                  const SizedBox(width: 4),
                                  Text(
                                    '%${campaign.discountPercentage} İndirim',
                                    style: AppTextStyles.labelLarge
                                        .copyWith(color: AppColors.success),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: AppSpacing.smLg),
                          ],
                          Icon(Icons.visibility_rounded,
                              size: 15, color: cs.onSurfaceVariant),
                          const SizedBox(width: 4),
                          Text(
                            '${campaign.codeViewCount ?? 0} görüntülenme',
                            style: AppTextStyles.bodySmall
                                .copyWith(color: cs.onSurfaceVariant),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.lg),

                      // Açıklama
                      if (campaign.description != null &&
                          campaign.description!.isNotEmpty) ...[
                        _sectionTitle(context, 'Kampanya Detayı'),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          campaign.description!,
                          style: AppTextStyles.bodyLarge
                              .copyWith(color: cs.onSurfaceVariant),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                      ],

                      // Minimum tutar ve stok limiti
                      if (campaign.minimumAmount != null ||
                          campaign.stockLimit != null) ...[
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: cs.surfaceContainerHighest,
                            borderRadius:
                                BorderRadius.circular(AppSpacing.radiusXl),
                          ),
                          child: Column(
                            children: [
                              if (campaign.minimumAmount != null) ...[
                                _kvRow(
                                  context,
                                  Icons.shopping_cart_rounded,
                                  'Minimum Tutar: ₺${campaign.minimumAmount!.toStringAsFixed(2)}',
                                ),
                                if (campaign.stockLimit != null)
                                  const SizedBox(height: AppSpacing.smLg),
                              ],
                              if (campaign.stockLimit != null)
                                _kvRow(
                                  context,
                                  Icons.inventory_2_rounded,
                                  'Stok Sınırı: ${campaign.stockLimit} adet',
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                      ],

                      // İşletme bilgileri
                      if (campaign.business != null) ...[
                        _sectionTitle(context, 'İşletme Bilgileri'),
                        const SizedBox(height: AppSpacing.smLg),
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: cs.surfaceContainerHighest,
                            borderRadius:
                                BorderRadius.circular(AppSpacing.radiusXl),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                campaign.business!.name,
                                style: AppTextStyles.titleLarge.copyWith(
                                  color: cs.onSurface,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.smLg),
                              if (campaign.business!.phone != null)
                                InkWell(
                                  onTap: () =>
                                      _launchPhone(campaign.business!.phone!),
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 4),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.phone_rounded,
                                            size: 18, color: AppColors.primary),
                                        const SizedBox(width: AppSpacing.sm),
                                        Text(
                                          campaign.business!.phone!,
                                          style: AppTextStyles.bodyMedium
                                              .copyWith(
                                            color: AppColors.primary,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              if (campaign.business!.address != null) ...[
                                const SizedBox(height: AppSpacing.sm),
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Icon(Icons.location_on_rounded,
                                        size: 18, color: cs.onSurfaceVariant),
                                    const SizedBox(width: AppSpacing.sm),
                                    Expanded(
                                      child: Text(
                                        campaign.business!.address!,
                                        style: AppTextStyles.bodyMedium
                                            .copyWith(color: cs.onSurface),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                              if (campaign.business!.latitude != null &&
                                  campaign.business!.longitude != null) ...[
                                const SizedBox(height: AppSpacing.smLg),
                                SizedBox(
                                  width: double.infinity,
                                  child: OutlinedButton.icon(
                                    onPressed: () => _launchMap(
                                        campaign.business!.latitude!,
                                        campaign.business!.longitude!),
                                    icon: const Icon(Icons.map_rounded,
                                        size: 18),
                                    label: const Text('Haritada Gör'),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: AppColors.primary,
                                      side: BorderSide(
                                          color: AppColors.primary
                                              .withValues(alpha: 0.4)),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(
                                            AppSpacing.radiusLg),
                                      ),
                                    ),
                                  ),
                                ),
                              ]
                            ],
                          ),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                      ],

                      // İndirim kodu alanı
                      Divider(height: AppSpacing.xl, color: cs.outlineVariant),
                      if (_discountCode != null ||
                          campaign.discountCode != null) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(AppSpacing.lg),
                          decoration: BoxDecoration(
                            color: AppColors.success.withValues(alpha: 0.10),
                            border: Border.all(
                              color: AppColors.success.withValues(alpha: 0.30),
                            ),
                            borderRadius:
                                BorderRadius.circular(AppSpacing.radiusXxl),
                          ),
                          child: Column(
                            children: [
                              Text(
                                'İndirim Kodunuz',
                                style: AppTextStyles.titleMedium
                                    .copyWith(color: AppColors.success),
                              ),
                              const SizedBox(height: AppSpacing.sm),
                              Text(
                                _discountCode ?? campaign.discountCode!,
                                style: AppTextStyles.displayMedium.copyWith(
                                  color: AppColors.success,
                                  letterSpacing: 3,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.sm),
                              Text(
                                'Bu kodu işletmeye göstererek indirimden faydalanabilirsiniz.',
                                textAlign: TextAlign.center,
                                style: AppTextStyles.bodySmall
                                    .copyWith(color: cs.onSurfaceVariant),
                              ),
                            ],
                          ),
                        ),
                        if (_terms != null || campaign.terms != null) ...[
                          const SizedBox(height: AppSpacing.md),
                          _sectionTitle(context, 'Kullanım Koşulları'),
                          const SizedBox(height: AppSpacing.sm),
                          Text(
                            _terms ?? campaign.terms!,
                            style: AppTextStyles.bodyMedium
                                .copyWith(color: cs.onSurfaceVariant),
                          ),
                        ],
                      ] else ...[
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: FilledButton.icon(
                            onPressed: _isLoadingCode ? null : _viewCode,
                            icon: _isLoadingCode
                                ? const SizedBox(
                                    width: 22,
                                    height: 22,
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2, color: Colors.white))
                                : const Icon(Icons.local_activity_rounded,
                                    size: 22),
                            label: Text(
                              _isLoadingCode
                                  ? 'Kod Alınıyor...'
                                  : 'İndirim Kodunu Gör',
                              style: AppTextStyles.titleLarge
                                  .copyWith(color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                      const SizedBox(height: AppSpacing.xl),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
        loading: () => const DetailStateView(
          title: 'Kampanya Detayı',
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => DetailStateView(
          title: 'Kampanya Detayı',
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
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
                  'Kampanya detayları yüklenemedi.',
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                ElevatedButton(
                  onPressed: () =>
                      ref.refresh(campaignDetailProvider(widget.campaignId)),
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
