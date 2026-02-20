# Backend Audit Report - KadirliApp
**Tarih:** 21 Şubat 2026
**Yapan:** Claude Code
**Durum:** ⚠️ ADMIN PANEL'E GEÇMEDEN ÖNCE ÇÖZÜLMELI

---

## 🎯 ÖZET

Backend %100 tamamlanmış ve çalışıyor (**492 test geçti, 85%+ coverage**). Ancak **ACIL olarak çözülmesi gereken 3 KRITIK sorun** ve **15+ Medium/Low Priority sorun** var.

| Kategori | Sayı | Durum |
|----------|------|-------|
| **🔴 KRITIK (Admin Panel'i Bloklar)** | 3 | ⚠️ ACIL |
| **🟠 YÜKSEKPrioriy (Prod Risk)** | 6 | ⚠️ Düzeltilmeli |
| **🟡 Medium (Best Practice)** | 15+ | ⚠️ Arzu edilen |
| **✅ İyi Uygulama** | 8 | ✓ Mevcut |

---

## 🔴 KRITIK SORUNLAR (ACIL - Admin Panel'e Geçmeden Çözülmeli)

### 1. ORM İlişki Eksiklikleri (Admin Panel Sorguları Kırılacak)
**Etkilenen Modüller:** Tüm entity'ler
**Risk Seviyesi:** BLOKLAR
**Açıklama:** 15+ entity'de OneToMany ilişkiler tanımlanmamış. Admin panel bu ilişkileri kullandığında:
- N+1 query problemi
- Eager loading başarısız
- Silme işlemleri cascade etmeyecek

**Örnek:**
```typescript
// ❌ SORUN: User'ın hiç OneToMany ilişkisi yok
@Entity()
export class User {
  @OneToMany(() => Ad, ad => ad.user) // ← YOK!
  ads: Ad[];
}

// Admin panel: User ile tüm Ad'larını yüklemek isterken:
const user = await this.userRepository.find({ relations: ['ads'] }); // Çalışmayacak!
```

**Etkilenen Entities (15+):**
- User (hiç OneToMany yok)
- AdCategory, AnnouncementType, EventCategory (hiç OneToMany yok)
- FileEntity (tüm uploads'ı yükleyemiyor)
- BusinessCategory, Neighborhood, Permission, GuideCategory, PlaceCategory
- Pharmacy, Business, TaxiDriver, Announcement, Cemetery, Mosque

**Çözüm:** Her entity'ye missing OneToMany ilişkileri ekle
**Tahmini Süre:** 2-3 saat
**Yapılması Gereken:**
1. User'a add[], notification[], announcement[], etc. OneToMany'leri ekle
2. Category entityleri'ne OneToMany children ekle
3. FileEntity'e OneToMany referrer'ları ekle
4. Cascade politikalarını standartlaştır

### 2. API Response Format Tutarsızlığı (Client Code Kırılacak)
**Risk Seviyesi:** BLOKLAR
**Açıklama:** Endpoint'ler farklı formatlarda response döndürüyor:

**Mevcut Karışık Formatlar:**
```json
// ❌ Auth endpoint (message only)
{ "message": "OTP gönderildi", "expires_in": 300, "retry_after": 60 }

// ❌ Users endpoint (object directly)
{ "user": {...} }

// ❌ Ads endpoint (array without meta)
{ "ads": [...], "meta": {...} }

// ✅ Error responses (tutarlı)
{ "success": false, "error": {...}, "meta": {...} }
```

**İstenen Format (tek standart):**
```json
{
  "success": true,
  "data": { "user": {...} },
  "meta": { "timestamp": "...", "path": "..." }
}
```

**Etkilenen Endpoint Sayısı:** 50+ endpoint
**Çözüm:** TransformInterceptor'u güçlendir veya her service'te wrapper ekle
**Tahmini Süre:** 4-5 saat

### 3. Security Critical: Database SSL + Env Vars + Secrets
**Risk Seviyesi:** KRITIK (Production Breach Risk)
**Açıklama:**
```typescript
// ❌ app.module.ts:47 - SSL cert validation devre dışı
ssl: configService.get<string>('DATABASE_SSL') === 'true'
  ? { rejectUnauthorized: false } // ← Miş to Man-in-the-Middle attacks!
  : false,

// ❌ data-source.ts:13 - Default password
password: process.env.DATABASE_PASSWORD || 'your_strong_password_here'

// ❌ jwt.strategy.ts:25 - JWT secret fallback
secretOrKey: configService.get<string>('JWT_SECRET') ?? ''
```

**Çözüm (5 step):**
```typescript
// 1. Env validation ekleme (app.module.ts'de)
configModule: ConfigModule.forRoot({
  validationSchema: Joi.object({
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required().min(16),
    JWT_SECRET: Joi.string().required().min(64),
    REDIS_PASSWORD: Joi.string().required(),
    // ... etc
  })
})

// 2. SSL fix (app.module.ts:47)
ssl: configService.get<string>('DATABASE_SSL') === 'true'
  ? { rejectUnauthorized: true } // ✓ Düzeltildi

// 3. Default password kaldır (data-source.ts:13)
password: configService.get<string>('DATABASE_PASSWORD'), // No fallback!

// 4. JWT secret validation (jwt.strategy.ts:25)
secretOrKey: configService.get<string>('JWT_SECRET'),
// Env validation zaten catch edecek eksikliği

// 5. Redis password zorunlu yap (docker-compose.yml + .env)
REDIS_PASSWORD: "strong_random_password_min_32_chars"
```

**Tahmini Süre:** 1-2 saat

---

## 🟠 YÜKSEK PRİORİTY SORUNLAR (Prod Deploy Öncesi)

### 4. DTO Validation Eksiklikleri (25 DTO'da @IsNotEmpty Yok)
**Etkilenen:** Auth, Announcements, Ads, Deaths, Campaigns, Files, etc.
**Problem:** Required alanlar boş string/null ile pass ediyor

```typescript
// ❌ upload-file.dto.ts
export class UploadFileDto {
  @IsEnum(['announcement', 'ad', 'event'])
  module_type: string; // @IsNotEmpty() YOK!
}

// User { module_type: "" } gönderse pass ediyor!
```

**Çözüm:** 25 DTO'ya @IsNotEmpty() ekle
**Tahmini Süre:** 1-2 saat

### 5. CORS Origin Parsing Hatası (XSS Risk)
**File:** src/main.ts:25
**Problem:**
```typescript
// ❌ YANLIŞ
const corsOrigins = configService.get<string>('CORS_ORIGINS', '').split(',');
// CORS_ORIGINS="http://localhost:3001, http://localhost:3002" ise
// ["http://localhost:3001", " http://localhost:3002"] → " http://localhost:3002" match etmeyecek!

// ✓ DOĞRU
const corsOrigins = configService.get<string>('CORS_ORIGINS', '')
  .split(',')
  .map(o => o.trim())
  .filter(o => o.length > 0);
```

**Tahmini Süre:** 15 dakika

### 6. Rate Limiting Çok Permissive (100 req/60s)
**File:** docker-compose.yml
**Problem:** 100 requests/60s çok yüksek (brute force açığı)

```typescript
// ❌ YANLIŞ
THROTTLE_LIMIT=100 # 100 requests/minute

// ✓ DOĞRU - Global
THROTTLE_LIMIT=20 # 20 requests/minute

// + Per-endpoint overrides ileride
// POST /auth/request-otp: 5/minute
// POST /auth/verify-otp: 3/minute per phone
```

**Tahmini Süre:** 30 dakika

### 7. Redis Şifresiz (Data Breach Risk)
**File:** docker-compose.yml + .env
**Problem:**
```yaml
# ❌ YANLIŞ
REDIS_PASSWORD: "" # Şifre yok!

# ✓ DOĞRU
REDIS_PASSWORD: "$(openssl rand -base64 32)" # Min 32 char
```

**Tahmini Süre:** 15 dakika

### 8. OTP Timing Attack Vulnerable (Low Risk)
**File:** auth.service.ts:107
**Problem:**
```typescript
// ❌ YANLIŞ (timing sensitive)
if (storedOtp !== otp) throw new Error();

// ✓ DOĞRU (constant-time)
if (!crypto.timingSafeEqual(Buffer.from(storedOtp), Buffer.from(otp))) throw;
```

**Tahmini Süre:** 15 dakika

### 9. Sensitive Data in Logs (Dev Mode)
**File:** auth.service.ts:65
**Problem:**
```typescript
// ❌ YANLIŞ - OTP'ler loglanıyor
this.logger.warn(`[DEV MODE] OTP for ${phone}: ${otp}`);

// ✓ DOĞRU
this.logger.warn(`[DEV MODE] OTP for ${maskPhone(phone)}: ${maskOtp(otp)}`);
```

**Tahmini Süre:** 30 dakika

---

## 🟡 MEDIUM PRİORİTY (Best Practice / Yarın Yapılabilir)

### 10. Cascade Policy Inconsistency
- AdFavorite, AdExtension'a `{ cascade: true }` eklenmesi
- Complaint'lerde onDelete behavior standardization
- Tahmini: 30 dakika

### 11. Self-Referential Hierarchy Incomplete
- BusinessCategory: missing @OneToMany children
- GuideCategory: missing @OneToMany children
- Tahmini: 1 saat

### 12. Missing OneToMany on Category Entities
- AdCategory → ads (has children but not ads themselves)
- Tahmini: 1-2 saat

### 13. Try-Catch Coverage (2 file'da var, 50+ eksik)
- Tüm async service method'larına try-catch eklemek (global filter zaten yapıyor ama explicit iyi)
- Tahmini: 2-3 saat

### 14. Database Connection Pooling
- TypeOrmModule'e max connection, timeout config'i eklemek
- Tahmini: 30 dakika

### 15. File Upload Security
- Local filesystem uploads remove (only R2 use)
- Tahmini: 1 saat

### 16. HTTPS/TLS Enforcement
- Helmet.js ekleme
- HTTP → HTTPS redirect
- HSTS headers
- Tahmini: 1 saat

### 17. Pagination Consistency
- Notifications, Pharmacy endpoints'e meta eklemek
- Tahmini: 30 dakika

### 18. User.banned_by Self-Reference Relationship
- User'ın kendisine ManyToOne relationship'i (ban auditine göre)
- Tahmini: 30 dakika

---

## ✅ İYİ UYGULANMIŞLAR

| Başlık | Durum | Not |
|--------|-------|-----|
| SQL Injection Prevention | ✓ Tüm queries parameterized | TypeORM query builder |
| XSS Protection | ✓ No innerHTML | Global validation |
| Exception Handling | ✓ Consistent exception types | BadRequest, NotFound, etc. |
| File Upload Validation | ✓ MIME type + 10MB limit | Good |
| Global Exception Filter | ✓ Stack traces masked | Production-ready |
| Docker Security | ✓ Non-root user (1001) | Proper signal handling |
| Validation Pipes | ✓ class-validator enabled | whitelist/forbidNonWhitelisted |
| JWT Strategy | ✓ ConfigService via env | Not hardcoded |

---

## 📋 ACTION PLAN (Sırasıyla Yapılması Gereken)

### MUST-DO BEFORE ADMIN PANEL (1-2 gün)
```
[GÜN 1]
1. Entity ilişkileri (OneToMany) ekle - 2-3 saat
2. Database SSL + Env validation + Secrets - 1-2 saat
3. API Response format standardize et - 4-5 saat
4. DTOs'a @IsNotEmpty ekle - 1-2 saat

[GÜN 2]
5. DTO + Response tests yaz - 1-2 saat
6. Tüm tests çalıştır - 30 dakika
7. MEMORY_BANK güncelle - 30 dakika
```

### NICE-TO-HAVE BEFORE DEPLOY (1 hafta sonra)
```
8. CORS parsing fix - 15 dakika
9. Rate limiting tighten - 30 dakika
10. Redis password - 15 dakika
11. OTP timing safe - 15 dakika
12. Log masking - 30 dakika
13. Helmet.js + HTTPS - 1 saat
14. File upload only R2 - 1 saat
15. Connection pooling - 30 dakika
```

---

## 📊 IMPACT ANALYSIS

### Admin Panel Başarısı için Kritik
- ✓ Entity ilişkileri
- ✓ Response format tutarlılığı
- ✓ DTO validation

### Production Deploy için Kritik
- ✓ SSL + Env vars + Secrets
- ✓ Rate limiting
- ✓ Helmet.js
- ✓ HTTPS enforcement

---

## 🚨 YARINI ATLAMA ÇIKTILARI

**Admin Panel'e GEÇMEYECEĞİZ eğer:**
1. ❌ Entity OneToMany'ler eklenmemiş
2. ❌ Security issues (SSL, env vars) çözülmemiş
3. ❌ DTO validation @IsNotEmpty eksik
4. ❌ Response format inconsistent

**Ondan sonra geçebiliriz:**
1. ✓ Tüm KRITIK sorunlar çözüldü
2. ✓ 492 test çalışıyor
3. ✓ API response tutarlı
4. ✓ Entity relations complete
5. ✓ Security baseline met

---

## 📝 TAVSIYE

> **Yarın yapacağımız:** Admin Panel Development
> **Ama önce (bugün/yarın sabahı):** İlk 4 KRITIK sorunu çöz
> **Sonra:** Admin Panel'e başla - daha clean ortamda çalışacaksın

---

**Rapport Yapan:** Claude Code
**Rapor Tarihi:** 21 Şubat 2026
**Sonraki Adım:** ACIL sorunları gözden geçir ve onayla → Çözüme başla
