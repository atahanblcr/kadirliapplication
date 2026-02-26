import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../models/announcement_model.dart';

class AnnouncementsRepository {
  final DioClient _client;

  AnnouncementsRepository({DioClient? client}) : _client = client ?? DioClient();

  /// GET /announcements?page=1&limit=20
  /// Returns tuple: (items, total, totalPages)
  Future<({List<AnnouncementModel> items, int total, int totalPages})>
      getAnnouncements({int page = 1, int limit = 20}) async {
    try {
      final response = await _client.get(
        ApiConstants.announcementsList,
        queryParameters: {'page': page, 'limit': limit},
      );

      // API response: { success, data: { announcements: [...], meta: {...} }, meta }
      // Pagination meta is in data.data.meta (NOT data.meta)
      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};

      // Get announcements list
      final announcementsList = (dataField['announcements'] as List<dynamic>? ?? [])
          .map((e) => AnnouncementModel.fromJson(e as Map<String, dynamic>))
          .toList();

      // Get pagination meta from data.data.meta
      final metaField = dataField['meta'] as Map<String, dynamic>? ?? {};
      final total = metaField['total'] as int? ?? 0;
      final totalPages = metaField['total_pages'] as int? ?? 1;

      return (items: announcementsList, total: total, totalPages: totalPages);
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  /// GET /announcements/:id
  /// Returns single announcement detail
  Future<AnnouncementModel> getAnnouncementById(String id) async {
    try {
      final response = await _client.get('/announcements/$id');

      // API response: { success, data: { announcement: {...} }, meta }
      final dataField = response.data['data'] as Map<String, dynamic>? ?? {};

      // Get announcement object (could be 'announcement' or directly in data)
      final announcementJson = (dataField['announcement'] ?? dataField) as Map<String, dynamic>;

      return AnnouncementModel.fromJson(announcementJson);
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw UnknownException(message: 'Beklenmedik bir hata: $e');
    }
  }

  /// Handle Dio errors and convert to app exceptions
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
      case 400:
        return ValidationException(message: message);
      case 401:
        return UnauthorizedException(message: message);
      case 403:
        return ForbiddenException(message: message);
      case 404:
        return NotFoundException(message: message);
      case 429:
        return ValidationException(
            message: 'Çok fazla istek gönderdiziz, lütfen bekleyin');
      default:
        if (statusCode != null && statusCode >= 500) {
          return ServerException(message: message);
        }
        return UnknownException(message: message);
    }
  }
}
