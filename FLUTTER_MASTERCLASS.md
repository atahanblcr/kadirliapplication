# 🎓 KadirliApp Flutter Masterclass - The Complete Developer Guide

**Version:** 2.0
**Date:** 2 March 2026
**Status:** 30% Complete (Auth ✅ + Home ✅ + Announcements ✅) → 70% Remaining
**Target Completion:** 8 weeks at current pace

> This document is THE BIBLE for all Flutter development on KadirliApp. Every module must follow these patterns exactly. This is for **Gemini CLI continuation** after Haiku runs out of tokens.

---

## 🎯 Table of Contents

1. [Project Architecture & Setup](#project-architecture--setup)
2. [Riverpod State Management Patterns](#riverpod-state-management-patterns)
3. [Network Integration & API Calls](#network-integration--api-calls)
4. [Module Development Pipeline](#module-development-pipeline)
5. [All 13 Remaining Modules - Step-by-Step](#all-13-remaining-modules---step-by-step)
   - [Module 4: Ads](#module-4-ads-list--detail--favorites)
   - [Module 5: Taxi](#module-5-taxi)
   - [Module 6: Deaths](#module-6-deaths)
   - [Module 7: Pharmacy](#module-7-pharmacy)
   - [Module 8: Events](#module-8-events)
   - [Module 9: Campaigns](#module-9-campaigns)
   - [Module 10: Guide](#module-10-guide)
   - [Module 11: Places](#module-11-places)
   - [Module 12: Transport](#module-12-transport-intercity--intracity)
   - [Module 13: Profile/Users](#module-13-profile--users)
   - [Module 14: Complaints](#module-14-complaints)
   - [Module 15: Notifications](#module-15-notifications)
   - [Module 16: Jobs](#module-16-jobs)
6. [UI/UX Design Patterns](#uiux-design-patterns)
7. [Error Handling & Validation](#error-handling--validation)
8. [Testing Strategy](#testing-strategy)
9. [Performance Optimization](#performance-optimization)
10. [Deployment & Release](#deployment--release)

---

## 📋 PROJECT ARCHITECTURE & SETUP

### Folder Structure (Complete)

```
lib/
├── main.dart                              # Entry point
├── app.dart                               # Root widget + routing
├── core/
│   ├── constants/
│   │   ├── api_constants.dart            # Base URL, endpoints
│   │   ├── app_constants.dart            # App-wide settings
│   │   ├── colors.dart                   # Material Design 3 palette
│   │   └── spacing.dart                  # Padding/margin constants (4,8,12,16,24,32)
│   ├── network/
│   │   ├── dio_client.dart               # Dio setup + interceptors
│   │   ├── interceptors.dart             # JWT, error handling, retries
│   │   └── api_response.dart             # Response wrapper types
│   ├── storage/
│   │   ├── shared_preferences.dart       # Token & user data storage
│   │   └── secure_storage.dart           # (Optional) Encrypted token storage
│   ├── exceptions/
│   │   ├── app_exception.dart            # Base exception class
│   │   ├── network_exception.dart        # Network errors (timeout, 404, etc)
│   │   ├── parse_exception.dart          # JSON parsing errors
│   │   └── validation_exception.dart     # Form validation errors
│   └── validators/
│       ├── phone_validator.dart          # Phone format (05XX...)
│       ├── otp_validator.dart            # OTP format (6 digits)
│       ├── password_validator.dart       # Password strength
│       └── url_validator.dart            # URL validation
├── features/
│   ├── auth/                             # ✅ COMPLETE
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   └── auth_remote_datasource.dart
│   │   │   ├── models/
│   │   │   │   ├── auth_request_model.dart
│   │   │   │   ├── auth_response_model.dart
│   │   │   │   └── user_model.dart
│   │   │   └── repositories/
│   │   │       └── auth_repository.dart
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── login_page.dart
│   │       │   ├── otp_page.dart
│   │       │   └── register_page.dart
│   │       ├── widgets/
│   │       │   ├── phone_input.dart
│   │       │   ├── otp_input.dart
│   │       │   └── password_input.dart
│   │       └── providers/
│   │           └── auth_provider.dart
│   ├── home/                             # ✅ COMPLETE
│   │   └── presentation/
│   │       ├── pages/
│   │       │   └── home_page.dart
│   │       ├── widgets/
│   │       │   ├── module_grid.dart
│   │       │   ├── greeting_header.dart
│   │       │   └── user_menu.dart
│   │       └── providers/
│   │           └── home_provider.dart
│   ├── announcements/                   # ✅ COMPLETE
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   └── announcement_remote_datasource.dart
│   │   │   ├── models/
│   │   │   │   └── announcement_model.dart
│   │   │   └── repositories/
│   │   │       └── announcement_repository.dart
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── announcements_list_page.dart
│   │       │   └── announcement_detail_page.dart
│   │       ├── widgets/
│   │       │   ├── announcement_card.dart
│   │       │   ├── priority_badge.dart
│   │       │   └── shimmer_skeleton.dart
│   │       └── providers/
│   │           ├── announcements_provider.dart
│   │           └── announcement_detail_provider.dart
│   ├── ads/                              # 🔄 NEXT (0%)
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   └── ads_remote_datasource.dart
│   │   │   ├── models/
│   │   │   │   ├── ad_model.dart
│   │   │   │   ├── category_model.dart
│   │   │   │   └── favorite_model.dart
│   │   │   └── repositories/
│   │   │       ├── ads_repository.dart
│   │   │       └── favorites_repository.dart
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── ads_list_page.dart
│   │       │   └── ad_detail_page.dart
│   │       ├── widgets/
│   │       │   ├── ad_card.dart
│   │       │   ├── image_carousel.dart
│   │       │   ├── price_tag.dart
│   │       │   └── contact_actions.dart
│   │       └── providers/
│   │           ├── ads_provider.dart
│   │           ├── ad_detail_provider.dart
│   │           └── favorites_provider.dart
│   ├── taxi/                             # 🔄 (0%)
│   ├── deaths/                           # 🔄 (0%)
│   ├── pharmacy/                         # 🔄 (0%)
│   ├── events/                           # 🔄 (0%)
│   ├── campaigns/                        # 🔄 (0%)
│   ├── guide/                            # 🔄 (0%)
│   ├── places/                           # 🔄 (0%)
│   ├── transport/                        # 🔄 (0%)
│   ├── profile/                          # 🔄 (0%)
│   ├── complaints/                       # 🔄 (0%)
│   ├── notifications/                    # 🔄 (0%)
│   └── jobs/                             # 🔄 (0%)
└── generated/                             # auto-generated (build_runner)
    └── l10n/                             # i18n files

test/
├── features/                             # Feature tests
│   ├── auth/
│   ├── ads/
│   └── [...]
└── core/                                 # Core utility tests
```

### Critical Configuration Files

**pubspec.yaml** - All dependencies installed ✅
```yaml
sdk: '>=3.0.0 <4.0.0'
flutter: '>=3.0.0'

dependencies:
  flutter:
    sdk: flutter
  riverpod: ^2.0.0
  flutter_riverpod: ^2.0.0
  dio: ^5.3.1
  shared_preferences: ^2.2.0
  intl: ^0.19.0
  firebase_core: ^2.24.0
  firebase_messaging: ^14.6.0
  material_design_icons_flutter: ^7.0.0
  cached_network_image: ^3.3.0
  url_launcher: ^6.2.0
  shimmer: ^3.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0
  build_runner: ^2.4.0
  json_serializable: ^6.7.0
```

---

## 🧠 RIVERPOD STATE MANAGEMENT PATTERNS

### Pattern 1: Simple Read-Only Provider (Data Fetching)

**When to use:** Display-only data, caching
**Example:** Get list of announcements (read-only, no mutations)

```dart
// lib/features/announcements/presentation/providers/announcements_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/repositories/announcement_repository.dart';
import '../../../data/models/announcement_model.dart';

final announcementRepositoryProvider = Provider((ref) {
  return AnnouncementRepository();
});

/// Fetch announcements list with pagination
final announcementsProvider = FutureProvider.family<
    Map<String, dynamic>,  // Returns {announcements: [...], meta: {...}}
    int>((ref, page) async {
  final repository = ref.watch(announcementRepositoryProvider);
  return repository.getAnnouncements(page: page);
});

/// Auto-dispose version (clears when unused for 60 seconds)
final announcementsAutoProvider = FutureProvider.family.autoDispose<
    Map<String, dynamic>,
    int>((ref, page) async {
  final repository = ref.watch(announcementRepositoryProvider);
  return repository.getAnnouncements(page: page);
});
```

**Usage in Widget:**

```dart
class AnnouncementsListPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch provider - rebuilds on state change
    final announcementsAsync = ref.watch(announcementsProvider(1));

    return announcementsAsync.when(
      data: (response) => ListView.builder(
        itemCount: response['announcements'].length,
        itemBuilder: (context, index) {
          final announcement = response['announcements'][index];
          return AnnouncementCard(announcement: announcement);
        },
      ),
      loading: () => ShimmerSkeleton(),
      error: (error, stack) => ErrorWidget(message: error.toString()),
    );
  }
}
```

### Pattern 2: State Notifier Provider (Stateful Logic)

**When to use:** User interaction with state changes (favorites, filters, counters)
**Example:** Toggle favorite ads, manage filter state

```dart
// lib/features/ads/presentation/providers/favorites_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/repositories/favorites_repository.dart';

class FavoritesNotifier extends StateNotifier<List<String>> {
  final FavoritesRepository _repository;

  FavoritesNotifier(this._repository) : super([]);

  /// Load user's favorite ad IDs on init
  Future<void> loadFavorites() async {
    state = await _repository.getFavorites();
  }

  /// Toggle ad in favorites
  Future<void> toggleFavorite(String adId) async {
    final isFavorite = state.contains(adId);

    if (isFavorite) {
      state = state.where((id) => id != adId).toList();
      await _repository.removeFavorite(adId);
    } else {
      if (state.length >= 30) {
        throw Exception('Maximum 30 favorites reached');
      }
      state = [...state, adId];
      await _repository.addFavorite(adId);
    }
  }

  /// Check if ad is favorited
  bool isFavorite(String adId) => state.contains(adId);
}

final favoritesRepositoryProvider = Provider((ref) {
  return FavoritesRepository();
});

final favoritesProvider = StateNotifierProvider<
    FavoritesNotifier,
    List<String>>((ref) {
  final repository = ref.watch(favoritesRepositoryProvider);
  return FavoritesNotifier(repository);
});
```

**Usage:**

```dart
class AdDetailPage extends ConsumerWidget {
  final String adId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favoriteList = ref.watch(favoritesProvider);
    final isFavorite = favoriteList.contains(adId);

    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          try {
            await ref.read(favoritesProvider.notifier)
                .toggleFavorite(adId);
          } catch (e) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error: $e')),
            );
          }
        },
        child: Icon(
          isFavorite ? Icons.favorite : Icons.favorite_border,
        ),
      ),
    );
  }
}
```

### Pattern 3: Cached Provider with Manual Refresh

**When to use:** Data that changes, but needs to be cached (user profile)
**Example:** User profile - cache for 5 min, refresh manually

```dart
// lib/features/profile/presentation/providers/profile_provider.dart

final userProfileProvider = FutureProvider.autoDispose<User>((ref) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getUserProfile();
});

/// Manually refresh profile
final userProfileRefreshProvider = FutureProvider<void>((ref) async {
  return ref.refresh(userProfileProvider.future);
});
```

**Usage with RefreshIndicator:**

```dart
class ProfilePage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProfileProvider);

    return RefreshIndicator(
      onRefresh: () => ref.refresh(userProfileProvider.future),
      child: userAsync.when(
        data: (user) => ProfileView(user: user),
        loading: () => Skeleton(),
        error: (e, st) => ErrorView(error: e),
      ),
    );
  }
}
```

### Pattern 4: Family Providers (Parameterized)

**When to use:** Fetch data based on parameters
**Example:** Get detail page for different IDs (ad detail, announcement detail)

```dart
// Correct way - FutureProvider.family
final adDetailProvider = FutureProvider.family.autoDispose<Ad, String>(
  (ref, adId) async {
    final repository = ref.watch(adsRepositoryProvider);
    return repository.getAdDetail(adId);
  },
);

// Wrong way ❌
// final adDetailProvider = FutureProvider.autoDispose<Ad>((ref) async { ... })
// ^ This doesn't accept parameters!
```

**Usage:**

```dart
class AdDetailPage extends ConsumerWidget {
  final String adId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Pass adId as parameter
    final adAsync = ref.watch(adDetailProvider(adId));

    return adAsync.when(
      data: (ad) => AdDetailView(ad: ad),
      loading: () => Skeleton(),
      error: (e, st) => ErrorView(),
    );
  }
}
```

### Pattern 5: AsyncValue Handling (AsyncValue<T>)

**When to use:** Complex loading/error states
**All Riverpod Future/Stream providers return AsyncValue**

```dart
// The AsyncValue enum:
// - AsyncValue.data(T value)
// - AsyncValue.loading()
// - AsyncValue.error(Object error, StackTrace stackTrace)

class ListPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dataAsync = ref.watch(someListProvider);

    // Method 1: .when() - Most common
    return dataAsync.when(
      data: (items) => ListView(...),
      loading: () => LoadingWidget(),
      error: (error, stack) => ErrorWidget(error: error),
    );

    // Method 2: .whenData() - Only handle data
    return dataAsync.whenData((items) => ListView(...))
        ?? LoadingWidget();

    // Method 3: Direct state checks
    if (dataAsync.isLoading) {
      return LoadingWidget();
    } else if (dataAsync.hasError) {
      return ErrorWidget();
    } else {
      final items = dataAsync.value ?? [];
      return ListView(...);
    }
  }
}
```

### ⚠️ Common Mistakes & Solutions

```dart
// ❌ WRONG: Watching mutable state in build
Widget build(BuildContext context, WidgetRef ref) {
  final data = ref.watch(provider); // Don't create new objects here!
  return Text(data.toString());
}

// ✅ CORRECT: Memoize expensive operations
final memoizedDataProvider = Provider((ref) {
  final data = ref.watch(someProvider);
  return expensiveComputation(data);
});

// ❌ WRONG: StateNotifier mutation
state = state..add(newItem); // Wrong!

// ✅ CORRECT: Create new list
state = [...state, newItem];

// ❌ WRONG: Calling async in build()
Widget build(BuildContext context, WidgetRef ref) {
  repository.fetchData(); // DON'T DO THIS!
  return Container();
}

// ✅ CORRECT: Use FutureProvider
final dataProvider = FutureProvider((ref) async {
  final repo = ref.watch(repositoryProvider);
  return repo.fetchData();
});
```

---

## 🌐 NETWORK INTEGRATION & API CALLS

### Dio Client Setup

**lib/core/network/dio_client.dart:**

```dart
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class DioClient {
  static final DioClient _instance = DioClient._internal();

  late Dio dio;

  factory DioClient() {
    return _instance;
  }

  DioClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: _getBaseUrl(),
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add interceptors
    dio.interceptors.add(
      LoggingInterceptor(),
    );
    dio.interceptors.add(
      TokenInterceptor(),
    );
    dio.interceptors.add(
      ErrorInterceptor(),
    );
  }

  static String _getBaseUrl() {
    const String devUrl = 'http://localhost:3000/v1';

    // Platform detection
    if (kIsWeb) {
      return devUrl;
    } else if (defaultTargetPlatform == TargetPlatform.android) {
      // Android emulator special IP
      return 'http://10.0.2.2:3000/v1';
    } else if (defaultTargetPlatform == TargetPlatform.iOS) {
      // iOS simulator uses localhost
      return devUrl;
    }

    // Real device
    return 'https://api.kadirliapp.com/v1';
  }
}
```

### JWT Token Interceptor

**lib/core/network/interceptors/token_interceptor.dart:**

```dart
import 'package:dio/dio.dart';
import '../../storage/shared_preferences.dart';

class TokenInterceptor extends QueuedInterceptor {
  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Add JWT token to every request
    final token = await StorageService.getAccessToken();

    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    // Handle 401 - Token expired
    if (err.response?.statusCode == 401) {
      try {
        // Try to refresh token
        final refreshToken = await StorageService.getRefreshToken();
        if (refreshToken != null) {
          // Call refresh endpoint
          final dio = Dio(BaseOptions(
            baseUrl: 'http://localhost:3000/v1',
          ));

          final response = await dio.post(
            '/auth/refresh',
            data: {'refresh_token': refreshToken},
          );

          final newAccessToken = response.data['data']['access_token'];
          await StorageService.setAccessToken(newAccessToken);

          // Retry original request with new token
          final options = err.requestOptions;
          options.headers['Authorization'] = 'Bearer $newAccessToken';
          return handler.resolve(await dio.request(
            options.path,
            options: options,
          ));
        }
      } catch (e) {
        // Refresh failed - logout
        await StorageService.clearTokens();
        // Navigate to login (use ref.read in repositories)
      }
    }

    return handler.next(err);
  }
}
```

### Error Handling Interceptor

**lib/core/network/interceptors/error_interceptor.dart:**

```dart
import 'package:dio/dio.dart';
import '../../exceptions/app_exception.dart';
import '../../exceptions/network_exception.dart';

class ErrorInterceptor extends QueuedInterceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final appException = _parseException(err);
    return handler.next(
      DioException(
        requestOptions: err.requestOptions,
        error: appException,
        type: err.type,
        response: err.response,
      ),
    );
  }

  AppException _parseException(DioException err) {
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkException(
          'Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.',
          err,
        );

      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode ?? 0;
        final data = err.response?.data;

        if (statusCode == 400) {
          return NetworkException(
            data?['error']?['message'] ?? 'Geçersiz istek',
            err,
          );
        } else if (statusCode == 401) {
          return NetworkException(
            'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.',
            err,
          );
        } else if (statusCode == 403) {
          return NetworkException(
            'Bu işlem için yetkiniz yok.',
            err,
          );
        } else if (statusCode == 404) {
          return NetworkException(
            'Aradığınız içerik bulunamadı.',
            err,
          );
        } else if (statusCode == 429) {
          return NetworkException(
            'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.',
            err,
          );
        } else if (statusCode >= 500) {
          return NetworkException(
            'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
            err,
          );
        }
        break;

      case DioExceptionType.unknown:
        return NetworkException(
          'Bilinmeyen bir hata oluştu: ${err.error}',
          err,
        );

      default:
        return NetworkException(
          err.message ?? 'Bir hata oluştu',
          err,
        );
    }

    return NetworkException(
      'Beklenmeyen bir hata oluştu',
      err,
    );
  }
}
```

### Repository Pattern - Example (Ads)

**lib/features/ads/data/repositories/ads_repository.dart:**

```dart
import 'package:dio/dio.dart';
import '../../../core/exceptions/parse_exception.dart';
import '../datasources/ads_remote_datasource.dart';
import '../models/ad_model.dart';

class AdsRepository {
  final AdsRemoteDatasource _datasource;

  AdsRepository({AdsRemoteDatasource? datasource})
      : _datasource = datasource ?? AdsRemoteDatasource();

  /// Get ads list with filters and pagination
  /// Returns: {ads: [...], meta: {page, total, total_pages, has_next}}
  Future<Map<String, dynamic>> getAds({
    int page = 1,
    int limit = 20,
    String? categoryId,
    int? minPrice,
    int? maxPrice,
    String? search,
    String? sort,
  }) async {
    try {
      final response = await _datasource.getAds(
        page: page,
        limit: limit,
        categoryId: categoryId,
        minPrice: minPrice,
        maxPrice: maxPrice,
        search: search,
        sort: sort,
      );

      // Parse response: data -> ads array + meta
      final data = response['data'] as Map<String, dynamic>;
      final ads = List<AdModel>.from(
        (data['ads'] as List).map((ad) => AdModel.fromJson(ad as Map<String, dynamic>)),
      );

      return {
        'ads': ads,
        'meta': data['meta'] as Map<String, dynamic>,
      };
    } on DioException catch (e) {
      rethrow; // Let interceptors handle
    } catch (e) {
      throw ParseException('Failed to parse ads: $e');
    }
  }

  /// Get ad detail by ID
  /// Increments view_count server-side
  Future<AdModel> getAdDetail(String adId) async {
    try {
      final response = await _datasource.getAdDetail(adId);
      final adJson = response['data']['ad'] as Map<String, dynamic>;
      return AdModel.fromJson(adJson);
    } catch (e) {
      throw ParseException('Failed to parse ad detail: $e');
    }
  }

  /// Get categories (hierarchical: parent -> children)
  Future<Map<String, dynamic>> getCategories() async {
    try {
      final response = await _datasource.getCategories();
      return response['data'] as Map<String, dynamic>;
    } catch (e) {
      throw ParseException('Failed to parse categories: $e');
    }
  }
}
```

### Data Source - Remote API Calls

**lib/features/ads/data/datasources/ads_remote_datasource.dart:**

```dart
import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class AdsRemoteDatasource {
  late final Dio dio;

  AdsRemoteDatasource() {
    dio = DioClient().dio;
  }

  Future<Map<String, dynamic>> getAds({
    required int page,
    required int limit,
    String? categoryId,
    int? minPrice,
    int? maxPrice,
    String? search,
    String? sort,
  }) async {
    final queryParameters = {
      'page': page,
      'limit': limit,
      if (categoryId != null) 'category_id': categoryId,
      if (minPrice != null) 'min_price': minPrice,
      if (maxPrice != null) 'max_price': maxPrice,
      if (search != null) 'search': search,
      if (sort != null) 'sort': sort,
    };

    final response = await dio.get<Map<String, dynamic>>(
      '/ads',
      queryParameters: queryParameters,
    );

    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getAdDetail(String adId) async {
    final response = await dio.get<Map<String, dynamic>>('/ads/$adId');
    return response.data ?? {};
  }

  Future<Map<String, dynamic>> getCategories() async {
    final response = await dio.get<Map<String, dynamic>>('/ads/categories');
    return response.data ?? {};
  }
}
```

### Response Model - Freezed (Optional but Recommended)

**lib/features/ads/data/models/ad_model.dart:**

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'ad_model.freezed.dart';
part 'ad_model.g.dart';

@freezed
class AdModel with _$AdModel {
  const factory AdModel({
    required String id,
    required String title,
    required String description,
    required int price,
    required CategoryModel category,
    required ImageModel? coverImage,
    required int imagesCount,
    required int viewCount,
    required DateTime createdAt,
    required DateTime expiresAt,
  }) = _AdModel;

  factory AdModel.fromJson(Map<String, dynamic> json) =>
      _$AdModelFromJson(json);
}

@freezed
class CategoryModel with _$CategoryModel {
  const factory CategoryModel({
    required String id,
    required String name,
    required CategoryModel? parent,
  }) = _CategoryModel;

  factory CategoryModel.fromJson(Map<String, dynamic> json) =>
      _$CategoryModelFromJson(json);
}

@freezed
class ImageModel with _$ImageModel {
  const factory ImageModel({
    required String id,
    required String url,
    required String thumbnailUrl,
  }) = _ImageModel;

  factory ImageModel.fromJson(Map<String, dynamic> json) =>
      _$ImageModelFromJson(json);
}
```

---

## 🔧 MODULE DEVELOPMENT PIPELINE

### Step-by-Step Template for ANY Module

**Every module follows this exact order:**

#### 1️⃣ Create Folder Structure

```bash
mkdir -p lib/features/{module_name}/data/datasources
mkdir -p lib/features/{module_name}/data/models
mkdir -p lib/features/{module_name}/data/repositories
mkdir -p lib/features/{module_name}/presentation/pages
mkdir -p lib/features/{module_name}/presentation/widgets
mkdir -p lib/features/{module_name}/presentation/providers
```

#### 2️⃣ Create Models (Data Layer)

```dart
// {module_name}_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part '{module_name}_model.freezed.dart';
part '{module_name}_model.g.dart';

@freezed
class {ModuleName}Model with _{$ModuleName}Model {
  const factory {ModuleName}Model({
    required String id,
    required String name,
    // ... all fields from API response
  }) = _{ModuleName}Model;

  factory {ModuleName}Model.fromJson(Map<String, dynamic> json) =>
      _{$ModuleName}ModelFromJson(json);
}
```

#### 3️⃣ Create Remote Data Source

```dart
// {module_name}_remote_datasource.dart
class {ModuleName}RemoteDatasource {
  late final Dio dio;

  {ModuleName}RemoteDatasource() {
    dio = DioClient().dio;
  }

  Future<Map<String, dynamic>> getItems({
    required int page,
    required int limit,
  }) async {
    final response = await dio.get<Map<String, dynamic>>(
      '/{endpoint}',
      queryParameters: {'page': page, 'limit': limit},
    );
    return response.data ?? {};
  }
}
```

#### 4️⃣ Create Repository

```dart
// {module_name}_repository.dart
class {ModuleName}Repository {
  final {ModuleName}RemoteDatasource _datasource;

  {ModuleName}Repository({
    {ModuleName}RemoteDatasource? datasource,
  }) : _datasource = datasource ?? {ModuleName}RemoteDatasource();

  Future<Map<String, dynamic>> getItems({
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final response = await _datasource.getItems(
        page: page,
        limit: limit,
      );
      return response;
    } catch (e) {
      rethrow;
    }
  }
}
```

#### 5️⃣ Create Providers (State Management)

```dart
// {module_name}_provider.dart
final {moduleNameLower}RepositoryProvider = Provider((ref) {
  return {ModuleName}Repository();
});

final {moduleNameLower}sProvider = FutureProvider.family.autoDispose<
    Map<String, dynamic>,
    int>((ref, page) async {
  final repository = ref.watch({moduleNameLower}RepositoryProvider);
  return repository.getItems(page: page);
});
```

#### 6️⃣ Create Pages (UI Layer)

```dart
// {module_name}_list_page.dart
class {ModuleName}ListPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemsAsync = ref.watch({moduleNameLower}sProvider(1));

    return Scaffold(
      appBar: AppBar(title: Text('{Module Name}')),
      body: itemsAsync.when(
        data: (response) => _buildList(response),
        loading: () => const LoadingWidget(),
        error: (error, stack) => ErrorWidget(error: error),
      ),
    );
  }

  Widget _buildList(Map<String, dynamic> response) {
    final items = response['{items_key}'] as List;
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) => {ModuleName}Card(item: items[index]),
    );
  }
}
```

#### 7️⃣ Create Widgets (Reusable Components)

```dart
// {module_name}_card.dart
class {ModuleName}Card extends StatelessWidget {
  final {ModuleName}Model item;

  const {ModuleName}Card({required this.item});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(12),
      child: ListTile(
        title: Text(item.name),
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => {ModuleName}DetailPage(id: item.id),
          ),
        ),
      ),
    );
  }
}
```

#### 8️⃣ Wire into Home Grid

**lib/features/home/presentation/widgets/module_grid.dart:**
```dart
const moduleConfigs = [
  ModuleConfig(
    title: 'Ilanlar',
    icon: Icons.shopping_bag,
    color: Colors.blue,
    page: AdsListPage(),
  ),
  ModuleConfig(
    title: 'Taksi',
    icon: Icons.local_taxi,
    color: Colors.yellow,
    page: TaxiPage(),
  ),
  // ... add new modules here
];
```

---

## 📱 ALL 13 REMAINING MODULES - STEP-BY-STEP

### MODULE 4: ADS (List + Detail + Favorites)

**Status:** 0% → 100%
**Time Estimate:** 4-5 hours
**Complexity:** Medium
**API Endpoints:** GET /ads, GET /ads/:id, GET /ads/categories
**Key Features:** Image carousel, price filtering, favorites (max 30), contact actions

#### 4.1 API Response Structure

```json
// GET /ads?page=1&limit=20
{
  "success": true,
  "data": {
    "ads": [
      {
        "id": "uuid",
        "title": "iPhone 13 Pro Max 256GB",
        "description": "Tertemiz, hiç çizmesi yok...",
        "price": 35000,
        "category": {
          "id": "uuid",
          "name": "Telefon",
          "parent": { "id": "uuid", "name": "Elektronik" }
        },
        "cover_image": {
          "id": "uuid",
          "url": "https://cdn.kadirliapp.com/...",
          "thumbnail_url": "https://cdn.kadirliapp.com/.../thumb.jpg"
        },
        "images_count": 5,
        "view_count": 234,
        "created_at": "2026-02-10T14:30:00Z",
        "expires_at": "2026-02-17T14:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": { "timestamp": "...", "path": "..." }
}

// GET /ads/:id
{
  "success": true,
  "data": {
    "ad": {
      "id": "uuid",
      "title": "iPhone 13 Pro Max 256GB",
      "description": "...",
      "price": 35000,
      "phone": "05551234567",
      "whatsapp_url": "https://wa.me/905551234567",
      "images": [
        { "id": "uuid", "url": "...", "thumbnail_url": "..." }
      ],
      "cover_image_id": "uuid",
      "created_at": "...",
      "expires_at": "..."
    }
  }
}
```

#### 4.2 File Structure

```
lib/features/ads/
├── data/
│   ├── datasources/
│   │   └── ads_remote_datasource.dart
│   ├── models/
│   │   ├── ad_model.dart
│   │   ├── category_model.dart
│   │   └── image_model.dart
│   └── repositories/
│       ├── ads_repository.dart
│       └── favorites_repository.dart
└── presentation/
    ├── pages/
    │   ├── ads_list_page.dart
    │   └── ad_detail_page.dart
    ├── widgets/
    │   ├── ad_card.dart
    │   ├── image_carousel.dart
    │   ├── price_tag.dart
    │   ├── category_filter.dart
    │   └── contact_actions.dart
    └── providers/
        ├── ads_provider.dart
        ├── ad_detail_provider.dart
        └── favorites_provider.dart
```

#### 4.3 Critical Business Rules

1. **Max Favorites:** 30 per user
2. **Filters:** Category ID, Min/Max Price, Search, Sort (by created_at, price, view_count)
3. **Contact:** Phone + WhatsApp button
4. **Images:** 1-5 max, carousel with thumbnail gallery

#### 4.4 Code Implementation

**models/ad_model.dart:**
```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'ad_model.freezed.dart';
part 'ad_model.g.dart';

@freezed
class AdModel with _$AdModel {
  const factory AdModel({
    required String id,
    required String title,
    required String description,
    required int price,
    required CategoryModel category,
    required ImageModel? coverImage,
    required int imagesCount,
    required int viewCount,
    required DateTime createdAt,
    required DateTime expiresAt,
  }) = _AdModel;

  factory AdModel.fromJson(Map<String, dynamic> json) =>
      _$AdModelFromJson(json);
}

@freezed
class AdDetailModel with _$AdDetailModel {
  const factory AdDetailModel({
    required String id,
    required String title,
    required String description,
    required int price,
    required String phone,
    required String whatsappUrl,
    required List<ImageModel> images,
    required String coverImageId,
    required DateTime createdAt,
    required DateTime expiresAt,
  }) = _AdDetailModel;

  factory AdDetailModel.fromJson(Map<String, dynamic> json) =>
      _$AdDetailModelFromJson(json);
}

@freezed
class CategoryModel with _$CategoryModel {
  const factory CategoryModel({
    required String id,
    required String name,
    required CategoryModel? parent,
  }) = _CategoryModel;

  factory CategoryModel.fromJson(Map<String, dynamic> json) =>
      _$CategoryModelFromJson(json);
}

@freezed
class ImageModel with _$ImageModel {
  const factory ImageModel({
    required String id,
    required String url,
    required String thumbnailUrl,
  }) = _ImageModel;

  factory ImageModel.fromJson(Map<String, dynamic> json) =>
      _$ImageModelFromJson(json);
}
```

**repositories/ads_repository.dart:**
```dart
import 'package:dio/dio.dart';
import '../datasources/ads_remote_datasource.dart';
import '../models/ad_model.dart';

class AdsRepository {
  final AdsRemoteDatasource _datasource;

  AdsRepository({AdsRemoteDatasource? datasource})
      : _datasource = datasource ?? AdsRemoteDatasource();

  Future<Map<String, dynamic>> getAds({
    int page = 1,
    int limit = 20,
    String? categoryId,
    int? minPrice,
    int? maxPrice,
    String? search,
    String? sort,
  }) async {
    try {
      final response = await _datasource.getAds(
        page: page,
        limit: limit,
        categoryId: categoryId,
        minPrice: minPrice,
        maxPrice: maxPrice,
        search: search,
        sort: sort,
      );

      final data = response['data'] as Map<String, dynamic>;
      final ads = List<AdModel>.from(
        (data['ads'] as List).map(
          (ad) => AdModel.fromJson(ad as Map<String, dynamic>),
        ),
      );

      return {
        'ads': ads,
        'meta': data['meta'] as Map<String, dynamic>,
      };
    } catch (e) {
      rethrow;
    }
  }

  Future<AdDetailModel> getAdDetail(String adId) async {
    try {
      final response = await _datasource.getAdDetail(adId);
      final adJson = response['data']['ad'] as Map<String, dynamic>;
      return AdDetailModel.fromJson(adJson);
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getCategories() async {
    try {
      final response = await _datasource.getCategories();
      return response['data'] as Map<String, dynamic>;
    } catch (e) {
      rethrow;
    }
  }
}
```

**repositories/favorites_repository.dart:**
```dart
import '../../storage/shared_preferences.dart';

class FavoritesRepository {
  /// Get all favorite ad IDs
  Future<List<String>> getFavorites() async {
    return await StorageService.getFavoriteIds();
  }

  /// Add ad to favorites
  Future<void> addFavorite(String adId) async {
    final current = await getFavorites();
    if (!current.contains(adId)) {
      await StorageService.setFavoriteIds([...current, adId]);
    }
  }

  /// Remove from favorites
  Future<void> removeFavorite(String adId) async {
    final current = await getFavorites();
    await StorageService.setFavoriteIds(
      current.where((id) => id != adId).toList(),
    );
  }

  /// Check if ad is favorited
  Future<bool> isFavorite(String adId) async {
    final favorites = await getFavorites();
    return favorites.contains(adId);
  }
}
```

**providers/ads_provider.dart:**
```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/repositories/ads_repository.dart';

final adsRepositoryProvider = Provider((ref) {
  return AdsRepository();
});

final adsProvider = FutureProvider.family.autoDispose<
    Map<String, dynamic>,
    int>((ref, page) async {
  final repository = ref.watch(adsRepositoryProvider);
  return repository.getAds(page: page);
});

final adCategoriesProvider = FutureProvider.autoDispose((ref) async {
  final repository = ref.watch(adsRepositoryProvider);
  return repository.getCategories();
});
```

**providers/favorites_provider.dart:**
```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/repositories/favorites_repository.dart';

class FavoritesNotifier extends StateNotifier<List<String>> {
  final FavoritesRepository _repository;

  FavoritesNotifier(this._repository) : super([]);

  Future<void> loadFavorites() async {
    state = await _repository.getFavorites();
  }

  Future<void> toggleFavorite(String adId) async {
    final isFavorited = state.contains(adId);

    if (isFavorited) {
      state = state.where((id) => id != adId).toList();
      await _repository.removeFavorite(adId);
    } else {
      if (state.length >= 30) {
        throw Exception('Maksimum 30 ilanı favoriye ekleyebilirsiniz');
      }
      state = [...state, adId];
      await _repository.addFavorite(adId);
    }
  }

  bool isFavorited(String adId) => state.contains(adId);
}

final favoritesRepositoryProvider = Provider((ref) {
  return FavoritesRepository();
});

final favoritesProvider = StateNotifierProvider<
    FavoritesNotifier,
    List<String>>((ref) {
  final repository = ref.watch(favoritesRepositoryProvider);
  return FavoritesNotifier(repository);
});
```

**pages/ads_list_page.dart:**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/ads_provider.dart';
import '../widgets/ad_card.dart';

class AdsListPage extends ConsumerStatefulWidget {
  const AdsListPage({Key? key}) : super(key: key);

  @override
  ConsumerState<AdsListPage> createState() => _AdsListPageState();
}

class _AdsListPageState extends ConsumerState<AdsListPage> {
  late ScrollController _scrollController;
  int _currentPage = 1;
  final List<dynamic> _allAds = [];

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 500) {
      // Load next page
      _currentPage++;
    }
  }

  @override
  Widget build(BuildContext context) {
    final adsAsync = ref.watch(adsProvider(_currentPage));

    return Scaffold(
      appBar: AppBar(title: const Text('İlanlar')),
      body: adsAsync.when(
        data: (response) {
          final ads = response['ads'] as List;
          final meta = response['meta'] as Map<String, dynamic>;

          _allAds.addAll(ads);

          return ListView.builder(
            controller: _scrollController,
            itemCount: _allAds.length + (meta['has_next'] ? 1 : 0),
            itemBuilder: (context, index) {
              if (index == _allAds.length) {
                return const Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(),
                );
              }
              return AdCard(ad: _allAds[index]);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Text('Hata: $error'),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}
```

**pages/ad_detail_page.dart:**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/ads_provider.dart';
import '../providers/ad_detail_provider.dart';
import '../providers/favorites_provider.dart';
import '../widgets/image_carousel.dart';
import '../widgets/contact_actions.dart';

class AdDetailPage extends ConsumerWidget {
  final String adId;

  const AdDetailPage({required this.adId, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final adAsync = ref.watch(adDetailProvider(adId));
    final favoriteList = ref.watch(favoritesProvider);
    final isFavorited = favoriteList.contains(adId);

    return Scaffold(
      appBar: AppBar(
        title: const Text('İlan Detayı'),
        actions: [
          IconButton(
            icon: Icon(
              isFavorited ? Icons.favorite : Icons.favorite_border,
              color: isFavorited ? Colors.red : null,
            ),
            onPressed: () async {
              try {
                await ref.read(favoritesProvider.notifier)
                    .toggleFavorite(adId);
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Hata: $e')),
                );
              }
            },
          ),
        ],
      ),
      body: adAsync.when(
        data: (ad) => SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image carousel
              ImageCarousel(images: ad.images),

              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title + Price
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            ad.title,
                            style: Theme.of(context).textTheme.headlineSmall,
                          ),
                        ),
                        Text(
                          '₺${ad.price}',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.green[700],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Description
                    Text(
                      'Açıklama',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(ad.description),
                    const SizedBox(height: 24),

                    // Contact actions
                    ContactActions(ad: ad),
                  ],
                ),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Hata: $error')),
      ),
    );
  }
}
```

**widgets/ad_card.dart:**
```dart
import 'package:flutter/material.dart';
import '../../data/models/ad_model.dart';

class AdCard extends StatelessWidget {
  final AdModel ad;

  const AdCard({required this.ad, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => AdDetailPage(adId: ad.id),
            ),
          );
        },
        child: Row(
          children: [
            // Thumbnail
            ClipRRect(
              borderRadius: const BorderRadius.horizontal(left: Radius.circular(8)),
              child: Image.network(
                ad.coverImage?.thumbnailUrl ?? '',
                width: 100,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
            // Info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      ad.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      ad.category.name,
                      style: TextStyle(color: Colors.grey[600], fontSize: 12),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '₺${ad.price}',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.green[700],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

**widgets/image_carousel.dart:**
```dart
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../data/models/ad_model.dart';

class ImageCarousel extends StatefulWidget {
  final List<ImageModel> images;

  const ImageCarousel({required this.images, Key? key}) : super(key: key);

  @override
  State<ImageCarousel> createState() => _ImageCarouselState();
}

class _ImageCarouselState extends State<ImageCarousel> {
  late PageController _pageController;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Main image
        SizedBox(
          height: 300,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() => _currentIndex = index);
            },
            itemCount: widget.images.length,
            itemBuilder: (context, index) {
              return CachedNetworkImage(
                imageUrl: widget.images[index].url,
                fit: BoxFit.cover,
                placeholder: (context, url) => const Center(
                  child: CircularProgressIndicator(),
                ),
                errorWidget: (context, url, error) => const Center(
                  child: Icon(Icons.error),
                ),
              );
            },
          ),
        ),
        // Thumbnail gallery
        SizedBox(
          height: 80,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: widget.images.length,
            itemBuilder: (context, index) {
              final isSelected = index == _currentIndex;
              return GestureDetector(
                onTap: () => _pageController.animateToPage(
                  index,
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                ),
                child: Container(
                  margin: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    border: isSelected
                        ? Border.all(color: Colors.blue, width: 2)
                        : null,
                  ),
                  child: CachedNetworkImage(
                    imageUrl: widget.images[index].thumbnailUrl,
                    width: 64,
                    fit: BoxFit.cover,
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
}
```

**widgets/contact_actions.dart:**
```dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../data/models/ad_model.dart';

class ContactActions extends StatelessWidget {
  final AdDetailModel ad;

  const ContactActions({required this.ad, Key? key}) : super(key: key);

  Future<void> _launchPhone() async {
    final phoneUrl = Uri.parse('tel:${ad.phone}');
    if (await canLaunchUrl(phoneUrl)) {
      await launchUrl(phoneUrl);
    }
  }

  Future<void> _launchWhatsApp() async {
    final whatsappUrl = Uri.parse(ad.whatsappUrl);
    if (await canLaunchUrl(whatsappUrl)) {
      await launchUrl(whatsappUrl, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            icon: const Icon(Icons.phone),
            label: const Text('Ara'),
            onPressed: _launchPhone,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: ElevatedButton.icon(
            icon: const Icon(Icons.chat),
            label: const Text('WhatsApp'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
            ),
            onPressed: _launchWhatsApp,
          ),
        ),
      ],
    );
  }
}
```

#### 4.5 Testing (Unit Tests)

**test/features/ads/repositories/ads_repository_test.dart:**
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:kadirliapp/features/ads/data/repositories/ads_repository.dart';
import 'package:kadirliapp/features/ads/data/datasources/ads_remote_datasource.dart';

void main() {
  late AdsRepository repository;
  late MockAdsRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockAdsRemoteDatasource();
    repository = AdsRepository(datasource: mockDatasource);
  });

  group('AdsRepository', () {
    test('getAds returns map with ads and meta', () async {
      // Arrange
      when(mockDatasource.getAds(
        page: 1,
        limit: 20,
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        search: null,
        sort: null,
      )).thenAnswer((_) async => {
            'data': {
              'ads': [
                {
                  'id': 'uuid',
                  'title': 'iPhone 13',
                  'price': 35000,
                  'category': {
                    'id': 'uuid',
                    'name': 'Telefon',
                    'parent': null,
                  },
                  'cover_image': null,
                  'images_count': 0,
                  'view_count': 0,
                  'created_at': '2026-01-01T00:00:00Z',
                  'expires_at': '2026-01-08T00:00:00Z',
                }
              ],
              'meta': {
                'page': 1,
                'limit': 20,
                'total': 1,
                'total_pages': 1,
              }
            }
          });

      // Act
      final result = await repository.getAds();

      // Assert
      expect(result['ads'], isNotEmpty);
      expect(result['meta']['total'], 1);
    });
  });
}
```

---

### MODULE 5: TAXI

**Status:** 0%
**Time Estimate:** 2-3 hours
**Complexity:** Low
**API Endpoint:** GET /taxi (list available taxis)
**Key Features:** Random ordering, real-time location, contact button

#### 5.1 API Response

```json
{
  "success": true,
  "data": {
    "taxis": [
      {
        "id": "uuid",
        "driver_name": "Ahmet Yılmaz",
        "phone": "05551234567",
        "car_info": "Toyota Corolla 2020, Beyaz",
        "rating": 4.8,
        "rides_completed": 234,
        "is_available": true,
        "created_at": "..."
      }
    ],
    "meta": { "page": 1, "total": 15 }
  }
}
```

#### 5.2 Implementation (Abbreviated - Full in code block below)

**Key Points:**
- `ORDER BY RANDOM()` ⚠️ (no order column exists!)
- Simple list display
- Contact button launches phone call
- RefreshIndicator for manual refresh

**lib/features/taxi/presentation/pages/taxi_page.dart:**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/taxi_provider.dart';

class TaxiPage extends ConsumerWidget {
  const TaxiPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final taxisAsync = ref.watch(taxisProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Taksi')),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(taxisProvider.future),
        child: taxisAsync.when(
          data: (response) {
            final taxis = response['taxis'] as List;
            return ListView.builder(
              itemCount: taxis.length,
              itemBuilder: (context, index) {
                final taxi = taxis[index];
                return TaxiCard(taxi: taxi);
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, st) => Center(child: Text('Hata: $e')),
        ),
      ),
    );
  }
}

class TaxiCard extends StatelessWidget {
  final Map<String, dynamic> taxi;

  const TaxiCard({required this.taxi, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Driver name + rating
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  taxi['driver_name'] ?? 'İsimsiz',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Chip(
                  label: Text('⭐ ${taxi['rating']}'),
                  backgroundColor: Colors.amber[100],
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Car info
            Text(
              taxi['car_info'] ?? '-',
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
            ),
            const SizedBox(height: 8),

            // Stats + Call button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${taxi['rides_completed']} yolculuk',
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                ),
                ElevatedButton.icon(
                  icon: const Icon(Icons.phone),
                  label: const Text('Ara'),
                  onPressed: () async {
                    final phoneUrl = Uri.parse('tel:${taxi['phone']}');
                    if (await canLaunchUrl(phoneUrl)) {
                      await launchUrl(phoneUrl);
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

---

### MODULE 6: DEATHS

**Status:** 0%
**Time Estimate:** 3 hours
**Complexity:** Low
**API Endpoint:** GET /deaths, GET /deaths/:id
**Key Features:** Funeral date filter, cemetery/mosque info, auto-archive info

#### 6.1 API Response

```json
{
  "success": true,
  "data": {
    "deaths": [
      {
        "id": "uuid",
        "deceased_name": "Ali Bey",
        "age": 75,
        "funeral_date": "2026-02-25T10:00:00Z",
        "cemetery": { "id": "uuid", "name": "Merkez Mezarlığı" },
        "mosque": { "id": "uuid", "name": "Camii" },
        "description": "İnşallah rahmeti bol...",
        "contact_phone": "05551234567",
        "auto_archive_at": "2026-03-04T10:00:00Z",
        "created_at": "..."
      }
    ],
    "meta": { "page": 1, "total": 5 }
  }
}
```

#### 6.2 Code Snippet

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/deaths_provider.dart';

class DeathsPage extends ConsumerWidget {
  const DeathsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final deathsAsync = ref.watch(deathsProvider(1));

    return Scaffold(
      appBar: AppBar(title: const Text('Vefat Duyuruları')),
      body: deathsAsync.when(
        data: (response) {
          final deaths = response['deaths'] as List;
          return ListView.builder(
            itemCount: deaths.length,
            itemBuilder: (context, index) {
              final death = deaths[index];
              final funeralDate = DateTime.parse(death['funeral_date']);
              final formatter = DateFormat('dd MMMM yyyy HH:mm', 'tr_TR');

              return Card(
                margin: const EdgeInsets.all(8),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        death['deceased_name'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Yaş: ${death['age']}',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 8),
                      Text('Cenaze: ${formatter.format(funeralDate)}'),
                      const SizedBox(height: 4),
                      Text('Mezarlık: ${death['cemetery']['name']}'),
                      const SizedBox(height: 4),
                      Text('Cami: ${death['mosque']['name']}'),
                      const SizedBox(height: 12),
                      Text(death['description'] ?? '-'),
                    ],
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Hata: $e')),
      ),
    );
  }
}
```

---

### MODULE 7: PHARMACY

**Status:** 0%
**Time Estimate:** 3-4 hours
**Complexity:** Medium
**API Endpoints:** GET /pharmacy/list, GET /pharmacy/schedule, GET /pharmacy/current
**Key Features:** On-duty pharmacy, schedule view, search

#### 7.1 API Response

```json
// GET /pharmacy/list
{
  "data": {
    "pharmacies": [
      {
        "id": "uuid",
        "name": "Merkez Eczanesi",
        "address": "Merkez Mahallesi, ...",
        "phone": "05551234567",
        "opening_hour": "08:00",
        "closing_hour": "22:00",
        "is_on_duty": true,
        "duty_start": "2026-02-24T00:00:00Z",
        "duty_end": "2026-02-25T00:00:00Z"
      }
    ]
  }
}

// GET /pharmacy/current
{
  "data": {
    "pharmacy": { ... } // Currently on-duty pharmacy
  }
}

// GET /pharmacy/schedule
{
  "data": {
    "schedule": [
      {
        "date": "2026-02-24",
        "pharmacy_id": "uuid",
        "pharmacy_name": "Merkez Eczanesi"
      }
    ]
  }
}
```

#### 7.2 Code Implementation

```dart
class PharmacyPage extends ConsumerWidget {
  const PharmacyPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pharmaciesAsync = ref.watch(pharmaciesProvider(1));
    final currentAsync = ref.watch(currentPharmacyProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Eczaneler')),
      body: RefreshIndicator(
        onRefresh: () async {
          await Future.wait([
            ref.refresh(pharmaciesProvider(1).future),
            ref.refresh(currentPharmacyProvider.future),
          ]);
        },
        child: CustomScrollView(
          slivers: [
            // Current on-duty pharmacy (highlight)
            SliverToBoxAdapter(
              child: currentAsync.when(
                data: (response) {
                  final current = response['pharmacy'];
                  return Container(
                    margin: const EdgeInsets.all(12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.green[50],
                      border: Border.all(color: Colors.green),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Şu anda nöbetçi',
                          style: TextStyle(color: Colors.green),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          current['name'],
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(current['phone']),
                      ],
                    ),
                  );
                },
                loading: () => const SizedBox.shrink(),
                error: (e, st) => const SizedBox.shrink(),
              ),
            ),

            // All pharmacies list
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  return pharmaciesAsync.when(
                    data: (response) {
                      final pharmacies = response['pharmacies'] as List;
                      final pharmacy = pharmacies[index];

                      return PharmacyCard(pharmacy: pharmacy);
                    },
                    loading: () => const SizedBox.shrink(),
                    error: (e, st) => const SizedBox.shrink(),
                  );
                },
                childCount: pharmaciesAsync.maybeWhen(
                  data: (response) => (response['pharmacies'] as List).length,
                  orElse: () => 0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PharmacyCard extends StatelessWidget {
  final Map<String, dynamic> pharmacy;

  const PharmacyCard({required this.pharmacy, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  pharmacy['name'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (pharmacy['is_on_duty'] ?? false)
                  Chip(
                    label: const Text('Nöbetçi'),
                    backgroundColor: Colors.green[100],
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              pharmacy['address'],
              style: TextStyle(color: Colors.grey[600], fontSize: 12),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${pharmacy['opening_hour']}-${pharmacy['closing_hour']}'),
                ElevatedButton.icon(
                  icon: const Icon(Icons.phone),
                  label: const Text('Ara'),
                  onPressed: () async {
                    final phoneUrl = Uri.parse('tel:${pharmacy['phone']}');
                    if (await canLaunchUrl(phoneUrl)) {
                      await launchUrl(phoneUrl);
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

---

### MODULE 8: EVENTS

**Status:** 0%
**Time Estimate:** 3 hours
**Complexity:** Low-Medium
**API Endpoints:** GET /events, GET /events/categories
**Key Features:** Category filtering, date-time display, location

#### 8.1 API Response

```json
{
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "Bahar Festivali",
        "description": "Tüm mahalleler için...",
        "category": { "id": "uuid", "name": "Festival" },
        "start_date": "2026-03-15T18:00:00Z",
        "end_date": "2026-03-15T22:00:00Z",
        "location": "Merkez Parkı",
        "organizer": "Belediye",
        "image_url": "https://..."
      }
    ]
  }
}
```

---

### MODULE 9: CAMPAIGNS

**Status:** 0%
**Time Estimate:** 3 hours
**Complexity:** Medium
**API Endpoints:** GET /campaigns
**Key Features:** Business campaigns, discounts, images, category filter

#### 9.1 Quick Notes

- Similar to Ads list + detail pattern
- Include discount badge
- Business info card
- External link button

---

### MODULE 10: GUIDE

**Status:** 0%
**Time Estimate:** 4 hours
**Complexity:** Medium
**API Endpoints:** GET /guide/categories, GET /guide/items
**Key Features:** Hierarchical categories (max 2 levels), search

#### 10.1 Hierarchical Structure

```json
{
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Sağlık",
        "children": [
          {
            "id": "uuid",
            "name": "Doktors",
            "children": []  // Leaf level - no more children
          }
        ]
      }
    ]
  }
}
```

#### 10.2 Implementation

```dart
// Use nested category expansion tiles
// Max 2 levels = ExpansionTile inside ExpansionTile (with depth tracking)
```

---

### MODULE 11: PLACES

**Status:** 0%
**Time Estimate:** 4-5 hours
**Complexity:** Medium-High
**API Endpoints:** GET /places, GET /places/:id
**Key Features:** Image carousel, location map, categories, reviews

#### 11.1 API Response

```json
{
  "data": {
    "places": [
      {
        "id": "uuid",
        "name": "Merkez Parki",
        "description": "...",
        "category": { "id": "uuid", "name": "Park" },
        "location": { "latitude": 37.xxx, "longitude": 35.xxx },
        "images": [ { "id": "uuid", "url": "..." } ],
        "cover_image_id": "uuid",
        "rating": 4.5,
        "review_count": 23
      }
    ]
  }
}
```

#### 11.2 Key Implementation

- Image carousel (same as Ads)
- Map integration (google_maps_flutter)
- Review/rating display

---

### MODULE 12: TRANSPORT (Intercity + Intracity)

**Status:** 0%
**Time Estimate:** 5-6 hours
**Complexity:** High
**API Endpoints:** GET /transport/intercity, GET /transport/intracity
**Key Features:** Schedule view, stops, seat selection, booking

#### 12.1 API Response

```json
// GET /transport/intercity?from=ankara&to=istanbul
{
  "data": {
    "routes": [
      {
        "id": "uuid",
        "from": "Ankara",
        "to": "İstanbul",
        "departure": "2026-02-24T10:00:00Z",
        "arrival": "2026-02-24T18:00:00Z",
        "company": "Şehrilerarası Nakliyat",
        "price": 250,
        "available_seats": 5,
        "total_seats": 50
      }
    ]
  }
}
```

---

### MODULE 13: PROFILE / USERS

**Status:** 0%
**Time Estimate:** 3 hours
**Complexity:** Low-Medium
**API Endpoints:** GET /users/me, PATCH /users/me
**Key Features:** Profile view, edit, neighborhood change (30-day limit), notification preferences

#### 13.1 Code Snippet

```dart
class ProfilePage extends ConsumerWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProfileProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Profil')),
      body: userAsync.when(
        data: (user) => ListView(
          children: [
            // Profile header
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    user.username,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  Text(user.phone, style: TextStyle(color: Colors.grey[600])),
                  const SizedBox(height: 4),
                  Text('Mahalle: ${user.primaryNeighborhood.name}'),
                ],
              ),
            ),
            const Divider(),

            // Edit button
            ListTile(
              title: const Text('Profili Düzenle'),
              trailing: const Icon(Icons.edit),
              onTap: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const EditProfilePage()),
              ),
            ),

            // Notification preferences
            ListTile(
              title: const Text('Bildirim Ayarları'),
              trailing: const Icon(Icons.notifications),
              onTap: () {
                // Navigate to notification settings
              },
            ),

            const Divider(),

            // Logout
            ListTile(
              title: const Text('Çıkış Yap'),
              trailing: const Icon(Icons.logout),
              onTap: () {
                // Logout logic
              },
            ),
          ],
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Hata: $e')),
      ),
    );
  }
}
```

---

### MODULE 14: COMPLAINTS

**Status:** 0%
**Time Estimate:** 3-4 hours
**Complexity:** Medium
**API Endpoints:** GET /complaints, POST /complaints
**Key Features:** Report issues, status tracking, priority levels

#### 14.1 Code Snippet

```dart
class ComplaintsPage extends ConsumerWidget {
  const ComplaintsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final complaintsAsync = ref.watch(complaintsProvider(1));

    return Scaffold(
      appBar: AppBar(title: const Text('Şikayetler')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => const NewComplaintPage()),
        ),
        child: const Icon(Icons.add),
      ),
      body: complaintsAsync.when(
        data: (response) {
          final complaints = response['complaints'] as List;
          return ListView.builder(
            itemCount: complaints.length,
            itemBuilder: (context, index) {
              final complaint = complaints[index];
              return ComplaintCard(complaint: complaint);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Hata: $e')),
      ),
    );
  }
}
```

---

### MODULE 15: NOTIFICATIONS

**Status:** 0%
**Time Estimate:** 3-4 hours
**Complexity:** Medium
**API Endpoints:** GET /notifications, PATCH /notifications/:id/read
**Key Features:** Push notifications, in-app notifications, unread badge

#### 15.1 Code Snippet

```dart
class NotificationsPage extends ConsumerWidget {
  const NotificationsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notificationsAsync = ref.watch(notificationsProvider(1));

    return Scaffold(
      appBar: AppBar(title: const Text('Bildirimler')),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(notificationsProvider(1).future),
        child: notificationsAsync.when(
          data: (response) {
            final notifications = response['notifications'] as List;
            final unreadCount = response['unread_count'] as int;

            return ListView.builder(
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                final isRead = notification['is_read'] ?? false;

                return NotificationTile(
                  notification: notification,
                  onTap: () async {
                    if (!isRead) {
                      await ref
                          .read(notificationsProvider.notifier)
                          .markAsRead(notification['id']);
                    }
                  },
                );
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, st) => Center(child: Text('Hata: $e')),
        ),
      ),
    );
  }
}
```

---

### MODULE 16: JOBS

**Status:** 0%
**Time Estimate:** 3-4 hours
**Complexity:** Low-Medium
**API Endpoints:** GET /jobs, GET /jobs/:id
**Key Features:** Job listings, company info, apply button

#### 16.1 Quick Implementation

- Simple list + detail pattern (similar to Announcements)
- Include company info card
- "Apply" button opens phone/email

---

## 🎨 UI/UX DESIGN PATTERNS

### 1. List with Pagination (Infinite Scroll)

```dart
class InfiniteScrollListPage extends ConsumerStatefulWidget {
  @override
  ConsumerState<InfiniteScrollListPage> createState() =>
      _InfiniteScrollListPageState();
}

class _InfiniteScrollListPageState extends ConsumerState<InfiniteScrollListPage> {
  late ScrollController _scrollController;
  int _currentPage = 1;
  final List<dynamic> _allItems = [];
  bool _hasMore = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 500) {
      if (!_isLoading && _hasMore) {
        _loadMore();
      }
    }
  }

  Future<void> _loadMore() async {
    setState(() => _isLoading = true);
    _currentPage++;
    // Load next page via provider
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final itemsAsync = ref.watch(itemsProvider(_currentPage));

    return Scaffold(
      body: itemsAsync.when(
        data: (response) {
          final meta = response['meta'] as Map<String, dynamic>;
          _hasMore = meta['has_next'] as bool;

          return ListView.builder(
            controller: _scrollController,
            itemCount: _allItems.length + (_hasMore ? 1 : 0),
            itemBuilder: (context, index) {
              if (index == _allItems.length) {
                return const Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(),
                );
              }
              return ItemCard(item: _allItems[index]);
            },
          );
        },
        loading: () => const LoadingWidget(),
        error: (e, st) => ErrorWidget(error: e),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}
```

### 2. Pull-to-Refresh

```dart
RefreshIndicator(
  onRefresh: () => ref.refresh(itemsProvider(1).future),
  child: ListView(...),
)
```

### 3. Filter & Search

```dart
class FilterableListPage extends ConsumerWidget {
  const FilterableListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filterState = ref.watch(filterProvider);
    final itemsAsync = ref.watch(
      itemsProvider(1)
          .select((state) => state.when(
            data: (items) => items,
            loading: () => null,
            error: (e, st) => null,
          )),
    );

    return Scaffold(
      body: Column(
        children: [
          // Filter bar
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Ara...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    onChanged: (value) {
                      ref.read(filterProvider.notifier).setSearch(value);
                    },
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.filter_list),
                  onPressed: () => _showFilterDialog(context, ref),
                ),
              ],
            ),
          ),

          // List
          Expanded(
            child: itemsAsync?.isEmpty ?? true
                ? const Center(child: Text('Sonuç bulunamadı'))
                : ListView.builder(
                    itemCount: itemsAsync!.length,
                    itemBuilder: (context, index) =>
                        ItemCard(item: itemsAsync![index]),
                  ),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      builder: (context) => FilterPanel(
        onApply: (filters) {
          ref.read(filterProvider.notifier).setFilters(filters);
          Navigator.pop(context);
        },
      ),
    );
  }
}
```

### 4. Shimmer Loading Skeleton

```dart
import 'package:shimmer/shimmer.dart';

class ShimmerSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: ListView.builder(
        itemCount: 10,
        itemBuilder: (context, index) => Container(
          margin: const EdgeInsets.all(8),
          height: 100,
          color: Colors.grey,
        ),
      ),
    );
  }
}
```

### 5. Error Handling UI

```dart
class ErrorWidget extends StatelessWidget {
  final Object error;
  final VoidCallback? onRetry;

  const ErrorWidget({
    required this.error,
    this.onRetry,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text(
            error.toString(),
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 24),
          if (onRetry != null)
            ElevatedButton(
              onPressed: onRetry,
              child: const Text('Tekrar Dene'),
            ),
        ],
      ),
    );
  }
}
```

### 6. Bottom Navigation Tab Switching

```dart
class MainPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedTab = ref.watch(bottomNavProvider);

    return Scaffold(
      body: IndexedStack(
        index: selectedTab,
        children: const [
          HomePage(),
          AdsListPage(),
          FavoritesPage(),
          ProfilePage(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: selectedTab,
        onTap: (index) {
          ref.read(bottomNavProvider.notifier).state = index;
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Ana Sayfa'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_bag), label: 'İlanlar'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Favoriler'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }
}

final bottomNavProvider = StateProvider<int>((ref) => 0);
```

---

## 🚨 ERROR HANDLING & VALIDATION

### Custom Exception Classes

**lib/core/exceptions/app_exception.dart:**

```dart
abstract class AppException implements Exception {
  final String message;
  final dynamic originalException;

  AppException(this.message, [this.originalException]);

  @override
  String toString() => message;
}

class NetworkException extends AppException {
  NetworkException(String message, [dynamic originalException])
      : super(message, originalException);
}

class ParseException extends AppException {
  ParseException(String message, [dynamic originalException])
      : super(message, originalException);
}

class ValidationException extends AppException {
  final Map<String, List<String>> errors;

  ValidationException(String message, this.errors, [dynamic originalException])
      : super(message, originalException);
}

class UnauthorizedException extends AppException {
  UnauthorizedException(String message, [dynamic originalException])
      : super(message, originalException);
}

class ForbiddenException extends AppException {
  ForbiddenException(String message, [dynamic originalException])
      : super(message, originalException);
}
```

### Try-Catch in Repositories

```dart
class MyRepository {
  Future<MyModel> getItem(String id) async {
    try {
      final response = await _datasource.getItem(id);
      return MyModel.fromJson(response['data']);
    } on DioException catch (e) {
      // Let Dio interceptors handle this
      rethrow;
    } catch (e) {
      throw ParseException('Failed to parse item: $e');
    }
  }
}
```

### Handle in UI

```dart
class MyPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dataAsync = ref.watch(myProvider);

    return dataAsync.when(
      data: (data) => DataView(data: data),
      loading: () => const LoadingWidget(),
      error: (error, stack) {
        // Show user-friendly error message
        String message = 'Bir hata oluştu';

        if (error is NetworkException) {
          message = error.message;
        } else if (error is ParseException) {
          message = 'Veri işlenirken hata oluştu';
        } else if (error is UnauthorizedException) {
          // Logout user
          message = 'Oturumunuz sona erdi';
        }

        return ErrorWidget(
          error: message,
          onRetry: () => ref.refresh(myProvider),
        );
      },
    );
  }
}
```

---

## 🧪 TESTING STRATEGY

### Unit Tests for Repositories

```dart
// test/features/ads/repositories/ads_repository_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:kadirliapp/features/ads/data/repositories/ads_repository.dart';

void main() {
  group('AdsRepository', () {
    late AdsRepository repository;
    late MockAdsRemoteDatasource mockDatasource;

    setUp(() {
      mockDatasource = MockAdsRemoteDatasource();
      repository = AdsRepository(datasource: mockDatasource);
    });

    test('getAds returns parsed ads list', () async {
      // Arrange
      when(mockDatasource.getAds(
        page: 1,
        limit: 20,
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        search: null,
        sort: null,
      )).thenAnswer((_) async => {
            'data': {
              'ads': [
                {
                  'id': 'uuid',
                  'title': 'iPhone',
                  'price': 35000,
                  // ... full response
                }
              ],
              'meta': {'page': 1, 'total': 1},
            }
          });

      // Act
      final result = await repository.getAds();

      // Assert
      expect(result['ads'], isNotEmpty);
      expect(result['ads'][0].title, 'iPhone');
    });

    test('getAds throws ParseException on invalid JSON', () async {
      // Arrange
      when(mockDatasource.getAds(
        page: anyNamed('page'),
        limit: anyNamed('limit'),
        categoryId: anyNamed('categoryId'),
        minPrice: anyNamed('minPrice'),
        maxPrice: anyNamed('maxPrice'),
        search: anyNamed('search'),
        sort: anyNamed('sort'),
      )).thenAnswer((_) async => {'invalid': 'data'});

      // Act & Assert
      expect(
        () => repository.getAds(),
        throwsA(isA<ParseException>()),
      );
    });
  });
}
```

### Widget Tests

```dart
// test/features/ads/widgets/ad_card_test.dart

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/ads/data/models/ad_model.dart';
import 'package:kadirliapp/features/ads/presentation/widgets/ad_card.dart';

void main() {
  group('AdCard Widget', () {
    final mockAd = AdModel(
      id: 'uuid',
      title: 'iPhone 13',
      description: 'Great condition',
      price: 35000,
      category: const CategoryModel(id: 'uuid', name: 'Telefon', parent: null),
      coverImage: null,
      imagesCount: 0,
      viewCount: 0,
      createdAt: DateTime.now(),
      expiresAt: DateTime.now().add(const Duration(days: 7)),
    );

    testWidgets('renders ad title and price', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AdCard(ad: mockAd),
          ),
        ),
      );

      expect(find.text('iPhone 13'), findsOneWidget);
      expect(find.text('₺35000'), findsOneWidget);
    });

    testWidgets('navigates to detail on tap', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AdCard(ad: mockAd),
          ),
        ),
      );

      await tester.tap(find.byType(AdCard));
      await tester.pumpAndSettle();

      // Verify navigation occurred
      expect(find.byType(AdDetailPage), findsOneWidget);
    });
  });
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### 1. Image Caching

```dart
import 'package:cached_network_image/cached_network_image.dart';

CachedNetworkImage(
  imageUrl: 'https://...',
  cacheKey: 'unique_key', // Custom cache key
  memCacheWidth: 400,
  memCacheHeight: 400,
  placeholder: (context, url) => const Placeholder(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
)
```

### 2. Lazy Loading Lists

```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    // Only builds visible items
    return ItemCard(item: items[index]);
  },
)
```

### 3. Pagination Instead of Loading All

**Good:** Load page 1 (20 items), then page 2 on scroll
**Bad:** `GET /items?limit=999999` (kills performance)

### 4. Provider Auto-Dispose

```dart
final itemsProvider = FutureProvider.family.autoDispose<
    Items,
    int>((ref, page) async { ... });
// ^ Automatically clears when unused for 60 seconds
```

### 5. Memoization

```dart
// ❌ Bad: Recomputes every build
final expensiveValue = ref.watch(someProvider)
    .map((item) => item.expensive())
    .toList();

// ✅ Good: Memoizes result
final memoizedProvider = Provider((ref) {
  final items = ref.watch(someProvider);
  return items.map((item) => item.expensive()).toList();
});
```

---

## 🚀 DEPLOYMENT & RELEASE

### iOS Build & Release

```bash
# Build for iOS
flutter build ios --release

# Or use Xcode for App Store submission
cd ios && pod install && cd ..
xcode-select --install

# Archive for App Store
flutter build ios --release
# Open in Xcode
open ios/Runner.xcworkspace/

# In Xcode:
# 1. Product > Scheme > Runner
# 2. Product > Destination > Generic iOS Device
# 3. Product > Archive
# 4. Distribute App
```

### Android Build & Release

```bash
# Build APK (for testing)
flutter build apk --release

# Build App Bundle (for Google Play)
flutter build appbundle --release

# Sign APK (if needed)
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore ~/android.jks \
  build/app/outputs/apk/release/app-release-unsigned.apk \
  alias_name
```

### Version Management

**pubspec.yaml:**
```yaml
version: 1.0.0+1
# Format: VERSION_NAME+VERSION_CODE
# VERSION_NAME: 1.0.0 (for App Store/Play Store)
# VERSION_CODE: 1 (internal build number, must increment)
```

### Firebase Distribution (Beta Testing)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Build and distribute
flutter build apk --release
firebase app-distribution:distribute build/app/outputs/apk/release/app-release.apk \
  --app 1:123456789:android:abcdef123456 \
  --release-notes "Beta version 1.0.0" \
  --testers "beta@example.com"
```

---

## 📋 COMPLETE CHECKLIST FOR EACH MODULE

Before marking a module complete:

- [ ] All API endpoints mapped correctly
- [ ] Models created (Freezed recommended)
- [ ] Repository with error handling
- [ ] Riverpod providers (FutureProvider, StateNotifier, etc)
- [ ] Pages (list + detail if applicable)
- [ ] Widgets (card, filters, dialogs, etc)
- [ ] Tested on iOS Simulator
- [ ] Tested on Android Emulator
- [ ] Pull-to-refresh working
- [ ] Pagination working (if applicable)
- [ ] Error messages user-friendly
- [ ] Loading states (shimmer skeleton)
- [ ] Empty states displayed
- [ ] Proper spacing & colors (Material Design 3)
- [ ] Responsive layout (landscape/portrait)
- [ ] No console warnings/errors
- [ ] Unit tests written (min 70% coverage)
- [ ] Widget tests for critical pages
- [ ] Wired into home grid/navigation
- [ ] Git commit with descriptive message
- [ ] Updated progress in MEMORY_BANK/activeContext.md

---

## 🔗 QUICK REFERENCE

### API Base URLs

```dart
// Development
Android Emulator: http://10.0.2.2:3000/v1
iOS Simulator: http://localhost:3000/v1

// Production
Real Device: https://api.kadirliapp.com/v1
```

### Common API Response Structure

```json
{
  "success": true,
  "data": {
    "{items_key}": [...],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-27T10:00:00Z",
    "path": "/v1/..."
  }
}
```

### Riverpod Provider Types

| Type | Use Case | Example |
|------|----------|---------|
| `Provider` | Static/computed data | `userNameProvider = Provider(...)` |
| `FutureProvider` | Async data, read-only | `adsProvider = FutureProvider(...)` |
| `StateNotifierProvider` | Mutable state with logic | `favoritesProvider = StateNotifierProvider(...)` |
| `.family` | Parameterized providers | `adDetailProvider = FutureProvider.family(...)` |
| `.autoDispose` | Auto cleanup when unused | `itemsProvider = FutureProvider.autoDispose(...)` |

### Material Design 3 Colors

```dart
primary: 0xFF2196F3,        // Blue
secondary: 0xFF8E24AA,      // Purple
error: 0xFFF44336,          // Red
surface: 0xFFFFFFFF,        // White
surfaceVariant: 0xFFF5F5F5, // Light Grey
```

### Common Packages

```yaml
flutter_riverpod: ^2.0.0    # State management
dio: ^5.3.1                 # HTTP client
freezed: ^2.x               # Model generation
intl: ^0.19.0               # Localization
cached_network_image: ^3.3  # Image caching
shimmer: ^3.0.0             # Loading skeleton
url_launcher: ^6.2.0        # Open URLs/phone
firebase_messaging: ^14.x   # Push notifications
```

---

## ⚠️ CRITICAL DO's & DON'Ts

### DO ✅

- ✅ Use Riverpod `FutureProvider.family` for parameterized providers
- ✅ Use `.autoDispose` for providers that can be cleared
- ✅ Use `RefreshIndicator` for pull-to-refresh
- ✅ Handle all error cases with user-friendly messages
- ✅ Show loading states (shimmer skeleton or CircularProgressIndicator)
- ✅ Use `CachedNetworkImage` for network images
- ✅ Validate user input before sending to API
- ✅ Use `const` constructors where possible
- ✅ Import only what you need
- ✅ Test on both iOS and Android

### DON'T ❌

- ❌ Don't call async functions in `build()`
- ❌ Don't hardcode text (use constants or i18n)
- ❌ Don't ignore error states
- ❌ Don't mutate state directly in StateNotifier
- ❌ Don't use nested `FutureBuilder` widgets
- ❌ Don't load all data at once (use pagination)
- ❌ Don't forget to dispose controllers
- ❌ Don't ignore platform differences (Android emulator IP!)
- ❌ Don't skip testing
- ❌ Don't commit code with console errors/warnings

---

## 🎯 NEXT IMMEDIATE STEPS FOR GEMINI

**When you take over (after Haiku's tokens run out):**

1. **Start with Module 4: Ads** (highest priority)
   - Follow the exact code blocks provided above
   - Use Freezed for models
   - Implement image carousel with PageView
   - Add favorites functionality (max 30)
   - Test on both iOS & Android

2. **Progress Order:**
   - Ads (4-5h)
   - Taxi (2-3h)
   - Deaths (3h)
   - Pharmacy (3-4h)
   - Events (3h)
   - Campaigns (3h)
   - Guide (4h) ← Tricky hierarchical structure
   - Places (4-5h) ← Map integration
   - Transport (5-6h) ← Most complex
   - Profile (3h)
   - Complaints (3-4h)
   - Notifications (3-4h)
   - Jobs (3-4h)

3. **After each module:**
   - Test on iOS simulator (`flutter run -d iPhone`)
   - Test on Android emulator (`flutter run -d emulator`)
   - Run tests (`flutter test`)
   - Commit to git with clear message
   - Update `MEMORY_BANK/activeContext.md`

4. **If you get stuck:**
   - Check API docs: `docs/04_API_ENDPOINTS_MASTER.md`
   - Check admin panel wireframes: `docs/05_ADMIN_PANEL_WIREFRAME_MASTER.md`
   - Reference completed modules (Auth, Home, Announcements)
   - Run backend tests to ensure API works

---

## 📞 FINAL NOTES

This document is **the single source of truth** for Flutter development. Every decision, pattern, and implementation detail is specified here.

**Good luck! Build fast, build right.** 🚀

