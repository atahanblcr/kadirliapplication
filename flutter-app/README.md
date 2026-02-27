# KadirliApp Flutter Mobile App

Flutter 3.x + Riverpod + Dio ile geliştirilmiş iOS & Android mobile uygulaması.

**Status:** 30% Complete (Auth + Home + Announcements modules)
**Platforms:** iOS 14+ | Android 7+ (API 24+)

---

## 📋 Hızlı Başlangıç

### Gereksinimler
- Flutter SDK 3.x (FVM recommended)
- Xcode 15+ (macOS için iOS development)
- Android Studio + Android SDK (Android development)
- Backend API running at `http://localhost:3000/v1`

### Kurulum

```bash
# Bağımlılıkları yükle
flutter pub get

# Build runner (code generation)
flutter pub run build_runner build --delete-conflicting-outputs

# iOS Pod install
cd ios && pod install && cd ..
```

### Çalıştırma

```bash
# Development mode (all platforms)
flutter run

# iOS simulator
flutter run -d iPhone

# Android emulator
flutter run -d emulator

# Web (experimental)
flutter run -d chrome
```

---

## 🧪 Testing

```bash
# Unit tests
flutter test

# Widget tests
flutter test test/widget_test.dart

# Integration tests (requires real device/emulator)
flutter drive --target=integration_test/app_test.dart
```

---

## 📱 Tamamlanan Modüller (3/16)

### ✅ Auth Module (100%)
- **Features:**
  - Phone number registration (05550000000 format)
  - OTP verification (dev: 123456)
  - Auto-registration with profile data
  - JWT token management (access + refresh)
  - Auto token refresh on expiry
  - Logout
- **Files:**
  - `lib/features/auth/data/models/` — Auth & user response models
  - `lib/features/auth/data/repositories/` — Auth API client
  - `lib/features/auth/presentation/providers/` — Riverpod providers
  - `lib/features/auth/presentation/pages/` — Login, OTP, Register pages
  - `lib/features/auth/presentation/widgets/` — Reusable widgets
- **State Management:** StateNotifierProvider + Riverpod
- **Validation:** Custom validators (phone, OTP, password)
- **Storage:** SharedPreferences for tokens + user data
- **Error Handling:** Custom exceptions + user-friendly messages
- **Tested:** ✅ iOS Simulator & Android Emulator

### ✅ Home Module (100%)
- **Features:**
  - 12-module grid (2 columns, square cards)
  - Greeting header with username + neighborhood
  - AppBar with notification bell + user avatar
  - User popup menu (Profile, Settings, Logout)
  - BottomNavigationBar (4 tabs: Home, Ads, Favorites, Profile)
  - Tab navigation with IndexedStack
  - Module cards with icons and colors
  - Placeholder tabs for unimplemented sections
- **Files:**
  - `lib/features/home/presentation/pages/home_page.dart`
  - `lib/features/home/presentation/widgets/` — Module card, greeting, user menu
  - `lib/features/home/presentation/providers/home_provider.dart`
- **Design:** Material Design 3
- **Icons:** Material Icons
- **Tested:** ✅ iOS Simulator & Android Emulator

### ✅ Announcements Module (100%)
- **Features:**
  - List announcements with infinite scroll
  - Pull-to-refresh
  - Detail view with content
  - PDF/external link launcher
  - Priority badges (emergency/high/normal/low)
  - Date formatting (Turkish locale)
  - Viewed announcements opacity (0.65)
  - Shimmer loading skeleton
  - Error/empty states
- **Files:**
  - `lib/features/announcements/data/models/announcement_model.dart`
  - `lib/features/announcements/data/repositories/announcement_repository.dart`
  - `lib/features/announcements/presentation/providers/`
  - `lib/features/announcements/presentation/pages/`
  - `lib/features/announcements/presentation/widgets/`
- **API Integration:**
  - `GET /announcements` — List with pagination
  - `GET /announcements/:id` — Detail view
  - Pagination: `data.data.meta` (page, total, has_next)
- **Packages:**
  - `riverpod` — State management
  - `dio` — HTTP client
  - `intl` — Date/time formatting
  - `url_launcher` — Open links/PDFs
  - `shimmer` — Loading skeleton
- **Tested:** ✅ iOS Simulator & Android Emulator

---

## 🔄 İlerleyen Modüller (Planlı Sıra)

### 🟡 Ads Module (Sonraki)
- List ads with filters/search
- Detail view with contact actions
- Favorites management
- Image carousel

### 🟡 Profile Module
- User profile view + edit
- Change password
- Notification preferences
- Neighborhood change

### (Diğer 13 modül devam edecek...)

---

## 🏗️ Proje Yapısı

```
lib/
├── core/
│   ├── constants/          - API constants, colors, spacing
│   ├── network/            - Dio client with interceptors
│   ├── storage/            - SharedPreferences wrapper
│   ├── exceptions/         - Custom exception classes
│   └── validators/         - Input validation methods
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── datasources/  - API calls
│   │   │   ├── models/       - Response models
│   │   │   └── repositories/ - Repository pattern
│   │   └── presentation/
│   │       ├── pages/        - Full-screen pages
│   │       ├── widgets/      - Reusable widgets
│   │       └── providers/    - Riverpod providers
│   ├── home/               - Similar structure
│   ├── announcements/      - Similar structure
│   └── [other-modules]/    - Similar structure
├── app.dart                - Root widget + routing
└── main.dart               - Entry point

test/
├── features/               - Feature-specific tests
└── core/                   - Core utility tests
```

---

## 🔌 API Integration

### Platform-Specific URLs
```dart
// Android Emulator
http://10.0.2.2:3000/v1

// iOS Simulator
http://localhost:3000/v1

// Real Device
https://api.kadirliapp.com/v1
```

**Auto-detection:** Platform.isIOS / Platform.isAndroid

### Response Format
```json
{
  "success": true,
  "data": {
    "announcements": [...],
    "meta": {
      "page": 1,
      "total": 50,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-27T10:00:00Z",
    "path": "/announcements"
  }
}
```

### Dio Client
- **Base URL:** Platform-specific (auto-detected)
- **Timeout:** 30 seconds
- **Interceptors:** JWT token injection, error handling
- **Token Refresh:** Auto-refresh on 401

---

## 🔐 Authentication

### Login Flow
1. User enters phone number
2. Request OTP via `POST /auth/request-otp`
3. Verify OTP via `POST /auth/verify-otp` → get `temp_token`
4. Register via `POST /auth/register` → get `access_token` + `refresh_token`
5. Token stored in SharedPreferences
6. All subsequent requests include JWT header

### Token Management
- **Storage:** SharedPreferences
- **Auto-Refresh:** On token expiry
- **Logout:** Clear tokens + navigate to login

### Development
- **OTP:** Always `123456` (hardcoded in backend for dev)
- **Test Phone:** `05551234567`

---

## 📦 Önemli Packages

```yaml
# State Management
riverpod: ^2.0

# HTTP Client
dio: ^5.3.1

# Local Storage
shared_preferences: ^2.2.0

# Localization
intl: ^0.19.0

# Firebase (Push Notifications)
firebase_core: ^2.x
firebase_messaging: ^14.x

# UI Components
material_design_icons_flutter: ^7.0

# Image Handling
cached_network_image: ^3.3

# URL Launcher
url_launcher: ^6.2

# Loading Skeleton
shimmer: ^3.0

# JSON Serialization
freezed: ^2.x (optional)
json_serializable: ^6.x (optional)
```

---

## 🎨 Design System

### Colors
- **Primary:** Material Blue (0xFF2196F3)
- **Secondary:** Material Purple (0xFF8E24AA)
- **Success:** Material Green (0xFF4CAF50)
- **Error:** Material Red (0xFFF44336)
- **Background:** White/Grey

### Spacing
- **xs:** 4px
- **sm:** 8px
- **md:** 16px (default)
- **lg:** 24px
- **xl:** 32px

### Typography
- **Body:** Roboto (default)
- **Sizes:** 12sp (small) → 24sp (large)

---

## 🚀 Build & Release

### iOS Build
```bash
# Development build
flutter build ios --mode=debug

# Production build
flutter build ios --mode=release --obfuscate --split-debug-info=build/app/outputs/symbols

# Archive for App Store
flutter build ios --release
# Open in Xcode: open ios/Runner.xcworkspace/
```

### Android Build
```bash
# Development build
flutter build apk --mode=debug

# Release build (unsigned)
flutter build apk --mode=release

# Release bundle (Google Play)
flutter build appbundle --release
```

### Code Quality
```bash
# Analyze code
flutter analyze

# Format code
dart format lib/

# Check dependencies
flutter pub outdated
```

---

## 🔗 Firebase Cloud Messaging (FCM)

### Setup Complete ✅
- Android: `google-services.json` configured
- iOS: `GoogleService-Info.plist` configured
- Backend: Firebase credentials loaded
- Flutter: `firebase_messaging` integrated

### Token Registration
```dart
// Auto-handled by auth module
// Token synced with backend on registration
```

---

## 🐛 Known Limitations

- **Android Emulator:** Browser limited (native restriction)
- **Web Platform:** Experimental support only
- **Real Device:** Requires backend certificate pinning setup

---

## 🔗 Referanslar

- **FLUTTER_SETUP_PLAN.md** — 4-week development roadmap
- **SKILLS/flutter-auth.md** — Auth architecture
- **SKILLS/flutter-list-detail.md** — List/detail patterns
- **API Endpoints:** `/docs/04_API_ENDPOINTS_MASTER.md`

---

## 📊 Module Progress

| Module | Status | Completion | iOS | Android |
|--------|--------|-----------|-----|---------|
| Auth | ✅ | 100% | ✅ | ✅ |
| Home | ✅ | 100% | ✅ | ✅ |
| Announcements | ✅ | 100% | ✅ | ✅ |
| Ads | 🟡 | 0% | ⏳ | ⏳ |
| Profile | 🟡 | 0% | ⏳ | ⏳ |
| Deaths | 🟡 | 0% | ⏳ | ⏳ |
| Campaigns | 🟡 | 0% | ⏳ | ⏳ |
| Events | 🟡 | 0% | ⏳ | ⏳ |
| Guide | 🟡 | 0% | ⏳ | ⏳ |
| Places | 🟡 | 0% | ⏳ | ⏳ |
| Pharmacy | 🟡 | 0% | ⏳ | ⏳ |
| Transport | 🟡 | 0% | ⏳ | ⏳ |
| Taxi | 🟡 | 0% | ⏳ | ⏳ |
| Jobs | 🟡 | 0% | ⏳ | ⏳ |
| Notifications | 🟡 | 0% | ⏳ | ⏳ |
| Complaints | 🟡 | 0% | ⏳ | ⏳ |

---

**Framework:** Flutter 3.x
**Language:** Dart
**State Management:** Riverpod + StateNotifier
**API Client:** Dio with JWT auth
**Backend:** NestJS 10 + PostgreSQL
