# iOS Firebase Setup - Xcode Manuel Adımları 🍎

> GoogleService-Info.plist'i Xcode projesine ekleme
> **Not:** Terminal'de yapılamaz, elle Xcode'da yapılmalı

---

## ✅ Adım 1: Xcode Projesini Aç

```bash
cd flutter-app/ios/
open Runner.xcworkspace
# UYARI: Runner.xcodeproj değil, Runner.xcworkspace açmalı!
```

---

## ✅ Adım 2: GoogleService-Info.plist'i Bundle Resources'a Ekle

1. **Xcode'da sol sidebar'dan "Runner" seç** (proje kökü)

2. **"Runner" targets seç** (mavi ikonik proje)

3. **"Build Phases" tab'ına git**

4. **"Copy Bundle Resources" bölümünü aç** (▶ ile)

5. **"+" button'a tıkla** (yeni file eklemek için)

6. **GoogleService-Info.plist dosyasını seç:**
   - `flutter-app/ios/Runner/GoogleService-Info.plist`
   - **"Add" button'a tıkla**

**Sonuç:** GoogleService-Info.plist "Copy Bundle Resources" listesinde görülmeli

---

## ✅ Adım 3: Podfile Konfigürasyonu (Opsiyonel)

Flutter sırasında otomatik yapılırsa bu adım gerekli değil. Ama manuel kontrol edelim:

**flutter-app/ios/Podfile dosyasını aç:**

```ruby
# Pod özelliklerini kontrol et:
platform :ios, '12.0'  # Minimum iOS 12.0

post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
  end
end
```

---

## ✅ Adım 4: Runner Info.plist Kontrol

`flutter-app/ios/Runner/Info.plist` dosyasında şunlar olmalı:

```xml
<key>FirebaseAppDelegateProxyEnabled</key>
<false/>
```

Bu, Flutter'ın Firebase'ı kontrol etmesini sağlar (Xcode'un değil).

---

## ✅ Adım 5: Build ve Run

```bash
flutter run -d iPhone
# Ya da Xcode'da Play button basıp çalıştır
```

---

## 🧪 Test Et

Uygulamayı başlat ve şunu kontrol et:

1. **Notification permission dialog çıktı mı?**
   - "Allow" (İzin ver)

2. **Xcode console'da log görünüyor mu?**
   ```
   FCM Token: ey...xyz
   ```

3. **Hata yok mu?**
   - Firebase initialization failed hatası yok mu?

---

## ❌ Sorun Yaşarsan

### Problem: "GoogleService-Info.plist not found"

**Çözüm:**
- Dosyayı ios/Runner/ içinde kontrol et
- Xcode'da Bundle Resources'a ekle

### Problem: Firebase initialization failed

**Çözüm:**
- Info.plist'te `FirebaseAppDelegateProxyEnabled = false` var mı?
- Podfile düzgün mü?

### Problem: Notification permission dialog çıkmıyor

**Çözüm:**
- Simülatörü reset et: Device → Erase All Content and Settings
- Yeniden çalıştır

---

**Status:** ✅ iOS Firebase Ready
