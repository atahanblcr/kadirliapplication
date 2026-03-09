import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/transport_model.dart';
import '../../data/repositories/transport_repository.dart';

final transportRepositoryProvider = Provider<TransportRepository>((ref) {
  return TransportRepository();
});

final intercityRoutesProvider = FutureProvider<List<IntercityRoute>>((ref) async {
  final repository = ref.read(transportRepositoryProvider);
  return repository.getIntercityRoutes();
});

final intracityRoutesProvider = FutureProvider<List<IntracityRoute>>((ref) async {
  final repository = ref.read(transportRepositoryProvider);
  return repository.getIntracityRoutes();
});
