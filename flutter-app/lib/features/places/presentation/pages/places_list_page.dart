import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/places_provider.dart';
import '../widgets/place_card.dart';
import '../../../../core/exceptions/app_exception.dart';

class PlacesListPage extends ConsumerStatefulWidget {
  const PlacesListPage({Key? key}) : super(key: key);

  @override
  ConsumerState<PlacesListPage> createState() => _PlacesListPageState();
}

class _PlacesListPageState extends ConsumerState<PlacesListPage> {
  String _sort = 'name';
  bool? _isFree;

  @override
  Widget build(BuildContext context) {
    final placesAsync = ref.watch(placesProvider(PlacesFilter(
      sort: _sort,
      isFree: _isFree,
    )));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mekanlar'),
      ),
      body: Column(
        children: [
          // Filtreler
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _sort,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 12),
                      border: OutlineInputBorder(),
                      labelText: 'Sırala',
                    ),
                    items: const [
                      DropdownMenuItem(value: 'name', child: Text('İsme Göre (A-Z)')),
                      DropdownMenuItem(value: 'distance', child: Text('Merkeze Uzaklık')),
                    ],
                    onChanged: (val) {
                      if (val != null) {
                        setState(() {
                          _sort = val;
                        });
                      }
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<bool?>(
                    value: _isFree,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 12),
                      border: OutlineInputBorder(),
                      labelText: 'Ücret Durumu',
                    ),
                    items: const [
                      DropdownMenuItem(value: null, child: Text('Tümü')),
                      DropdownMenuItem(value: true, child: Text('Ücretsiz')),
                      DropdownMenuItem(value: false, child: Text('Ücretli')),
                    ],
                    onChanged: (val) {
                      setState(() {
                        _isFree = val;
                      });
                    },
                  ),
                ),
              ],
            ),
          ),
          const Divider(),

          // Liste
          Expanded(
            child: placesAsync.when(
              data: (places) {
                if (places.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.place_outlined, size: 64, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          'Mekan bulunamadı.',
                          style: TextStyle(color: Colors.grey, fontSize: 16),
                        ),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    // ignore: unused_result
                    ref.refresh(placesProvider(PlacesFilter(
                      sort: _sort,
                      isFree: _isFree,
                    )));
                  },
                  child: ListView.builder(
                    itemCount: places.length,
                    itemBuilder: (context, index) {
                      return PlaceCard(place: places[index]);
                    },
                  ),
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
                          ref.refresh(placesProvider(PlacesFilter(
                            sort: _sort,
                            isFree: _isFree,
                          )));
                        },
                        child: const Text('Tekrar Dene'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
