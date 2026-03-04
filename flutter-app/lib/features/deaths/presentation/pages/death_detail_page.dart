import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/deaths_provider.dart';

class DeathDetailPage extends ConsumerWidget {
  final String id;

  const DeathDetailPage({required this.id, super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(deathDetailProvider(id));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Vefat İlanı Detayı'),
      ),
      body: detailAsync.when(
        data: (notice) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Photo
                if (notice.photo != null)
                  Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        notice.photo!.url,
                        height: 250,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                  )
                else
                  Center(
                    child: Container(
                      height: 150,
                      width: 150,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.person, size: 80, color: Colors.grey),
                    ),
                  ),
                const SizedBox(height: 24),
                // Name & Age
                Center(
                  child: Text(
                    notice.deceasedName,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                if (notice.age != null)
                  Center(
                    child: Text(
                      '${notice.age} yaşında',
                      style: TextStyle(fontSize: 16, color: Colors.grey[700]),
                    ),
                  ),
                const SizedBox(height: 32),
                // Details
                Text(
                  'Cenaze Bilgileri',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
                const Divider(),
                const SizedBox(height: 8),
                _buildInfoRow(
                  context: context,
                  icon: Icons.event,
                  title: 'Tarih & Saat',
                  value: '${_formatDate(notice.funeralDate)} - ${notice.funeralTime}',
                ),
                if (notice.mosque != null)
                  _buildInfoRow(
                    context: context,
                    icon: Icons.location_city,
                    title: 'Camii',
                    value: notice.mosque!.name,
                    actionIcon: (notice.mosque!.latitude != null && notice.mosque!.longitude != null) 
                        ? Icons.map 
                        : null,
                    onActionTap: (notice.mosque!.latitude != null && notice.mosque!.longitude != null)
                        ? () => _launchMaps(notice.mosque!.latitude!, notice.mosque!.longitude!, notice.mosque!.name)
                        : null,
                  ),
                if (notice.cemetery != null)
                  _buildInfoRow(
                    context: context,
                    icon: Icons.account_balance,
                    title: 'Mezarlık',
                    value: notice.cemetery!.name,
                    actionIcon: (notice.cemetery!.latitude != null && notice.cemetery!.longitude != null) 
                        ? Icons.map 
                        : null,
                    onActionTap: (notice.cemetery!.latitude != null && notice.cemetery!.longitude != null)
                        ? () => _launchMaps(notice.cemetery!.latitude!, notice.cemetery!.longitude!, notice.cemetery!.name)
                        : null,
                  ),
                if (notice.condolenceAddress != null && notice.condolenceAddress!.isNotEmpty) ...[
                  const SizedBox(height: 24),
                  Text(
                    'Taziye Adresi',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  const Divider(),
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.location_on, color: Colors.grey),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          notice.condolenceAddress!,
                          style: const TextStyle(fontSize: 16),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Hata: $error')),
      ),
    );
  }

  Widget _buildInfoRow({
    required BuildContext context,
    required IconData icon, 
    required String title, 
    required String value,
    VoidCallback? onActionTap,
    IconData? actionIcon,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.grey, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(color: Colors.grey[600], fontSize: 14),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
          if (onActionTap != null && actionIcon != null)
            IconButton(
              icon: Icon(actionIcon, color: Theme.of(context).colorScheme.primary),
              onPressed: onActionTap,
            ),
        ],
      ),
    );
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd.MM.yyyy').format(date);
    } catch (e) {
      return dateString;
    }
  }

  Future<void> _launchMaps(double lat, double lng, String label) async {
    final uri = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}
