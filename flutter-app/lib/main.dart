import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';
import 'core/network/dio_client.dart';
import 'core/storage/storage_service.dart';
import 'core/notifications/fcm_token_manager.dart';
import 'core/notifications/firebase_messaging_service.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize local storage
  await StorageService().init();

  // Setup Dio interceptors (auth token injection + refresh)
  DioClient().setupInterceptors(StorageService());

  // Initialize Firebase (Android & iOS only)
  if (Platform.isAndroid || Platform.isIOS) {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );

    // Request notification permissions
    await FirebaseMessaging.instance.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    // Initialize FCM Token Manager (get token + send to backend)
    await FcmTokenManager().initAndSendToken();

    // Listen for token refresh
    FcmTokenManager().listenForTokenRefresh();

    // Initialize Firebase Messaging Service (foreground + background handlers)
    await FirebaseMessagingService().init();
  }

  runApp(const ProviderScope(child: KadirliApp()));
}
