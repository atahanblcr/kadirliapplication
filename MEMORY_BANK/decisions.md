# decisions.md - Proje Kararları

**Son Güncelleme:** 24 Şubat 2026 16:00

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
**Karar:** Next.js 14 (Admin Panel)
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
**Tarih:** 22 Şubat 2026 → 24 Şubat 2026
**Status:** ✅ Tamamlandı (16/17 modül — Guide dahil)

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
- iOS simulator: `localhost` çalışıyor
- Development flexibility (dev machine IP yerine standart URL'ler)

**Uygulama:**
```dart
final baseUrl = Platform.isIOS
  ? 'http://localhost:3000/v1'      // iOS
  : 'http://10.0.2.2:3000/v1';      // Android
```

**Benefit:** Single codebase, her platform'da çalışıyor

---

### 9. Flutter API Response Defensive Parsing
**Karar:** Tüm number field'lerde String→Int type conversion
**Tarih:** 25 Şubat 2026
**Neden:**
- Backend'den gelen response inconsistent olabiliyor
- JSON parsing edge cases: `"300"` vs `300`
- Type safety: Dart strongly typed

**Uygulama:**
```dart
final value = json['expires_in'];
return value is String ? int.tryParse(value) ?? 300 : value as int? ?? 300;
```

---

### 10. Public API Endpoints Strategy
**Karar:** @SkipAuth() decorator ile JWT'den muaf endpoint'ler
**Tarih:** 25 Şubat 2026
**Neden:**
- Registration flow'unda token yok (OTP doğrulandıktan sonra temp_token)
- GET /admin/neighborhoods herkese açık olmalı
- Clean separation: public vs protected endpoints

**Uygulama:**
- Decorator: `skip-auth.decorator.ts`
- JwtAuthGuard: skipAuth metadata check before canActivate()
- RolesGuard: skipAuth check before role validation
- Endpoint: `@SkipAuth() @Get('neighborhoods')`

---

### 8. Deployment Strategy
**Karar:** Docker + NGINX + PM2
**Tarih:** 23 Şubat 2026
**Yapılandırılacaklar:**
- [ ] SSL sertifikası (Let's Encrypt)
- [ ] GitHub Actions deploy workflows
- [ ] Monitoring (optional: Prometheus)

---

### 9. OTP & Authentication
**Karar:**
- OTP: Redis (TTL: 5 dakika)
- Limit: 10 OTP/saat per phone
- JWT: Access + Refresh token

**Tarih:** 16 Şubat 2026

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
| Admin Frontend | Next.js 14 | SSR, DX |
| Mobile | Flutter 3.x | Cross-platform native |
| Testing | Jest | Built-in, fast |
| State (Admin) | Tanstack Query | Server state management |

---

## 🔄 Bekleyen Kararlar

- [ ] Monitoring: Prometheus vs DataDog vs Sentry
- [ ] Mobile state: Provider vs Riverpod vs BLoC
- [ ] Push: FCM vs OneSignal
- [ ] Analytics: Plausible vs Mixpanel
