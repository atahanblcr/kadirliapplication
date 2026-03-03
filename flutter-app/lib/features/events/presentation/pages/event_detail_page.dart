import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:share_plus/share_plus.dart';
import '../providers/events_provider.dart';
import '../../data/models/event_model.dart';

class EventDetailPage extends ConsumerWidget {
  final String eventId;

  const EventDetailPage({super.key, required this.eventId});

  Future<void> _openMap(double lat, double lng, String name) async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Future<void> _openUrl(String urlString) async {
    final url = Uri.parse(urlString);
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventAsyncValue = ref.watch(eventDetailProvider(eventId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Etkinlik Detayı'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              Share.share('Bu etkinliğe göz at: https://kadirliapp.com/events/$eventId');
            },
          ),
        ],
      ),
      body: eventAsyncValue.when(
        data: (event) => _buildDetail(context, event),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Hata: $error')),
      ),
    );
  }

  Widget _buildDetail(BuildContext context, EventDetailModel event) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (event.images.isNotEmpty)
            SizedBox(
              height: 250,
              width: double.infinity,
              child: PageView.builder(
                itemCount: event.images.length,
                itemBuilder: (context, index) {
                  return CachedNetworkImage(
                    imageUrl: event.images[index].url,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                    errorWidget: (context, url, error) => const Icon(Icons.error),
                  );
                },
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (event.category != null)
                  Chip(
                    label: Text(
                      event.category!.name,
                      style: const TextStyle(color: Colors.white),
                    ),
                    backgroundColor: Theme.of(context).primaryColor,
                  ),
                const SizedBox(height: 8),
                Text(
                  event.title,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                
                // Date & Time
                Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 20, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text(
                      '${event.eventDate} - ${event.eventTime}',
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
                if (event.durationMinutes != null) ...[
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.timer, size: 20, color: Colors.grey),
                      const SizedBox(width: 8),
                      Text(
                        'Süre: ${event.durationMinutes} dakika',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 8),
                
                // Venue
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.location_on, size: 20, color: Colors.grey),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            event.venueName,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          if (event.venueAddress != null)
                            Text(
                              event.venueAddress!,
                              style: const TextStyle(fontSize: 14, color: Colors.grey),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
                if (event.latitude != null && event.longitude != null) ...[
                  const SizedBox(height: 8),
                  ElevatedButton.icon(
                    onPressed: () => _openMap(event.latitude!, event.longitude!, event.venueName),
                    icon: const Icon(Icons.map),
                    label: const Text('Haritada Gör'),
                  ),
                ],
                
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 16),
                
                // Details
                if (event.organizer != null) ...[
                  Text('Düzenleyen: ${event.organizer}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                ],
                
                Row(
                  children: [
                    if (event.isFree)
                      const Chip(
                        label: Text('Ücretsiz', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        backgroundColor: Colors.green,
                      )
                    else if (event.ticketPrice != null)
                      Chip(
                        label: Text('Bilet: ${event.ticketPrice} ₺'),
                        backgroundColor: Colors.blue.shade100,
                      ),
                    const SizedBox(width: 8),
                    if (event.capacity != null)
                      Chip(
                        label: Text('Kapasite: ${event.capacity}'),
                        backgroundColor: Colors.orange.shade100,
                      ),
                  ],
                ),
                
                if (event.ageRestriction != null) ...[
                  const SizedBox(height: 8),
                  Text('Yaş Sınırı: ${event.ageRestriction}'),
                ],
                
                if (event.websiteUrl != null) ...[
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () => _openUrl(event.websiteUrl!),
                    icon: const Icon(Icons.link),
                    label: const Text('Etkinlik Web Sitesi'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 48),
                    ),
                  ),
                ],
                
                const SizedBox(height: 16),
                const Text('Açıklama', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(
                  event.description ?? 'Açıklama bulunmuyor.',
                  style: const TextStyle(fontSize: 15, height: 1.5),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
