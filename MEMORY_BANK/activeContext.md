# Active Context - Şu An Ne Üzerinde Çalışıyorum?

**Son Güncelleme:** 20 Şubat 2026 (Rapor yapılıyor, başka işe gidiyor, sonra devam)

---

## 🎯 Şu Anki Durum

**Modül:** Rapor ve Kontrol (Taxi Module sonra)
**Durum:** Backend %60 tamamlandı, tüm testler geçti (227 test, 13 suite)
**Model:** Claude Haiku (hızlı rapor için geçildi)
**Başlangıç:** 20 Şubat 2026, 13:XX
**Yapıldıktan Sonra:** Başka işe gidiyor, sonra Taxi Module'e başlayacak

---

## 📝 Yapılan Çalışmalar (20 Şubat 2026)

```
backend/
├── ✅ NestJS projesi oluşturuldu
├── ✅ Bağımlılıklar yüklendi (typeorm, jwt, bull, ioredis, vb.)
├── ✅ .env.example oluşturuldu
├── ✅ docker-compose.yml oluşturuldu (root klasörde)
├── ✅ src/main.ts güncellendi (ValidationPipe, CORS, GlobalFilters)
├── ✅ src/app.module.ts güncellendi (tüm modüller bağlandı)
├── ✅ common/ klasörü (filters, interceptors, decorators, utils, enums)
├── ✅ database/entities/ (30+ entity - TÜM tablolar tamamlandı, TypeScript hataları düzeltildi)
├── ✅ auth/ modülü (service, controller, strategy, guards, DTOs)
├── ✅ users/ modülü (service, controller, DTOs)
├── ✅ 13 modül placeholder (announcements, ads, deaths, pharmacy, events, campaigns, guide, places, transport, notifications, taxi, admin, files)
├── ✅ Auth Unit Testleri (4 dosya, 69 test, %85+ coverage)
└── ✅ Announcements Module (tam implementasyon + testler, 48 test, %90+ coverage)
    ├── announcements/dto/create-announcement.dto.ts
    ├── announcements/dto/update-announcement.dto.ts
    ├── announcements/dto/query-announcement.dto.ts
    ├── announcements/announcements.service.ts  (CRUD + targeting + send)
    ├── announcements/announcements.controller.ts  (7 endpoint)
    ├── announcements/announcements.module.ts
    ├── announcements/announcements.service.spec.ts  (97% coverage)
    └── announcements/announcements.controller.spec.ts  (100% coverage)
    ├── auth.service.spec.ts     (100% Stmts, 90% Branch, 100% Funcs, 100% Lines)
    ├── auth.controller.spec.ts  (100% Stmts, 79% Branch, 100% Funcs, 100% Lines)
    ├── jwt.strategy.spec.ts     (100% Stmts, 86% Branch, 100% Funcs, 100% Lines)
    └── roles.guard.spec.ts      (100% Stmts, 83% Branch, 100% Funcs, 100% Lines)
```

---

## 📊 Genel Durum

**Backend:** %25 tamamlandı
- ✅ Proje iskeleti hazır
- ✅ Auth + Users modülleri yazıldı
- ✅ Auth unit testleri yazıldı (%85+ coverage)
- ⏳ Diğer 11 modül placeholder (içleri boş)

---

## 💡 Aklımda Tutmam Gerekenler

1. **Taksi → RANDOM sıralama** (ORDER BY RANDOM()) - rank/order kolonu YOK
2. **Description alanları → Plain text** (Textarea) - Rich Text Editor KULLANMA
3. **Mahalle hedefleme → Array** (string[]) - Multi-Select
4. **Manuel duyurular → status = 'published'** otomatik
5. **Scraping duyurular → status = 'draft'** onay bekler
6. **Vefat ilanları → auto_archive_at = funeral_date + 7 days**

---

## 📌 Tamamlanan + Sonraki Adımlar

### ✅ Tamamlananlar (20 Şub 2026)
1. [x] Auth Module ✅ (69 test, 88.88% coverage)
2. [x] Users Module ✅ (30 test, 88.75% coverage)
3. [x] Announcements Module ✅ (48 test, 90.35% coverage)
4. [x] Entity Schema ✅ (30+ entity)
5. [x] Ads Module ✅ (61 test, 92.92% coverage)
6. [x] Deaths Module ✅ (22 test, cron job)

### 🔄 Yapılacaklar (Sıra)
1. [ ] Taxi Module (RANDOM sıralama, docs/04 "7. TAXI")
2. [ ] Pharmacy Module
3. [ ] Events Module
4. [ ] Campaigns Module
5. [ ] Guide Module
6. [ ] Places Module
7. [ ] Transport Module
8. [ ] Notifications Module (FCM)
9. [ ] Admin Module
10. [ ] Files Module (upload/delete)

---

## 🔗 İlgili Dokümantasyon

- `docs/04_API_ENDPOINTS_MASTER.md` - Tüm endpoint'ler
- `docs/10_CORRECTIONS_AND_UPDATES.md` - KRİTİK düzeltmeler
- `CLAUDE.md` - İş kuralları

---

**NOT:** Onay olmadan bir sonraki adıma GEÇMİYORUM!
