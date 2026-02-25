import 'package:dio/dio.dart';
import '../constants/api_constants.dart';

/// Dio HTTP Client
/// Configured with interceptors for auth, error handling, and logging

class DioClient {
  static final DioClient _instance = DioClient._internal();

  late Dio _dio;

  factory DioClient() {
    return _instance;
  }

  DioClient._internal() {
    _initializeDio();
  }

  void _initializeDio() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.devBaseUrl,
        connectTimeout: const Duration(milliseconds: ApiConstants.connectTimeoutMs),
        receiveTimeout: const Duration(milliseconds: ApiConstants.receiveTimeoutMs),
        sendTimeout: const Duration(milliseconds: ApiConstants.sendTimeoutMs),
        contentType: 'application/json',
        responseType: ResponseType.json,
      ),
    );

    // TODO: Add interceptors
    // _dio.interceptors.add(AuthInterceptor());
    // _dio.interceptors.add(ErrorInterceptor());
    // _dio.interceptors.add(LoggingInterceptor());
  }

  Dio get dio => _dio;

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.get<T>(
      path,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.post<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.put<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.patch<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> delete<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.delete<T>(
      path,
      queryParameters: queryParameters,
      options: options,
    );
  }
}
