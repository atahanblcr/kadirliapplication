import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:kadirliapp/core/utils/map_launcher.dart';
import 'package:intl/intl.dart';
import 'package:kadirliapp/features/pharmacy/presentation/providers/pharmacy_provider.dart';
import 'package:kadirliapp/features/pharmacy/data/models/pharmacy_model.dart';
import 'package:kadirliapp/core/constants/app_spacing.dart';
import 'package:kadirliapp/core/constants/app_colors.dart';
import 'package:kadirliapp/core/constants/app_text_styles.dart';
import 'package:kadirliapp/core/widgets/app_card.dart';

class PharmacyPage extends ConsumerStatefulWidget {
  const PharmacyPage({super.key});

  @override
  ConsumerState<PharmacyPage> createState() => _PharmacyPageState();
}

class _PharmacyPageState extends ConsumerState<PharmacyPage> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Nöbetçi Eczaneler'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Bugün Nöbetçi'),
              Tab(text: 'Takvim'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildCurrentPharmacyTab(context),
            _buildCalendarTab(context),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentPharmacyTab(BuildContext context) {
    final currentPharmacyAsync = ref.watch(currentPharmacyProvider);

    return currentPharmacyAsync.when(
      data: (pharmacy) {
        if (pharmacy == null) {
          return const Center(child: Text('Bugün için nöbetçi eczane bulunamadı.'));
        }
        return RefreshIndicator(
          onRefresh: () => ref.refresh(currentPharmacyProvider.future),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: _buildPharmacyCard(pharmacy, isCurrent: true),
            ),
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Hata: $err')),
    );
  }

  Widget _buildCalendarTab(BuildContext context) {
    final scheduleAsync = ref.watch(pharmacyScheduleProvider(_focusedDay));

    return Column(
      children: [
        TableCalendar<PharmacyScheduleModel>(
          firstDay: DateTime.now().subtract(const Duration(days: 365)),
          lastDay: DateTime.now().add(const Duration(days: 365)),
          focusedDay: _focusedDay,
          selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
          calendarFormat: CalendarFormat.month,
          startingDayOfWeek: StartingDayOfWeek.monday,
          availableCalendarFormats: const {
            CalendarFormat.month: 'Ay',
          },
          onDaySelected: (selectedDay, focusedDay) {
            setState(() {
              _selectedDay = selectedDay;
              _focusedDay = focusedDay;
            });
          },
          onPageChanged: (focusedDay) {
            setState(() {
              _focusedDay = focusedDay;
            });
          },
          eventLoader: (day) {
            final data = scheduleAsync.valueOrNull;
            if (data == null) return [];
            final dateFormat = DateFormat('yyyy-MM-dd');
            final dayStr = dateFormat.format(day);
            return data.where((item) => item.date.startsWith(dayStr)).toList();
          },
          calendarBuilders: CalendarBuilders(
            markerBuilder: (context, date, events) {
              if (events.isNotEmpty) {
                return Positioned(
                  bottom: 1,
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.success,
                    ),
                    width: 6.0,
                    height: 6.0,
                  ),
                );
              }
              return null;
            },
          ),
        ),
        const Divider(),
        Expanded(
          child: scheduleAsync.when(
            data: (scheduleList) {
              if (_selectedDay == null) return const SizedBox.shrink();
              
              final dateFormat = DateFormat('yyyy-MM-dd');
              final dayStr = dateFormat.format(_selectedDay!);
              final daySchedules = scheduleList.where((item) => item.date.startsWith(dayStr)).toList();

              if (daySchedules.isEmpty) {
                return const Center(child: Text('Bu tarihte nöbetçi eczane kaydı yok.'));
              }

              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: daySchedules.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: _buildPharmacyCard(daySchedules[index].pharmacy, isCurrent: false),
                  );
                },
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, stack) => Center(child: Text('Hata: $err')),
          ),
        ),
      ],
    );
  }

  Widget _buildPharmacyCard(PharmacyModel pharmacy, {required bool isCurrent}) {
    return Builder(builder: (context) {
      final cs = Theme.of(context).colorScheme;
      return AppCard(
        radius: AppSpacing.radiusXxl,
        elevated: isCurrent,
        glowColor: AppColors.success,
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            // Gradyan eczane ikonu
            Container(
              width: isCurrent ? 84 : 64,
              height: isCurrent ? 84 : 64,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: AppColors.gPharmacy,
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppSpacing.radius2xl),
                boxShadow:
                    AppColors.glow(AppColors.gPharmacy.first, strength: 0.32),
              ),
              child: Icon(Icons.local_pharmacy_rounded,
                  size: isCurrent ? 42 : 32, color: Colors.white),
            ),
            const SizedBox(height: AppSpacing.md),
            if (isCurrent)
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.success.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                ),
                child: Text(
                  'BUGÜN NÖBETÇİ',
                  style: AppTextStyles.labelSmall.copyWith(
                    color: AppColors.success,
                    letterSpacing: 0.8,
                  ),
                ),
              ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              pharmacy.name,
              style: (isCurrent
                      ? AppTextStyles.headlineMedium
                      : AppTextStyles.headlineSmall)
                  .copyWith(color: cs.onSurface),
              textAlign: TextAlign.center,
            ),
            if (pharmacy.pharmacistName != null) ...[
              const SizedBox(height: 4),
              Text(
                pharmacy.pharmacistName!,
                style: AppTextStyles.bodyMedium
                    .copyWith(color: cs.onSurfaceVariant),
              ),
            ],
            const SizedBox(height: AppSpacing.md),
            _infoRow(context, Icons.location_on_rounded, pharmacy.address),
            if (pharmacy.phone.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.sm),
              _infoRow(context, Icons.phone_rounded, pharmacy.phone),
            ],
            if (pharmacy.dutyHours != null) ...[
              const SizedBox(height: AppSpacing.sm),
              _infoRow(context, Icons.access_time_rounded,
                  'Nöbet Saatleri: ${pharmacy.dutyHours}'),
            ],
            const SizedBox(height: AppSpacing.lg),
            Row(
              children: [
                if (pharmacy.phone.isNotEmpty)
                  Expanded(
                    child: FilledButton.icon(
                      icon: const Icon(Icons.phone_rounded, size: 18),
                      label: const Text('Ara'),
                      onPressed: () => MapLauncher.callPhone(pharmacy.phone),
                    ),
                  ),
                // Yol tarifi: koordinat varsa onunla, yoksa adresle çalışır.
                if (pharmacy.phone.isNotEmpty &&
                    (pharmacy.latitude != null || pharmacy.address.isNotEmpty))
                  const SizedBox(width: AppSpacing.smLg),
                if (pharmacy.latitude != null || pharmacy.address.isNotEmpty)
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.directions_rounded, size: 18),
                      label: const Text('Yol Tarifi'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.primary,
                        side: BorderSide(
                            color: AppColors.primary.withValues(alpha: 0.4)),
                        padding:
                            const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusXl),
                        ),
                      ),
                      onPressed: () => MapLauncher.openDirections(
                        lat: pharmacy.latitude,
                        lng: pharmacy.longitude,
                        address: pharmacy.address,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
      );
    });
  }

  Widget _infoRow(BuildContext context, IconData icon, String text) {
    final cs = Theme.of(context).colorScheme;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 19, color: AppColors.primary),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          child: Text(
            text,
            style: AppTextStyles.bodyMedium.copyWith(color: cs.onSurface),
          ),
        ),
      ],
    );
  }

}
