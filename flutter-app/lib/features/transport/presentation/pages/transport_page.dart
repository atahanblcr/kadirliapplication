import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/transport_provider.dart';
import '../../data/models/transport_model.dart';
import '../../../../core/exceptions/app_exception.dart';

class TransportPage extends ConsumerStatefulWidget {
  const TransportPage({Key? key}) : super(key: key);

  @override
  ConsumerState<TransportPage> createState() => _TransportPageState();
}

class _TransportPageState extends ConsumerState<TransportPage> with SingleTickerProviderStateMixin {
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
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'Şehir İçi'),
            Tab(text: 'Şehirlerarası'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _IntracityView(),
          _IntercityView(),
        ],
      ),
    );
  }
}

class _IntracityView extends ConsumerWidget {
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
            return _buildEmptyState('Şehir içi güzergah bulunamadı.');
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: routes.length,
            itemBuilder: (context, index) {
              final route = routes[index];
              return _IntracityCard(route: route);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => _buildErrorState(error, ref, intracityRoutesProvider),
      ),
    );
  }
}

class _IntercityView extends ConsumerWidget {
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
            return _buildEmptyState('Şehirlerarası güzergah bulunamadı.');
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: routes.length,
            itemBuilder: (context, index) {
              final route = routes[index];
              return _IntercityCard(route: route);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => _buildErrorState(error, ref, intercityRoutesProvider),
      ),
    );
  }
}

Widget _buildEmptyState(String message) {
  return ListView(
    physics: const AlwaysScrollableScrollPhysics(),
    children: [
      SizedBox(
        height: 400,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.directions_bus, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              Text(
                message,
                style: const TextStyle(color: Colors.grey, fontSize: 16),
              ),
            ],
          ),
        ),
      ),
    ],
  );
}

Widget _buildErrorState(Object error, WidgetRef ref, ProviderBase provider) {
  String message = 'Bir hata oluştu.';
  if (error is AppException) {
    message = error.message;
  }
  return Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(Icons.error_outline, color: Colors.red, size: 48),
        const SizedBox(height: 16),
        Text(message, textAlign: TextAlign.center),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            // ignore: unused_result
            ref.refresh(provider);
          },
          child: const Text('Tekrar Dene'),
        ),
      ],
    ),
  );
}

class _IntracityCard extends StatelessWidget {
  final IntracityRoute route;

  const _IntracityCard({Key? key, required this.route}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ExpansionTile(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.blue[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                route.routeNumber,
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue[900]),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                route.routeName,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Text(
            'İlk: ${route.firstDeparture} | Son: ${route.lastDeparture} | ${route.frequencyMinutes} dk\'da bir',
            style: const TextStyle(fontSize: 12),
          ),
        ),
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
                  radius: 12,
                  backgroundColor: Colors.grey[200],
                  child: Text('${index + 1}', style: const TextStyle(fontSize: 12, color: Colors.black)),
                ),
                title: Text(stop.stopName),
                trailing: Text('+${stop.timeFromStart} dk', style: const TextStyle(color: Colors.grey)),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _IntercityCard extends StatelessWidget {
  final IntercityRoute route;

  const _IntercityCard({Key? key, required this.route}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    route.destination,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                ),
                Text(
                  '${route.price} ₺',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.green),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.directions_bus, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(route.company, style: const TextStyle(color: Colors.grey)),
                const SizedBox(width: 16),
                const Icon(Icons.timer, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text('${route.durationMinutes} dk', style: const TextStyle(color: Colors.grey)),
              ],
            ),
            const Divider(height: 24),
            const Text('Sefer Saatleri:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: route.schedules.map((schedule) {
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.indigo[50],
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.indigo[100]!),
                  ),
                  child: Text(
                    schedule.departureTime,
                    style: TextStyle(color: Colors.indigo[900], fontWeight: FontWeight.bold),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}
