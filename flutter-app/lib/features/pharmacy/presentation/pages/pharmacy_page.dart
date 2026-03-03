import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import 'package:kadirliapp/features/pharmacy/presentation/providers/pharmacy_provider.dart';
import 'package:kadirliapp/features/pharmacy/data/models/pharmacy_model.dart';

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
                      color: Colors.green,
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
    return Card(
      elevation: isCurrent ? 4 : 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Icon(
              Icons.local_pharmacy,
              size: isCurrent ? 64 : 48,
              color: Colors.green,
            ),
            const SizedBox(height: 12),
            if (isCurrent)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'BUGÜN NÖBETÇİ',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ),
            const SizedBox(height: 8),
            Text(
              pharmacy.name,
              style: TextStyle(
                fontSize: isCurrent ? 22 : 18,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            if (pharmacy.pharmacistName != null) ...[
              const SizedBox(height: 4),
              Text(
                pharmacy.pharmacistName!,
                style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
              ),
            ],
            const SizedBox(height: 16),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.location_on, size: 20, color: Colors.grey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    pharmacy.address,
                    style: const TextStyle(fontSize: 15),
                  ),
                ),
              ],
            ),
            if (pharmacy.phone.isNotEmpty) ...[
              const SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Icon(Icons.phone, size: 20, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(
                    pharmacy.phone,
                    style: const TextStyle(fontSize: 15),
                  ),
                ],
              ),
            ],
            if (pharmacy.dutyHours != null) ...[
              const SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Icon(Icons.access_time, size: 20, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(
                    'Nöbet Saatleri: ${pharmacy.dutyHours}',
                    style: const TextStyle(fontSize: 15),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (pharmacy.phone.isNotEmpty)
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.phone),
                      label: const Text('Ara'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        backgroundColor: Colors.blue.shade50,
                        foregroundColor: Colors.blue.shade700,
                      ),
                      onPressed: () => _callPhone(pharmacy.phone),
                    ),
                  ),
                if (pharmacy.phone.isNotEmpty && pharmacy.latitude != null)
                  const SizedBox(width: 12),
                if (pharmacy.latitude != null && pharmacy.longitude != null)
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.map),
                      label: const Text('Haritada Gör'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        backgroundColor: Colors.green.shade50,
                        foregroundColor: Colors.green.shade700,
                      ),
                      onPressed: () => _openMap(pharmacy.latitude!, pharmacy.longitude!, pharmacy.name),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _callPhone(String phone) async {
    final cleanPhone = phone.replaceAll(RegExp(r'[^\d+]'), '');
    final url = Uri.parse('tel:$cleanPhone');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Future<void> _openMap(double lat, double lng, String name) async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }
}
