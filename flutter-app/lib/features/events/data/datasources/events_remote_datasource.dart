import '../../../../core/network/dio_client.dart';

class EventsRemoteDatasource {
  final DioClient _dioClient;

  EventsRemoteDatasource({DioClient? dioClient}) : _dioClient = dioClient ?? DioClient();

  Future<Map<String, dynamic>> getEvents({
    int page = 1,
    int limit = 20,
    String? categoryId,
    String? city,
  }) async {
    final queryParameters = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (categoryId != null && categoryId.isNotEmpty) {
      queryParameters['category_id'] = categoryId;
    }
    if (city != null && city.isNotEmpty) {
      queryParameters['city'] = city;
    }

    final response = await _dioClient.get(
      '/events',
      queryParameters: queryParameters,
    );

    return response.data;
  }

  Future<Map<String, dynamic>> getEventDetail(String id) async {
    final response = await _dioClient.get('/events/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getCategories() async {
    final response = await _dioClient.get('/events/categories');
    return response.data;
  }
}
