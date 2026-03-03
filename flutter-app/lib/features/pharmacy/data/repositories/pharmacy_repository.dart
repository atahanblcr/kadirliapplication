import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/pharmacy_remote_datasource.dart';
import '../models/pharmacy_model.dart';

class PharmacyRepository {
  final PharmacyRemoteDatasource _datasource;

  PharmacyRepository({PharmacyRemoteDatasource? datasource})
      : _datasource = datasource ?? PharmacyRemoteDatasource();

  Future<PharmacyModel?> getCurrentPharmacy() async {
    try {
      final response = await _datasource.getCurrentPharmacy();
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final pharmacyJson = data['pharmacy'] as Map<String, dynamic>?;
      if (pharmacyJson == null) return null;
      return PharmacyModel.fromJson(pharmacyJson);
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message: 'Failed to parse current pharmacy: $e');
    }
  }

  Future<List<PharmacyScheduleModel>> getSchedule({
    required String startDate,
    required String endDate,
  }) async {
    try {
      final response = await _datasource.getSchedule(
        startDate: startDate,
        endDate: endDate,
      );
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final scheduleJson = data['schedule'] as List<dynamic>? ?? [];
      return List<PharmacyScheduleModel>.from(
        scheduleJson.map((item) => PharmacyScheduleModel.fromJson(item as Map<String, dynamic>)),
      );
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message: 'Failed to parse pharmacy schedule: $e');
    }
  }

  Future<Map<String, dynamic>> getPharmacies({
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final response = await _datasource.getPharmacies(page: page, limit: limit);
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final pharmaciesJson = data['pharmacies'] as List<dynamic>? ?? [];
      final pharmacies = List<PharmacyModel>.from(
        pharmaciesJson.map((item) => PharmacyModel.fromJson(item as Map<String, dynamic>)),
      );
      return {
        'pharmacies': pharmacies,
        'meta': data['meta'] ?? response['meta'] ?? {},
      };
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message: 'Failed to parse pharmacies list: $e');
    }
  }
}
