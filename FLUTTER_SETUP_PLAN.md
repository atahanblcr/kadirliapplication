# Flutter Mobile App - Setup Plan & Roadmap 📱

> KadirliApp Flutter uygulaması kurulum ve geliştirme planı
> **Tarih:** 25 Şubat 2026
> **Status:** ✅ Setup Tamamlandı - Kod Yazımı Hazır

---

## ✅ YAPILAN İŞLER (Setup Phase)

### 1. Dosya Yapısı Oluşturuldu ✅
```
flutter-app/
├── lib/
│   ├── main.dart + app.dart (root widgets)
│   ├── core/
│   │   ├── constants/ (4 dosya: API, Colors, Spacing, TextStyles)
│   │   ├── network/ (3 dosya: dio_client, api_response)
│   │   ├── storage/ (1 dosya: storage_service)
│   │   ├── exceptions/ (1 dosya: app_exception + 8 exception classes)
│   │   └── utils/ (1 dosya: validators)
│   ├── features/ (16 modül klasörü - empty structure ready)
│   ├── shared/ (widgets, models, providers klasörleri ready)
│   └── assets/ (images, icons, animations, fonts klasörleri)
├── pubspec.yaml ✅
├── analysis_options.yaml ✅
├── .gitignore ✅
└── README.md ✅
```

**Önceden Oluşturulan Dosyalar:**
- ✅ `pubspec.yaml` - 30+ paket tanımlanmış
- ✅ `lib/main.dart` - Entry point
- ✅ `lib/app.dart` - Root MaterialApp
- ✅ `lib/core/constants/` - 4 sabit dosya (API, Colors, Spacing, Typography)
- ✅ `lib/core/network/` - DioClient, ApiResponse modelleri
- ✅ `lib/core/storage/` - SharedPreferences wrapper
- ✅ `lib/core/exceptions/` - 8 custom exception class'ı
- ✅ `lib/core/utils/validators.dart` - Form validation
- ✅ `lib/shared/widgets/app_button.dart` - Reusable button component
- ✅ `analysis_options.yaml` - Linting kuralları
- ✅ `.gitignore` - Flutter ignore patterns
- ✅ `README.md` - Project documentation

---

## ⚠️ YAPILMASI GEREKENLER (Kurulum Aşaması)

### 1. Proje Başlatma (Terminal'de yapacaksın)

```bash
cd /Users/atahanblcr/Desktop/kadirliapp/flutter-app

# Paketleri indir
flutter pub get

# Code generation (Riverpod + Hive generators)
dart run build_runner build --delete-conflicting-outputs

# App'i test et
flutter run
```

**Beklenen Sonuç:**
- Boş ekranda "KadirliApp - Coming Soon" yazısı görülmeli
- Hata olmamalı

### 2. Firebase Setup (MUTLAKA YAP!) 🔥

**Android Setup:**
```bash
# 1. Google Cloud Console'a git
# https://console.cloud.google.com/

# 2. Firebase proje oluştur (KadirliApp-Mobile)

# 3. Firebase Console'dan google-services.json indir
# https://console.firebase.google.com/project/[project-id]/settings/general

# 4. Dosyayı koy:
# flutter-app/android/app/google-services.json

# 5. android/build.gradle'a ekle:
dependencies {
  classpath 'com.google.gms:google-services:4.4.0'
}

# 6. android/app/build.gradle'a ekle:
apply plugin: 'com.google.gms.google-services'
```

**iOS Setup:**
```bash
# 1. Firebase Console'dan GoogleService-Info.plist indir

# 2. Dosyayı koy:
# flutter-app/ios/Runner/GoogleService-Info.plist

# 3. Xcode'da projeye ekle:
# ios/Runner.xcworkspace açılmalı (Runner.xcodeproj değil!)
# Runner > Build Phases > Copy Bundle Resources'a ekle
```

**Sonraki Adım - Firebase Enable:**
```dart
// lib/main.dart'da bu satırı aktif et:
// await Firebase.initializeApp();

// Bunun için:
// 1. Firebase init komutu çalıştır:
flutterfire configure --platforms=android,ios

// 2. main.dart'da uncomment yap
```

### 3. Assets Klasörü Hazırla

```bash
# Şu klasörleri oluştur (boş kalabilirler şimdi):
# flutter-app/assets/
# ├── images/          (App görselleri)
# ├── icons/           (Custom ikonlar)
# ├── animations/      (Lottie JSON dosyaları)
# └── fonts/           (Poppins font dosyaları - pubspec.yaml'da tanımlandı)

# Not: Fonts pubspec.yaml'da zaten tanımlandı:
# fonts:
#   - family: Poppins
#     fonts:
#       - asset: assets/fonts/Poppins-Regular.ttf
#       - asset: assets/fonts/Poppins-Medium.ttf (weight: 500)
#       - asset: assets/fonts/Poppins-Bold.ttf (weight: 700)
```

### 4. .gitignore Kontrol

- ✅ Zaten yapıldı (`flutter-app/.gitignore`)
- Büyük dosyaları commit yapmaz

---

## 📝 KOD YAZIMINA BAŞLAMADAN ÖNCEKİ KONTROL LİSTESİ

### Backend Entegrasyonu
- [ ] Backend API'nin `/v1` endpoint'leri çalışıyor mu?
  - `GET /v1/` → API doc endpoint'i kontrol et
  - `POST /v1/auth/otp/request` → Test et

- [ ] `DioClient` base URL doğru mu?
  - Development: `http://192.168.1.x:3000/v1` (kendi IP'ni yaz)
  - Production: `https://api.kadirliapp.com/v1`

- [ ] Backend response format: ApiResponse standardına uyuyor mu?
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "timestamp": "..." }
  }
  ```

### Flutter Yapısı
- [ ] `flutter doctor` çıktısında ✓ mü?
- [ ] `flutter pub get` başarılı mı?
- [ ] `dart run build_runner build` başarılı mı?
- [ ] `flutter run` hatasız çalışıyor mu?

### Firebase
- [ ] Google Cloud proje oluşturuldu mu?
- [ ] `google-services.json` Android klasörüne koyuldu mu?
- [ ] `GoogleService-Info.plist` iOS klasörüne koyuldu mu?
- [ ] `flutterfire configure` çalıştırıldı mı?
- [ ] `main.dart`'da `Firebase.initializeApp()` aktif mi?

---

## 🚀 KOD YAZIM BAŞLANGICI

### Sıra Önemli!
Bu sırada yapılması gerekiyor:

**Phase 1 - Hafta 1 (Temel Altyapı)**

1. **Auth Module** (Kritik - önce bu!)
   - `/features/auth/data/models/` - Models oluştur
   - `/features/auth/data/repositories/` - AuthRepository
   - `/features/auth/presentation/providers/` - authProvider (Riverpod)
   - `/features/auth/presentation/pages/` - OTP, Register sayfaları
   - **Yapı:** OTP Request → OTP Verify → Register → Store tokens

2. **Announcements Module** (Temel)
   - List page (boş sayfa şekli)
   - Detail page (skeleton)
   - Repository + Provider

3. **Ads Module** (Temel)
   - List page (Grid/List)
   - Detail page
   - Favorites feature
   - Repository + Provider

4. **Core Interceptors** (Paralel)
   - AuthInterceptor (JWT token ekleme)
   - ErrorInterceptor (401, 403 handling)
   - LoggingInterceptor (debug)

5. **Storage & Preferences**
   - StorageService kullanarak Token storage
   - User preferences (theme, language)

---

## 📊 Geliştirme Takvimi (4 Hafta)

### Hafta 1: Foundation
```
Day 1-2: Auth module (OTP + Register + Login flow)
Day 3: Announcements module (List + Detail)
Day 4: Ads module (List + Detail + Favorites)
Day 5: Core interceptors + Error handling
```

### Hafta 2: Core Modules
```
Day 1-2: Deaths module
Day 3: Campaigns module
Day 4: Profile module
Day 5: Search & Filter
```

### Hafta 3: Extended
```
Day 1: Ads CRUD (Create/Update/Delete)
Day 2: Photo upload + Image handling
Day 3: Taxi, Pharmacy modules
Day 4: Events, Guide modules
Day 5: Integration testing
```

### Hafta 4: Final
```
Day 1-2: Places, Transport, Jobs modules
Day 3: Notifications module
Day 4: Polish + Error handling improvements
Day 5: Manual testing + Release prep
```

---

## 🛠️ Hızlı Komut Referansı

```bash
# Proje klasöründe (flutter-app/)

# Paketleri güncelle
flutter pub get

# Code generation
dart run build_runner build --delete-conflicting-outputs

# Specific generator
dart run build_runner build --delete-conflicting-outputs

# Linting kontrol
dart analyze

# Format kodu
dart format lib/

# App çalıştır
flutter run

# Release build
flutter build apk --release
flutter build ipa --release

# Clean & rebuild
flutter clean
flutter pub get
dart run build_runner build --delete-conflicting-outputs
```

---

## 📚 Kullanılacak Patterns & Best Practices

### 1. Riverpod State Management
```dart
// Provider örneği
final adsProvider = FutureProvider.autoDispose<List<Ad>>((ref) async {
  return ref.read(adsRepositoryProvider).getAds();
});

// Widget'ta kullanım
@override
Widget build(BuildContext context, WidgetRef ref) {
  final ads = ref.watch(adsProvider);
  return ads.when(
    data: (ads) => AdsListView(ads: ads),
    loading: () => LoadingWidget(),
    error: (err, stack) => ErrorWidget(error: err.toString()),
  );
}
```

### 2. Repository Pattern
```dart
// Interface
abstract class AdsRepository {
  Future<List<Ad>> getAds();
  Future<Ad> getAdDetail(String id);
  Future<void> createAd(Ad ad);
}

// Implementation
class AdsRepositoryImpl implements AdsRepository {
  final DioClient dioClient;

  @override
  Future<List<Ad>> getAds() async {
    try {
      final response = await dioClient.get('/ads');
      // Handle response
    } on NetworkException {
      // Handle error
    }
  }
}
```

### 3. Exception Handling
```dart
try {
  await repository.getAds();
} on NetworkException catch (e) {
  showSnackBar(e.message);
} on UnauthorizedException {
  navigateToLogin();
} on ServerException catch (e) {
  showSnackBar('Sunucu hatası: ${e.message}');
}
```

---

## 🎯 Başarı Kriterleri

Her modül tamamlandığında:

- [ ] Sayfa render oluyor
- [ ] API'ye bağlanıyor (Mock data OK)
- [ ] Hata handling var (SnackBar mesajları)
- [ ] Loading state gösteriliyor
- [ ] Empty state gösteriliyor
- [ ] Code format doğru (dart format)
- [ ] Lint hataları yok (dart analyze)
- [ ] Git commit yapıldı (`feat: add [module]`)

---

## 📞 Karşılaştığın Sorunlar

### Common Issues & Solutions

**Issue:** `flutter pub get` hata veriyorsa
```bash
flutter clean
flutter pub get
```

**Issue:** Build runner error'u
```bash
flutter clean
dart run build_runner clean
dart run build_runner build --delete-conflicting-outputs
```

**Issue:** Firebase setup hatası
```
→ flutterfire configure --platforms=android,ios komutu çalıştır
→ Main.dart'da Firebase.initializeApp() aktif et
```

**Issue:** DioClient 401 response veriyor
```
→ AuthInterceptor henüz yazılmadı
→ Token storage kontrol et
→ Backend'de token verification kontrol et
```

---

## 📋 ÖZET: KOD YAZIMINA BAŞLAMA

### Hemen Yapılacaklar (Bu Hafta)
1. ✅ Proje klasörü yapısı oluşturuldu
2. ✅ pubspec.yaml tüm paketlerle hazır
3. ✅ Core classes hazır (Constants, Exceptions, Storage, Validators)
4. ✅ README.md ve bu plan yazıldı
5. **TODO:** `flutter pub get` çalıştır
6. **TODO:** Firebase setup yap
7. **TODO:** `flutter run` test et

### Kod Yazımına Başlama (Phase 1)
1. **Auth module** yazılacak (OTP + Register)
2. **Announcements module** yazılacak
3. **Ads module** yazılacak
4. **Core interceptors** yazılacak

### Bağımlılıklar
- Backend API `/v1` endpoint'leri çalışıyor ✅ (Backend tamamlandı)
- Firebase Cloud Console hesabı ✅
- Flutter SDK 3.13+ ✅

---

## 🎓 Notlar

- **Hive:** ORM değil, hızlı local DB. Offline cache için kullan.
- **Riverpod:** Modern Provider. compile-time safe, test-friendly.
- **Dio:** Interceptor desteği var. Auth + Error handling merkezi yapılabilir.
- **SharedPreferences:** Tokens burada tut. Hive'da kompleks objeler.

---

**Sonraki Adım:**
Kurulum işlemlerini bitirdikten sonra (Flutter pub get, Firebase setup), Başka modele kod yazım phase'i başlat! 🚀

---

**Version:** 1.0
**Last Updated:** 25 Şubat 2026
**Status:** ✅ Setup Complete - Ready for Coding
