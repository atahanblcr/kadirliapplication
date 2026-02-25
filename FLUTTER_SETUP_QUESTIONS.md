# Flutter Mobile App - Karar Soruları 📱

> Bu dosya KadirliApp Flutter uygulamasının yapısını belirlemek için tasarlandı.
> Lütfen tüm soruları cevapla. Böylece mobile app'i tam aklındaki gibi yapabilirim.

---

## 1️⃣ UI/UX FRAMEWORK

**Soru:** Flutter uygulamasında hangi design pattern'i kullanmalıyız?

- [ ] **Material Design 3** (Material 3 latest)
- [ ] **Cupertino** (iOS native style)
- [ ] **Custom Design** (özel tasarım)
- [ ] **Material + Custom hybrid**

**Detay soruları:**
- Başlangıçta Mobile-first mi, Web-responsive olmalı mı?
- Dark mode desteği gerekli mi?
- Hedef cihazlar: Android + iOS mi, yoksa sadece biri mi?

---

## 2️⃣ STATE MANAGEMENT

**Soru:** Durum yönetimi için hangi paketi tercih edersin?

- [ ] **Provider** (Recommended, simple)
- [ ] **Riverpod** (Modern, Provider'ın successor'u)
- [ ] **GetX** (All-in-one, route management + DI)
- [ ] **Redux / BLoC** (Enterprise-level)
- [ ] **MobX** (Reactive)

**Detay soruları:**
- Uygulamanın karmaşıklığı için hangi level uygun?
- API state (loading, success, error) nasıl yönetilmeli?
- Global state (auth, notifications) nasıl tutulacak?

---

## 3️⃣ LOCAL STORAGE & PERSISTENCE

**Soru:** Yerel veri depolaması için hangi yöntem kullanılmalı?

- [ ] **SharedPreferences** (Basit key-value, küçük veri)
- [ ] **Hive** (Benzersiz/kolektif, hızlı)
- [ ] **SQLite** (Yapılandırılmış veri, relational)
- [ ] **Firebase Firestore** (Cloud-synced)
- [ ] **Kombinasyon** (SharedPreferences + Hive/SQLite)

**Detay soruları:**
- İlanlar, duyurular vb. yerel cache lazım mı?
- Offline mode desteği gerekli mi (online-first vs offline-first)?
- User credentials/tokens nasıl güvenli tutulmalı?

---

## 4️⃣ AUTHENTICATION FLOW

**Soru:** Auth flow'u nasıl implementasyon istiyorsun?

- [ ] **JWT Token Only** (access token ile gir)
- [ ] **JWT + Refresh Token** (access short-lived, refresh ile renew)
- [ ] **Session-based** (server-side session)
- [ ] **Firebase Auth** (Google/Apple sign-in)
- [ ] **Kombinasyon** (JWT + Firebase)

**Detay soruları:**
- Login/Register ekranlarından sonra welcome flow mu?
- Biometric (fingerprint) support gerekli mi?
- "Beni hatırla" / otomatik login lazım mı?
- Token expire olunca ne yapmalı (auto-refresh vs re-login)?

---

## 5️⃣ API CLIENT PATTERN

**Soru:** Backend API'ye bağlanma pattern'i?

- [ ] **Dio** (HTTP client library, interceptor support)
- [ ] **http** (Standart Dart library)
- [ ] **Chopper** (Code generation based)
- [ ] **Custom wrapper** (Provider + http)

**Detay soruları:**
- Error handling merkezi mi (interceptor)?
- Retry logic gerekli mi (network hatalarında)?
- Request timeout değeri kaç olmalı?
- API base URL prod/dev ne olmalı?

---

## 6️⃣ ERROR HANDLING & LOGGING

**Soru:** Hata yönetimi stratejisi?

- [ ] **Simple try-catch + SnackBar** (lightweight)
- [ ] **Custom exception hierarchy** (maintainable)
- [ ] **Result/Either pattern** (functional)
- [ ] **Firebase Crashlytics** (remote logging)
- [ ] **Custom logging service** (local logs)

**Detay soruları:**
- Kullanıcıya hata mesajları ne kadar detail gösterilmeli?
- App crash olunca crash report gönderilmeli mi?
- API error'larını nasıl handle etmeliyiz (401, 403, 500)?

---

## 7️⃣ PUSH NOTIFICATIONS & REAL-TIME

**Soru:** Bildirim sistemi gerekli mi?

- [ ] **Evet, Firebase Cloud Messaging (FCM)**
- [ ] **Evet, custom WebSocket**
- [ ] **Hayır, şimdilik polling ile yetinelim**
- [ ] **Sonraki phase'e erteleme**

**Detay soruları (Evet ise):**
- Background notification handling lazım mı?
- Local notification (içi cihazda) gerekli mi?
- Real-time update (WebSocket) gerekli mi?

---

## 8️⃣ FEATURE PRIORITY & SCOPE

**Soru:** İlk MVP'de hangi modülleri implement etmeliyiz?

Öncelik sırası (1=en önemli):

- [ ] **Auth** (Login/Register/Logout)
- [ ] **Announcements** (Duyurular listesi)
- [ ] **Ads** (İlan listesi, detay, kontakt)
- [ ] **Profile** (Kullanıcı profili, düzenleme)
- [ ] **Favorites** (Favoriler/Kaydedilenler)
- [ ] **Search/Filter** (Arama ve filtreleme)
- [ ] **Map** (Harita view)
- [ ] **Categories** (Kategoriye göre browsing)
- [ ] **Notifications** (Bildirimler)
- [ ] **User Posts** (Kendi ilanlarım)

**Detay soru:**
- v1.0'da kaçıncı versiyona gelmek istiyorsun? (kaç modül?)

---

## 9️⃣ APP ARCHITECTURE & FOLDER STRUCTURE

**Soru:** Proje klasör yapısı nasıl olmalı?

- [ ] **Feature-based** (lib/features/auth/, lib/features/ads/, vb.)
- [ ] **Layer-based** (lib/presentation/, lib/domain/, lib/data/)
- [ ] **Modular** (packages/)
- [ ] **Clean Architecture** (SOLID principles)

**Detay soru:**
- Constants, utilities, widgets'lar nereye koymalı?
- Shared code (base classes) nasıl organize edilmeli?

---

## 🔟 VERSION CONTROL & TESTING

**Soru:** Test coverage ve CI/CD stratejisi?

- [ ] **Unit tests** (%80+ coverage hedefi)
- [ ] **Integration tests** (API mock'ları ile)
- [ ] **Widget tests** (UI component tests)
- [ ] **E2E tests** (Cihazda gerçek test)
- [ ] **Şimdilik test yazmamalıyız** (sonraya bırak)

**Detay soruları:**
- Git workflow: feature branch + PR mi?
- Commit message conventions neler?
- Veri sensitive mi (encryption lazım mı)?

---

## 1️⃣1️⃣ THIRD-PARTY SERVICES

**Soru:** Hangi external service'ler kullanılmalı?

- [ ] **Firebase** (Auth, Analytics, Crashlytics)
- [ ] **Google Maps API** (Harita)
- [ ] **Şimdilik backend API yeter**
- [ ] **Diğer:** ___________

---

## 1️⃣2️⃣ PERFORMANCE & OPTIMIZATION

**Soru:** Performans kriterleri?

- [ ] **App startup time:** Kaç saniye içinde açılmalı?
- [ ] **Network:** 4G/WiFi hızını assume edelim
- [ ] **Device support:** Min SDK version kaç? (API 21+, iOS 11.0+?)
- [ ] **Image handling:** Optimize edilmeli mi (compression, caching)?

---

## 📝 OPSIYONEL NOTLAR

Başka bir şey söylemek istiyorsan buraya yaz:

```
(Buraya yazabilirsin)
```

---

**Sonraki Adım:**
Tüm soruları cevapladıktan sonra:
1. Bu dosyayı `/FLUTTER_RESPONSES.md` olarak kaydedip cevapları yazacaksın
2. Ben bunu okuyacağım
3. Doğru planning ile mobile app'i yazacağım ✅

