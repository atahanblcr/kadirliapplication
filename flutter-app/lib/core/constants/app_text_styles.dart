import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// KadirliApp — Premium Typography
///
/// Plus Jakarta Sans: modern, geniş x-height'lı, premium bir grotesk.
/// Hiyerarşi yalnızca boyutla değil; letter-spacing, line-height ve
/// weight kontrastıyla (ExtraBold başlık ↔ Regular gövde) kurulur.
///
/// Eski stil isimleri (displayLarge, bodyMedium, …) korundu.
class AppTextStyles {
  AppTextStyles._();

  static TextStyle _base(
    double size,
    FontWeight weight, {
    double spacing = 0,
    double height = 1.4,
  }) =>
      GoogleFonts.plusJakartaSans(
        fontSize: size,
        fontWeight: weight,
        letterSpacing: spacing,
        height: height,
      );

  // ---------------------------------------------------------------------------
  // DISPLAY — büyük, sıkı, ExtraBold başlıklar (negatif harf aralığı = premium)
  // ---------------------------------------------------------------------------
  static final TextStyle displayLarge =
      _base(34, FontWeight.w800, spacing: -0.8, height: 1.12);
  static final TextStyle displayMedium =
      _base(28, FontWeight.w800, spacing: -0.6, height: 1.15);
  static final TextStyle displaySmall =
      _base(24, FontWeight.w700, spacing: -0.4, height: 1.2);

  // ---------------------------------------------------------------------------
  // HEADLINE
  // ---------------------------------------------------------------------------
  static final TextStyle headlineLarge =
      _base(22, FontWeight.w700, spacing: -0.3, height: 1.25);
  static final TextStyle headlineMedium =
      _base(19, FontWeight.w700, spacing: -0.2, height: 1.3);
  static final TextStyle headlineSmall =
      _base(17, FontWeight.w600, spacing: -0.1, height: 1.35);

  // ---------------------------------------------------------------------------
  // TITLE
  // ---------------------------------------------------------------------------
  static final TextStyle titleLarge =
      _base(16, FontWeight.w600, spacing: 0, height: 1.4);
  static final TextStyle titleMedium =
      _base(14, FontWeight.w600, spacing: 0.1, height: 1.45);
  static final TextStyle titleSmall =
      _base(12.5, FontWeight.w600, spacing: 0.1, height: 1.5);

  // ---------------------------------------------------------------------------
  // BODY — Regular, ferah satır yüksekliği
  // ---------------------------------------------------------------------------
  static final TextStyle bodyLarge =
      _base(16, FontWeight.w400, spacing: 0.1, height: 1.55);
  static final TextStyle bodyMedium =
      _base(14, FontWeight.w400, spacing: 0.1, height: 1.55);
  static final TextStyle bodySmall =
      _base(12.5, FontWeight.w400, spacing: 0.15, height: 1.5);

  // ---------------------------------------------------------------------------
  // LABEL — butonlar, chip, overline
  // ---------------------------------------------------------------------------
  static final TextStyle labelLarge =
      _base(14, FontWeight.w600, spacing: 0.2, height: 1.3);
  static final TextStyle labelMedium =
      _base(12, FontWeight.w600, spacing: 0.3, height: 1.3);
  static final TextStyle labelSmall =
      _base(11, FontWeight.w600, spacing: 0.4, height: 1.3);

  /// Geniş harf aralıklı "overline" etiketi (bölüm başlıkları üstü).
  static final TextStyle overline =
      _base(11, FontWeight.w700, spacing: 1.6, height: 1.4);
}
