# KadirliApp Flutter Mobile App

Flutter + Riverpod + Dio ile geliştirilmiş iOS & Android mobil uygulaması.

**Durum:** 14 modül tamamlandı (commit `eba423c`: "100% module completion, 88% test coverage")
**Platformlar:** iOS 14+ | Android (minimum API belirtilmemiş)

---

## 📋 Hızlı Başlangıç

### Gereksinimler
- Flutter SDK >=3.13.0, Dart >=3.0.0 <4.0.0
- Xcode 15+ (iOS development, macOS)
- Android Studio + Android SDK
- Backend API çalışıyor olmalı

### Kurulum

```bash
flutter pub get

# Code generation (freezed, json_serializable, riverpod_generator, hive_generator)
flutter pub run build_runner build --delete-conflicting-outputs

cd ios && pod install && cd ..
```

### Çalıştırma

```bash
flutter run                  # Bağlı cihaz/emülatör
flutter run -d iPhone        # iOS simulator
flutter run -d emulator      # Android emulator
flutter run -d chrome        # Web (deneysel, resmi destek yok)
```

---

## 🧪 Testing

```bash
flutter test
```

**Mevcut durum:** 57 test dosyası (`test/` altında, modül bazlı: data model, repository, datasource, provider testleri). Coverage **%88 olarak commit mesajında belirtilmiş** ancak bu rakam CI tarafından üretilmiyor — proje için bir Flutter CI workflow'u yok (`.github/workflows/` içinde sadece backend ve admin pipeline'ları var). Coverage raporu (`coverage/lcov.info`) reponun bir parçası değil.

---

## 📱 Modüller (14/14 Tamamlandı)

| Modül | Data Layer | Sayfa Sayısı | Açıklama |
|-------|:---:|:---:|----------|
| **auth** | ✅ | 3 | Telefon/OTP girişi, kayıt, mahalle seçimi |
| **home** | — | 1 | 12 modüllük grid, alt navigasyon (bottom nav) |
| **announcements** | ✅ | 2 | Duyuru listesi + detay |
| **ads** | ✅ | 4 | İlan listesi, detay, oluşturma, düzenleme |
| **deaths** | ✅ | 2 | Vefat ilanları listesi + detay |
| **events** | ✅ | 2 | Etkinlik listesi + detay |
| **campaigns** | ✅ | 2 | Kampanya listesi + detay |
| **pharmacy** | ✅ | 1 | Nöbetçi eczane bilgisi |
| **guide** | ✅ | 1 | Şehir rehberi |
| **places** | ✅ | 2 | Mekan listesi + detay |
| **taxi** | ✅ | 1 | Taksi bilgisi |
| **transport** | ✅ | 1 | Şehirlerarası otobüs seferleri |
| **notifications** | ✅ | 1 | FCM push bildirim akışı |
| **profile** | — | 1 | Kullanıcı profili/ayarlar |

`home` ve `profile` modüllerinin ayrı bir `data/` katmanı yok — büyük ölçüde mevcut auth/diğer provider'ları kullanan UI katmanları.

> **Bilinen eksik:** Alt navigasyondaki **"Favoriler"** sekmesi şu an placeholder — ayrı bir feature modülü olarak implemente edilmemiş. Backend'de mevcut olan **complaints** (şikayet) ve **jobs** (arka plan işleri) modülleri için Flutter tarafında henüz UI yok.

---

## 🏗️ Proje Yapısı

```
lib/
├── core/
│   ├── constants/          - API constants, renkler, spacing
│   ├── network/            - DioClient (platform bazlı base URL, interceptor'lar)
│   ├── storage/            - SharedPreferences / Hive / FlutterSecureStorage wrapper'ları
│   ├── exceptions/         - Custom exception sınıfları
│   └── validators/         - Input validasyonları
├── features/
│   └── [module]/
│       ├── data/
│       │   ├── datasources/   - API çağrıları
│       │   ├── models/        - Response modelleri
│       │   └── repositories/  - Repository pattern
│       └── presentation/
│           ├── pages/         - Tam ekran sayfalar
│           ├── widgets/       - Yeniden kullanılabilir widget'lar
│           └── providers/     - Riverpod provider'ları
├── app.dart                - Root widget + _AuthGate (splash/login/home yönlendirmesi)
└── main.dart                - Entry point (Storage, DioClient, Firebase, FCM init)

test/
├── core/                   - Core utility testleri
└── features/               - Modül bazlı testler (57 dosya)
```

### Routing

**go_router yok** — manuel `Navigator` tabanlı yönlendirme:
- `app.dart` içindeki `_AuthGate`, auth durumuna göre Splash / `PhoneInputPage` / `HomePage` gösterir.
- Ana ekranda `IndexedStack` ile 4 sekme: Ana Sayfa, İlanlar, Favoriler (placeholder), Profil.
- Liste → detay geçişleri `Navigator.push()` ile yapılır, named route veya deep linking yok.

---

## 🔌 API Integration

### Platform Bazlı Base URL (`lib/core/network/dio_client.dart`)
```dart
// Android emulator
http://10.0.2.2:3000/v1

// iOS simulator
http://127.0.0.1:3000/v1

// Production
https://api.kadirliapp.com/v1
```
Seçim `Platform.isIOS` / `Platform.isAndroid` ile otomatik yapılır, environment dosyasına gerek yoktur. Timeout: 30 saniye (connect/receive/send).

### Response Format
```json
{
  "success": true,
  "data": {
    "announcements": [...],
    "meta": { "page": 1, "total": 50, "total_pages": 3, "has_next": true, "has_prev": false }
  },
  "meta": { "timestamp": "2026-02-27T10:00:00Z", "path": "/announcements" }
}
```

---

## 🔐 Authentication

1. Telefon numarası girilir
2. `POST /auth/request-otp` ile OTP istenir
3. `POST /auth/verify-otp` ile doğrulanır → temp token döner
4. `POST /auth/register` ile kayıt tamamlanır → `access_token` + `refresh_token`
5. Token'lar SharedPreferences'ta saklanır, JWT süresi dolunca otomatik refresh denenir; refresh de başarısız olursa `SessionExpiryNotifier` üzerinden `_AuthGate` tetiklenir ve kullanıcı otomatik olarak login ekranına döner

**Development:** `OTP_DEV_MODE=true` iken backend her zaman `123456` kodunu kabul eder.

---

## 📦 Önemli Bağımlılıklar (pubspec.yaml)

```yaml
# State Management
flutter_riverpod: ^2.4.0
riverpod_annotation: ^2.3.0

# HTTP
dio: ^5.4.0

# Storage
shared_preferences: ^2.2.2     # JWT token
hive: ^2.2.3 / hive_flutter: ^1.1.0   # local cache
flutter_secure_storage: ^10.0.0       # hassas veri

# Firebase
firebase_core: ^4.0.0
firebase_messaging: ^16.1.1
# flutter_local_notifications: yorum satırında — Android API 33+ gerektiriyor

# UI / Medya
cached_network_image: ^3.3.0
shimmer: ^3.0.0
pull_to_refresh: ^2.0.0
image_picker: ^1.0.5 / flutter_image_compress: ^2.1.0 / photo_view: ^0.15.0

# Harita/Konum
google_maps_flutter: ^2.5.0
geolocator: ^14.0.2

# Diğer
intl: ^0.20.2
intl_phone_field: ^3.2.0 / sms_autofill: ^2.3.0
url_launcher: ^6.2.2 / share_plus: ^12.0.1
email_validator: ^3.0.0
table_calendar: ^3.0.9
flutter_spinkit: ^5.2.0
freezed_annotation: ^2.4.1 / json_annotation: ^4.8.1

# Dev
mocktail: ^1.0.4
build_runner: ^2.4.7
riverpod_generator / hive_generator / freezed / json_serializable
```

> Not: `pubspec.yaml`'da `assets:`/`fonts:` blokları henüz yorum satırında — özel font/asset paketlemesi yapılmadı.

---

## 🚀 Build & Release

### iOS
```bash
flutter build ios --mode=debug
flutter build ios --release --obfuscate --split-debug-info=build/app/outputs/symbols
# App Store için: open ios/Runner.xcworkspace/
```
Minimum iOS hedefi: 14.0 (`ios/Podfile`).

### Android
```bash
flutter build apk --mode=debug
flutter build apk --mode=release
flutter build appbundle --release
```

### Kod Kalitesi
```bash
flutter analyze
dart format lib/
flutter pub outdated
```

---

## 🔗 Firebase Cloud Messaging

- Android: `google-services.json` yapılandırıldı
- iOS: `GoogleService-Info.plist` Xcode'a eklendi, `FirebaseAppDelegateProxyEnabled = false`
- Foreground/background mesaj handler'ları (`FirebaseMessagingService`) implemente edildi
- Token kaydı `notifications` modülünde otomatik backend'e senkronize edilir

Detaylar: `IOS_FIREBASE_SETUP.md`, `SETUP_INSTRUCTIONS.md`

---

## 🐛 Bilinen Kısıtlar

- **Favoriler sekmesi** henüz gerçek bir feature değil (placeholder UI).
- **complaints** ve **jobs** modülleri backend'de var, Flutter tarafında UI yok.
- **CI/CD yok** — testler ve coverage manuel çalıştırılıyor, GitHub Actions'a bağlı değil.
- **Web platformu** deneysel, resmi destek hedefi değil.
- `flutter_local_notifications` Android API 33+ gerektirdiği için pubspec'te devre dışı.

---

## 🔗 Referanslar

- `SETUP_INSTRUCTIONS.md` — kurulum adımları
- `IOS_FIREBASE_SETUP.md` — iOS Firebase yapılandırması
- `SKILLS/flutter-auth.md`, `SKILLS/flutter-list-detail.md`, `SKILLS/flutter-ui.md`, `SKILLS/flutter-ads.md`
- API: `/docs/04_API_ENDPOINTS_MASTER.md`

---

**Framework:** Flutter (Dart >=3.0.0)
**State Management:** Riverpod
**API Client:** Dio
**Backend:** NestJS 11 + PostgreSQL
