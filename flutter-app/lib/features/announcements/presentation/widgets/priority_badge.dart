import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_text_styles.dart';

/// Öncelik rozeti — acil/önemli/normal/düşük. Acil dışındakiler yumuşak
/// (renkli zemin + renkli metin) pill; acil dikkat çekmesi için dolu.
class PriorityBadge extends StatelessWidget {
  final String priority; // emergency | high | normal | low
  final bool small;

  const PriorityBadge({
    required this.priority,
    this.small = false,
    super.key,
  });

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

  Color get _color {
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
    final emergency = priority.toLowerCase() == 'emergency';
    final color = _color;
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: small ? 8 : 12,
        vertical: small ? 3 : 5,
      ),
      decoration: BoxDecoration(
        color: emergency ? color : color.withValues(alpha: 0.13),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Text(
        _label,
        style: (small ? AppTextStyles.labelSmall : AppTextStyles.labelMedium)
            .copyWith(
          color: emergency ? Colors.white : color,
          letterSpacing: 0.3,
        ),
      ),
    );
  }
}
