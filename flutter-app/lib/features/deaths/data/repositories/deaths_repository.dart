import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/deaths_remote_datasource.dart';
import '../models/death_model.dart';

class DeathsRepository {
  final DeathsRemoteDatasource _datasource;

  DeathsRepository({DeathsRemoteDatasource? datasource})
      : _datasource = datasource ?? DeathsRemoteDatasource();

  Future<Map<String, dynamic>> getDeaths({
    int page = 1,
    int limit = 20,
    String? funeralDate,
  }) async {
    try {
      final response = await _datasource.getDeaths(
        page: page,
        limit: limit,
        funeralDate: funeralDate,
      );

      final data = response['data'] as Map<String, dynamic>? ?? {};
      final noticesJson = data['notices'] as List<dynamic>? ?? [];
      final notices = List<DeathNoticeModel>.from(
        noticesJson.map((notice) => DeathNoticeModel.fromJson(notice as Map<String, dynamic>)),
      );

      return {
        'notices': notices,
        'meta': data['meta'] ?? response['meta'] ?? {},
      };
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message:'Failed to parse deaths: $e');
    }
  }

  Future<DeathNoticeDetailModel> getDeathDetail(String id) async {
    try {
      final response = await _datasource.getDeathDetail(id);
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final noticeJson = data['notice'] as Map<String, dynamic>;
      return DeathNoticeDetailModel.fromJson(noticeJson);
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message:'Failed to parse death detail: $e');
    }
  }

  Future<List<CemeteryModel>> getCemeteries() async {
    try {
      final response = await _datasource.getCemeteries();
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final cemeteriesJson = data['cemeteries'] as List<dynamic>? ?? [];
      return List<CemeteryModel>.from(
        cemeteriesJson.map((c) => CemeteryModel.fromJson(c as Map<String, dynamic>)),
      );
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message:'Failed to parse cemeteries: $e');
    }
  }

  Future<List<MosqueModel>> getMosques() async {
    try {
      final response = await _datasource.getMosques();
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final mosquesJson = data['mosques'] as List<dynamic>? ?? [];
      return List<MosqueModel>.from(
        mosquesJson.map((m) => MosqueModel.fromJson(m as Map<String, dynamic>)),
      );
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message:'Failed to parse mosques: $e');
    }
  }
}
