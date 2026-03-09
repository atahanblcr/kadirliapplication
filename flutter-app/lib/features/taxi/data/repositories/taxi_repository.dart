import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/taxi_remote_datasource.dart';
import '../models/taxi_model.dart';

class TaxiRepository {
  final TaxiRemoteDatasource _datasource;

  TaxiRepository({TaxiRemoteDatasource? datasource})
      : _datasource = datasource ?? TaxiRemoteDatasource();

  Future<List<TaxiDriverModel>> getDrivers() async {
    try {
      final response = await _datasource.getDrivers();
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final driversData = data['drivers'] as List?;
      if (driversData == null) return [];
      
      return List<TaxiDriverModel>.from(
        driversData.map((d) => TaxiDriverModel.fromJson(d as Map<String, dynamic>)),
      );
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse taxi drivers: $e');
    }
  }

  Future<void> callDriver(String driverId) async {
    try {
      await _datasource.callDriver(driverId);
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to process call response: $e');
    }
  }
}
