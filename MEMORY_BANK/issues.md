# Issues & Problems - Sorunlar ve Çözümler

**Amaç:** Karşılaşılan sorunları ve çözümlerini kaydetmek

---

## 🐛 Sorun Formatı

```markdown
## [ID] [Tarih] - [Başlık]

**Durum:** 🔴 Açık / 🟡 Devam ediyor / 🟢 Çözüldü

**Modül:** [Hangi modülde]

**Açıklama:**
[Sorunun detaylı açıklaması]

**Hata Mesajı:**
```
[Hata kodu/mesajı]
```

**Denenen Çözümler:**
1. [Çözüm 1] - Sonuç: Başarısız
2. [Çözüm 2] - Sonuç: Kısmi çözüm

**Nihai Çözüm:**
[Nasıl çözüldü]

**Önleme:**
[Gelecekte nasıl önlenir]
```

---

## #001 16 Şubat 2026 - Redis Connection Timeout
**Durum:** 🟢 Çözüldü
**Modül:** Auth (OTP Storage)
**Açıklama:** Backend başlatıldığında Redis'e bağlanamıyor.
**Hata:** `Error: connect ETIMEDOUT`
**Nihai Çözüm:** `docker-compose.yml` içinde Redis host'u `localhost` yerine container name `redis` olarak değiştirildi.

## #002 17 Şubat 2026 - TypeORM Entity Not Found
**Durum:** 🟢 Çözüldü
**Modül:** Database
**Hata:** `Error: No metadata for "User" was found`
**Nihai Çözüm:** `app.module.ts`'de entities array'e eklemeler yapıldı veya glob pattern kullanıldı.

## #003 18 Şubat 2026 - OTP Rate Limiting Çalışmıyor
**Durum:** 🟢 Çözüldü
**Modül:** Auth
**Nihai Çözüm:** Redis key formatı `otp_count:${phone}` olarak düzenlendi ve her istekte increment edildi.

## #004 23 Şubat 2026 - File Upload Sorunları
**Durum:** 🟢 Çözüldü
**Modül:** Files
**Nihai Çözüm:** `@CurrentUser('user_id')` yerine `id` kullanıldı. Limit 20MB'a çıkarıldı. `main.ts`'e body-parser limiti eklendi.

## #005 22 Şubat 2026 - Admin Panel Database Schema Mismatch
**Durum:** 🟢 Çözüldü
**Modül:** Admin
**Açıklama:** SELECT query'leri tabloda olmayan column'ları referans ediyor (`e.is_local` vb.)
**Nihai Çözüm:** AdminService query'leri database schema'sına uyduruldu.

## #006 - Admin Panel Placeholder Sayfaları
**Durum:** 🟢 Çözüldü (İNTENSİYONEL)
**Modül:** Admin Panel
**Açıklama:** 7 sayfa henüz placeholder. Bu durum bilinçli bırakılmıştır.

## #007 22 Şubat 2026 - Campaign Admin Endpoint'leri Eksikti
**Durum:** 🟢 Çözüldü
**Nihai Çözüm:** `campaign-admin.controller.ts` ve servis metotları sıfırdan yazıldı.

## #008 22 Şubat 2026 - Campaign Entity Alan Adı Uyumsuzluğu
**Durum:** 🟢 Çözüldü
**Nihai Çözüm:** AdminService'deki `getAdminCampaigns()` içinde mapping ile dönüşüm sağlandı.

## #009 22 Şubat 2026 - Users role= ve Neighborhoods type= boş param 400 hatası
**Durum:** 🟢 Çözüldü
**Nihai Çözüm:** `@Transform(({ value }) => (value === '' ? undefined : value))` eklendi.

## #010 25 Şubat 2026 - Flutter iOS Build: Multiple commands produce Info.plist
**Durum:** 🟢 Çözüldü
**Hata:** `Multiple commands produce Info.plist`
**Nihai Çözüm:** `project.pbxproj` dosyasından duplicate entry'ler `sed` komutuyla silindi.

## #011 25 Şubat 2026 - Flutter: Android vs iOS Network Base URL Farkı
**Durum:** 🟢 Çözüldü
**Nihai Çözüm:** Platform detection eklendi. Android `10.0.2.2`, iOS `127.0.0.1` olarak ayrıldı.

## #012 25 Şubat 2026 - Flutter: Response Parsing Type Mismatch
**Durum:** 🟢 Çözüldü
**Hata:** `type 'String' is not a subtype of type 'int'`
**Nihai Çözüm:** `int.tryParse(value)` ile güvenli tip dönüşümü (Defensive parsing) sağlandı.

## #013 25 Şubat 2026 - Flutter: Public Neighborhoods Endpoint
**Durum:** 🟢 Çözüldü
**Nihai Çözüm:** `@SkipAuth()` decorator oluşturuldu ve Guard'lara entegre edildi.

## #014 25 Şubat 2026 - Flutter: Register Sayfasında Dropdown Dynamic Filtering
**Durum:** 🟢 Çözüldü
**Nihai Çözüm:** Frontend API parse yapısı ve state reset mantığı düzeltildi.

## #015 25 Şubat 2026 - Flutter: Duplicate User Registration
**Durum:** 🟢 Çözüldü
**Nihai Çözüm:** Test numarası DB'den manuel silinerek kayıt flow'u tekrar açıldı.

---

## #016 2 Mart 2026 - Flutter iOS Simulator Connection Refused
**Durum:** 🟢 Çözüldü
**Modül:** Flutter Networking
**Hata:** `SocketException: Connection refused`
**Nihai Çözüm:** iOS simülatörü için API adresi `localhost:3000` yerine `127.0.0.1:3000` olarak değiştirilerek kararlılık sağlandı.

## #017 2 Mart 2026 - Flutter Ads Upload: image_ids must be a UUID
**Durum:** 🟢 Çözüldü
**Modül:** Flutter Ads Repository
**Hata:** `each value in image_ids must be a UUID`
**Nihai Çözüm:** Backend'den dönen dosya ID'si `data['id']` yerine doğru path olan `data['file']['id']` ile okunarak soruldu.

## #018 2 Mart 2026 - Backend TypeORM Lock (cannot drop type user_role_old)
**Durum:** 🟢 Çözüldü
**Modül:** Backend Database Sync
**Hata:** `QueryFailedError: cannot drop type user_role_old because other objects depend on it`
**Nihai Çözüm:** Postgres konteynerinde `DROP TYPE IF EXISTS user_role_old CASCADE;` çalıştırılarak lock manuel kırıldı. Ayrıca entity'deki `email` sorunu çözüldü.

## #019 2 Mart 2026 - Admin Panel Runtime TypeError (Null Safety)
**Durum:** 🟢 Çözüldü
**Modül:** Admin Panel
**Hata:** `undefined is not an object (evaluating 'category.parent')` ve `toLocaleString` hatası.
**Nihai Çözüm:** `ad-utils.tsx` ve `AdsPage` içerisinde eksik gelebilecek alanlara `??` fallback'leri, if kontrolleri (`if (!category)`) ve opsiyonel zincirleme eklendi.

## #020 2 Mart 2026 - Next.js Tailwind v4 Monorepo Çakışması
**Durum:** 🟢 Çözüldü
**Modül:** Admin Panel
**Hata:** `Can't resolve 'tailwindcss' in '/Users/atahanblcr/Desktop/kadirliapp'`
**Nihai Çözüm:** Next.js Turbopack'in üst dizindeki `package.json` dosyasını workspace sanması engellenmek için ana dizindeki dosyalar temizlendi. Klasör tam yalıtımlı hale getirildi.

---

## 📊 İstatistikler

**Toplam Sorun:** 20
**Çözülmüş:** 20 (100%) ✅
**Devam Eden:** 0 (0%)
**Açık:** 0 (0%)
