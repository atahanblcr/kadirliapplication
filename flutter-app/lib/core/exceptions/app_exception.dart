/// App Exception Hierarchy
/// Base exception class for application-level errors

abstract class AppException implements Exception {
  final String message;
  final String? code;

  AppException(this.message, [this.code]);

  @override
  String toString() => message;
}

/// Network Exception
/// Thrown when network connectivity is lost or unavailable
class NetworkException extends AppException {
  NetworkException({
    String message = 'İnternet bağlantısı yok',
  }) : super(message, 'NETWORK_ERROR');
}

/// Unauthorized Exception
/// Thrown when authentication fails (401) or token is invalid
class UnauthorizedException extends AppException {
  UnauthorizedException({
    String message = 'Oturum süresi doldu, lütfen giriş yapın',
  }) : super(message, '401');
}

/// Forbidden Exception
/// Thrown when user doesn't have permission (403)
class ForbiddenException extends AppException {
  ForbiddenException({
    String message = 'Yetkiniz yok',
  }) : super(message, '403');
}

/// Not Found Exception
/// Thrown when resource is not found (404)
class NotFoundException extends AppException {
  NotFoundException({
    String message = 'Aranan kayıt bulunamadı',
  }) : super(message, '404');
}

/// Validation Exception
/// Thrown when input validation fails (400)
class ValidationException extends AppException {
  final Map<String, List<String>>? errors;

  ValidationException({
    String message = 'Geçersiz giriş',
    this.errors,
  }) : super(message, '400');
}

/// Server Exception
/// Thrown when server returns 500+ errors
class ServerException extends AppException {
  ServerException({
    String message = 'Sunucu hatası, lütfen daha sonra tekrar deneyin',
  }) : super(message, '500');
}

/// Unknown Exception
/// Thrown for unexpected errors
class UnknownException extends AppException {
  UnknownException({
    String message = 'Beklenmedik bir hata oluştu',
    String? code,
  }) : super(message, code ?? 'UNKNOWN_ERROR');
}

/// Timeout Exception
/// Thrown when request times out
class TimeoutException extends AppException {
  TimeoutException({
    String message = 'İstek zaman aşımına uğradı',
  }) : super(message, 'TIMEOUT');
}

/// Cache Exception
/// Thrown when local cache operations fail
class CacheException extends AppException {
  CacheException({
    String message = 'Yerel depolama hatası',
  }) : super(message, 'CACHE_ERROR');
}
