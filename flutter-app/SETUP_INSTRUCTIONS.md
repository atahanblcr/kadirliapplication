# Flutter App - Setup Talimatları ✅

> KadirliApp Flutter uygulaması kurulum ve başlama adımları
> **Status:** Ready for Firebase Setup + Auth Module Coding

---

## ✅ Şu Ana Kadar Yapılan

### 1. Proje Yapısı Oluşturuldu ✅
```
flutter-app/
├── android/              (Native Android files - hazır)
├── ios/                  (Native iOS files - hazır)
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/            (API, Colors, Spacing, Exceptions, Storage, Validators)
│   ├── features/        (16 modül - empty structure)
│   └── shared/          (Reusable widgets)
├── pubspec.yaml         (30+ paket tanımlı)
├── analysis_options.yaml
└── .gitignore
```

### 2. Paketler İndirildi ✅
- ✅ flutter_riverpod (State Management)
- ✅ dio (HTTP Client)
- ✅ firebase_core + firebase_messaging (Notifications)
- ✅ hive + shared_preferences (Storage)
- ✅ google_maps_flutter (Maps)
- ✅ 20+ diğer paket

### 3. Core Dosyalar Yazıldı ✅
- ✅ API Constants
- ✅ App Colors, Spacing, TextStyles
- ✅ Exception Classes (8 adet)
- ✅ DioClient (HTTP wrapper)
- ✅ StorageService (Token + Preferences)
- ✅ Validators (Email, Phone, OTP, Password vb.)
- ✅ AppButton widget

---

## 🚀 ŞIMDI NE YAPMAN GEREKIYOR?

### ADIM 1: Firebase Setup (25-30 dakika)

```bash
cd /Users/atahanblcr/Desktop/kadirliapp
```

**Detaylı rehber:** `/Users/atahanblcr/Desktop/kadirliapp/FIREBASE_SETUP_GUIDE.md`

Yapılacaklar:
1. Google Cloud Console'da Firebase projesi oluştur
2. Android app ekle (google-services.json indir)
3. iOS app ekle (GoogleService-Info.plist indir)
4. Dosyaları doğru yere koy:
   - `google-services.json` → `flutter-app/android/app/`
   - `GoogleService-Info.plist` → `flutter-app/ios/Runner/`
5. `flutterfire configure --platforms=android,ios` çalıştır
6. `main.dart`'da Firebase.initializeApp() aktif et

**Test:**
```bash
flutter run
# Uygulamayı aç → FCM token print'lenecek
```

---

### ADIM 2: Auth Module Kod Yazımı (Başka Modele)

Firebase setup tamamlandığında, başka modele şunu söyle:

> "Firebase setup'ı tamamladım. Şimdi Auth Module (OTP + Register) yazabilirsin."

---

## 📋 Kontrol Listesi (Firebase Setup)

### Before Firebase Setup
- [x] Flutter proje struktur oluşturuldu
- [x] pubspec.yaml tüm dependencies'yle hazır
- [x] Core dosyaları yazıldı
- [x] `flutter pub get` başarılı
- [x] android/ ve ios/ klasörleri hazır

### During Firebase Setup
- [ ] Google Cloud Console'da Firebase projesi
- [ ] Android app eklendi (SHA-1 fingerprint)
- [ ] iOS app eklendi
- [ ] google-services.json indirildi
- [ ] GoogleService-Info.plist indirildi
- [ ] android/build.gradle güncelllendi
- [ ] android/app/build.gradle güncellendi
- [ ] Xcode'da GoogleService-Info.plist eklendi
- [ ] `flutterfire configure` çalıştırıldı

### After Firebase Setup
- [ ] lib/firebase_options.dart oluşturuldu
- [ ] main.dart'da Firebase.initializeApp() eklendi
- [ ] main.dart'da FCM permissions istendi
- [ ] `flutter run` hatasız çalışıyor
- [ ] FCM token print'lenecek
- [ ] Bildirim test gönderimi çalışıyor

---

## 📁 Önemli Dosyalar

| Dosya | Amaç |
|-------|------|
| `FIREBASE_SETUP_GUIDE.md` | Firebase kurulum adım adım |
| `FLUTTER_SETUP_PLAN.md` | Genel kurulum + development plan |
| `README.md` | Proje dokumentasyonu |
| `pubspec.yaml` | Dependencies |
| `lib/main.dart` | Entry point (Firebase init burada) |

---

## 🔗 Git Workflow

### Firebase Setup'tan Sonra
```bash
cd flutter-app/
git add .
git commit -m "setup: firebase cloud messaging configured"
git push origin main
```

### Auth Module Yazarken
```bash
git checkout -b feature/auth
# ... code ...
git add lib/features/auth
git commit -m "feat: add auth module with OTP and registration"
git push origin feature/auth
# PR oluştur
```

---

## 🎯 Sonraki Aşamalar (4 Hafta)

### Hafta 1: Foundation
- [x] Setup ✅
- [ ] **Auth module** (OTP + Register)
- [ ] **Announcements** (List + Detail)
- [ ] **Ads** (List + Detail + Favorites)

### Hafta 2: Core Features
- [ ] Deaths module
- [ ] Campaigns module
- [ ] Profile module
- [ ] Search & Filter

### Hafta 3: Extended
- [ ] Ads CRUD
- [ ] Photo upload
- [ ] Taxi, Pharmacy, Events, Guide

### Hafta 4: Final
- [ ] Places, Transport, Jobs
- [ ] Notifications
- [ ] Polish + Testing

---

## ⚠️ Önemli Notlar

1. **API Base URL**: `lib/core/constants/api_constants.dart`
   - Dev: `http://192.168.1.x:3000/v1` (kendi IP'ni yaz)
   - Prod: `https://api.kadirliapp.com/v1`

2. **FCM Token Backend'e Gönderme**:
   - `POST /v1/notifications/token { "token": fcmToken }`
   - main.dart'da yapılacak

3. **Architecture**: Feature-based + Riverpod
   - Her modül: `lib/features/[modul]/{data, presentation}`

4. **Storage**:
   - Tokens → SharedPreferences
   - Cache → Hive
   - Sensitive → FlutterSecureStorage

---

## 🆘 Problem Yaşarsan

1. **Lint hataları görüyorsan:**
   ```bash
   dart analyze  # Kontrol et
   dart format lib/  # Format et
   ```

2. **Paket problemi:**
   ```bash
   flutter clean
   flutter pub get
   ```

3. **Firebase error'u:**
   - FIREBASE_SETUP_GUIDE.md'deki "Sık Sorunlar" bölümüne bak

4. **Build error'u:**
   ```bash
   flutter clean
   flutter pub get
   dart run build_runner build --delete-conflicting-outputs
   ```

---

## 📞 Özet

**Şu anda:** Setup tamamlandı ✅
**Yapılması gereken:** Firebase setup (sen yapacaksın)
**Sonra:** Auth module kod yazımı (başka modele yazılacak)
**Timeline:** 25-30 dakika Firebase + 1 hafta Auth module

---

**Status:** ✅ Ready for Firebase Setup
**Date:** 25 Şubat 2026
**Next:** Firebase Setup Guide'ı oku → Apply et

Başarılar! 🚀

---

*Questions?* Bak: `FIREBASE_SETUP_GUIDE.md`
