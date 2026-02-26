import 'package:flutter/material.dart';

/// Announcement type: id, name, slug, icon, color
class AnnouncementTypeModel {
  final String id;
  final String name;
  final String slug;
  final String? icon;
  final String? color;

  AnnouncementTypeModel({
    required this.id,
    required this.name,
    required this.slug,
    this.icon,
    this.color,
  });

  factory AnnouncementTypeModel.fromJson(Map<String, dynamic> json) {
    return AnnouncementTypeModel(
      id: json['id'] as String,
      name: json['name'] as String? ?? 'Duyuru',
      slug: json['slug'] as String? ?? '',
      icon: json['icon'] as String?,
      color: json['color'] as String?,
    );
  }

  /// Map icon string to Flutter IconData
  /// Unknown icons default to Icons.campaign
  static const Map<String, IconData> _iconMap = {
    'flash_on': Icons.flash_on,
    'water_drop': Icons.water_drop,
    'campaign': Icons.campaign,
    'warning': Icons.warning_amber,
    'info': Icons.info_outline,
    'event': Icons.event,
    'announcement': Icons.announcement,
    'notifications': Icons.notifications,
    'error': Icons.error_outline,
    'check_circle': Icons.check_circle,
  };

  /// Get IconData for this type (fallback to campaign)
  IconData get iconData {
    if (icon == null || icon!.isEmpty) return Icons.campaign;
    return _iconMap[icon!] ?? Icons.campaign;
  }

  /// Parse color hex string to Color
  /// Returns primary blue if invalid
  Color get typeColor {
    if (color == null || color!.isEmpty) {
      return const Color(0xFF2196F3); // Primary blue
    }
    try {
      return Color(int.parse(color!.replaceFirst('#', '0xFF')));
    } catch (_) {
      return const Color(0xFF2196F3);
    }
  }
}
