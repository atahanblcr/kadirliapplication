import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/taxi_repository.dart';
import '../../data/models/taxi_model.dart';

final taxiRepositoryProvider = Provider((ref) {
  return TaxiRepository();
});

final taxiDriversProvider = FutureProvider.autoDispose<List<TaxiDriverModel>>((ref) async {
  final repository = ref.watch(taxiRepositoryProvider);
  return repository.getDrivers();
});
