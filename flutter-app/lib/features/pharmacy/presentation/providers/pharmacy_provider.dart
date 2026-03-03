import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/datasources/pharmacy_remote_datasource.dart';
import '../../data/repositories/pharmacy_repository.dart';
import '../../data/models/pharmacy_model.dart';
import 'package:intl/intl.dart';

final pharmacyDatasourceProvider = Provider<PharmacyRemoteDatasource>((ref) {
  return PharmacyRemoteDatasource(dioClient: DioClient());
});

final pharmacyRepositoryProvider = Provider<PharmacyRepository>((ref) {
  return PharmacyRepository(datasource: ref.read(pharmacyDatasourceProvider));
});

final currentPharmacyProvider = FutureProvider<PharmacyModel?>((ref) async {
  final repository = ref.read(pharmacyRepositoryProvider);
  return await repository.getCurrentPharmacy();
});

final pharmacyScheduleProvider = FutureProvider.family<List<PharmacyScheduleModel>, DateTime>((ref, month) async {
  final repository = ref.read(pharmacyRepositoryProvider);
  
  // Calculate first and last day of the month
  final firstDay = DateTime(month.year, month.month, 1);
  final lastDay = DateTime(month.year, month.month + 1, 0);
  
  final dateFormat = DateFormat('yyyy-MM-dd');
  
  return await repository.getSchedule(
    startDate: dateFormat.format(firstDay),
    endDate: dateFormat.format(lastDay),
  );
});

class PharmaciesListState {
  final List<PharmacyModel> pharmacies;
  final bool isLoading;
  final bool hasNext;
  final String? error;
  final int page;

  PharmaciesListState({
    this.pharmacies = const [],
    this.isLoading = false,
    this.hasNext = true,
    this.error,
    this.page = 1,
  });

  PharmaciesListState copyWith({
    List<PharmacyModel>? pharmacies,
    bool? isLoading,
    bool? hasNext,
    String? error,
    int? page,
  }) {
    return PharmaciesListState(
      pharmacies: pharmacies ?? this.pharmacies,
      isLoading: isLoading ?? this.isLoading,
      hasNext: hasNext ?? this.hasNext,
      error: error,
      page: page ?? this.page,
    );
  }
}

class PharmaciesListNotifier extends StateNotifier<PharmaciesListState> {
  final Ref ref;

  PharmaciesListNotifier(this.ref) : super(PharmaciesListState()) {
    loadMore();
  }

  Future<void> loadMore({bool refresh = false}) async {
    if (state.isLoading || (!state.hasNext && !refresh)) return;

    if (refresh) {
      state = state.copyWith(
        isLoading: true,
        page: 1,
        hasNext: true,
        error: null,
      );
    } else {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final repository = ref.read(pharmacyRepositoryProvider);
      final response = await repository.getPharmacies(page: state.page);
      
      final newPharmacies = response['pharmacies'] as List<PharmacyModel>;
      final meta = response['meta'] as Map<String, dynamic>;
      final hasNext = meta['has_next'] ?? false;

      state = state.copyWith(
        pharmacies: refresh ? newPharmacies : [...state.pharmacies, ...newPharmacies],
        isLoading: false,
        hasNext: hasNext,
        page: state.page + 1,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refresh() => loadMore(refresh: true);
}

final pharmaciesListNotifierProvider = StateNotifierProvider.autoDispose<PharmaciesListNotifier, PharmaciesListState>((ref) {
  return PharmaciesListNotifier(ref);
});
