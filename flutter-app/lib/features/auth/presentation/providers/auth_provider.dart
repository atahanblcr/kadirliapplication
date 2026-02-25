import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/storage/storage_service.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../../data/models/user_model.dart';
import '../../data/repositories/auth_repository.dart';

// --- State ---

enum AuthStatus { initial, authenticated, unauthenticated }

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final bool isLoading;
  final String? error;

  // OTP flow state
  final String? phone;
  final String? tempToken;
  final bool isNewUser;

  const AuthState({
    this.status = AuthStatus.initial,
    this.user,
    this.isLoading = false,
    this.error,
    this.phone,
    this.tempToken,
    this.isNewUser = false,
  });

  AuthState copyWith({
    AuthStatus? status,
    UserModel? user,
    bool? isLoading,
    String? error,
    String? phone,
    String? tempToken,
    bool? isNewUser,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      phone: phone ?? this.phone,
      tempToken: tempToken ?? this.tempToken,
      isNewUser: isNewUser ?? this.isNewUser,
    );
  }
}

// --- Notifier ---

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;
  final StorageService _storage;

  AuthNotifier(this._repository, this._storage) : super(const AuthState());

  /// Check if user is already logged in (called at app start)
  Future<void> checkAuthStatus() async {
    final token = _storage.getAccessToken();
    if (token != null) {
      state = state.copyWith(status: AuthStatus.authenticated);
    } else {
      state = state.copyWith(status: AuthStatus.unauthenticated);
    }
  }

  /// Step 1: Request OTP
  Future<bool> requestOtp(String phone) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.requestOtp(phone);
      state = state.copyWith(isLoading: false, phone: phone);
      return true;
    } on AppException catch (e) {
      state = state.copyWith(isLoading: false, error: e.message);
      return false;
    } catch (e) {
      state = state.copyWith(
          isLoading: false, error: 'Beklenmedik bir hata olustu');
      return false;
    }
  }

  /// Step 2: Verify OTP
  /// Returns: 'home' if existing user, 'register' if new user
  Future<String?> verifyOtp(String otp) async {
    final phone = state.phone;
    if (phone == null) {
      state = state.copyWith(error: 'Telefon numarasi bulunamadi');
      return null;
    }

    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _repository.verifyOtp(phone, otp);

      if (response.isNewUser) {
        // New user — store temp token, go to register
        state = state.copyWith(
          isLoading: false,
          tempToken: response.tempToken,
          isNewUser: true,
        );
        return 'register';
      } else {
        // Existing user — save tokens, go to home
        await _saveAuthData(
          response.accessToken!,
          response.refreshToken!,
          response.user,
        );
        state = state.copyWith(
          isLoading: false,
          status: AuthStatus.authenticated,
          user: response.user,
          isNewUser: false,
        );
        return 'home';
      }
    } on AppException catch (e) {
      state = state.copyWith(isLoading: false, error: e.message);
      return null;
    } catch (e) {
      state = state.copyWith(
          isLoading: false, error: 'Beklenmedik bir hata olustu');
      return null;
    }
  }

  /// Step 3: Complete registration (new users only)
  Future<bool> register({
    required String username,
    required int age,
    required String locationType,
    required String primaryNeighborhoodId,
  }) async {
    final tempToken = state.tempToken;
    if (tempToken == null) {
      state = state.copyWith(error: 'Gecici token bulunamadi');
      return false;
    }

    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _repository.register(
        tempToken: tempToken,
        username: username,
        age: age,
        locationType: locationType,
        primaryNeighborhoodId: primaryNeighborhoodId,
        acceptTerms: true,
      );

      await _saveAuthData(
        response.accessToken,
        response.refreshToken,
        response.user,
      );

      state = state.copyWith(
        isLoading: false,
        status: AuthStatus.authenticated,
        user: response.user,
        tempToken: null,
      );
      return true;
    } on AppException catch (e) {
      state = state.copyWith(isLoading: false, error: e.message);
      return false;
    } catch (e) {
      state = state.copyWith(
          isLoading: false, error: 'Beklenmedik bir hata olustu');
      return false;
    }
  }

  /// Logout
  Future<void> logout() async {
    try {
      await _repository.logout();
    } catch (_) {
      // Ignore network errors during logout
    }
    await _storage.clearTokens();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  /// Clear error message
  void clearError() {
    state = state.copyWith(error: null);
  }

  Future<void> _saveAuthData(
    String accessToken,
    String refreshToken,
    UserModel? user,
  ) async {
    await _storage.setAccessToken(accessToken);
    await _storage.setRefreshToken(refreshToken);
    if (user != null) {
      debugPrint('Auth: User ${user.username} logged in');
    }
  }
}

// --- Providers ---

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository();
});

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository, StorageService());
});

final neighborhoodsProvider =
    FutureProvider.autoDispose<List<NeighborhoodModel>>((ref) async {
  final repository = ref.watch(authRepositoryProvider);
  return repository.getNeighborhoods();
});
