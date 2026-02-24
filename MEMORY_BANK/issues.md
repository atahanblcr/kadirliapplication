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

**Modül:** Backend Database Schema

**Durum:** 🔴 Açık

**Açıklama:**
Admin panel API test sırasında 4 endpoint'te database schema mismatch hatası bulundu. AdminService'deki SELECT query'leri database table'larında olmayan column'ları referans ediyor.

**Affected Endpoints:**
1. GET /admin/deaths → `d.neighborhood_id` column yok
2. GET /admin/transport/intercity → `r.company_name` column yok
3. GET /admin/transport/intracity → `r.color` column yok
4. GET /admin/events → `e.is_local` column yok

**Hata Mesajı:**
```
QueryFailedError: column d.neighborhood_id does not exist
QueryFailedError: column r.company_name does not exist
QueryFailedError: column r.color does not exist
QueryFailedError: column e.is_local does not exist
```

**Root Cause:**
AdminService'deki SQL query builder select() metodları database schema'sı ile senkron değil. Migration'lar run edilmiş ama schema'da bu column'lar yok.

**Çözüm Seçenekleri:**
1. AdminService query'lerini database schema'sına uydurmak
2. Database migration oluşturup eksik column'ları eklemek
3. TypeORM entities ile senkronizasyon sağlamak

**Etki:**
- Admin panel UI tamamlandı (100%)
- Backend API 16/23 endpoint çalışıyor (7 bloklı)
- Manual test yapılamıyor (test plan hazırlandı, backend düzeltilince çalıştırılacak)

---

## #001 16 Şubat 2026 - Redis Connection Timeout

**Durum:** 🟢 Çözüldü

**Modül:** Auth (OTP Storage)

**Açıklama:**
Backend başlatıldığında Redis'e bağlanamıyor. 5 saniye sonra timeout hatası veriyor.

**Hata Mesajı:**
```
Error: connect ETIMEDOUT
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16)
```

**Denenen Çözümler:**
1. Redis restart - Başarısız
2. Port değiştirme (6380) - Başarısız
3. localhost yerine 127.0.0.1 - Başarısız

**Nihai Çözüm:**
docker-compose.yml'de Redis host'u değiştirdim:
```yaml
# ESKI:
REDIS_HOST: localhost

# YENİ:
REDIS_HOST: redis  # Container name
```

Backend de Redis container'ına bağlandı.

**Önleme:**
Docker Compose kullanırken container name'leri kullan, localhost değil.

---

## #002 17 Şubat 2026 - TypeORM Entity Not Found

**Durum:** 🟢 Çözüldü

**Modül:** Database

**Açıklama:**
TypeORM `User` entity'sini bulamıyor. `EntityNotFoundError` hatası veriyor.

**Hata Mesajı:**
```
Error: No metadata for "User" was found
```

**Denenen Çözümler:**
1. Entity import kontrol - Doğru
2. @Entity() decorator kontrol - Var

**Nihai Çözüm:**
`app.module.ts`'de entities array'e ekledim:
```typescript
TypeOrmModule.forRoot({
  // ...
  entities: [User, Announcement, Ad, /* ... */],
  // VEYA:
  entities: ['dist/**/*.entity.js'],
})
```

**Önleme:**
Yeni entity oluşturduktan sonra mutlaka entities array'e ekle veya glob pattern kullan.

---

## #003 18 Şubat 2026 - OTP Rate Limiting Çalışmıyor

**Durum:** 🟢 Çözüldü

**Modül:** Auth

**Açıklama:**
10 OTP/hour limiti uygulanmıyor. Kullanıcı sınırsız OTP alabiliyordu.

**Hata Mesajı:**
[Hata yok, iş mantığı hatası]

**Denenen Çözümler:**
1. Redis key kontrolü - Doğru
2. TTL kontrolü - 3600 saniye (1 saat) ✓

**Nihai Çözüm:**
Redis key format'ı yanlıştı:
```typescript
// YANLIŞ:
const key = `otp:${phone}`;

// DOĞRU:
const key = `otp_count:${phone}`;
```

Her OTP isteğinde count arttırılıyor, 10'dan fazlaysa reject ediliyor.

**Önleme:**
Redis key naming convention belirle ve dokümante et.

---

## #004 23 Şubat 2026 - File Upload Sorunları

**Durum:** 🟢 Çözüldü

**Modül:** Files

**Açıklama:**
İki sorun çözüldü:
1. `@CurrentUser('user_id')` → `@CurrentUser('id')` düzeltildi (User entity'de `id` var, `user_id` yok)
   - Sonucu: `uploaded_by` NULL doluyor, `deleteFile` her zaman 403 Forbidden veriyordu
2. File size limit 10MB → 20MB artırıldı
3. `main.ts`'e body-parser limit eklendi (JSON/urlencoded için)

**Nihai Çözüm:**
- `files.controller.ts`: `@CurrentUser('id')` - hem upload hem delete
- `files.controller.ts`: `limits: { fileSize: 20 * 1024 * 1024 }`
- `files.service.ts`: `MAX_SIZE_BYTES = 20 * 1024 * 1024`
- `main.ts`: `express.json({ limit: '1mb' })`

**Test Sonucu (23 Şubat):**
- ✅ Upload → `uploaded_by = a84a7512-...` (dolu)
- ✅ Delete → "Dosya silindi"
- ✅ cdn_url doğru dönüyor

**Önleme:**
NestJS'de JWT strategy `validate()` User entity döndürür. `@CurrentUser` decorator `req.user[field]` okuyor. User entity'de `user_id` YOK, `id` VAR.

---

## #005 [YENİ SORUN ŞABLONU]

**Durum:** 🔴 Açık

**Modül:**

**Açıklama:**

**Hata Mesajı:**
```
```

**Denenen Çözümler:**

**Nihai Çözüm:**

**Önleme:**

---

---

## #006 - Admin Panel Placeholder Sayfaları

**Durum:** 🟢 Çözüldü (İNTENSİYONEL)

**Modül:** Admin Panel

**Açıklama:**
7 sayfa henüz placeholder (sadece AlertCircle + "Bu modül henüz yapılmadı" mesajı):
1. Taxi (`/dashboard/taxi`)
2. Events (`/dashboard/events`)
3. Guide (`/dashboard/guide`)
4. Places (`/dashboard/places`)
5. Complaints (`/dashboard/complaints`)
6. Scrapers (`/dashboard/scrapers`)
7. Settings (`/dashboard/settings`)

**Nihai Çözüm:**
Bu placeholder sayfalar INTENTIONAL ve doğru. Sidebar'da navigasyon var, sayfa açılır, ama daha implement edilmemiş modüller içindir.

**NOT:** Silinmemeleri gerekir - kullanıcıya "bu geliyor" mesajı verir.

---

## #007 22 Şubat 2026 - Campaign Admin Endpoint'leri Eksikti

**Durum:** 🟢 Çözüldü

**Modül:** Admin / Campaigns

**Açıklama:**
Audit'te keşfedildi: Frontend `use-campaigns.ts` `/admin/campaigns/*` endpoint'lerini çağırıyor, ama backend'de bu endpoint'ler hiç yoktu. Campaign admin modülü tamamen yazılmamıştı.

**Etki:**
- Campaign listesi yüklenemiyordu (404)
- Approve/reject/delete işlemleri çalışmıyordu
- Frontend'de TypeScript hatası yoktu (sadece runtime 404)

**Nihai Çözüm:**
- `backend/src/admin/campaign-admin.controller.ts` oluşturuldu (4 endpoint)
- `backend/src/admin/dto/query-admin-campaigns.dto.ts` oluşturuldu
- `backend/src/admin/dto/reject-campaign.dto.ts` oluşturuldu
- AdminService'e 4 campaign metodu eklendi
- `admin.module.ts`'e yeni controller kayıt edildi

**Önleme:**
Her frontend modülü yazılırken karşılık gelen backend endpoint'lerinin var olduğu kontrol edilmeli.

---

## #008 22 Şubat 2026 - Campaign Entity Alan Adı Uyumsuzluğu

**Durum:** 🟢 Çözüldü

**Modül:** Admin / Campaigns

**Açıklama:**
Campaign entity'deki alan adları frontend Campaign type'taki alan adlarıyla uyuşmuyordu.

| Entity (DB) | Frontend (beklenen) |
|---|---|
| `discount_percentage` | `discount_rate` |
| `start_date` | `valid_from` |
| `end_date` | `valid_until` |
| `discount_code` | `code` |
| `code_view_count` | `code_views` |

Ayrıca `rejected_reason` backend entity'de vardı ama frontend Campaign tipinde tanımlı değildi.

**Nihai Çözüm:**
AdminService'deki `getAdminCampaigns()` mapping ile dönüşüm yapıyor (entity alan adı → frontend alan adı).
`admin/src/types/index.ts` Campaign interface'ine `rejected_reason?: string` eklendi.

**Önleme:**
Frontend tipler oluşturulurken backend entity'yle alan adları karşılaştırılmalı. Uyumsuzluk varsa mapping katmanı oluşturulmalı.

---

## #009 22 Şubat 2026 - Users role= ve Neighborhoods type= boş param 400 hatası

**Durum:** 🟢 Çözüldü

**Modül:** Admin / Users + Neighborhoods

**Açıklama:**
`role=` veya `type=` boş string olarak gönderildiğinde (UI'da filtre temizlenince), `@IsOptional()` decorator'ı NestJS class-validator'da boş string'i `undefined` olarak saymıyor. Bu yüzden `@IsEnum` / `@IsIn` validasyonu devreye girip 400 hatası veriyor.

**Hata Mesajı:**
```
role must be one of the following values: user, taxi_driver, ...
type must be one of the following values: neighborhood, village
```

**Nihai Çözüm:**
`@Transform` decorator ile boş string'i `undefined`'a dönüştür:
```typescript
@IsOptional()
@Transform(({ value }) => (value === '' ? undefined : value))
@IsEnum(UserRole)
role?: UserRole;
```
Hem `query-users.dto.ts` hem `query-neighborhoods.dto.ts`'e uygulandı.

**Önleme:**
NestJS'de enum/in filter'larda boş string her zaman `@Transform` ile handle edilmeli.

---

## 📊 İstatistikler

**Toplam Sorun:** 9
**Çözülmüş:** 7 (78%)
**Devam Eden:** 1 (11%)
**Açık:** 1 (11%)

**En Sık Sorun Kategorileri:**
1. Database/ORM (2 sorun)
2. Configuration (2 sorun)
3. File Upload (1 sorun)

---

**NOT:** Her sorunla karşılaştığında buraya ekle, çözüm bulunca güncelle!
