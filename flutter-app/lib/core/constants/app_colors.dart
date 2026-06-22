import 'package:flutter/material.dart';

/// App Color Constants
/// Centralized color definitions for the application

class AppColors {
  // Primary colors (Sivil Yeşil-Teal)
  static const Color primary = Color(0xFF0D9488);
  static const Color primaryLight = Color(0xFF14B8A6);
  static const Color primaryDark = Color(0xFF0F766E);

  // Secondary / accent colors
  static const Color secondary = Color(0xFF65A30D);
  static const Color secondaryLight = Color(0xFF84CC16);
  static const Color secondaryDark = Color(0xFF4D7C0F);

  // Gradient (AppBar, hero alanları, ana butonlar)
  static const List<Color> primaryGradient = [primary, secondary];

  // Background & Surface (light)
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF5F5F5);

  // Background & Surface (dark)
  static const Color backgroundDark = Color(0xFF0C1714);
  static const Color surfaceDark = Color(0xFF16241F);
  static const Color surfaceVariantDark = Color(0xFF1C2E27);

  // Text colors
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textHint = Color(0xFFBDBDBD);
  static const Color textDisabled = Color(0xFFBDBDBD);

  // Status colors
  static const Color success = Color(0xFF16A34A);
  static const Color error = Color(0xFFDC2626);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF0EA5E9);

  // Neutral colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color grey50 = Color(0xFFFAFAFA);
  static const Color grey100 = Color(0xFFF5F5F5);
  static const Color grey200 = Color(0xFFEEEEEE);
  static const Color grey300 = Color(0xFFE0E0E0);
  static const Color grey400 = Color(0xFFBDBDBD);
  static const Color grey500 = Color(0xFF9E9E9E);
  static const Color grey600 = Color(0xFF757575);
  static const Color grey700 = Color(0xFF616161);
  static const Color grey800 = Color(0xFF424242);
  static const Color grey900 = Color(0xFF212121);

  // Borders
  static const Color borderLight = Color(0xFFE0E0E0);
  static const Color borderMedium = Color(0xFFBDBDBD);
  static const Color borderDark = Color(0xFF9E9E9E);

  // Transparency
  static const Color overlay = Color(0x1F000000);
}
