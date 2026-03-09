import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/places_remote_datasource.dart';
import '../models/place_model.dart';

class PlacesRepository {
  final PlacesRemoteDatasource _datasource;

  PlacesRepository({PlacesRemoteDatasource? datasource})
      : _datasource = datasource ?? PlacesRemoteDatasource();

  Future<List<PlaceModel>> getPlaces({
    String? categoryId,
    bool? isFree,
    String sort = 'name',
    double? userLat,
    double? userLng,
  }) async {
    try {
      final response = await _datasource.getPlaces(
        categoryId: categoryId,
        isFree: isFree,
        sort: sort,
        userLat: userLat,
        userLng: userLng,
      );
      
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final placesData = data['places'] as List?;
      if (placesData == null) return [];
      
      return List<PlaceModel>.from(
        placesData.map(
          (p) => PlaceModel.fromJson(p as Map<String, dynamic>),
        ),
      );
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse places: $e');
    }
  }

  Future<PlaceDetailModel> getPlaceDetail(String placeId) async {
    try {
      final response = await _datasource.getPlaceDetail(placeId);
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final placeJson = data['place'] as Map<String, dynamic>;
      return PlaceDetailModel.fromJson(placeJson);
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse place detail: $e');
    }
  }
}
