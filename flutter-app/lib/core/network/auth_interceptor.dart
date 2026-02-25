import 'package:dio/dio.dart';
import '../storage/storage_service.dart';
import '../constants/api_constants.dart';

class AuthInterceptor extends Interceptor {
  final StorageService _storage;

  AuthInterceptor(this._storage);

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) {
    // Skip token injection if Authorization header is already set (e.g. temp_token)
    if (options.headers.containsKey('Authorization')) {
      handler.next(options);
      return;
    }

    final token = _storage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode != 401) {
      handler.next(err);
      return;
    }

    // Don't retry auth endpoints to avoid infinite loops
    final path = err.requestOptions.path;
    if (path.contains('/auth/refresh') ||
        path.contains('/auth/request-otp') ||
        path.contains('/auth/verify-otp')) {
      handler.next(err);
      return;
    }

    final refreshToken = _storage.getRefreshToken();
    if (refreshToken == null) {
      await _storage.clearTokens();
      handler.next(err);
      return;
    }

    try {
      // Attempt token refresh
      final dio = Dio(BaseOptions(
        baseUrl: ApiConstants.devBaseUrl,
        connectTimeout:
            const Duration(milliseconds: ApiConstants.connectTimeoutMs),
        receiveTimeout:
            const Duration(milliseconds: ApiConstants.receiveTimeoutMs),
      ));

      final response = await dio.post(
        ApiConstants.authRefresh,
        data: {'refresh_token': refreshToken},
      );

      final data = response.data['data'] as Map<String, dynamic>?
          ?? response.data as Map<String, dynamic>;
      final newAccessToken = data['access_token'] as String;
      await _storage.setAccessToken(newAccessToken);

      // Retry the original request with the new token
      final opts = err.requestOptions;
      opts.headers['Authorization'] = 'Bearer $newAccessToken';

      final retryResponse = await dio.request(
        opts.path,
        options: Options(
          method: opts.method,
          headers: opts.headers,
        ),
        data: opts.data,
        queryParameters: opts.queryParameters,
      );

      handler.resolve(retryResponse);
    } catch (_) {
      // Refresh failed — clear tokens, let the error propagate
      await _storage.clearTokens();
      handler.next(err);
    }
  }
}
