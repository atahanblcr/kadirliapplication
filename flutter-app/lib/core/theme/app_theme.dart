import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/app_spacing.dart';
import '../constants/app_text_styles.dart';

/// KadirliApp — Premium ThemeData (Material 3)
///
/// Light & Dark için elle ayarlanmış ColorScheme, Plus Jakarta Sans tipografi,
/// floating AppBar, yumuşak nav bar ve geniş kavisli bileşen temaları.
class AppTheme {
  AppTheme._();

  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final isDark = brightness == Brightness.dark;

    final colorScheme = isDark
        ? const ColorScheme.dark(
            primary: AppColors.primary,
            onPrimary: Colors.white,
            primaryContainer: AppColors.primaryDark,
            onPrimaryContainer: AppColors.primaryLight,
            secondary: AppColors.secondary,
            onSecondary: Color(0xFF0B0F19),
            tertiary: AppColors.accent,
            surface: AppColors.surfaceDark,
            onSurface: AppColors.textPrimaryDark,
            onSurfaceVariant: AppColors.textSecondaryDark,
            surfaceContainerHighest: AppColors.surfaceVariantDark,
            outline: AppColors.borderDark,
            outlineVariant: AppColors.hairlineDark,
            error: AppColors.error,
          )
        : const ColorScheme.light(
            primary: AppColors.primary,
            onPrimary: Colors.white,
            primaryContainer: Color(0xFFD7F8EC),
            onPrimaryContainer: AppColors.primaryDark,
            secondary: AppColors.secondary,
            onSecondary: Colors.white,
            tertiary: AppColors.accent,
            surface: AppColors.surface,
            onSurface: AppColors.textPrimary,
            onSurfaceVariant: AppColors.textSecondary,
            surfaceContainerHighest: AppColors.surfaceVariant,
            outline: AppColors.borderMedium,
            outlineVariant: AppColors.borderLight,
            error: AppColors.error,
          );

    final baseTextTheme = GoogleFonts.plusJakartaSansTextTheme(
      isDark ? ThemeData.dark().textTheme : ThemeData.light().textTheme,
    );

    final onSurface = colorScheme.onSurface;
    final textTheme = baseTextTheme.copyWith(
      displayLarge: AppTextStyles.displayLarge.copyWith(color: onSurface),
      displayMedium: AppTextStyles.displayMedium.copyWith(color: onSurface),
      displaySmall: AppTextStyles.displaySmall.copyWith(color: onSurface),
      headlineLarge: AppTextStyles.headlineLarge.copyWith(color: onSurface),
      headlineMedium: AppTextStyles.headlineMedium.copyWith(color: onSurface),
      headlineSmall: AppTextStyles.headlineSmall.copyWith(color: onSurface),
      titleLarge: AppTextStyles.titleLarge.copyWith(color: onSurface),
      titleMedium: AppTextStyles.titleMedium.copyWith(color: onSurface),
      titleSmall: AppTextStyles.titleSmall.copyWith(color: onSurface),
      bodyLarge: AppTextStyles.bodyLarge.copyWith(color: onSurface),
      bodyMedium: AppTextStyles.bodyMedium
          .copyWith(color: colorScheme.onSurfaceVariant),
      bodySmall: AppTextStyles.bodySmall
          .copyWith(color: colorScheme.onSurfaceVariant),
      labelLarge: AppTextStyles.labelLarge.copyWith(color: onSurface),
      labelMedium: AppTextStyles.labelMedium.copyWith(color: onSurface),
      labelSmall: AppTextStyles.labelSmall.copyWith(color: onSurface),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      textTheme: textTheme,
      scaffoldBackgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.background,
      splashFactory: InkSparkle.splashFactory,
      // Floating, transparan AppBar — hero alanların üzerinde süzülür.
      appBarTheme: AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        centerTitle: false,
        foregroundColor: onSurface,
        titleTextStyle: AppTextStyles.headlineMedium.copyWith(color: onSurface),
        systemOverlayStyle:
            isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: colorScheme.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusXxl),
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: isDark ? AppColors.surfaceDark : AppColors.surface,
        selectedItemColor: AppColors.primary,
        unselectedItemColor:
            isDark ? AppColors.textHintDark : AppColors.textHint,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        showUnselectedLabels: true,
        selectedLabelStyle: AppTextStyles.labelSmall,
        unselectedLabelStyle: AppTextStyles.labelSmall,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.md,
          ),
          textStyle: AppTextStyles.labelLarge,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          ),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.md,
          ),
          textStyle: AppTextStyles.labelLarge,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: colorScheme.surfaceContainerHighest,
        side: BorderSide.none,
        labelStyle: AppTextStyles.labelMedium.copyWith(color: onSurface),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colorScheme.surfaceContainerHighest,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.md,
        ),
        hintStyle: AppTextStyles.bodyMedium.copyWith(
          color: isDark ? AppColors.textHintDark : AppColors.textHint,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
      ),
      dividerTheme: DividerThemeData(
        color: colorScheme.outlineVariant,
        thickness: 1,
        space: 1,
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor:
            isDark ? AppColors.surfaceElevatedDark : AppColors.grey900,
        contentTextStyle:
            AppTextStyles.bodyMedium.copyWith(color: Colors.white),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        ),
      ),
    );
  }
}
