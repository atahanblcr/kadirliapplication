import 'package:flutter/foundation.dart';

/// Fired by [AuthInterceptor] when a token refresh attempt fails (or no
/// refresh token exists), so the widget tree can react and send the user
/// back to login. The interceptor is a plain Dio [Interceptor] with no
/// access to Riverpod or navigation, so it only notifies; `_AuthGate`
/// listens and drives the actual state change.
class SessionExpiryNotifier extends ChangeNotifier {
  SessionExpiryNotifier._();
  static final SessionExpiryNotifier instance = SessionExpiryNotifier._();

  void notifySessionExpired() => notifyListeners();
}
