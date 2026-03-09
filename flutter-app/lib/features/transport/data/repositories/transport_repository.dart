import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/transport_remote_datasource.dart';
import '../models/transport_model.dart';

class TransportRepository {
  final TransportRemoteDatasource _datasource;

  TransportRepository({TransportRemoteDatasource? datasource})
      : _datasource = datasource ?? TransportRemoteDatasource();

  Future<List<IntercityRoute>> getIntercityRoutes() async {
    try {
      final response = await _datasource.getIntercityRoutes();
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final routesData = data['routes'] as List?;
      if (routesData == null) return [];
      
      return List<IntercityRoute>.from(
        routesData.map((d) => IntercityRoute.fromJson(d as Map<String, dynamic>)),
      );
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse intercity routes: $e');
    }
  }

  Future<List<IntracityRoute>> getIntracityRoutes() async {
    try {
      final response = await _datasource.getIntracityRoutes();
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final routesData = data['routes'] as List?;
      if (routesData == null) return [];
      
      return List<IntracityRoute>.from(
        routesData.map((d) => IntracityRoute.fromJson(d as Map<String, dynamic>)),
      );
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse intracity routes: $e');
    }
  }
}
