import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

/// Priority badge widget
/// Shows emergency/high/normal/low with color
class PriorityBadge extends StatelessWidget {
  final String priority; // emergency | high | normal | low
  final bool small;

  const PriorityBadge({
    required this.priority,
    this.small = false,
    super.key,
  });

  /// Get label text in Turkish
  String get _label {
    switch (priority.toLowerCase()) {
      case 'emergency':
        return 'ACİL';
      case 'high':
        return 'Önemli';
      case 'normal':
        return 'Duyuru';
      case 'low':
        return 'Bilgi';
      default:
        return 'Duyuru';
    }
  }

  /// Get background color
  Color get _backgroundColor {
    switch (priority.toLowerCase()) {
      case 'emergency':
        return AppColors.error;
      case 'high':
        return AppColors.warning;
      case 'normal':
        return AppColors.primary;
      case 'low':
        return AppColors.grey500;
      default:
        return AppColors.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: small ? 8 : 12,
        vertical: small ? 4 : 6,
      ),
      decoration: BoxDecoration(
        color: _backgroundColor,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        _label,
        style: TextStyle(
          color: Colors.white,
          fontSize: small ? 11 : 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
