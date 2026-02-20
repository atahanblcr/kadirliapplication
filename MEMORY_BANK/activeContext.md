# Active Context - Şu An Ne Üzerinde Çalışıyorum?

**Son Güncelleme:** 20 Şubat 2026

---

## 🎯 Şu Anki Görev

**Modül:** Announcements Module (sıradaki)
**Alt Görev:** Auth testleri tamamlandı, Announcements'a geçmeye hazır
**Başlangıç:** 20 Şubat 2026

---

## 📝 Yapılan Çalışmalar (Bu Session)

```
backend/
├── ✅ NestJS projesi oluşturuldu
├── ✅ Bağımlılıklar yüklendi (typeorm, jwt, bull, ioredis, vb.)
├── ✅ .env.example oluşturuldu
├── ✅ docker-compose.yml oluşturuldu (root klasörde)
├── ✅ src/main.ts güncellendi (ValidationPipe, CORS, GlobalFilters)
├── ✅ src/app.module.ts güncellendi (tüm modüller bağlandı)
├── ✅ common/ klasörü (filters, interceptors, decorators, utils, enums)
├── ✅ database/entities/ (user, neighborhood, file, announcement, ad, taxi-driver, death-notice, pharmacy, notification)
├── ✅ auth/ modülü (service, controller, strategy, guards, DTOs)
├── ✅ users/ modülü (service, controller, DTOs)
├── ✅ 13 modül placeholder (announcements, ads, deaths, pharmacy, events, campaigns, guide, places, transport, notifications, taxi, admin, files)
└── ✅ Auth Unit Testleri (4 dosya, 69 test, %85+ coverage)
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

## 📌 Sonraki Adımlar (Sırayla - ONAY BEKLE)

1. [x] Auth Module Unit Testleri ✅ (69 test, %85+ coverage)
2. [ ] Announcements Module (tam implementasyon) ← **SIRADAKI**
3. [ ] Ads Module (en karmaşık)
4. [ ] Deaths Module + cron job
5. [ ] Taxi Module (RANDOM sıralama)
6. [ ] Pharmacy, Events, Campaigns, Guide, Places, Transport
7. [ ] Notifications Module (FCM)
8. [ ] Admin Module

---

## 🔗 İlgili Dokümantasyon

- `docs/04_API_ENDPOINTS_MASTER.md` - Tüm endpoint'ler
- `docs/10_CORRECTIONS_AND_UPDATES.md` - KRİTİK düzeltmeler
- `CLAUDE.md` - İş kuralları

---

**NOT:** Onay olmadan bir sonraki adıma GEÇMİYORUM!
