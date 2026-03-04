import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/deaths_repository.dart';
import '../../data/models/death_model.dart';

final deathsRepositoryProvider = Provider((ref) {
  return DeathsRepository();
});

class DeathsFilter {
  final int page;
  final String? funeralDate;

  DeathsFilter({required this.page, this.funeralDate});

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DeathsFilter &&
          runtimeType == other.runtimeType &&
          page == other.page &&
          funeralDate == other.funeralDate;

  @override
  int get hashCode => page.hashCode ^ funeralDate.hashCode;
}

final deathsProvider = FutureProvider.family.autoDispose<
    Map<String, dynamic>,
    DeathsFilter>((ref, filter) async {
  final repository = ref.watch(deathsRepositoryProvider);
  return repository.getDeaths(
    page: filter.page,
    funeralDate: filter.funeralDate,
  );
});

final deathDetailProvider = FutureProvider.family.autoDispose<
    DeathNoticeDetailModel,
    String>((ref, id) async {
  final repository = ref.watch(deathsRepositoryProvider);
  return repository.getDeathDetail(id);
});

final cemeteriesProvider = FutureProvider.autoDispose<List<CemeteryModel>>((ref) async {
  final repository = ref.watch(deathsRepositoryProvider);
  return repository.getCemeteries();
});

final mosquesProvider = FutureProvider.autoDispose<List<MosqueModel>>((ref) async {
  final repository = ref.watch(deathsRepositoryProvider);
  return repository.getMosques();
});
