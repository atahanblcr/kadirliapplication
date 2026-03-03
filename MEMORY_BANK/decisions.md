# decisions.md - Proje Kararları

**Son Güncelleme:** 2 Mart 2026 16:30

---

## 🎯 Mimarî Kararlar

### 1. Backend Architecture
**Karar:** NestJS + TypeORM
**Tarih:** Proje başlangıcı
**Neden:**
- Enterprise-grade framework
- Built-in dependency injection
- Type-safe database operations
- Test-friendly architecture

---

### 2. API Response Format
**Karar:**
```json
{
  "success": true,
  "data": { "...içerik...", "meta": { "page":1,"total":50,"total_pages":3 } },
  "meta": { "timestamp": "...", "path": "..." }
}
```
**Tarih:** 16 Şubat 2026
**Neden:**
- Consistent response structure
- `data.data.meta` = pagination, `data.meta` = TransformInterceptor (KARIŞTIRILMAMALI!)

---

### 3. Database (PostgreSQL + Redis)
**Karar:** PostgreSQL (persistence) + Redis (cache)
**Tarih:** Proje başlangıcı
**Neden:**
- PostgreSQL: ACID transactions, complex queries, 50+ table schema
- Redis: OTP storage (TTL), session cache, rate limiting

---

### 4. Frontend Framework
**Karar:** Next.js 14/16 (Admin Panel)
**Tarih:** 20 Şubat 2026
**Neden:** SSR, API routes built-in, TypeScript desteği mükemmel

---

### 5. Mobile Framework
**Karar:** Flutter 3.x
**Tarih:** Proje planlaması
**Neden:** Cross-platform (iOS + Android), single codebase, native performance

---

### 6. Admin Panel Completion Strategy
**Karar:** Flutter başlamadan admin panel tamamlanacak
**Tarih:** 22 Şubat → 24 Şubat 2026
**Status:** ✅ Tamamlandı (16/16 modül)

---

### 7. Guide Module Hierarchy Design
**Karar:** Max 2 seviye hiyerarşi (Ana Kategori → Alt Kategori)
**Tarih:** 24 Şubat 2026
**Neden:**
- Daha derin hiyerarşi UI'ı gereksiz karmaşıklaştırır
- Kadirli rehberi için 2 seviye yeterli (örn. "Resmi Kurumlar → Belediye")

**Uygulama:**
- Backend: `parent.parent_id` kontrolü ile circular ref engeli
- Silme: children veya items olan kategori silinemez (önce boşaltılmalı)
- Frontend: sadece root kategoriler parent select'te görünür

---

### 8. Flutter Platform-Specific Networking
**Karar:** Platform detection ile dynamic base URL
**Tarih:** 25 Şubat 2026
**Neden:**
- Android emulator: special host alias `10.0.2.2` gerekli
- iOS simulator: `localhost` veya `127.0.0.1`
- Development flexibility (dev machine IP yerine standart URL'ler)

**Uygulama:**
```dart
final baseUrl = Platform.isIOS
  ? 'http://127.0.0.1:3000/v1'      // iOS (2 Mart Fix)
  : 'http://10.0.2.2:3000/v1';      // Android
```

**Benefit:** Single codebase, her platform'da çalışıyor

---

### 9. Flutter API Response Defensive Parsing
**Karar:** Tüm verilerde null-safety kontrolü ve default değer kullanımı
**Tarih:** 25 Şubat - 2 Mart 2026
**Neden:**
- Backend'den gelen response eksik veya inconsistent olabiliyor.
- Type safety ve Runtime TypeError önleme (örn. "subtype of String").

**Uygulama:**
```dart
final value = json['expires_in'];
return value is String ? int.tryParse(value) ?? 300 : value as int? ?? 300;
// 2 Mart (Ads Module):
id: json['id']?.toString() ?? '',
```

---

### 10. Public API Endpoints Strategy
**Karar:** @SkipAuth() decorator ile JWT'den muaf endpoint'ler
**Tarih:** 25 Şubat 2026
**Neden:**
- Registration flow'unda token yok (OTP doğrulandıktan sonra temp_token)
- GET /admin/neighborhoods herkese açık olmalı
- Clean separation: public vs protected endpoints

---

### 11. Admin Panel Tailwind v4 Çözümü
**Karar:** Kök dizindeki `package.json` silinerek monorepo yanılgısı engellendi.
**Tarih:** 2 Mart 2026
**Neden:** Next.js (Turbopack) alt klasördeki projelerde üst dizinde bir config gördüğünde Tailwind eklentisini dışarıda aramaya çalışıyordu. Admin dizinini bağımsız bir "root" yapmak en kalıcı çözüm oldu.

---

### 12. Kullanıcı Bulma Stratejisi (Phone vs Email)
**Karar:** Kimlik doğrulama ve veritabanı aramalarında öncelikli anahtar telefon numarasıdır (`phone`).
**Tarih:** 2 Mart 2026
**Neden:** Orijinal veritabanı şemasında `email` alanı yoktu. Sonradan eklenmesi, Admin ve Auth servislerini, `seed.ts` betiklerini kilitlediği için her şey `phone` kullanacak şekilde senkronize edildi.

---

### 13. Ads Modülü Navigasyon Yapısı
**Karar:** Alt navigasyondaki sekmeler bağımsız bir rota (`Navigator.push`) haline getirildi.
**Tarih:** 2 Mart 2026
**Neden:** İlanlar modülünün `HomePage` içinde bir sekme olarak kalması, kullanıcı deneyimini bozuyor ve ana sayfaya "Geri" dönüşünü engelliyordu.

---

## 🚫 Kısıtlamalar (Kesinlikle Uyulacak)

### 1. Rich Text Editor (YASAK)
**Karar:** Description alanları plain text — HTML/RTE yasak
**Neden:** XSS riski + gereksiz karmaşıklık

### 2. Taksi Sıralama
**Karar:** `ORDER BY RANDOM()` — order kolonu YOK, eklenmiyor
**Neden:** Fair distribution, ranking sistemi istenmiyor

### 3. Mahalle Hedefleme
**Karar:** `target_neighborhoods: string[]` (array)
**Neden:** Multi-select gerekli, string değil

---

## 📊 Teknoloji Seçimleri

| Katman | Seçim | Neden |
|--------|-------|-------|
| Backend | NestJS + TypeORM | Type safety, structure |
| Database | PostgreSQL | ACID, complex queries |
| Cache | Redis | TTL, pub/sub |
| Admin Frontend | Next.js 16 | SSR, DX |
| Mobile | Flutter 3.x | Cross-platform native |
| Testing | Jest & Mocktail | Built-in, fast, no-codegen mocks |
| State (Admin) | Tanstack Query | Server state management |

---

## 🔄 Bekleyen Kararlar

- [ ] Monitoring: Prometheus vs DataDog vs Sentry
- [ ] Push: FCM vs OneSignal
- [ ] Analytics: Plausible vs Mixpanel
