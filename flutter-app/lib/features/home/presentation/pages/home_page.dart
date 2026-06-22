import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kadirliapp/core/constants/app_colors.dart';
import 'package:kadirliapp/core/constants/app_spacing.dart';
import 'package:kadirliapp/core/constants/app_text_styles.dart';
import 'package:kadirliapp/features/home/presentation/providers/home_provider.dart';
import 'package:kadirliapp/features/home/presentation/widgets/greeting_header.dart';
import 'package:kadirliapp/features/home/presentation/widgets/module_card.dart';
import 'package:kadirliapp/features/home/presentation/widgets/user_menu.dart';
import 'package:kadirliapp/features/announcements/presentation/pages/announcements_list_page.dart';
import 'package:kadirliapp/features/ads/presentation/pages/ads_list_page.dart';
import 'package:kadirliapp/features/deaths/presentation/pages/deaths_list_page.dart';
import 'package:kadirliapp/features/events/presentation/pages/events_list_page.dart';
import 'package:kadirliapp/features/pharmacy/presentation/pages/pharmacy_page.dart';
import 'package:kadirliapp/features/campaigns/presentation/pages/campaigns_list_page.dart';
import 'package:kadirliapp/features/guide/presentation/pages/guide_page.dart';
import 'package:kadirliapp/features/places/presentation/pages/places_list_page.dart';
import 'package:kadirliapp/features/taxi/presentation/pages/taxi_page.dart';
import 'package:kadirliapp/features/transport/presentation/pages/transport_page.dart';
import 'package:kadirliapp/features/notifications/presentation/pages/notifications_page.dart';
import 'package:kadirliapp/features/profile/presentation/pages/profile_page.dart';

/// Premium "Bento Box" ana sayfa + glassmorphic floating navigasyon.
class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    if (index == 1) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const AdsListPage()),
      );
      return;
    }
    setState(() => _selectedIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final modules = ref.watch(moduleListProvider);

    return Scaffold(
      extendBody: true,
      body: Stack(
        children: [
          const _MeshBackground(),
          IndexedStack(
            index: _selectedIndex,
            children: [
              _HomeTab(modules: modules),
              const _PlaceholderTab(title: 'İlanlar'),
              const _PlaceholderTab(title: 'Favoriler'),
              const ProfilePage(),
            ],
          ),
        ],
      ),
      bottomNavigationBar: _GlassBottomNav(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

// =============================================================================
// HOME TAB — Bento dashboard
// =============================================================================
class _HomeTab extends StatelessWidget {
  final List<ModuleItem> modules;
  const _HomeTab({required this.modules});

  ModuleItem? _byKey(String key) {
    for (final m in modules) {
      if (m.key == key) return m;
    }
    return null;
  }

  void _navigate(BuildContext context, String key) {
    final routes = <String, WidgetBuilder>{
      'announcements': (_) => const AnnouncementsListPage(),
      'ads': (_) => const AdsListPage(),
      'deaths': (_) => const DeathsListPage(),
      'events': (_) => const EventsListPage(),
      'pharmacy': (_) => const PharmacyPage(),
      'campaigns': (_) => const CampaignsListPage(),
      'guide': (_) => const GuidePage(),
      'places': (_) => const PlacesListPage(),
      'taxi': (_) => const TaxiPage(),
      'transport': (_) => const TransportPage(),
      'notifications': (_) => const NotificationsPage(),
    };
    final builder = routes[key];
    if (builder != null) {
      Navigator.push(context, MaterialPageRoute(builder: builder));
    }
  }

  @override
  Widget build(BuildContext context) {
    const gap = 14.0;
    const square = 132.0;
    const tall = square * 2 + gap;

    // Staggered giriş animasyonu için global sayaç.
    var step = 0;
    Widget anim(Widget child) {
      final d = (step++) * 55;
      return child
          .animate()
          .fadeIn(
            delay: Duration(milliseconds: d),
            duration: 420.ms,
            curve: Curves.easeOut,
          )
          .slideY(
            begin: 0.18,
            end: 0,
            delay: Duration(milliseconds: d),
            duration: 480.ms,
            curve: Curves.easeOutCubic,
          );
    }

    // Bir modül anahtarı için boyutlandırılmış tile üretir.
    Widget tile(
      String key, {
      required double height,
      ModuleTileStyle style = ModuleTileStyle.surface,
      bool subtitle = false,
    }) {
      final m = _byKey(key);
      if (m == null) return SizedBox(height: height);
      return anim(
        SizedBox(
          height: height,
          child: ModuleCard(
            module: m,
            style: style,
            showSubtitle: subtitle,
            onTap: () => _navigate(context, key),
          ),
        ),
      );
    }

    return CustomScrollView(
      physics: const BouncingScrollPhysics(
        parent: AlwaysScrollableScrollPhysics(),
      ),
      slivers: [
        SliverToBoxAdapter(child: SafeArea(bottom: false, child: _TopBar())),
        const SliverToBoxAdapter(child: GreetingHeader()),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.lg,
            AppSpacing.md,
            AppSpacing.lg,
            120, // floating nav için boşluk
          ),
          sliver: SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                anim(const _SectionLabel('KEŞFET')),
                const SizedBox(height: AppSpacing.smLg),

                // Hero — Duyurular
                tile(
                  'announcements',
                  height: 170,
                  style: ModuleTileStyle.filled,
                  subtitle: true,
                ),
                const SizedBox(height: gap),

                // Asimetrik satır: tall (Etkinlikler) + 2 kompakt
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: tile(
                        'events',
                        height: tall,
                        style: ModuleTileStyle.filled,
                        subtitle: true,
                      ),
                    ),
                    const SizedBox(width: gap),
                    Expanded(
                      child: Column(
                        children: [
                          tile('pharmacy', height: square),
                          const SizedBox(height: gap),
                          tile('taxi', height: square),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: gap),

                _row(tile('ads', height: square), gap,
                    tile('campaigns', height: square)),
                const SizedBox(height: gap),
                _row(tile('places', height: square), gap,
                    tile('guide', height: square)),
                const SizedBox(height: gap),
                _row(tile('transport', height: square), gap,
                    tile('deaths', height: square)),
                const SizedBox(height: gap),

                // Wide banner — Bildirimler
                tile(
                  'notifications',
                  height: 110,
                  style: ModuleTileStyle.filled,
                  subtitle: true,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  static Widget _row(Widget a, double gap, Widget b) => Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(child: a),
          SizedBox(width: gap),
          Expanded(child: b),
        ],
      );
}

/// Marka kelime-işareti + kullanıcı menüsü içeren üst bar.
class _TopBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.lg,
        AppSpacing.sm,
        AppSpacing.sm,
        0,
      ),
      child: Row(
        children: [
          ShaderMask(
            shaderCallback: (bounds) => const LinearGradient(
              colors: AppColors.primaryGradient,
            ).createShader(bounds),
            child: Text(
              'KadirliApp',
              style: AppTextStyles.headlineMedium.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          const Spacer(),
          const UserMenu(),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 16,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: AppColors.primaryGradient,
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        Text(
          text,
          style: AppTextStyles.overline.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// MESH BACKGROUND — yumuşak radial parıltı katmanları
// =============================================================================
class _MeshBackground extends StatelessWidget {
  const _MeshBackground();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Positioned.fill(
      child: IgnorePointer(
        child: Stack(
          children: [
            Positioned(
              top: -120,
              left: -80,
              child: _blob(
                260,
                isDark ? AppColors.meshDarkA : AppColors.meshLightA,
              ),
            ),
            Positioned(
              top: 40,
              right: -110,
              child: _blob(
                240,
                isDark ? AppColors.meshDarkC : AppColors.meshLightB,
              ),
            ),
            Positioned(
              bottom: -100,
              left: -60,
              child: _blob(
                300,
                isDark ? AppColors.meshDarkB : AppColors.meshLightC,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _blob(double size, Color color) => Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [color, color.withValues(alpha: 0)],
          ),
        ),
      );
}

// =============================================================================
// GLASS BOTTOM NAV — floating, buzlu cam navigasyon
// =============================================================================
class _GlassBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const _GlassBottomNav({required this.currentIndex, required this.onTap});

  static const _items = [
    (icon: Icons.grid_view_rounded, label: 'Ana Sayfa'),
    (icon: Icons.storefront_rounded, label: 'İlanlar'),
    (icon: Icons.favorite_rounded, label: 'Favoriler'),
    (icon: Icons.person_rounded, label: 'Profil'),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          AppSpacing.lg,
          0,
          AppSpacing.lg,
          AppSpacing.md,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppSpacing.radius3xl),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
            child: Container(
              height: 68,
              decoration: BoxDecoration(
                color: isDark
                    ? AppColors.surfaceDark.withValues(alpha: 0.82)
                    : Colors.white.withValues(alpha: 0.78),
                borderRadius: BorderRadius.circular(AppSpacing.radius3xl),
                border: Border.all(
                  color: isDark
                      ? AppColors.glassBorderDark
                      : AppColors.glassBorderLight,
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: isDark
                        ? Colors.black.withValues(alpha: 0.4)
                        : AppColors.primary.withValues(alpha: 0.12),
                    blurRadius: 30,
                    spreadRadius: -6,
                    offset: const Offset(0, 12),
                  ),
                ],
              ),
              child: Row(
                children: [
                  for (var i = 0; i < _items.length; i++)
                    Expanded(
                      child: _NavItem(
                        icon: _items[i].icon,
                        label: _items[i].label,
                        selected: currentIndex == i,
                        onTap: () => onTap(i),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final inactive = theme.colorScheme.onSurfaceVariant;
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onTap,
      child: AnimatedContainer(
        duration: 280.ms,
        curve: Curves.easeOutCubic,
        margin: const EdgeInsets.symmetric(
          horizontal: AppSpacing.xs,
          vertical: 10,
        ),
        decoration: BoxDecoration(
          gradient: selected
              ? const LinearGradient(colors: AppColors.primaryGradient)
              : null,
          borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          boxShadow: selected
              ? AppColors.glow(AppColors.primary, strength: 0.4)
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 22,
              color: selected ? Colors.white : inactive,
            ),
            if (selected) ...[
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  label,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.labelMedium.copyWith(
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// PLACEHOLDER
// =============================================================================
class _PlaceholderTab extends StatelessWidget {
  final String title;
  const _PlaceholderTab({required this.title});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(AppSpacing.radius2xl),
            ),
            child: const Icon(
              Icons.auto_awesome_rounded,
              size: 44,
              color: AppColors.primary,
            ),
          ).animate().scale(duration: 400.ms, curve: Curves.easeOutBack),
          const SizedBox(height: AppSpacing.lg),
          Text(title, style: AppTextStyles.headlineSmall.copyWith(
            color: theme.colorScheme.onSurface,
          )),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Çok yakında burada',
            style: AppTextStyles.bodyMedium.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}
