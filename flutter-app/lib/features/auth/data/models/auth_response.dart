import 'user_model.dart';

/// Response from POST /auth/request-otp
class OtpResponse {
  final String message;
  final int expiresIn;
  final int retryAfter;

  OtpResponse({
    required this.message,
    required this.expiresIn,
    required this.retryAfter,
  });

  factory OtpResponse.fromJson(Map<String, dynamic> json) {
    return OtpResponse(
      message: json['message'] as String? ?? 'OTP gönderildi',
      expiresIn: json['expires_in'] as int? ?? 300,
      retryAfter: json['retry_after'] as int? ?? 60,
    );
  }
}

/// Response from POST /auth/verify-otp
class VerifyOtpResponse {
  final bool isNewUser;
  final String? tempToken;
  final String? accessToken;
  final String? refreshToken;
  final int? expiresIn;
  final UserModel? user;

  VerifyOtpResponse({
    required this.isNewUser,
    this.tempToken,
    this.accessToken,
    this.refreshToken,
    this.expiresIn,
    this.user,
  });

  factory VerifyOtpResponse.fromJson(Map<String, dynamic> json) {
    return VerifyOtpResponse(
      isNewUser: json['is_new_user'] as bool? ?? true,
      tempToken: json['temp_token'] as String?,
      accessToken: json['access_token'] as String?,
      refreshToken: json['refresh_token'] as String?,
      expiresIn: json['expires_in'] as int?,
      user: json['user'] != null
          ? UserModel.fromJson(json['user'] as Map<String, dynamic>)
          : null,
    );
  }
}

/// Response from POST /auth/register
class AuthResponse {
  final String accessToken;
  final String refreshToken;
  final int expiresIn;
  final UserModel user;

  AuthResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['access_token'] as String,
      refreshToken: json['refresh_token'] as String,
      expiresIn: json['expires_in'] as int? ?? 2592000,
      user: UserModel.fromJson(json['user'] as Map<String, dynamic>),
    );
  }
}

/// Response from POST /auth/refresh
class RefreshResponse {
  final String accessToken;
  final int expiresIn;

  RefreshResponse({
    required this.accessToken,
    required this.expiresIn,
  });

  factory RefreshResponse.fromJson(Map<String, dynamic> json) {
    return RefreshResponse(
      accessToken: json['access_token'] as String,
      expiresIn: json['expires_in'] as int? ?? 2592000,
    );
  }
}
