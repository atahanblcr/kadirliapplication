# Firebase Cloud Messaging (FCM) - Kurulum Rehberi 🔥

> KadirliApp mobil uygulaması için Firebase setup adım adım
> **Tarih:** 25 Şubat 2026
> **Zorunlu mudur?** EVET - Push notifications için gerekli!

---

## 🎯 Neden Firebase?

- **Push Notifications:** Duyurular, kampanyalar, mesajlar
- **Backend FCM Token:** Kullanıcı FCM token'ı kaydediliyor (`POST /v1/notifications/token`)
- **Real-time:** Bildirimler anında gönderilir

---

## 📋 Yapılması Gerekenler (4 Adım)

### ✅ ADIM 1: Google Cloud Console'da Firebase Projesi Oluştur

1. **Google Cloud Console'a git:**
   ```
   https://console.cloud.google.com/
   ```

2. **Yeni proje oluştur:**
   - Sağ üst köşedeki dropdown'a tıkla
   - "NEW PROJECT" seç
   - **Project Name:** `KadirliApp-Mobile` (ya da istediğin isim)
   - **Location:** Turkey (Türkiye)
   - Create'e tıkla (2-3 dakika sürer)

3. **Firebase'ı etkinleştir:**
   - Sol sidebar'dan "APIs & Services" → "Library" seç
   - "Firebase" ara
   - **Firebase Realtime Database API** → Enable
   - **Firebase Messaging API** → Enable
   - **Firebase Cloud Messaging API** → Enable

---

### ✅ ADIM 2: Firebase Console'da Android & iOS Ayarla

#### 2A. Firebase Console'a Gir

```
https://console.firebase.google.com/
```

- Sağ üst köşe "+" → "Add Project"
- Yukarıda oluşturduğun Google Cloud projesi seç
- Finish'e tıkla

#### 2B. Android App Ekle

1. **Firebase Console'da:**
   - Proje seç → "Project Settings" (⚙️)
   - "General" tab'ında aşağıya scroll
   - "Your apps" başlığı altında "Add app"

2. **Android seç:**
   ```
   Android Package Name: com.kadirli.kadirliapp
   App nickname: KadirliApp (opsiyonel)
   SHA-1 certificate fingerprint: (aşağıya bak)
   ```

3. **SHA-1 Fingerprint Bul:**
   ```bash
   cd flutter-app/

   # macOS/Linux için:
   ./gradlew signingReport

   # Ya da:
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

   # SHA1 değerini kopyala (debug keystore'da bulunur)
   ```

4. **google-services.json İndir:**
   - Firebase Console'da "Download google-services.json"
   - **Nereye koy:** `flutter-app/android/app/google-services.json`

5. **Android build dosyalarını güncelle:**

   **flutter-app/android/build.gradle:**
   ```gradle
   buildscript {
     repositories {
       google()
       mavenCentral()
     }

     dependencies {
       classpath 'com.google.gms:google-services:4.4.0'  // ← Ekle
     }
   }
   ```

   **flutter-app/android/app/build.gradle (en sonda):**
   ```gradle
   apply plugin: 'com.google.gms.google-services'  // ← Ekle (en sonda!)
   ```

#### 2C. iOS App Ekle

1. **Firebase Console'da:**
   - "Add app" → iOS seç
   ```
   iOS Bundle ID: com.kadirli.kadirliapp
   App nickname: KadirliApp (opsiyonel)
   ```

2. **GoogleService-Info.plist İndir:**
   - Firebase Console → "Download GoogleService-Info.plist"
   - **Nereye koy:** `flutter-app/ios/Runner/GoogleService-Info.plist`

3. **Xcode'da Dosya Ekle:**
   ```
   ios/Runner.xcworkspace açılmalı (Runner.xcodeproj DEĞİL!)

   1. Xcode açıl: open ios/Runner.xcworkspace
   2. Runner projesine sağ tıkla → "Add Files to Runner"
   3. GoogleService-Info.plist seç
   4. "Copy items if needed" işaretle
   5. Add
   ```

---

### ✅ ADIM 3: Flutter'da Firebase'ı Başlat

#### 3A. FlutterFire Configure Çalıştır

```bash
cd flutter-app/

# Firebase CLI plugin yükle (ilk sefer)
flutter pub global activate flutterfire_cli

# Firebase yapılandır
flutterfire configure --platforms=android,ios
```

Bu komut:
- `lib/firebase_options.dart` oluşturur
- Android + iOS ayarlarını otomatik yapar

#### 3B. main.dart'da Firebase'ı Initialize Et

**flutter-app/lib/main.dart:**

```dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';  // ← Otomatik oluşturuldu

void main() async {
  // ✅ Firebase'ı başlat
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const KadirliApp());
}
```

#### 3C. Firebase Messaging'i Başlat

**flutter-app/lib/main.dart'da Firebase.initializeApp() sonrası ekle:**

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // ✅ FCM token al ve backend'e gönder
  final fcmToken = await FirebaseMessaging.instance.getToken();
  if (fcmToken != null) {
    // Backend API'ye token gönder
    // POST /v1/notifications/token { "token": fcmToken }
    debugPrint('FCM Token: $fcmToken');
  }

  // ✅ Notification permissions iste
  await FirebaseMessaging.instance.requestPermission(
    alert: true,
    announcement: false,
    badge: true,
    carryForwardNotificationSettings: true,
    criticalAlert: false,
    provisional: false,
    sound: true,
  );

  runApp(const KadirliApp());
}
```

---

### ✅ ADIM 4: Test Et

#### 4A. Android Test

```bash
flutter run --release
# veya emulator'da:
flutter run
```

**Kontrol:**
- Uygulama açılsın
- Hiç error olmasın
- FCM token print'lensin

#### 4B. iOS Test

```bash
# iOS build et
flutter build ios

# Xcode'da çalıştır
open ios/Runner.xcworkspace
# Sonra Play button basıp simulator'da çalıştır
```

#### 4C. Bildirim Test Gönder

**Firebase Console'dan:**
1. Proje seç
2. Sol sidebar → "Messaging"
3. "Create your first campaign"
4. "Send test notification"
5. Your App'ı seç
6. "Send"

**Sonuç:**
- Telefona notification gelsin
- Uygulamayı açar ve kapatırsa test et

---

## 🚨 Sık Sorunlar & Çözümler

### ❌ Problem: "google-services.json not found"

**Çözüm:**
```bash
# Dosya yolunu kontrol et
ls flutter-app/android/app/google-services.json

# Yok ise Firebase Console'dan tekrar indir
```

### ❌ Problem: "GoogleService-Info.plist not found"

**Çözüm:**
```bash
# Dosya yolunu kontrol et
ls flutter-app/ios/Runner/GoogleService-Info.plist

# Yok ise Firebase Console'dan tekrar indir
# Xcode'da bundle resources'a ekle
```

### ❌ Problem: "FlutterFire not configured"

**Çözüm:**
```bash
flutterfire configure --platforms=android,ios
```

### ❌ Problem: "FirebaseException: [firebase_core/no-app]"

**Çözüm:**
main.dart'da `Firebase.initializeApp()` call'ı ekle:
```dart
await Firebase.initializeApp(
  options: DefaultFirebaseOptions.currentPlatform,
);
```

### ❌ Problem: "SHA-1 fingerprint not found"

**Çözüm:**
```bash
cd flutter-app/

# Debug keystore SHA-1:
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Copy SHA1 değerini Firebase Console'da Android app settings'e yapıştır
```

---

## 📝 Checklist - Firebase Setup Tamamlandı mı?

- [ ] Google Cloud Console'da Firebase projesi oluşturuldu
- [ ] Android app eklendi (google-services.json indirildi)
- [ ] iOS app eklendi (GoogleService-Info.plist indirildi)
- [ ] google-services.json → flutter-app/android/app/ içinde
- [ ] GoogleService-Info.plist → flutter-app/ios/Runner/ içinde
- [ ] android/build.gradle güncellendi
- [ ] android/app/build.gradle güncellendi
- [ ] Xcode'da GoogleService-Info.plist Bundle Resources'a eklendi
- [ ] `flutterfire configure --platforms=android,ios` çalıştırıldı
- [ ] lib/firebase_options.dart oluşturuldu
- [ ] main.dart'da `Firebase.initializeApp()` eklendi
- [ ] main.dart'da FCM permissions istendi
- [ ] `flutter run` hatasız çalışıyor
- [ ] Bildirim test gönderimi başarılı

---

## 🔗 Sonraki Adımlar (Auth Module Yazımı)

Firebase setup tamamlandıktan sonra:

1. **Auth module** yazılacak:
   - `/features/auth/presentation/pages/` → OTP, Register sayfası
   - `/features/auth/data/repositories/` → AuthRepository
   - `/features/auth/presentation/providers/` → authProvider (Riverpod)

2. **FCM Token → Backend gönderme:**
   - main.dart'da FCM token al
   - `/v1/notifications/token` endpoint'ine gönder
   - Token storage'a kaydet

3. **Notification listeners:**
   - Ön plan bildirim: flutter_local_notifications
   - Arka plan bildirim: Firebase FCM handler
   - Terminated app: Deep linking (v2.0)

---

## 📚 Kaynaklar

- [Firebase Console](https://console.firebase.google.com/)
- [FlutterFire Documentation](https://firebase.flutter.dev/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Flutter Firebase Setup](https://docs.flutter.dev/development/packages-and-plugins/using-packages)

---

## 💬 Yardım Gerekiyorsa

1. **FlutterFire docs:** https://firebase.flutter.dev/docs/messaging/overview/
2. **Stack Overflow:** Firebase + Flutter
3. **GitHub Issues:** firebase-flutter
4. **Firebase Support:** https://support.google.com/firebase/

---

**Status:** ✅ Ready to Setup
**Duration:** 15-30 dakika
**Zorunlu mu?** EVET - Bildirimler için

**Sonra:** Auth module yazımı başlayabilir! 🚀

---

**Version:** 1.0
**Last Updated:** 25 Şubat 2026
