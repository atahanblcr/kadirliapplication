import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/models/death_model.dart';
import '../pages/death_detail_page.dart';
import '../../../../core/widgets/app_card.dart';

class DeathCard extends StatelessWidget {
  final DeathNoticeModel notice;

  const DeathCard({required this.notice, super.key});

  /// Liste kartı ile detay sayfasındaki fotoğrafın Hero geçişini eşleştiren etiket
  static String heroTag(String noticeId) => 'death-photo-$noticeId';

  @override
  Widget build(BuildContext context) {
    return AppCard(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      radius: 12,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DeathDetailPage(id: notice.id),
          ),
        );
      },
      padding: const EdgeInsets.all(16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Photo
          Hero(
            tag: DeathCard.heroTag(notice.id),
            child: Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                shape: BoxShape.circle,
                image: notice.photoUrl != null
                    ? DecorationImage(
                        image: NetworkImage(notice.photoUrl!),
                        fit: BoxFit.cover,
                      )
                    : null,
              ),
              child: notice.photoUrl == null
                  ? const Icon(Icons.person, size: 40, color: Colors.grey)
                  : null,
            ),
          ),
          const SizedBox(width: 16),
          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  notice.deceasedName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (notice.age != null)
                  Text(
                    '${notice.age} yaşında',
                    style: TextStyle(color: Colors.grey[700], fontSize: 14),
                  ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.event,
                        size: 16, color: Theme.of(context).colorScheme.primary),
                    const SizedBox(width: 4),
                    Text(
                      'Cenaze: ${_formatDate(notice.funeralDate)} - ${notice.funeralTime}',
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                if (notice.mosque != null)
                  Row(
                    children: [
                      const Icon(Icons.location_city,
                          size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          notice.mosque!.name,
                          style: const TextStyle(fontSize: 14),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                if (notice.cemetery != null)
                  Row(
                    children: [
                      const Icon(Icons.account_balance,
                          size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          notice.cemetery!.name,
                          style: const TextStyle(fontSize: 14),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
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
}
