import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/auth/presentation/providers/auth_provider.dart';
import 'package:kadirliapp/features/auth/data/repositories/auth_repository.dart';
import 'package:kadirliapp/core/storage/storage_service.dart';
import 'package:kadirliapp/features/auth/data/models/auth_response.dart';
import 'package:kadirliapp/features/auth/data/models/user_model.dart';

class MockAuthRepository extends Mock implements AuthRepository {}
class MockStorageService extends Mock implements StorageService {}

void main() {
  late AuthNotifier notifier;
  late MockAuthRepository mockRepository;
  late MockStorageService mockStorage;

  setUp(() {
    mockRepository = MockAuthRepository();
    mockStorage = MockStorageService();
    notifier = AuthNotifier(mockRepository, mockStorage);
  });

  group('AuthNotifier', () {
    test('initial state is correct', () {
      expect(notifier.state.status, AuthStatus.initial);
      expect(notifier.state.isLoading, false);
    });

    test('checkAuthStatus set authenticated if token exists', () async {
      when(() => mockStorage.getAccessToken()).thenReturn('token');
      await notifier.checkAuthStatus();
      expect(notifier.state.status, AuthStatus.authenticated);
    });

    test('checkAuthStatus set unauthenticated if no token', () async {
      when(() => mockStorage.getAccessToken()).thenReturn(null);
      await notifier.checkAuthStatus();
      expect(notifier.state.status, AuthStatus.unauthenticated);
    });

    test('requestOtp success', () async {
      when(() => mockRepository.requestOtp(any())).thenAnswer((_) async => OtpResponse(message: 'ok', expiresIn: 300, retryAfter: 60));
      
      final result = await notifier.requestOtp('05551112233');

      expect(result, true);
      expect(notifier.state.phone, '05551112233');
      expect(notifier.state.isLoading, false);
    });

    test('verifyOtp existing user success', () async {
      notifier.state = notifier.state.copyWith(phone: '05551112233');
      
      final user = UserModel(id: '1', phone: '05551112233');
      when(() => mockRepository.verifyOtp(any(), any())).thenAnswer((_) async => VerifyOtpResponse(
        isNewUser: false,
        accessToken: 'access',
        refreshToken: 'refresh',
        user: user,
      ));
      when(() => mockStorage.setAccessToken(any())).thenAnswer((_) async {});
      when(() => mockStorage.setRefreshToken(any())).thenAnswer((_) async {});

      final result = await notifier.verifyOtp('123456');

      expect(result, 'home');
      expect(notifier.state.status, AuthStatus.authenticated);
      expect(notifier.state.user, user);
    });

    test('verifyOtp new user success', () async {
      notifier.state = notifier.state.copyWith(phone: '05551112233');
      
      when(() => mockRepository.verifyOtp(any(), any())).thenAnswer((_) async => VerifyOtpResponse(
        isNewUser: true,
        tempToken: 'temp',
      ));

      final result = await notifier.verifyOtp('123456');

      expect(result, 'register');
      expect(notifier.state.isNewUser, true);
      expect(notifier.state.tempToken, 'temp');
    });

    test('verifyOtp failure sets error', () async {
      notifier.state = notifier.state.copyWith(phone: '05551112233');
      when(() => mockRepository.verifyOtp(any(), any())).thenThrow(ValidationException(message: 'error'));

      final result = await notifier.verifyOtp('123456');

      expect(result, isNull);
      expect(notifier.state.error, 'error');
    });

    test('logout handles error silently', () async {
      when(() => mockRepository.logout()).thenThrow(Exception());
      when(() => mockStorage.clearTokens()).thenAnswer((_) async {});

      await notifier.logout();

      expect(notifier.state.status, AuthStatus.unauthenticated);
    });

    test('generic catch in requestOtp', () async {
      when(() => mockRepository.requestOtp(any())).thenThrow(Exception('unknown'));
      
      final result = await notifier.requestOtp('0555');

      expect(result, false);
      expect(notifier.state.error, contains('Beklenmedik'));
    });

    group('Registration', () {
      test('register success', () async {
        notifier.state = notifier.state.copyWith(tempToken: 'temp');
        final user = UserModel(id: '1', phone: '0555');
        when(() => mockRepository.register(
          tempToken: any(named: 'tempToken'),
          username: any(named: 'username'),
          age: any(named: 'age'),
          locationType: any(named: 'locationType'),
          primaryNeighborhoodId: any(named: 'primaryNeighborhoodId'),
          acceptTerms: any(named: 'acceptTerms'),
        )).thenAnswer((_) async => AuthResponse(
          accessToken: 'at',
          refreshToken: 'rt',
          expiresIn: 3600,
          user: user,
        ));
        when(() => mockStorage.setAccessToken(any())).thenAnswer((_) async {});
        when(() => mockStorage.setRefreshToken(any())).thenAnswer((_) async {});

        final result = await notifier.register(
          username: 'u',
          age: 20,
          locationType: 'c',
          primaryNeighborhoodId: 'n',
        );

        expect(result, true);
        expect(notifier.state.status, AuthStatus.authenticated);
      });

      test('register failure sets error', () async {
        notifier.state = notifier.state.copyWith(tempToken: 'temp');
        when(() => mockRepository.register(
          tempToken: any(named: 'tempToken'),
          username: any(named: 'username'),
          age: any(named: 'age'),
          locationType: any(named: 'locationType'),
          primaryNeighborhoodId: any(named: 'primaryNeighborhoodId'),
          acceptTerms: any(named: 'acceptTerms'),
        )).thenThrow(ValidationException(message: 'register error'));

        final result = await notifier.register(
          username: 'u',
          age: 20,
          locationType: 'c',
          primaryNeighborhoodId: 'n',
        );

        expect(result, false);
        expect(notifier.state.error, 'register error');
      });

      test('register fails if tempToken is null', () async {
        notifier.state = const AuthState(tempToken: null);
        final result = await notifier.register(username: 'u', age: 20, locationType: 'c', primaryNeighborhoodId: 'n');
        expect(result, false);
        expect(notifier.state.error, contains('Gecici token'));
      });
    });

    test('clearError resets error state', () {
      notifier.state = notifier.state.copyWith(error: 'some error');
      notifier.clearError();
      expect(notifier.state.error, isNull);
    });
  });
}
