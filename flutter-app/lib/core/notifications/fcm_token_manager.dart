import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import '../network/dio_client.dart';
import '../storage/storage_service.dart';

/// FCM Token Manager
/// Handles FCM token generation and backend synchronization

class FcmTokenManager {
  static final FcmTokenManager _instance = FcmTokenManager._internal();

  factory FcmTokenManager() {
    return _instance;
  }

  FcmTokenManager._internal();

  /// Initialize FCM and send token to backend
  Future<void> initAndSendToken() async {
    try {
      // Get FCM token
      final token = await FirebaseMessaging.instance.getToken();

      if (token != null) {
        debugPrint('FCM Token obtained: $token');

        // Save to local storage
        await _saveTokenLocally(token);

        // Send to backend
        await _sendTokenToBackend(token);
      } else {
        debugPrint('FCM Token is null');
      }
    } catch (e) {
      debugPrint('Error getting FCM token: $e');
    }
  }

  /// Save token to local storage
  Future<void> _saveTokenLocally(String token) async {
    try {
      await StorageService().setString('fcm_token', token);
      debugPrint('FCM Token saved locally');
    } catch (e) {
      debugPrint('Error saving FCM token locally: $e');
    }
  }

  /// Send token to backend API
  Future<void> _sendTokenToBackend(String token) async {
    try {
      final dio = DioClient().dio;

      final response = await dio.post(
        '/notifications/token',
        data: {
          'token': token,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('FCM Token sent to backend successfully');
      } else {
        debugPrint('Failed to send FCM Token to backend: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error sending FCM Token to backend: $e');
      // Don't throw error here - FCM token is not critical for app startup
    }
  }

  /// Get saved token from local storage
  Future<String?> getLocalToken() async {
    try {
      return StorageService().getString('fcm_token');
    } catch (e) {
      debugPrint('Error getting local FCM token: $e');
      return null;
    }
  }

  /// Refresh token and send to backend
  Future<void> refreshToken() async {
    try {
      final newToken = await FirebaseMessaging.instance.getToken();
      if (newToken != null) {
        final oldToken = await getLocalToken();

        // Only send if token changed
        if (newToken != oldToken) {
          await _saveTokenLocally(newToken);
          await _sendTokenToBackend(newToken);
          debugPrint('FCM Token refreshed and sent to backend');
        }
      }
    } catch (e) {
      debugPrint('Error refreshing FCM token: $e');
    }
  }

  /// Listen for token refresh
  void listenForTokenRefresh() {
    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
      debugPrint('FCM Token refreshed: $newToken');
      _saveTokenLocally(newToken);
      _sendTokenToBackend(newToken);
    });
  }
}
