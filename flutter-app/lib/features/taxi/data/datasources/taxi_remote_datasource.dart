import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class TaxiRemoteDatasource {
  late final Dio dio;

  TaxiRemoteDatasource({Dio? mockDio}) {
    dio = mockDio ?? DioClient().dio;
  }

  Future<Map<String, dynamic>> getDrivers() async {
    final response = await dio.get<Map<String, dynamic>>('/taxi/drivers');
    return response.data ?? {};
  }

  Future<Map<String, dynamic>> callDriver(String driverId) async {
    final response = await dio.post<Map<String, dynamic>>('/taxi/drivers/$driverId/call');
    return response.data ?? {};
  }
}
