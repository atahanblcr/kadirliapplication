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

## #004 20 Şubat 2026 - File Upload 10MB Üzeri Hata

**Durum:** 🟡 Devam ediyor

**Modül:** Files

**Açıklama:**
10MB'dan büyük dosyalar upload edilemiyor. NGINX 413 (Payload Too Large) hatası veriyor.

**Hata Mesajı:**
```
413 Request Entity Too Large
```

**Denenen Çözümler:**
1. NestJS body-parser limit arttırıldı - Başarısız (NGINX blokluyordu)
2. NGINX config değiştirildi - Test ediliyor

**Mevcut Çalışma:**
```nginx
# /etc/nginx/nginx.conf
client_max_body_size 20M;
```

**Sonraki Adımlar:**
- NGINX restart
- Test et
- CloudFlare R2'ye direkt upload stratejisi düşün

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

## #006 20 Şubat 2026 - Placeholder Modüller Tamamlanmamış

**Durum:** 🔴 Açık / Yapılacak

**Modül:** 10 placeholder modül

**Açıklama:**
Aşağıdaki 10 modül henüz placeholder durumunda. Service, Controller, Test yazılmadı:
1. admin - Admin panel CRUD (Rollback, User management)
2. campaigns - Marketing campaigns
3. events - Şehir etkinlikleri
4. files - File upload/delete management
5. guide - Rehber modülü
6. notifications - FCM push notifications
7. pharmacy - Eczane modülü
8. places - Yerler rehberi (Sokaklar, Meydanlar)
9. taxi - Taksi modülü (RANDOM sıralama)
10. transport - Şehirlerarası taşıma

**İş Sırası:**
1. Taxi (DONE oldu 60% oluş sürdür)
2. Pharmacy
3. Events
4. Campaigns
5. Guide
6. Places
7. Transport
8. Notifications (FCM)
9. Admin Panel
10. Files

**Sonraki Adımlar:**
- Taxi Module: docs/04 "7. TAXI" bölümünü oku ve implement et
- Her modül: DTOs → Service (CRUD + business rules) → Controller (endpoints) → Tests (%85+ coverage)
- Tamamlanan modüller: Auth (88.88%), Users (88.75%), Announcements (90.35%), Ads (92.92%), Deaths (100%)

**NOT:** Şu an "Haiku" modeline geçildi, sonrası devam edecek başka işi var.

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
