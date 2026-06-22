import 'dart:ui';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/app_colors.dart';
import '../constants/app_spacing.dart';
import '../constants/app_text_styles.dart';
import 'app_shimmer.dart';

/// Premium parallax kapak: collapsing `SliverAppBar` + `FlexibleSpaceBar`.
///
/// - Kaydırırken kapak görseli **parallax** ile yavaşça akar.
/// - Aşağı çekince (over-scroll) görsel **zoom + blur** ile esner.
/// - İlk görsel, liste kartıyla **Hero** geçişi yapar (heroTag verilirse).
/// - Birden fazla görsel varsa yatay carousel + nokta göstergeleri.
/// - Üst/alt yumuşak scrim'ler ikon ve başlık okunabilirliğini garanti eder.
class SliverParallaxCover extends StatefulWidget {
  final List<String> imageUrls;
  final String? heroTag;
  final String title;
  final List<Widget> actions;
  final double expandedHeight;
  final IconData placeholderIcon;

  const SliverParallaxCover({
    super.key,
    required this.imageUrls,
    required this.title,
    this.heroTag,
    this.actions = const [],
    this.expandedHeight = 320,
    this.placeholderIcon = Icons.image_rounded,
  });

  @override
  State<SliverParallaxCover> createState() => _SliverParallaxCoverState();
}

class _SliverParallaxCoverState extends State<SliverParallaxCover> {
  final PageController _controller = PageController();
  int _index = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final images = widget.imageUrls.where((u) => u.isNotEmpty).toList();

    return SliverAppBar(
      pinned: true,
      stretch: true,
      expandedHeight: widget.expandedHeight,
      backgroundColor: AppColors.primary,
      surfaceTintColor: Colors.transparent,
      foregroundColor: Colors.white,
      elevation: 0,
      stretchTriggerOffset: 120,
      systemOverlayStyle: SystemUiOverlayStyle.light,
      leadingWidth: 60,
      leading: _GlassCircleButton(
        icon: Icons.arrow_back_ios_new_rounded,
        onTap: () => Navigator.of(context).maybePop(),
      ),
      actions: [
        ...widget.actions,
        const SizedBox(width: AppSpacing.xs),
      ],
      flexibleSpace: FlexibleSpaceBar(
        stretchModes: const [
          StretchMode.zoomBackground,
          StretchMode.blurBackground,
        ],
        titlePadding: const EdgeInsetsDirectional.only(
          start: 56,
          bottom: 16,
          end: 56,
        ),
        title: Text(
          widget.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: AppTextStyles.titleLarge.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.w700,
            shadows: const [
              Shadow(color: Color(0x99000000), blurRadius: 8),
            ],
          ),
        ),
        background: _CoverBackground(
          images: images,
          heroTag: widget.heroTag,
          controller: _controller,
          index: _index,
          onPageChanged: (i) => setState(() => _index = i),
          placeholderIcon: widget.placeholderIcon,
        ),
      ),
    );
  }
}

class _CoverBackground extends StatelessWidget {
  final List<String> images;
  final String? heroTag;
  final PageController controller;
  final int index;
  final ValueChanged<int> onPageChanged;
  final IconData placeholderIcon;

  const _CoverBackground({
    required this.images,
    required this.heroTag,
    required this.controller,
    required this.index,
    required this.onPageChanged,
    required this.placeholderIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        if (images.isEmpty)
          _placeholder()
        else
          PageView.builder(
            controller: controller,
            onPageChanged: onPageChanged,
            itemCount: images.length,
            itemBuilder: (context, i) {
              final img = CachedNetworkImage(
                imageUrl: images[i],
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
                placeholder: (_, __) => const ShimmerBox(radius: 0),
                errorWidget: (_, __, ___) => _placeholder(),
              );
              if (i == 0 && heroTag != null) {
                return Hero(tag: heroTag!, child: img);
              }
              return img;
            },
          ),

        // Üst scrim — status bar / ikon okunabilirliği
        const IgnorePointer(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0x73000000), Color(0x00000000)],
                stops: [0, 0.28],
              ),
            ),
          ),
        ),

        // Alt scrim — başlık okunabilirliği + derinlik
        const IgnorePointer(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
                colors: [Color(0xB3000000), Color(0x00000000)],
                stops: [0, 0.5],
              ),
            ),
          ),
        ),

        // Nokta göstergeleri
        if (images.length > 1)
          Positioned(
            bottom: AppSpacing.md,
            right: AppSpacing.md,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(images.length, (i) {
                final active = i == index;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 280),
                  curve: Curves.easeOut,
                  width: active ? 20 : 7,
                  height: 7,
                  margin: const EdgeInsets.only(left: 4),
                  decoration: BoxDecoration(
                    color: active
                        ? Colors.white
                        : Colors.white.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                  ),
                );
              }),
            ),
          ),
      ],
    );
  }

  Widget _placeholder() => DecoratedBox(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: AppColors.primaryGradient,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Center(
          child: Icon(
            placeholderIcon,
            size: 72,
            color: Colors.white.withValues(alpha: 0.85),
          ),
        ),
      );
}

/// Görsel üzerinde net duran, buzlu cam yuvarlak buton (geri / aksiyonlar).
class _GlassCircleButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _GlassCircleButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ClipOval(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
          child: Material(
            color: Colors.black.withValues(alpha: 0.22),
            shape: const CircleBorder(),
            child: InkWell(
              onTap: onTap,
              customBorder: const CircleBorder(),
              child: SizedBox(
                width: 40,
                height: 40,
                child: Icon(icon, size: 18, color: Colors.white),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Detay sayfalarının yükleme / hata durumları için geri butonlu basit görünüm.
/// (Parallax kapak yalnızca veri geldiğinde kurulduğundan, bu durumlarda da
/// kullanıcı geri dönebilsin diye standart bir AppBar sağlar.)
class DetailStateView extends StatelessWidget {
  final String title;
  final Widget child;

  const DetailStateView({super.key, required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(pinned: true, title: Text(title)),
        SliverFillRemaining(
          hasScrollBody: false,
          child: Center(child: child),
        ),
      ],
    );
  }
}
