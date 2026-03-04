import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/auth/data/models/auth_response.dart';
import 'package:kadirliapp/features/auth/data/models/user_model.dart';

void main() {
  group('Auth Response Models', () {
    test('OtpResponse.fromJson', () {
      final json = {'message': 'sent', 'expires_in': 300, 'retry_after': 60};
      final model = OtpResponse.fromJson(json);
      expect(model.message, 'sent');
      expect(model.expiresIn, 300);
    });

    test('VerifyOtpResponse.fromJson', () {
      final json = {
        'is_new_user': true,
        'temp_token': 'temp',
        'access_token': 'at',
        'refresh_token': 'rt',
        'user': {'id': '1', 'phone': '123'}
      };
      final model = VerifyOtpResponse.fromJson(json);
      expect(model.isNewUser, true);
      expect(model.user?.id, '1');
    });

    test('AuthResponse.fromJson', () {
      final json = {
        'access_token': 'at',
        'refresh_token': 'rt',
        'expires_in': 3600,
        'user': {'id': '1', 'phone': '123'}
      };
      final model = AuthResponse.fromJson(json);
      expect(model.accessToken, 'at');
      expect(model.user.id, '1');
    });

    test('RefreshResponse.fromJson', () {
      final json = {'access_token': 'new_at', 'expires_in': 3600};
      final model = RefreshResponse.fromJson(json);
      expect(model.accessToken, 'new_at');
      expect(model.expiresIn, 3600);
    });
  });
}
