import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class PlacesRemoteDatasource {
  late final Dio dio;

  PlacesRemoteDatasource({Dio? mockDio}) {
    dio = mockDio ?? DioClient().dio;
  }

  Future<Map<String, dynamic>> getPlaces({
    String? categoryId,
    bool? isFree,
    String sort = 'name',
    double? userLat,
    double? userLng,
  }) async {
    final queryParameters = <String, dynamic>{
      'sort': sort,
    };
    
    if (categoryId != null) queryParameters['category_id'] = categoryId;
    if (isFree != null) queryParameters['is_free'] = isFree;
    if (userLat != null) queryParameters['user_lat'] = userLat;
    if (userLng != null) queryParameters['user_lng'] = userLng;

    final response = await dio.get<Map<String, dynamic>>(
      '/places',
      queryParameters: queryParameters,
    );

    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getPlaceDetail(String placeId) async {
    final response = await dio.get<Map<String, dynamic>>('/places/$placeId');
    return response.data ?? {};
  }
}
