import 'package:flutter/material.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/bouncy_button.dart';
import '../providers/home_provider.dart';

/// Bento tile görünüm stili.
enum ModuleTileStyle {
  /// Canlı gradyan dolgulu, beyaz metinli, glow gölgeli — öne çıkan modüller.
  filled,

  /// Yüzey/cam zeminli, renkli ikon chip'li — kompakt modüller.
  surface,
}

/// Premium "Bento Box" modül kartı. Parent (Expanded / SizedBox / AspectRatio)
/// tarafından boyutlandırılır; içeriğini boyuta göre uyarlar.
class ModuleCard extends StatelessWidget {
  final ModuleItem module;
  final VoidCallback? onTap;
  final ModuleTileStyle style;

  /// Alt başlık göster (hero / geniş tile'lar). Kompaktlarda kapalı.
  final bool showSubtitle;

  const ModuleCard({
    super.key,
    required this.module,
    this.onTap,
    this.style = ModuleTileStyle.surface,
    this.showSubtitle = false,
  });

  @override
  Widget build(BuildContext context) {
    return BouncyButton(
      onTap: onTap,
      child: style == ModuleTileStyle.filled
          ? _FilledTile(module: module, showSubtitle: showSubtitle)
          : _SurfaceTile(module: module, showSubtitle: showSubtitle),
    );
  }
}

/// Gradyan dolgulu, beyaz metinli öne-çıkan tile.
class _FilledTile extends StatelessWidget {
  final ModuleItem module;
  final bool showSubtitle;
  const _FilledTile({required this.module, required this.showSubtitle});

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(AppSpacing.radius3xl);
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: module.gradient,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: radius,
        boxShadow: AppColors.glow(module.color, strength: 0.34),
      ),
      child: Stack(
        children: [
          // Dekoratif "soft radial" parıltı topları — derinlik için.
          Positioned(
            top: -28,
            right: -20,
            child: _glowBlob(86, Colors.white.withValues(alpha: 0.22)),
          ),
          Positioned(
            bottom: -34,
            left: -16,
            child: _glowBlob(96, Colors.black.withValues(alpha: 0.10)),
          ),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.mdLg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _IconChip(
                  icon: module.icon,
                  background: Colors.white.withValues(alpha: 0.22),
                  iconColor: Colors.white,
                  size: 52,
                ),
                const Spacer(),
                Text(
                  module.title,
                  style: AppTextStyles.headlineSmall.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                if (showSubtitle) ...[
                  const SizedBox(height: AppSpacing.xxs),
                  Text(
                    module.subtitle,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: Colors.white.withValues(alpha: 0.82),
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Yüzey / cam zeminli kompakt tile — renkli ikon chip + adaptif metin.
class _SurfaceTile extends StatelessWidget {
  final ModuleItem module;
  final bool showSubtitle;
  const _SurfaceTile({required this.module, required this.showSubtitle});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final radius = BorderRadius.circular(AppSpacing.radius3xl);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: radius,
        border: Border.all(
          color: isDark ? AppColors.hairlineDark : Colors.white,
          width: isDark ? 1 : 0.5,
        ),
        boxShadow: isDark
            ? [
                BoxShadow(
                  color: module.color.withValues(alpha: 0.16),
                  blurRadius: 26,
                  spreadRadius: -12,
                  offset: const Offset(0, 12),
                ),
              ]
            : AppColors.softShadow(module.color),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _IconChip(
              icon: module.icon,
              // Gradyandan türeyen yumuşak renkli zemin.
              gradient: module.gradient,
              iconColor: Colors.white,
              size: 46,
              glow: true,
            ),
            const Spacer(),
            Text(
              module.title,
              style: AppTextStyles.titleMedium.copyWith(
                color: theme.colorScheme.onSurface,
                fontWeight: FontWeight.w700,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            if (showSubtitle) ...[
              const SizedBox(height: AppSpacing.xxs),
              Text(
                module.subtitle,
                style: AppTextStyles.bodySmall.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Yuvarlatılmış ikon "chip"i — gradyan veya düz zeminli.
class _IconChip extends StatelessWidget {
  final IconData icon;
  final Color? background;
  final List<Color>? gradient;
  final Color iconColor;
  final double size;
  final bool glow;

  const _IconChip({
    required this.icon,
    this.background,
    this.gradient,
    required this.iconColor,
    required this.size,
    this.glow = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: gradient == null ? background : null,
        gradient: gradient == null
            ? null
            : LinearGradient(
                colors: gradient!,
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
        borderRadius: BorderRadius.circular(size * 0.34),
        boxShadow: glow && gradient != null
            ? [
                BoxShadow(
                  color: gradient!.first.withValues(alpha: 0.4),
                  blurRadius: 16,
                  spreadRadius: -4,
                  offset: const Offset(0, 8),
                ),
              ]
            : null,
      ),
      child: Icon(icon, size: size * 0.52, color: iconColor),
    );
  }
}

Widget _glowBlob(double size, Color color) => Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [color, color.withValues(alpha: 0)],
        ),
      ),
    );
