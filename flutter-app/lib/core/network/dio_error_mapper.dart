import 'package:dio/dio.dart';
import '../exceptions/app_exception.dart';

/// Converts a [DioException] into the matching [AppException] subtype so
/// every repository surfaces the same Turkish, status-code-aware message
/// instead of repeating this switch or leaking the raw DioException to the UI.
AppException mapDioError(DioException e) {
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
    default:
      if (statusCode != null && statusCode >= 500) return ServerException(message: message);
      return UnknownException(message: message);
  }
}
