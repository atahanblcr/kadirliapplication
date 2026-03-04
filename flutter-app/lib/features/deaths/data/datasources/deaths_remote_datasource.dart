import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class DeathsRemoteDatasource {
  late final Dio dio;

  DeathsRemoteDatasource({Dio? mockDio}) {
    dio = mockDio ?? DioClient().dio;
  }

  Future<Map<String, dynamic>> getDeaths({
    required int page,
    required int limit,
    String? funeralDate,
  }) async {
    final queryParameters = {
      'page': page,
      'limit': limit,
      if (funeralDate != null) 'funeral_date': funeralDate,
    };

    final response = await dio.get<Map<String, dynamic>>(
      '/deaths',
      queryParameters: queryParameters,
    );

    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getDeathDetail(String id) async {
    final response = await dio.get<Map<String, dynamic>>('/deaths/$id');
    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getCemeteries() async {
    final response = await dio.get<Map<String, dynamic>>('/deaths/cemeteries');
    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getMosques() async {
    final response = await dio.get<Map<String, dynamic>>('/deaths/mosques');
    return response.data ?? {};
  }
}
