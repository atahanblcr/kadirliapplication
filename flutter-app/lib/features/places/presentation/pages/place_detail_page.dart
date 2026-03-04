import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/places_provider.dart';

class PlaceDetailPage extends ConsumerWidget {
  final String placeId;

  const PlaceDetailPage({Key? key, required this.placeId}) : super(key: key);

  Future<void> _launchMap(double lat, double lng) async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final placeAsync = ref.watch(placeDetailProvider(placeId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mekan Detayı'),
      ),
      body: placeAsync.when(
        data: (place) {
          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Resimler
                if (place.images.isNotEmpty)
                  SizedBox(
                    height: 250,
                    child: PageView.builder(
                      itemCount: place.images.length,
                      itemBuilder: (context, index) {
                        return CachedNetworkImage(
                          imageUrl: place.images[index].imageUrl ?? '',
                          fit: BoxFit.cover,
                          placeholder: (context, url) => const Center(
                            child: CircularProgressIndicator(),
                          ),
                          errorWidget: (context, url, error) => const Icon(Icons.broken_image, size: 50, color: Colors.grey),
                        );
                      },
                    ),
                  )
                else if (place.coverImageUrl != null)
                  SizedBox(
                    height: 250,
                    width: double.infinity,
                    child: CachedNetworkImage(
                      imageUrl: place.coverImageUrl!,
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
                    child: const Icon(Icons.place, size: 80, color: Colors.grey),
                  ),

                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Kategori ve Ücret
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (place.category != null)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Theme.of(context).primaryColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                place.category!.name,
                                style: TextStyle(
                                  color: Theme.of(context).primaryColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            )
                          else
                            const SizedBox.shrink(),
                          
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: place.isFree ? Colors.green[50] : Colors.orange[50],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              place.isFree ? 'Ücretsiz' : (place.entranceFee != null ? '₺${place.entranceFee!.toStringAsFixed(0)}' : 'Ücretli'),
                              style: TextStyle(
                                color: place.isFree ? Colors.green[700] : Colors.orange[800],
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Başlık
                      Text(
                        place.name,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      
                      // Uzaklık
                      if (place.distanceFromCenter != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          'Şehir merkezine ${place.distanceFromCenter} km uzaklıkta',
                          style: TextStyle(color: Colors.blueGrey[600], fontWeight: FontWeight.w500),
                        ),
                      ],
                      const SizedBox(height: 24),

                      // Adres ve Harita
                      if (place.address != null || (place.latitude != null && place.longitude != null))
                        Card(
                          elevation: 0,
                          color: Colors.blue[50],
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              children: [
                                if (place.address != null)
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Icon(Icons.location_on, color: Colors.blue, size: 24),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          place.address!,
                                          style: const TextStyle(fontSize: 15, color: Colors.black87),
                                        ),
                                      ),
                                    ],
                                  ),
                                if (place.address != null && place.latitude != null && place.longitude != null)
                                  const SizedBox(height: 16),
                                if (place.latitude != null && place.longitude != null)
                                  SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton.icon(
                                      onPressed: () => _launchMap(place.latitude!, place.longitude!),
                                      icon: const Icon(Icons.map),
                                      label: const Text('Haritada Yol Tarifi Al'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.blue[600],
                                        foregroundColor: Colors.white,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                      
                      const SizedBox(height: 24),

                      // Detaylı Bilgiler
                      if (place.openingHours != null || place.bestSeason != null) ...[
                        const Text(
                          'Ziyaret Bilgileri',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        if (place.openingHours != null)
                          ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(color: Colors.grey[200], shape: BoxShape.circle),
                              child: const Icon(Icons.access_time, color: Colors.black87),
                            ),
                            title: const Text('Ziyaret Saatleri'),
                            subtitle: Text(place.openingHours!),
                            contentPadding: EdgeInsets.zero,
                          ),
                        if (place.bestSeason != null)
                          ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(color: Colors.grey[200], shape: BoxShape.circle),
                              child: const Icon(Icons.wb_sunny, color: Colors.black87),
                            ),
                            title: const Text('En İyi Mevsim'),
                            subtitle: Text(place.bestSeason!),
                            contentPadding: EdgeInsets.zero,
                          ),
                        const SizedBox(height: 16),
                      ],

                      // Açıklama
                      if (place.description != null && place.description!.isNotEmpty) ...[
                        const Divider(),
                        const SizedBox(height: 16),
                        const Text(
                          'Mekan Hakkında',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          place.description!,
                          style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.black87),
                        ),
                        const SizedBox(height: 24),
                      ],

                      // Nasıl Gidilir
                      if (place.howToGetThere != null && place.howToGetThere!.isNotEmpty) ...[
                        const Divider(),
                        const SizedBox(height: 16),
                        const Text(
                          'Nasıl Gidilir?',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          place.howToGetThere!,
                          style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.black87),
                        ),
                        const SizedBox(height: 32),
                      ],
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
                const Text('Mekan detayları yüklenemedi.'),
                const SizedBox(height: 16),
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
