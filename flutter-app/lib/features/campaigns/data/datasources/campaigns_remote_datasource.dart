import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class CampaignsRemoteDatasource {
  late final Dio dio;

  CampaignsRemoteDatasource({Dio? mockDio}) {
    dio = mockDio ?? DioClient().dio;
  }

  Future<Map<String, dynamic>> getCampaigns({
    required int page,
    required int limit,
    String? categoryId,
    bool activeOnly = true,
  }) async {
    final queryParameters = {
      'page': page,
      'limit': limit,
      'active_only': activeOnly,
    };
    
    if (categoryId != null) {
      queryParameters['category_id'] = categoryId;
    }

    final response = await dio.get<Map<String, dynamic>>(
      '/campaigns',
      queryParameters: queryParameters,
    );

    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getCampaignDetail(String campaignId) async {
    final response = await dio.get<Map<String, dynamic>>('/campaigns/$campaignId');
    return response.data ?? {};
  }

  Future<Map<String, dynamic>> viewCode(String campaignId) async {
    final response = await dio.post<Map<String, dynamic>>('/campaigns/$campaignId/view-code');
    return response.data ?? {};
  }
}
