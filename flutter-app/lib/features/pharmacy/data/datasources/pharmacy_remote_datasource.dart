import '../../../../core/network/dio_client.dart';

class PharmacyRemoteDatasource {
  final DioClient _dioClient;

  PharmacyRemoteDatasource({DioClient? dioClient}) : _dioClient = dioClient ?? DioClient();

  Future<Map<String, dynamic>> getCurrentPharmacy() async {
    final response = await _dioClient.get('/pharmacy/current');
    return response.data;
  }

  Future<Map<String, dynamic>> getSchedule({
    required String startDate,
    required String endDate,
  }) async {
    final response = await _dioClient.get(
      '/pharmacy/schedule',
      queryParameters: {
        'start_date': startDate,
        'end_date': endDate,
      },
    );
    return response.data;
  }

  Future<Map<String, dynamic>> getPharmacies({
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _dioClient.get(
      '/pharmacy/list',
      queryParameters: {
        'page': page,
        'limit': limit,
      },
    );
    return response.data;
  }
}
