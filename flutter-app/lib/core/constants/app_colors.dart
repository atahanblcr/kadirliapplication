import 'package:flutter/material.dart';

/// KadirliApp — Premium Color System
///
/// Felsefe: Canlı, derinlikli, HSL-uyumlu bir palet. Marka rengi "Sivil Yeşil"
/// neon-mint / zümrüt tonlarıyla yükseltildi; dark mode tam siyah yerine derin
/// lacivert (#0B0F19) üzerine ince glow & glassmorphism ile kuruldu.
///
/// Not: Eski sabit isimleri (primary, surface, textPrimary, grey*, vb.) geriye
/// dönük uyumluluk için korundu — yalnızca değerleri premium tonlara çekildi.
class AppColors {
  AppColors._();

  // ---------------------------------------------------------------------------
  // BRAND — Emerald / Mint (canlı "Sivil Yeşil")
  // ---------------------------------------------------------------------------
  static const Color primary = Color(0xFF10B981); // emerald-500
  static const Color primaryLight = Color(0xFF34E0B0); // neon mint
  static const Color primaryDark = Color(0xFF059467); // derin zümrüt
  static const Color primaryGlow = Color(0xFF2DE3B7); // glow / parıltı

  // İkincil — Lime / Çimen
  static const Color secondary = Color(0xFF84CC16); // lime-500
  static const Color secondaryLight = Color(0xFFA8E635);
  static const Color secondaryDark = Color(0xFF5E9E0E);

  // Vurgu — Sky / Cyan (glow, link, bilgi)
  static const Color accent = Color(0xFF22D3EE); // cyan
  static const Color accentLight = Color(0xFF67E8F9);
  static const Color violet = Color(0xFF8B5CF6); // mor vurgu

  // ---------------------------------------------------------------------------
  // GRADIENTS — düz 2 renk değil; çok duraklı, opaklığı ayarlı geçişler
  // ---------------------------------------------------------------------------
  /// Marka gradyanı (AppBar, hero, ana butonlar)
  static const List<Color> primaryGradient = [
    Color(0xFF0FB98A),
    Color(0xFF10B981),
    Color(0xFF5BD17F),
  ];

  /// Emerald → Cyan (canlı, ferah)
  static const List<Color> mintGradient = [
    Color(0xFF34E0B0),
    Color(0xFF14C5C9),
  ];

  /// Lime → Emerald (doğa)
  static const List<Color> limeGradient = [
    Color(0xFFA8E635),
    Color(0xFF22C55E),
  ];

  /// Light scaffold "mesh" arka plan katmanları (üst üste radial blur'lar için)
  static const Color meshLightA = Color(0x2610B981); // emerald @ ~15%
  static const Color meshLightB = Color(0x1A22D3EE); // cyan @ ~10%
  static const Color meshLightC = Color(0x14A8E635); // lime @ ~8%

  /// Dark scaffold "mesh" arka plan katmanları
  static const Color meshDarkA = Color(0x3310B981); // emerald glow
  static const Color meshDarkB = Color(0x261D4ED8); // mavi derinlik
  static const Color meshDarkC = Color(0x2622D3EE); // cyan

  // ---------------------------------------------------------------------------
  // SURFACES — Light
  // ---------------------------------------------------------------------------
  static const Color background = Color(0xFFF5F8FA); // soğuk yumuşak beyaz
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFEEF3F6);
  static const Color surfaceElevated = Color(0xFFFFFFFF);

  // SURFACES — Dark (derin lacivert, tam siyah DEĞİL)
  static const Color backgroundDark = Color(0xFF0B0F19); // deep navy-black
  static const Color surfaceDark = Color(0xFF131A2A); // kaldırılmış panel
  static const Color surfaceVariantDark = Color(0xFF1B2436);
  static const Color surfaceElevatedDark = Color(0xFF1E2A40);

  // ---------------------------------------------------------------------------
  // GLASS & BORDER — glassmorphism token'ları
  // ---------------------------------------------------------------------------
  static const Color glassLight = Color(0xCCFFFFFF); // %80 beyaz cam
  static const Color glassDark = Color(0x991B2436); // %60 koyu cam
  static const Color glassBorderLight = Color(0x33FFFFFF); // parlak ince kenar
  static const Color glassBorderDark = Color(0x1FFFFFFF); // 0.12 beyaz kenar
  static const Color hairlineDark = Color(0x14FFFFFF); // 0.08 beyaz hairline

  // ---------------------------------------------------------------------------
  // TEXT — opaklık dengeli (tam siyah/beyaz yok)
  // ---------------------------------------------------------------------------
  static const Color textPrimary = Color(0xFF0F1B2D); // koyu lacivert-siyah
  static const Color textSecondary = Color(0xFF5B6B7F);
  static const Color textHint = Color(0xFF94A3B8);
  static const Color textDisabled = Color(0xFFBCC6D4);

  // Dark text — beyazın opaklık varyasyonları
  static const Color textPrimaryDark = Color(0xF2FFFFFF); // %95
  static const Color textSecondaryDark = Color(0xB3FFFFFF); // %70 body
  static const Color textHintDark = Color(0x80FFFFFF); // %50
  static const Color textDisabledDark = Color(0x4DFFFFFF); // %30

  // ---------------------------------------------------------------------------
  // STATUS
  // ---------------------------------------------------------------------------
  static const Color success = Color(0xFF22C55E);
  static const Color error = Color(0xFFFB5870); // canlı mercan-kırmızı
  static const Color warning = Color(0xFFFBBF24);
  static const Color info = Color(0xFF38BDF8);

  // ---------------------------------------------------------------------------
  // NEUTRAL — slate ailesi (mavi nüanslı, daha modern)
  // ---------------------------------------------------------------------------
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color grey50 = Color(0xFFF8FAFC);
  static const Color grey100 = Color(0xFFF1F5F9);
  static const Color grey200 = Color(0xFFE2E8F0);
  static const Color grey300 = Color(0xFFCBD5E1);
  static const Color grey400 = Color(0xFF94A3B8);
  static const Color grey500 = Color(0xFF64748B);
  static const Color grey600 = Color(0xFF475569);
  static const Color grey700 = Color(0xFF334155);
  static const Color grey800 = Color(0xFF1E293B);
  static const Color grey900 = Color(0xFF0F172A);

  // Borders
  static const Color borderLight = Color(0xFFE2E8F0);
  static const Color borderMedium = Color(0xFFCBD5E1);
  static const Color borderDark = Color(0xFF334155);

  // Overlay
  static const Color overlay = Color(0x99000000);
  static const Color scrim = Color(0x66000000);

  // ---------------------------------------------------------------------------
  // MODULE ACCENTS — her modül için canlı çift renk (gradient için)
  // ---------------------------------------------------------------------------
  static const List<Color> gAnnouncements = [Color(0xFF3B82F6), Color(0xFF22D3EE)];
  static const List<Color> gAds = [Color(0xFF6366F1), Color(0xFF8B5CF6)];
  static const List<Color> gDeaths = [Color(0xFF475569), Color(0xFF64748B)];
  static const List<Color> gCampaigns = [Color(0xFFF43F5E), Color(0xFFFB7185)];
  static const List<Color> gEvents = [Color(0xFF10B981), Color(0xFF34E0B0)];
  static const List<Color> gGuide = [Color(0xFFF59E0B), Color(0xFFFBBF24)];
  static const List<Color> gPlaces = [Color(0xFF06B6D4), Color(0xFF22D3EE)];
  static const List<Color> gPharmacy = [Color(0xFF16A34A), Color(0xFF84CC16)];
  static const List<Color> gTransport = [Color(0xFF6366F1), Color(0xFF818CF8)];
  static const List<Color> gTaxi = [Color(0xFFF59E0B), Color(0xFFFACC15)];
  static const List<Color> gNotifications = [Color(0xFF0EA5E9), Color(0xFF38BDF8)];

  // ---------------------------------------------------------------------------
  // SHADOWS — "soft & deep" floating gölgeler
  // ---------------------------------------------------------------------------
  /// Yumuşak, derin, havada süzülen kart gölgesi (light).
  static List<BoxShadow> softShadow(Color tint) => [
        BoxShadow(
          color: tint.withValues(alpha: 0.10),
          blurRadius: 30,
          spreadRadius: -8,
          offset: const Offset(0, 18),
        ),
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.04),
          blurRadius: 12,
          spreadRadius: -6,
          offset: const Offset(0, 6),
        ),
      ];

  /// Renkli glow (gradient kartların altına süzülme + parlama).
  static List<BoxShadow> glow(Color color, {double strength = 0.35}) => [
        BoxShadow(
          color: color.withValues(alpha: strength),
          blurRadius: 28,
          spreadRadius: -6,
          offset: const Offset(0, 14),
        ),
      ];
}
