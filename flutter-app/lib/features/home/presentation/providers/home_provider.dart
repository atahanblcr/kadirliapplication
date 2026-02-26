import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Module item model
class ModuleItem {
  final String key;
  final String title;
  final IconData icon;
  final Color color;

  ModuleItem({
    required this.key,
    required this.title,
    required this.icon,
    required this.color,
  });
}

/// Static module list provider
final moduleListProvider = Provider<List<ModuleItem>>((ref) {
  return [
    ModuleItem(
      key: 'announcements',
      title: 'Duyurular',
      icon: Icons.campaign,
      color: const Color(0xFF2196F3), // Mavi
    ),
    ModuleItem(
      key: 'ads',
      title: 'İlanlar',
      icon: Icons.shopping_bag,
      color: const Color(0xFF1976D2), // Primary
    ),
    ModuleItem(
      key: 'deaths',
      title: 'Vefat İlanları',
      icon: Icons.sentiment_very_dissatisfied,
      color: const Color(0xFF424242), // Gri
    ),
    ModuleItem(
      key: 'campaigns',
      title: 'Kampanyalar',
      icon: Icons.local_offer,
      color: const Color(0xFFE91E63), // Pembe
    ),
    ModuleItem(
      key: 'events',
      title: 'Etkinlikler',
      icon: Icons.event,
      color: const Color(0xFF4CAF50), // Yeşil
    ),
    ModuleItem(
      key: 'guide',
      title: 'Rehber',
      icon: Icons.menu_book,
      color: const Color(0xFFFF9800), // Turuncu
    ),
    ModuleItem(
      key: 'places',
      title: 'Mekanlar',
      icon: Icons.place,
      color: const Color(0xFF00BCD4), // Cyan
    ),
    ModuleItem(
      key: 'pharmacy',
      title: 'Nöbetçi Eczane',
      icon: Icons.local_pharmacy,
      color: const Color(0xFF43A047), // Koyu Yeşil
    ),
    ModuleItem(
      key: 'transport',
      title: 'Ulaşım',
      icon: Icons.directions_bus,
      color: const Color(0xFF5C6BC0), // İndigo
    ),
    ModuleItem(
      key: 'taxi',
      title: 'Taksi',
      icon: Icons.local_taxi,
      color: const Color(0xFFFBC02D), // Sarı
    ),
    ModuleItem(
      key: 'jobs',
      title: 'İş İlanları',
      icon: Icons.work_outline,
      color: const Color(0xFF8E24AA), // Mor
    ),
    ModuleItem(
      key: 'notifications',
      title: 'Bildirimler',
      icon: Icons.notifications,
      color: const Color(0xFF29B6F6), // Info Blue
    ),
  ];
});
