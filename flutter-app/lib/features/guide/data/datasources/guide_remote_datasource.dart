import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class GuideRemoteDatasource {
  late final Dio dio;

  GuideRemoteDatasource({Dio? mockDio}) {
    dio = mockDio ?? DioClient().dio;
  }

  Future<Map<String, dynamic>> getCategories() async {
    final response = await dio.get<Map<String, dynamic>>('/guide/categories');
    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getGuideItems({
    String? categoryId,
    String? search,
  }) async {
    final queryParameters = <String, dynamic>{};
    
    if (categoryId != null) {
      queryParameters['category_id'] = categoryId;
    }
    
    if (search != null && search.isNotEmpty) {
      queryParameters['search'] = search;
    }

    final response = await dio.get<Map<String, dynamic>>(
      '/guide',
      queryParameters: queryParameters,
    );

    return response.data ?? {};
  }
}
