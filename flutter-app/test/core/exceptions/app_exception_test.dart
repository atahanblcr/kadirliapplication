import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';

void main() {
  group('AppException Tests', () {
    test('NetworkException has correct message and code', () {
      final ex = NetworkException();
      expect(ex.message, 'İnternet bağlantısı yok');
      expect(ex.code, 'NETWORK_ERROR');
      expect(ex.toString(), 'İnternet bağlantısı yok');
    });

    test('UnauthorizedException has correct message and code', () {
      final ex = UnauthorizedException();
      expect(ex.message, 'Oturum süresi doldu, lütfen giriş yapın');
      expect(ex.code, '401');
    });

    test('ForbiddenException has correct message and code', () {
      final ex = ForbiddenException();
      expect(ex.message, 'Yetkiniz yok');
      expect(ex.code, '403');
    });

    test('NotFoundException has correct message and code', () {
      final ex = NotFoundException();
      expect(ex.message, 'Aranan kayıt bulunamadı');
      expect(ex.code, '404');
    });

    test('ValidationException has correct message, code and errors', () {
      final errors = {'field': ['error']};
      final ex = ValidationException(errors: errors);
      expect(ex.message, 'Geçersiz giriş');
      expect(ex.code, '400');
      expect(ex.errors, errors);
    });

    test('ServerException has correct message and code', () {
      final ex = ServerException();
      expect(ex.message, 'Sunucu hatası, lütfen daha sonra tekrar deneyin');
      expect(ex.code, '500');
    });

    test('UnknownException has correct message and code', () {
      final ex = UnknownException();
      expect(ex.message, 'Beklenmedik bir hata oluştu');
      expect(ex.code, 'UNKNOWN_ERROR');
    });

    test('TimeoutException has correct message and code', () {
      final ex = TimeoutException();
      expect(ex.message, 'İstek zaman aşımına uğradı');
      expect(ex.code, 'TIMEOUT');
    });

    test('CacheException has correct message and code', () {
      final ex = CacheException();
      expect(ex.message, 'Yerel depolama hatası');
      expect(ex.code, 'CACHE_ERROR');
    });
  });
}
