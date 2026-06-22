import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';

/// Module item model — premium bento tile'ları besler.
class ModuleItem {
  final String key;
  final String title;

  /// Kısa açıklama (hero / geniş tile'larda alt metin).
  final String subtitle;
  final IconData icon;

  /// Tile'ın canlı çift renk gradyanı.
  final List<Color> gradient;

  ModuleItem({
    required this.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.gradient,
  });

  /// Birincil marka rengi (glow / icon chip).
  Color get color => gradient.first;
}

/// Static module list provider
final moduleListProvider = Provider<List<ModuleItem>>((ref) {
  return [
    ModuleItem(
      key: 'announcements',
      title: 'Duyurular',
      subtitle: 'Şehrinden son haberler ve resmi duyurular',
      icon: Icons.campaign_rounded,
      gradient: AppColors.gAnnouncements,
    ),
    ModuleItem(
      key: 'ads',
      title: 'İlanlar',
      subtitle: 'Al, sat, kirala',
      icon: Icons.storefront_rounded,
      gradient: AppColors.gAds,
    ),
    ModuleItem(
      key: 'deaths',
      title: 'Vefat İlanları',
      subtitle: 'Başınız sağ olsun',
      icon: Icons.local_florist_rounded,
      gradient: AppColors.gDeaths,
    ),
    ModuleItem(
      key: 'campaigns',
      title: 'Kampanyalar',
      subtitle: 'Fırsatları kaçırma',
      icon: Icons.local_offer_rounded,
      gradient: AppColors.gCampaigns,
    ),
    ModuleItem(
      key: 'events',
      title: 'Etkinlikler',
      subtitle: 'Şehirde bugün ne var?',
      icon: Icons.celebration_rounded,
      gradient: AppColors.gEvents,
    ),
    ModuleItem(
      key: 'guide',
      title: 'Rehber',
      subtitle: 'Önemli numaralar',
      icon: Icons.menu_book_rounded,
      gradient: AppColors.gGuide,
    ),
    ModuleItem(
      key: 'places',
      title: 'Mekanlar',
      subtitle: 'Gezilecek yerler',
      icon: Icons.place_rounded,
      gradient: AppColors.gPlaces,
    ),
    ModuleItem(
      key: 'pharmacy',
      title: 'Nöbetçi Eczane',
      subtitle: 'Bu gece açık',
      icon: Icons.local_pharmacy_rounded,
      gradient: AppColors.gPharmacy,
    ),
    ModuleItem(
      key: 'transport',
      title: 'Ulaşım',
      subtitle: 'Otobüs & saatler',
      icon: Icons.directions_bus_rounded,
      gradient: AppColors.gTransport,
    ),
    ModuleItem(
      key: 'taxi',
      title: 'Taksi',
      subtitle: 'Hemen çağır',
      icon: Icons.local_taxi_rounded,
      gradient: AppColors.gTaxi,
    ),
    ModuleItem(
      key: 'notifications',
      title: 'Bildirimler',
      subtitle: 'Sana özel güncellemeler',
      icon: Icons.notifications_active_rounded,
      gradient: AppColors.gNotifications,
    ),
  ];
});
