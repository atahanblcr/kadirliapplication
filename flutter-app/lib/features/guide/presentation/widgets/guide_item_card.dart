import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../data/models/guide_model.dart';

class GuideItemCard extends StatelessWidget {
  final GuideItemModel item;

  const GuideItemCard({Key? key, required this.item}) : super(key: key);

  Future<void> _launchPhone() async {
    final url = Uri.parse('tel:${item.phone}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Future<void> _launchMap() async {
    if (item.latitude != null && item.longitude != null) {
      final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}');
      if (await canLaunchUrl(url)) {
        await launchUrl(url);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: item.logoUrl != null
            ? CircleAvatar(
                radius: 25,
                backgroundImage: CachedNetworkImageProvider(item.logoUrl!),
                backgroundColor: Colors.transparent,
              )
            : CircleAvatar(
                radius: 25,
                backgroundColor: Colors.blue[100],
                child: const Icon(Icons.business, color: Colors.blue),
              ),
        title: Text(
          item.name,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Text(
          item.category?.name ?? '',
          style: TextStyle(color: Colors.grey[600], fontSize: 13),
        ),
        childrenPadding: const EdgeInsets.all(16),
        expandedCrossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Divider(),
          if (item.description != null && item.description!.isNotEmpty) ...[
            Text(item.description!, style: const TextStyle(fontSize: 14)),
            const SizedBox(height: 12),
          ],
          
          InkWell(
            onTap: _launchPhone,
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  const Icon(Icons.phone, color: Colors.blue, size: 20),
                  const SizedBox(width: 12),
                  Text(
                    item.phone,
                    style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),
          ),
          
          if (item.address != null && item.address!.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.location_on, color: Colors.grey, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      item.address!,
                      style: const TextStyle(color: Colors.black87),
                    ),
                  ),
                ],
              ),
            ),

          if (item.workingHours != null && item.workingHours!.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  const Icon(Icons.access_time, color: Colors.grey, size: 20),
                  const SizedBox(width: 12),
                  Text(item.workingHours!),
                ],
              ),
            ),

          if (item.latitude != null && item.longitude != null) ...[
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _launchMap,
                icon: const Icon(Icons.map),
                label: const Text('Haritada Gör'),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
