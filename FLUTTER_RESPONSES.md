# Flutter Mobile App - Karar Cevapları 📱

> KadirliApp Flutter uygulaması için alınan kararlar
> Tarih: 24 Şubat 2026
> Backend ve Admin Panel'e uyumlu olarak hazırlandı

---

## 1️⃣ UI/UX FRAMEWORK

**Karar:** ✅ **Material Design 3** (Material 3 latest)

**Sebep:**
- Android kullanıcı kitlesi büyük (Türkiye)
- Material 3 modern ve güncel
- Backend/Admin zaten web-based (konsistent olması güzel)

**Detay Cevapları:**
- **Mobile-first:** Evet, öncelik mobil (tablet sonrası düşünülür)
- **Dark mode:** Hayır, şimdilik light mode yeter (v1.0)
- **Hedef cihazlar:** Android + iOS (her ikisi de)
- **Min versions:** Android 5.0 (API 21+), iOS 12.0+

---

## 2️⃣ STATE MANAGEMENT

**Karar:** ✅ **Riverpod**

**Sebep:**
- Modern ve güvenli (Provider'ın gelişmiş hali)
- Compile-time safety (daha az bug)
- API state yönetimi kolay
- Backend'in karmaşıklığı orta seviye → Riverpod ideal

**Detay Cevapları:**
- **API state:** AsyncValue<T> kullanılacak (loading, data, error)
- **Global state:** 
  * Auth: authProvider (user, token)
  * Notifications: notificationProvider
  * Favorites: favoritesProvider
- **Local state:** Widget seviyesinde StateProvider

**Örnek:**
```dart
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

final adsListProvider = FutureProvider.autoDispose.family<List<Ad>, AdFilters>((ref, filters) async {
  return ref.read(adsRepositoryProvider).getAds(filters);
});
```

---

## 3️⃣ LOCAL STORAGE & PERSISTENCE

**Karar:** ✅ **Kombinasyon: SharedPreferences + Hive**

**Kullanım:**
- **SharedPreferences:** 
  * Auth tokens (access_token, refresh_token)
  * User preferences (theme, language)
  * Basit key-value data
  
- **Hive:**
  * İlanlar cache (offline mode için)
  * Favoriler listesi
  * Son aramalar
  * Karmaşık objeler

**Detay Cevapları:**
- **Cache gerekli mi?** Evet, özellikle İlanlar ve Duyurular
- **Offline mode:** Online-first (internet varsa API, yoksa cache)
- **Token güvenliği:** SharedPreferences + FlutterSecureStorage (sensitive data için)

**Örnek:**
```dart
// Token saklama (SharedPreferences)
await prefs.setString('access_token', token);

// İlanlar cache (Hive)
@HiveType(typeId: 0)
class Ad extends HiveObject {
  @HiveField(0)
  String id;
  @HiveField(1)
  String title;
  // ...
}
```

---

## 4️⃣ AUTHENTICATION FLOW

**Karar:** ✅ **JWT + Refresh Token**

**Sebep:**
- Backend zaten JWT + Refresh Token kullanıyor
- access_token: 7 gün
- refresh_token: 30 gün
- Auto-refresh mekanizması var (Dio interceptor)

**Detay Cevapları:**
- **Welcome flow:** Hayır, direkt OTP → Register → Ana sayfa
- **Biometric:** Hayır, v1.0'da değil (gelecek özellik)
- **Beni hatırla:** Evet, token varsa otomatik login
- **Token expire:** Auto-refresh (Dio interceptor ile)

**Flow:**
```
1. Phone Input → OTP Request
2. OTP Verify → temp_token (5 dk)
3. Register → access + refresh token
4. Token storage → Ana sayfa
5. Token expire (401) → Auto refresh → Retry request
6. Refresh fail → Logout → Login ekranı
```

---

## 5️⃣ API CLIENT PATTERN

**Karar:** ✅ **Dio** (HTTP client library, interceptor support)

**Sebep:**
- Interceptor desteği (JWT ekleme, refresh token)
- Timeout handling
- Error handling
- Form data (multipart upload)
- Backend'e tam uyumlu

**Detay Cevapları:**
- **Error handling:** Merkezi (Dio interceptor)
- **Retry logic:** Evet, 401 durumunda (refresh token ile)
- **Timeout:** 30 saniye
- **Base URL:**
  * Dev: `http://192.168.1.x:3000/v1`
  * Prod: `https://api.kadirliapp.com/v1`

**Örnek:**
```dart
final dio = Dio(BaseOptions(
  baseUrl: apiBaseUrl,
  connectTimeout: Duration(seconds: 30),
  receiveTimeout: Duration(seconds: 30),
));

dio.interceptors.add(AuthInterceptor()); // JWT + Refresh
dio.interceptors.add(ErrorInterceptor()); // Error handling
```

---

## 6️⃣ ERROR HANDLING & LOGGING

**Karar:** ✅ **Custom exception hierarchy + SnackBar**

**Sebep:**
- Maintainable (her error tipi için özel class)
- User-friendly mesajlar
- Developer için detaylı log

**Yapı:**
```dart
// Base exception
abstract class AppException implements Exception {
  final String message;
  final String? code;
  AppException(this.message, [this.code]);
}

// API exceptions
class NetworkException extends AppException {
  NetworkException() : super('İnternet bağlantısı yok');
}

class UnauthorizedException extends AppException {
  UnauthorizedException() : super('Oturum süresi doldu', '401');
}

class ServerException extends AppException {
  ServerException(String message) : super(message, '500');
}

class ValidationException extends AppException {
  ValidationException(String message) : super(message, '400');
}
```

**Detay Cevapları:**
- **User mesajları:** Basit ve anlaşılır (teknik detay yok)
- **Crash report:** Hayır, v1.0'da değil (gelecekte Firebase Crashlytics)
- **API errors:**
  * 401 → Auto refresh token
  * 403 → "Yetkiniz yok"
  * 404 → "Bulunamadı"
  * 500 → "Sunucu hatası, tekrar deneyin"
  * Network → "Bağlantı hatası"

**Kullanım:**
```dart
try {
  await adsRepository.getAds();
} on NetworkException catch (e) {
  showSnackBar(e.message);
} on UnauthorizedException {
  // Logout
  navigateToLogin();
} on ServerException catch (e) {
  showSnackBar('Bir hata oluştu: ${e.message}');
}
```

---

## 7️⃣ PUSH NOTIFICATIONS & REAL-TIME

**Karar:** ✅ **Evet, Firebase Cloud Messaging (FCM)**

**Sebep:**
- Backend FCM token kaydı hazır
- POST /v1/notifications/token endpoint var
- Duyurular, Kampanyalar için bildirim gerekli

**Detay Cevapları:**
- **Background notification:** Evet (FCM otomatik handle eder)
- **Local notification:** Evet (flutter_local_notifications)
- **Real-time update:** Hayır, polling yeter (v1.0)
- **WebSocket:** Hayır, gelecek özellik

**Setup:**
```dart
// FCM token al
final token = await FirebaseMessaging.instance.getToken();

// Backend'e gönder
await api.post('/notifications/token', {'token': token});

// Foreground message
FirebaseMessaging.onMessage.listen((message) {
  // Local notification göster
  showLocalNotification(message);
});

// Background/Terminated message
FirebaseMessaging.onMessageOpenedApp.listen((message) {
  // İlgili sayfaya yönlendir
  navigateToContent(message.data);
});
```

---

## 8️⃣ FEATURE PRIORITY & SCOPE

**Karar:** MVP v1.0 için öncelik sırası:

### Phase 1 (Hafta 1) - Temel
1. ✅ **Auth** (Login/Register/Logout) - KRİTİK
2. ✅ **Announcements** (Duyurular listesi + detay) - Önemli
3. ✅ **Ads** (İlan listesi + detay + favoriler) - Önemli
4. ✅ **Profile** (Kullanıcı profili + görüntüleme) - Önemli

### Phase 2 (Hafta 2) - İkincil
5. ✅ **Ads CRUD** (İlan ekleme/düzenleme/silme) - Önemli
6. ✅ **Deaths** (Vefat ilanları listesi + detay) - Orta
7. ✅ **Campaigns** (Kampanyalar listesi + detay) - Orta
8. ✅ **Search/Filter** (Arama + filtreleme) - Orta

### Phase 3 (Hafta 3) - Ek Özellikler
9. ✅ **Taxi** (Taksi listesi - sadece görüntüleme) - Düşük
10. ✅ **Pharmacy** (Nöbetçi eczane + takvim) - Düşük
11. ✅ **Events** (Etkinlikler listesi) - Düşük
12. ✅ **Guide** (Rehber - kategoriler) - Düşük

### Phase 4 (Hafta 4) - Polish
13. ✅ **Places** (Mekanlar + harita) - Düşük
14. ✅ **Transport** (Ulaşım bilgileri) - Düşük
15. ✅ **Jobs** (İş ilanları) - Düşük
16. ✅ **Notifications** (Bildirim listesi + ayarları) - Orta

**v1.0 Hedefi:** 16 modülün hepsi (4 hafta)

---

## 9️⃣ APP ARCHITECTURE & FOLDER STRUCTURE

**Karar:** ✅ **Feature-based** (Riverpod + Clean Architecture light)

**Sebep:**
- Modüller bağımsız (kolayca eklenip çıkarılabilir)
- Kod tekrarı azalır (shared widgets)
- Takım çalışmasına uygun

**Klasör Yapısı:**
```
lib/
├── main.dart
├── app.dart
│
├── core/
│   ├── constants/
│   │   ├── api_constants.dart
│   │   ├── app_colors.dart
│   │   ├── app_text_styles.dart
│   │   └── app_spacing.dart
│   ├── network/
│   │   ├── dio_client.dart
│   │   ├── api_interceptor.dart
│   │   └── api_response.dart
│   ├── storage/
│   │   ├── storage_service.dart
│   │   └── hive_service.dart
│   ├── exceptions/
│   │   ├── app_exception.dart
│   │   └── api_exceptions.dart
│   └── utils/
│       ├── validators.dart
│       ├── formatters.dart
│       └── date_utils.dart
│
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   └── datasources/
│   │   ├── presentation/
│   │   │   ├── pages/
│   │   │   ├── widgets/
│   │   │   └── providers/
│   │   └── domain/ (optional)
│   │
│   ├── announcements/
│   ├── ads/
│   ├── deaths/
│   ├── campaigns/
│   ├── profile/
│   └── ... (diğer modüller)
│
└── shared/
    ├── widgets/
    │   ├── app_button.dart
    │   ├── app_text_field.dart
    │   ├── loading_widget.dart
    │   ├── error_widget.dart
    │   └── empty_state_widget.dart
    ├── models/
    │   └── pagination_meta.dart
    └── providers/
        └── connectivity_provider.dart
```

**Detay Cevapları:**
- **Constants:** `core/constants/`
- **Utilities:** `core/utils/`
- **Shared widgets:** `shared/widgets/`
- **Base classes:** `core/` (BaseRepository, BaseProvider)

---

## 🔟 VERSION CONTROL & TESTING

**Karar:** ✅ **Şimdilik test yazmamalıyız** (sonraya bırak)

**Sebep:**
- MVP hızlı çıkmalı
- Backend/Admin zaten test edildi
- v2.0'da test coverage eklenebilir

**Ancak:**
- Kod kalitesi için linting eklenmeli (analysis_options.yaml)
- Git workflow: feature branch + PR (opsiyonel)

**Git Workflow:**
```
main (production)
  └── develop (development)
       ├── feature/auth
       ├── feature/ads
       └── feature/profile
```

**Commit Conventions:**
```
feat: add login screen
fix: resolve token refresh bug
refactor: improve ads list performance
style: format code
docs: update README
```

**Detay Cevapları:**
- **Test coverage:** v2.0'da (%50+ hedef)
- **Git workflow:** Feature branch (küçük ekip için yeterli)
- **Data sensitive:** Evet, tokens encrypted (FlutterSecureStorage)

---

## 1️⃣1️⃣ THIRD-PARTY SERVICES

**Karar:** ✅ Kullanılacak servisler:

### Zorunlu:
1. **Firebase Cloud Messaging (FCM)** - Push notifications
2. **Google Maps API** - Harita (Deaths, Places, Pharmacy)

### Opsiyonel (v2.0):
3. **Firebase Crashlytics** - Crash reporting
4. **Firebase Analytics** - Usage analytics
5. **Google Sign-In** - Social login

### Kullanılmayacak:
- ❌ Firebase Auth (backend JWT var)
- ❌ Firebase Firestore (backend PostgreSQL var)
- ❌ AdMob (reklam yok)

**Setup:**
```yaml
dependencies:
  firebase_core: ^2.24.2
  firebase_messaging: ^14.7.9
  flutter_local_notifications: ^16.3.0
  google_maps_flutter: ^2.5.0
```

---

## 1️⃣2️⃣ PERFORMANCE & OPTIMIZATION

**Karar:** ✅ Performans kriterleri:

### Startup Time:
- **Hedef:** 2-3 saniye içinde açılmalı (cold start)
- **Strateji:** 
  * Lazy loading (modüller gerektiğinde yüklensin)
  * Image cache (cached_network_image)
  * Token check async (splash screen sırasında)

### Network:
- **Assumption:** 4G/WiFi (ortalama hız)
- **Fallback:** 3G için düşük kalite görsel
- **Timeout:** 30 saniye

### Device Support:
- **Android:** Min SDK 21 (Android 5.0 - 2014)
- **iOS:** Min 12.0 (iPhone 5S ve üzeri)
- **Kapsam:** %95+ kullanıcı

### Image Handling:
- **Optimization:** Evet, mutlaka
- **Strategi:**
  * cached_network_image (cache + placeholder)
  * Thumbnail'ler göster (liste için)
  * Full image (detay için)
  * Upload'da resize (max 1920x1080)
  * Compression (80% kalite)

**Paketler:**
```yaml
dependencies:
  cached_network_image: ^3.3.0
  image_picker: ^1.0.5
  flutter_image_compress: ^2.1.0
```

---

## 📝 EK NOTLAR VE KARARLAR

### 1. Dil Desteği
- **v1.0:** Sadece Türkçe
- **v2.0:** İngilizce eklenebilir (i18n)

### 2. Analytics
- **v1.0:** Hayır
- **v2.0:** Firebase Analytics eklenecek

### 3. Splash Screen
- **Evet:** Logo + loading indicator
- **Süre:** Max 2 saniye (token check)

### 4. Onboarding
- **Hayır:** İlk açılışta tutorial yok
- **Sebep:** Basit UI, anlaşılır

### 5. Deep Linking
- **Hayır:** v1.0'da değil
- **v2.0:** Bildirimlerden içeriğe geçiş için

### 6. In-App Purchase
- **Hayır:** Uygulama ücretsiz

### 7. Social Share
- **Evet:** İlanlar paylaşılabilir (share_plus)

### 8. Biometric Auth
- **Hayır:** v1.0'da değil
- **v2.0:** Opsiyonel özellik

### 9. Multi-Language
- **Hayır:** Sadece Türkçe (v1.0)

### 10. Camera/Gallery
- **Evet:** İlan eklerken fotoğraf (image_picker)

---

## 🎯 ÖZET - KULLANILACAK PAKETLER

```yaml
name: kadirliapp
description: KadirliApp - Kadirli Şehir Platformu

dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_riverpod: ^2.4.0

  # HTTP Client
  dio: ^5.4.0

  # Storage
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  flutter_secure_storage: ^9.0.0

  # Firebase
  firebase_core: ^2.24.2
  firebase_messaging: ^14.7.9
  flutter_local_notifications: ^16.3.0

  # UI/Image
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  pull_to_refresh: ^2.0.0
  image_picker: ^1.0.5
  flutter_image_compress: ^2.1.0
  photo_view: ^0.14.0

  # Maps
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0

  # Utils
  intl: ^0.18.1
  url_launcher: ^6.2.2
  share_plus: ^7.2.1
  intl_phone_field: ^3.2.0
  sms_autofill: ^2.3.0

  # Date/Time
  table_calendar: ^3.0.9

  # Loading
  flutter_spinkit: ^5.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.7
  hive_generator: ^2.0.1
```

---

## 📋 GELİŞTİRME PLANI (4 HAFTA)

### Hafta 1: Temel (Auth + Core)
- [ ] Proje setup + dependencies
- [ ] Folder structure
- [ ] Dio client + interceptor
- [ ] Auth flow (OTP + Register)
- [ ] Storage service (SharedPreferences + Hive)
- [ ] Firebase FCM setup
- [ ] Ana sayfa skeleton

### Hafta 2: Ana Modüller
- [ ] Announcements (Liste + Detay)
- [ ] Ads (Liste + Detay + Favoriler)
- [ ] Deaths (Liste + Detay + Harita)
- [ ] Campaigns (Liste + Detay)
- [ ] Profile (Görüntüle + Düzenle)

### Hafta 3: CRUD + Diğer Modüller
- [ ] Ads CRUD (Ekle/Düzenle/Sil)
- [ ] Fotoğraf upload
- [ ] Search + Filter
- [ ] Taxi, Pharmacy, Events, Guide

### Hafta 4: Polish + Test
- [ ] Places, Transport, Jobs
- [ ] Notification listesi
- [ ] Error handling polish
- [ ] Performance optimization
- [ ] Manual testing
- [ ] Bug fixing

---

## ✅ SONUÇ

**v1.0 Hedefi:**
- 16 modül
- Android + iOS
- Material Design 3
- Riverpod + Dio
- FCM + Google Maps
- 4 hafta development

**Başlangıç:**
```bash
flutter create kadirliapp
cd kadirliapp
flutter pub add flutter_riverpod dio shared_preferences hive ...
flutter run
```

---

**Hazırlayan:** Senior Flutter Developer (AI-assisted)
**Tarih:** 24 Şubat 2026
**Versiyon:** 1.0
**Durum:** Production-ready decisions ✅
