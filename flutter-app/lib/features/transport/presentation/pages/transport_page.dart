import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/transport_provider.dart';
import '../../data/models/transport_model.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_shimmer.dart';
import '../../../../core/widgets/app_empty_state.dart';
import '../../../../core/widgets/app_error_state.dart';

class TransportPage extends ConsumerStatefulWidget {
  const TransportPage({super.key});

  @override
  ConsumerState<TransportPage> createState() => _TransportPageState();
}

class _TransportPageState extends ConsumerState<TransportPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ulaşım'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          labelColor: AppColors.primary,
          unselectedLabelColor: Theme.of(context).colorScheme.onSurfaceVariant,
          labelStyle: AppTextStyles.labelLarge,
          tabs: const [
            Tab(text: 'Şehir İçi'),
            Tab(text: 'Şehirlerarası'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          _IntracityView(),
          _IntercityView(),
        ],
      ),
    );
  }
}

class _IntracityView extends ConsumerWidget {
  const _IntracityView();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final routesAsync = ref.watch(intracityRoutesProvider);

    return RefreshIndicator(
      onRefresh: () async {
        // ignore: unused_result
        ref.refresh(intracityRoutesProvider);
      },
      child: routesAsync.when(
        data: (routes) {
          if (routes.isEmpty) {
            return const _Empty('Şehir içi güzergah bulunamadı.');
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
            itemCount: routes.length,
            itemBuilder: (context, index) =>
                _IntracityCard(route: routes[index]),
          );
        },
        loading: () => const ShimmerList(),
        error: (error, stack) => AppErrorState(
          error: error,
          // ignore: unused_result
          onRetry: () => ref.refresh(intracityRoutesProvider),
        ),
      ),
    );
  }
}

class _IntercityView extends ConsumerWidget {
  const _IntercityView();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final routesAsync = ref.watch(intercityRoutesProvider);

    return RefreshIndicator(
      onRefresh: () async {
        // ignore: unused_result
        ref.refresh(intercityRoutesProvider);
      },
      child: routesAsync.when(
        data: (routes) {
          if (routes.isEmpty) {
            return const _Empty('Şehirlerarası güzergah bulunamadı.');
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
            itemCount: routes.length,
            itemBuilder: (context, index) =>
                _IntercityCard(route: routes[index]),
          );
        },
        loading: () => const ShimmerList(),
        error: (error, stack) => AppErrorState(
          error: error,
          // ignore: unused_result
          onRetry: () => ref.refresh(intercityRoutesProvider),
        ),
      ),
    );
  }
}

class _Empty extends StatelessWidget {
  final String message;
  const _Empty(this.message);

  @override
  Widget build(BuildContext context) {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        SizedBox(
          height: 420,
          child: AppEmptyState(
            icon: Icons.directions_bus_rounded,
            title: message,
          ),
        ),
      ],
    );
  }
}

class _IntracityCard extends StatelessWidget {
  final IntracityRoute route;

  const _IntracityCard({required this.route});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return AppCard(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      radius: AppSpacing.radiusXl,
      glowColor: AppColors.gTransport.first,
      padding: EdgeInsets.zero,
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          iconColor: AppColors.gTransport.first,
          collapsedIconColor: cs.onSurfaceVariant,
          tilePadding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.xs,
          ),
          title: Row(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: AppColors.gTransport,
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                ),
                child: Text(
                  route.routeNumber,
                  style: AppTextStyles.labelMedium.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.smLg),
              Expanded(
                child: Text(
                  route.routeName,
                  style: AppTextStyles.titleMedium.copyWith(
                    color: cs.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          subtitle: Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Text(
              'İlk: ${route.firstDeparture}  •  Son: ${route.lastDeparture}  •  ${route.frequencyMinutes} dk\'da bir',
              style: AppTextStyles.bodySmall.copyWith(
                color: cs.onSurfaceVariant,
              ),
            ),
          ),
          childrenPadding: const EdgeInsets.only(bottom: AppSpacing.sm),
          children: [
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: route.stops.length,
              itemBuilder: (context, index) {
                final stop = route.stops[index];
                return ListTile(
                  dense: true,
                  leading: CircleAvatar(
                    radius: 13,
                    backgroundColor:
                        AppColors.gTransport.first.withValues(alpha: 0.14),
                    child: Text(
                      '${index + 1}',
                      style: AppTextStyles.labelSmall.copyWith(
                        color: AppColors.gTransport.first,
                      ),
                    ),
                  ),
                  title: Text(
                    stop.stopName,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: cs.onSurface,
                    ),
                  ),
                  trailing: Text(
                    '+${stop.timeFromStart} dk',
                    style: AppTextStyles.labelMedium.copyWith(
                      color: cs.onSurfaceVariant,
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _IntercityCard extends StatelessWidget {
  final IntercityRoute route;

  const _IntercityCard({required this.route});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return AppCard(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      radius: AppSpacing.radiusXl,
      glowColor: AppColors.gTransport.first,
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  route.destination,
                  style: AppTextStyles.titleLarge.copyWith(
                    color: cs.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Text(
                '${route.price} ₺',
                style: AppTextStyles.titleLarge.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Icon(Icons.directions_bus_rounded,
                  size: 15, color: cs.onSurfaceVariant),
              const SizedBox(width: 4),
              Text(route.company,
                  style: AppTextStyles.bodySmall
                      .copyWith(color: cs.onSurfaceVariant)),
              const SizedBox(width: AppSpacing.md),
              Icon(Icons.timer_rounded, size: 15, color: cs.onSurfaceVariant),
              const SizedBox(width: 4),
              Text('${route.durationMinutes} dk',
                  style: AppTextStyles.bodySmall
                      .copyWith(color: cs.onSurfaceVariant)),
            ],
          ),
          Divider(height: AppSpacing.lg, color: cs.outlineVariant),
          Text('Sefer Saatleri',
              style: AppTextStyles.labelMedium.copyWith(color: cs.onSurface)),
          const SizedBox(height: AppSpacing.sm),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: route.schedules.map((schedule) {
              return Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.gTransport.first.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                ),
                child: Text(
                  schedule.departureTime,
                  style: AppTextStyles.labelMedium.copyWith(
                    color: AppColors.gTransport.first,
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
