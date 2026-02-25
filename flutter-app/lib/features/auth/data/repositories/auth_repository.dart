import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../models/auth_response.dart';
import '../models/user_model.dart';

class AuthRepository {
  final DioClient _client;

  AuthRepository({DioClient? client}) : _client = client ?? DioClient();

  /// POST /auth/request-otp
  Future<OtpResponse> requestOtp(String phone) async {
    try {
      final response = await _client.post(
        ApiConstants.authRequestOtp,
        data: {'phone': phone},
      );
      final data = response.data['data'] as Map<String, dynamic>?
          ?? response.data as Map<String, dynamic>;
      return OtpResponse.fromJson(data);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// POST /auth/verify-otp
  Future<VerifyOtpResponse> verifyOtp(String phone, String otp) async {
    try {
      final response = await _client.post(
        ApiConstants.authVerifyOtp,
        data: {'phone': phone, 'otp': otp},
      );
      final data = response.data['data'] as Map<String, dynamic>?
          ?? response.data as Map<String, dynamic>;
      return VerifyOtpResponse.fromJson(data);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// POST /auth/register
  Future<AuthResponse> register({
    required String tempToken,
    required String username,
    required int age,
    required String locationType,
    required String primaryNeighborhoodId,
    required bool acceptTerms,
  }) async {
    try {
      final response = await _client.post(
        ApiConstants.authRegister,
        data: {
          'username': username,
          'age': age,
          'location_type': locationType,
          'primary_neighborhood_id': primaryNeighborhoodId,
          'accept_terms': acceptTerms,
        },
        options: Options(
          headers: {'Authorization': 'Bearer $tempToken'},
        ),
      );
      final data = response.data['data'] as Map<String, dynamic>?
          ?? response.data as Map<String, dynamic>;
      return AuthResponse.fromJson(data);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// POST /auth/refresh
  Future<RefreshResponse> refreshToken(String refreshToken) async {
    try {
      final response = await _client.post(
        ApiConstants.authRefresh,
        data: {'refresh_token': refreshToken},
      );
      final data = response.data['data'] as Map<String, dynamic>?
          ?? response.data as Map<String, dynamic>;
      return RefreshResponse.fromJson(data);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// POST /auth/logout
  Future<void> logout({String? fcmToken}) async {
    try {
      await _client.post(
        ApiConstants.authLogout,
        data: fcmToken != null ? {'fcm_token': fcmToken} : null,
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// GET /admin/neighborhoods (public list for registration)
  Future<List<NeighborhoodModel>> getNeighborhoods() async {
    try {
      final response = await _client.get(ApiConstants.neighborhoods);
      final responseData = response.data;

      List<dynamic> items;
      if (responseData['data'] is Map && responseData['data']['data'] != null) {
        items = responseData['data']['data'] as List<dynamic>;
      } else if (responseData['data'] is List) {
        items = responseData['data'] as List<dynamic>;
      } else {
        items = [];
      }

      return items
          .map((e) => NeighborhoodModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
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
    String message = 'Bir hata olustu';

    if (responseData is Map<String, dynamic>) {
      message = responseData['error']?['message'] as String?
          ?? responseData['message'] as String?
          ?? message;
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
      case 409:
        return ValidationException(message: message);
      case 429:
        return ValidationException(
            message: 'Cok fazla istek gonderdiniz, lutfen bekleyin');
      default:
        if (statusCode != null && statusCode >= 500) {
          return ServerException(message: message);
        }
        return UnknownException(message: message);
    }
  }
}
