import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/campaigns_provider.dart';
import '../../../../core/exceptions/app_exception.dart';

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

  @override
  Widget build(BuildContext context) {
    final campaignAsync = ref.watch(campaignDetailProvider(widget.campaignId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kampanya Detayı'),
      ),
      body: campaignAsync.when(
        data: (campaign) {
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

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Resimler
                if (campaign.images.isNotEmpty)
                  SizedBox(
                    height: 250,
                    child: PageView.builder(
                      itemCount: campaign.images.length,
                      itemBuilder: (context, index) {
                        return CachedNetworkImage(
                          imageUrl: campaign.images[index].imageUrl ?? '',
                          fit: BoxFit.cover,
                          placeholder: (context, url) => const Center(
                            child: CircularProgressIndicator(),
                          ),
                          errorWidget: (context, url, error) => const Icon(Icons.broken_image, size: 50, color: Colors.grey),
                        );
                      },
                    ),
                  )
                else if (campaign.coverImageUrl != null)
                  SizedBox(
                    height: 250,
                    width: double.infinity,
                    child: CachedNetworkImage(
                      imageUrl: campaign.coverImageUrl!,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => const Center(
                        child: CircularProgressIndicator(),
                      ),
                      errorWidget: (context, url, error) => const Icon(Icons.broken_image, size: 50, color: Colors.grey),
                    ),
                  )
                else
                  Container(
                    height: 250,
                    width: double.infinity,
                    color: Colors.grey[200],
                    child: const Icon(Icons.local_offer, size: 80, color: Colors.grey),
                  ),

                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // İşletme ve Süre
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (campaign.business != null)
                            Expanded(
                              child: Text(
                                campaign.business!.name,
                                style: TextStyle(
                                  color: Theme.of(context).primaryColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          if (remainingDays.isNotEmpty)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.red[50],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                remainingDays,
                                style: TextStyle(
                                  color: Colors.red[700],
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Başlık
                      Text(
                        campaign.title,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // İndirim Bilgisi ve Görüntülenme
                      Row(
                        children: [
                          if (campaign.discountPercentage != null) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.green[50],
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                children: [
                                  Icon(Icons.percent, size: 18, color: Colors.green[700]),
                                  const SizedBox(width: 4),
                                  Text(
                                    '%${campaign.discountPercentage} İndirim',
                                    style: TextStyle(
                                      color: Colors.green[700],
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                          ],
                          Row(
                            children: [
                              const Icon(Icons.visibility, size: 16, color: Colors.grey),
                              const SizedBox(width: 4),
                              Text(
                                '${campaign.codeViewCount ?? 0} defa görüntülendi',
                                style: const TextStyle(color: Colors.grey),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Açıklama
                      if (campaign.description != null && campaign.description!.isNotEmpty) ...[
                        const Text(
                          'Kampanya Detayı',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          campaign.description!,
                          style: const TextStyle(fontSize: 15, height: 1.5),
                        ),
                        const SizedBox(height: 24),
                      ],

                      // Minimum Tutar ve Stok Limiti
                      if (campaign.minimumAmount != null || campaign.stockLimit != null) ...[
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.blue[50],
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            children: [
                              if (campaign.minimumAmount != null) ...[
                                Row(
                                  children: [
                                    Icon(Icons.shopping_cart, size: 20, color: Colors.blue[700]),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Minimum Tutar: ₺${campaign.minimumAmount!.toStringAsFixed(2)}',
                                      style: TextStyle(color: Colors.blue[900], fontWeight: FontWeight.w500),
                                    ),
                                  ],
                                ),
                                if (campaign.stockLimit != null) const SizedBox(height: 8),
                              ],
                              if (campaign.stockLimit != null)
                                Row(
                                  children: [
                                    Icon(Icons.inventory, size: 20, color: Colors.blue[700]),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Stok Sınırı: ${campaign.stockLimit} adet',
                                      style: TextStyle(color: Colors.blue[900], fontWeight: FontWeight.w500),
                                    ),
                                  ],
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],

                      // İşletme Bilgileri
                      if (campaign.business != null) ...[
                        const Text(
                          'İşletme Bilgileri',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Card(
                          elevation: 0,
                          color: Colors.grey[100],
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  campaign.business!.name,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                                const SizedBox(height: 12),
                                if (campaign.business!.phone != null)
                                  InkWell(
                                    onTap: () => _launchPhone(campaign.business!.phone!),
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(vertical: 4),
                                      child: Row(
                                        children: [
                                          const Icon(Icons.phone, size: 18, color: Colors.blue),
                                          const SizedBox(width: 8),
                                          Text(
                                            campaign.business!.phone!,
                                            style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w500),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                if (campaign.business!.address != null) ...[
                                  const SizedBox(height: 8),
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Icon(Icons.location_on, size: 18, color: Colors.grey),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          campaign.business!.address!,
                                          style: const TextStyle(color: Colors.black87),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                                if (campaign.business!.latitude != null && campaign.business!.longitude != null) ...[
                                  const SizedBox(height: 12),
                                  SizedBox(
                                    width: double.infinity,
                                    child: OutlinedButton.icon(
                                      onPressed: () => _launchMap(campaign.business!.latitude!, campaign.business!.longitude!),
                                      icon: const Icon(Icons.map),
                                      label: const Text('Haritada Gör'),
                                    ),
                                  ),
                                ]
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],

                      // İndirim Kodu Alanı
                      const Divider(height: 32),
                      if (_discountCode != null || campaign.discountCode != null) ...[
                        // Kod zaten görünür veya yeni alındı
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.green[50],
                            border: Border.all(color: Colors.green[200]!),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            children: [
                              const Text(
                                'İndirim Kodunuz',
                                style: TextStyle(fontSize: 16, color: Colors.green),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                _discountCode ?? campaign.discountCode!,
                                style: TextStyle(
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green[800],
                                  letterSpacing: 2,
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Bu kodu işletmeye göstererek indirimden faydalanabilirsiniz.',
                                textAlign: TextAlign.center,
                                style: TextStyle(color: Colors.black54, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                        if (_terms != null || campaign.terms != null) ...[
                          const SizedBox(height: 16),
                          const Text(
                            'Kullanım Koşulları',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _terms ?? campaign.terms!,
                            style: const TextStyle(fontSize: 14, color: Colors.black87),
                          ),
                        ],
                      ] else ...[
                        // İndirim kodu alma butonu
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton.icon(
                            onPressed: _isLoadingCode ? null : _viewCode,
                            icon: _isLoadingCode 
                                ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : const Icon(Icons.local_activity, size: 24),
                            label: Text(
                              _isLoadingCode ? 'Kod Alınıyor...' : 'İndirim Kodunu Gör',
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Theme.of(context).primaryColor,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                        ),
                      ],
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                const Text('Kampanya detayları yüklenemedi.'),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.refresh(campaignDetailProvider(widget.campaignId)),
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
