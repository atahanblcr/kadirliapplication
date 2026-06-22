import 'dart:ui';
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_spacing.dart';
import 'bouncy_button.dart';

/// Premium kart. Keskin gölge / kalın border yerine "soft & deep" floating
/// gölge, geniş kavis ve dark mode'da ince glow + hairline border kullanır.
/// Tıklanabilirse bouncy (spring) dokunma geri bildirimi taşır.
class AppCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final double radius;

  /// Gölge/glow için renk ipucu (varsayılan: marka rengi). Modül kartlarında
  /// kartın kendi rengini geçirerek renkli floating gölge elde edilir.
  final Color? glowColor;

  /// Süzülme hissi için gölgeyi tamamen kapatmak isteyenler için.
  final bool elevated;

  const AppCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(AppSpacing.md),
    this.margin,
    this.radius = AppSpacing.radiusXxl,
    this.glowColor,
    this.elevated = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final borderRadius = BorderRadius.circular(radius);
    final tint = glowColor ?? AppColors.primary;

    final card = Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: borderRadius,
        border: Border.all(
          color: isDark ? AppColors.hairlineDark : Colors.white,
          width: isDark ? 1 : 0.5,
        ),
        boxShadow: !elevated
            ? null
            : isDark
                // Dark: yumuşak renkli glow (siyahta gölge görünmez)
                ? [
                    BoxShadow(
                      color: tint.withValues(alpha: 0.14),
                      blurRadius: 28,
                      spreadRadius: -10,
                      offset: const Offset(0, 14),
                    ),
                    const BoxShadow(
                      color: Color(0x40000000),
                      blurRadius: 18,
                      spreadRadius: -8,
                      offset: Offset(0, 10),
                    ),
                  ]
                : AppColors.softShadow(tint),
      ),
      child: Material(
        type: MaterialType.transparency,
        borderRadius: borderRadius,
        clipBehavior: Clip.antiAlias,
        child: Padding(padding: padding, child: child),
      ),
    );

    final wrapped = onTap == null
        ? card
        : BouncyButton(onTap: onTap, child: card);

    return margin == null ? wrapped : Padding(padding: margin!, child: wrapped);
  }
}

/// Gerçek glassmorphism kartı: arka planı `BackdropFilter` ile bulanıklaştırır,
/// yarı saydam yüzey + ince parlak kenar uygular. Renkli/mesh arka planların
/// üzerinde "buzlu cam" premium etki için kullanılır.
class GlassCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final double radius;
  final double blur;

  const GlassCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(AppSpacing.md),
    this.margin,
    this.radius = AppSpacing.radiusXxl,
    this.blur = 18,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final borderRadius = BorderRadius.circular(radius);

    final glass = ClipRRect(
      borderRadius: borderRadius,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Container(
          decoration: BoxDecoration(
            color: isDark ? AppColors.glassDark : AppColors.glassLight,
            borderRadius: borderRadius,
            border: Border.all(
              color: isDark
                  ? AppColors.glassBorderDark
                  : AppColors.glassBorderLight,
              width: 1,
            ),
          ),
          child: Padding(padding: padding, child: child),
        ),
      ),
    );

    final wrapped = onTap == null
        ? glass
        : BouncyButton(onTap: onTap, child: glass);

    return margin == null ? wrapped : Padding(padding: margin!, child: wrapped);
  }
}
