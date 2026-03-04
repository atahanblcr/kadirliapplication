import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/taxi_provider.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../../data/models/taxi_model.dart';

class TaxiPage extends ConsumerWidget {
  const TaxiPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final driversAsync = ref.watch(taxiDriversProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Taksi'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // ignore: unused_result
          ref.refresh(taxiDriversProvider);
        },
        child: driversAsync.when(
          data: (drivers) {
            if (drivers.isEmpty) {
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.7,
                    child: const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.local_taxi, size: 64, color: Colors.grey),
                          SizedBox(height: 16),
                          Text(
                            'Şu an aktif taksi bulunmuyor.',
                            style: TextStyle(color: Colors.grey, fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            }

            return ListView.builder(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: drivers.length,
              itemBuilder: (context, index) {
                return _TaxiCard(driver: drivers[index]);
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stack) {
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
                      ref.refresh(taxiDriversProvider);
                    },
                    child: const Text('Tekrar Dene'),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class _TaxiCard extends ConsumerWidget {
  final TaxiDriverModel driver;

  const _TaxiCard({Key? key, required this.driver}) : super(key: key);

  Future<void> _callDriver(BuildContext context, WidgetRef ref) async {
    try {
      final repository = ref.read(taxiRepositoryProvider);
      await repository.callDriver(driver.id);
    } catch (e) {
      debugPrint('Taksi çağrısı kaydedilemedi: $e');
      // Kullanıcıya hata göstermeyebiliriz çünkü telefon araması asıl amaç
    }

    final url = Uri.parse('tel:${driver.phone}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            // İkon
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.yellow[100],
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.local_taxi, color: Colors.orange, size: 32),
            ),
            const SizedBox(width: 16),
            
            // Bilgiler
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    driver.name,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue[50],
                      border: Border.all(color: Colors.blue[200]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      driver.plaka,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: Colors.blue[800],
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                  if (driver.vehicleInfo != null && driver.vehicleInfo!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      driver.vehicleInfo!,
                      style: TextStyle(color: Colors.grey[600], fontSize: 13),
                    ),
                  ],
                ],
              ),
            ),
            
            // Ara Butonu
            IconButton(
              onPressed: () => _callDriver(context, ref),
              icon: const Icon(Icons.phone),
              color: Colors.white,
              style: IconButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.all(12),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
