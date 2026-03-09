import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class TransportRemoteDatasource {
  late final Dio dio;

  TransportRemoteDatasource({Dio? mockDio}) {
    dio = mockDio ?? DioClient().dio;
  }

  Future<Map<String, dynamic>> getIntercityRoutes() async {
    final response = await dio.get<Map<String, dynamic>>('/transport/intercity');
    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getIntracityRoutes() async {
    final response = await dio.get<Map<String, dynamic>>('/transport/intracity');
    return response.data ?? {};
  }
}
