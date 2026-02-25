import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

/// Firebase Cloud Messaging Service
/// Handles foreground, background, and terminated message handling

class FirebaseMessagingService {
  static final FirebaseMessagingService _instance = FirebaseMessagingService._internal();

  factory FirebaseMessagingService() {
    return _instance;
  }

  FirebaseMessagingService._internal();

  /// Initialize FCM handlers
  Future<void> init() async {
    // Handle foreground messages
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Handle background message tap
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpenedApp);

    // Handle background message (when app is in background)
    // This must be a top-level function
    // FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  }

  /// Handle foreground messages
  void _handleForegroundMessage(RemoteMessage message) {
    debugPrint('=== FOREGROUND MESSAGE ===');
    debugPrint('Title: ${message.notification?.title}');
    debugPrint('Body: ${message.notification?.body}');
    debugPrint('Data: ${message.data}');

    // TODO: Show local notification
    // TODO: Navigate to relevant screen
  }

  /// Handle message when app is opened from notification tap
  void _handleMessageOpenedApp(RemoteMessage message) {
    debugPrint('=== MESSAGE OPENED APP ===');
    debugPrint('Title: ${message.notification?.title}');
    debugPrint('Data: ${message.data}');

    // TODO: Navigate to relevant screen based on message.data
    // Example:
    // if (message.data['type'] == 'announcement') {
    //   navigateToAnnouncement(message.data['id']);
    // }
  }

  /// Get FCM token
  Future<String?> getToken() async {
    return await FirebaseMessaging.instance.getToken();
  }

  /// Subscribe to topic
  Future<void> subscribeToTopic(String topic) async {
    await FirebaseMessaging.instance.subscribeToTopic(topic);
    debugPrint('Subscribed to topic: $topic');
  }

  /// Unsubscribe from topic
  Future<void> unsubscribeFromTopic(String topic) async {
    await FirebaseMessaging.instance.unsubscribeFromTopic(topic);
    debugPrint('Unsubscribed from topic: $topic');
  }
}

/// Top-level function to handle background messages
/// This must be outside the class and top-level
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  debugPrint('=== BACKGROUND MESSAGE ===');
  debugPrint('Title: ${message.notification?.title}');
  debugPrint('Body: ${message.notification?.body}');
  debugPrint('Data: ${message.data}');

  // TODO: Handle background message
  // This function is called even when app is terminated
}
