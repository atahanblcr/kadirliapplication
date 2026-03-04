import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../models/ad_model.dart';
import '../models/category_model.dart';

class AdsRepository {
  final DioClient _client;

  AdsRepository({DioClient? client}) : _client = client ?? DioClient();

  Future<({List<AdModel> items, int total, int totalPages})> getAds({
    int page = 1,
    int limit = 20,
    String? categoryId,
    int? minPrice,
    int? maxPrice,
    String? search,
    String? sort,
  }) async {
    try {
      final Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
      };

      if (categoryId != null) queryParams['category_id'] = categoryId;
      if (minPrice != null) queryParams['min_price'] = minPrice;
      if (maxPrice != null) queryParams['max_price'] = maxPrice;
      if (search != null) queryParams['search'] = search;
      if (sort != null) queryParams['sort'] = sort;

      final response = await _client.get(
        ApiConstants.adsList,
        queryParameters: queryParams,
      );

      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};
      final adsList = (dataField['ads'] as List<dynamic>? ?? [])
          .map((e) => AdModel.fromJson(e as Map<String, dynamic>? ?? {}))
          .toList();

      final metaField = dataField['meta'] as Map<String, dynamic>? ?? {};
      final total = metaField['total'] as int? ?? 0;
      final totalPages = metaField['total_pages'] as int? ?? 1;

      return (items: adsList, total: total, totalPages: totalPages);
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<AdModel> getAdById(String id) async {
    try {
      final response = await _client.get('/ads/$id');
      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};
      final adJson = (dataField['ad'] ?? dataField) as Map<String, dynamic>? ?? {};

      return AdModel.fromJson(adJson);
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<List<CategoryModel>> getCategories() async {
    try {
      final response = await _client.get(ApiConstants.adsCategories);
      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};
      final categoriesList = (dataField['categories'] as List<dynamic>? ?? [])
          .map((e) => CategoryModel.fromJson(e as Map<String, dynamic>? ?? {}))
          .toList();

      return categoriesList;
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<({CategoryModel category, List<Map<String, dynamic>> properties})> getCategoryProperties(String categoryId) async {
    try {
      final response = await _client.get('/ads/categories/$categoryId/properties');
      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};
      
      final category = CategoryModel.fromJson(dataField['category'] as Map<String, dynamic>? ?? {});
      final properties = (dataField['properties'] as List<dynamic>? ?? [])
          .map((e) => e as Map<String, dynamic>? ?? {})
          .toList();

      return (category: category, properties: properties);
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<AdModel> createAd(Map<String, dynamic> adData) async {
    try {
      final response = await _client.post(ApiConstants.adsCreate, data: adData);
      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};
      final adJson = (dataField['ad'] ?? dataField) as Map<String, dynamic>? ?? {};
      return AdModel.fromJson(adJson);
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<AdModel> updateAd(String id, Map<String, dynamic> adData) async {
    try {
      final response = await _client.patch('/ads/$id', data: adData);
      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};
      final adJson = (dataField['ad'] ?? dataField) as Map<String, dynamic>? ?? {};
      return AdModel.fromJson(adJson);
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<void> deleteAd(String id) async {
    try {
      await _client.delete('/ads/$id');
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<Map<String, dynamic>> extendAd(String id, int adsWatched) async {
    try {
      final response = await _client.post('/ads/$id/extend', data: {'ads_watched': adsWatched});
      return response.data['data'] as Map<String, dynamic>? ?? {};
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<bool> toggleFavorite(String id, bool isAdding) async {
    try {
      if (isAdding) {
        await _client.post('/ads/$id/favorite');
      } else {
        await _client.delete('/ads/$id/favorite');
      }
      return true;
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  Future<String> uploadFile(String filePath) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath),
        'module_type': 'ad',
      });
      final response = await _client.post('/files/upload', data: formData);
      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};
      final fileData = dataField['file'] as Map<String, dynamic>? ?? {};
      return fileData['id']?.toString() ?? '';
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  AppException _handleDioError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout) {
      return TimeoutException();
    }
    if (e.type == DioExceptionType.connectionError) {
      return NetworkException();
    }
    final statusCode = e.response?.statusCode;
    final responseData = e.response?.data;
    String message = 'Bir hata oluştu';
    if (responseData is Map<String, dynamic>) {
      message = responseData['error']?['message'] as String? ??
          responseData['message'] as String? ??
          message;
    }
    switch (statusCode) {
      case 400: return ValidationException(message: message);
      case 401: return UnauthorizedException(message: message);
      case 403: return ForbiddenException(message: message);
      case 404: return NotFoundException(message: message);
      default:
        if (statusCode != null && statusCode >= 500) return ServerException(message: message);
        return UnknownException(message: message);
    }
  }
}
