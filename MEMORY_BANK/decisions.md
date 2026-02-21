# Decisions Log - Önemli Kararlar

**Amaç:** Proje boyunca alınan önemli kararları kaydetmek

---

## 📝 Karar Formatı

```markdown
## [Tarih] - [Konu Başlığı]

**Durum:** Onaylandı / Tartışılıyor / Reddedildi

**Soru:** [Ne karar veriliyor?]

**Seçenekler:**
1. Seçenek A
   - Artı: ...
   - Eksi: ...
2. Seçenek B
   - Artı: ...
   - Eksi: ...

**Karar:** [Hangi seçenek seçildi]

**Gerekçe:** [Neden bu seçenek?]

**Etkilenen Modüller:** [Hangi modüller etkilenir]

**Karar Veren:** [Claude / Kullanıcı]
```

---

## 16 Şubat 2026 - OTP Storage Mekanizması

**Durum:** ✅ Onaylandı

**Soru:** OTP kodlarını nerede saklamalıyız?

**Seçenekler:**
1. **Redis**
   - Artı: Hızlı, TTL desteği, memory-based
   - Eksi: Persistent değil (restart'ta kaybolur)

2. **PostgreSQL**
   - Artı: Persistent, reliable
   - Eksi: Yavaş, TTL için cron gerekir

**Karar:** Redis kullanacağız

**Gerekçe:**
- OTP temporary data (5 dakika geçerli)
- TTL otomatik expire ediyor
- Hız kritik (her login'de kullanılacak)
- Kaybolsa bile kullanıcı yeni OTP alabilir

**Etkilenen Modüller:** Auth

**Karar Veren:** Claude (docs/08 prompt chain'den)

---

## 16 Şubat 2026 - Taksi Sıralama Stratejisi

**Durum:** ✅ Onaylandı

**Soru:** Taksiler nasıl sıralanmalı?

**Seçenekler:**
1. **Konum bazlı** (En yakın önce)
   - Artı: Kullanıcıya en yakın taksi
   - Eksi: Konum tracking gerekir, KVKK sorunları

2. **Manuel sıralama** (Admin belirler)
   - Artı: Kontrol edilebilir
   - Eksi: Adil değil, favoritism

3. **Random sıralama**
   - Artı: Adil, kolay, KVKK yok
   - Eksi: En yakın taksi olmayabilir

**Karar:** Random sıralama (ORDER BY RANDOM())

**Gerekçe:**
- Konum tracking KVKK sorunu yaratır
- Manuel sıralama adil değil
- Random en basit ve adil çözüm
- Her refresh'te farklı sıralama

**Etkilenen Modüller:** Taxi, Admin Panel (Taksi yönetimi)

**Karar Veren:** Kullanıcı (docs/10 corrections'dan)

---

## 16 Şubat 2026 - Rich Text Editor Kullanımı

**Durum:** ✅ Reddedildi

**Soru:** İlan/Duyuru description'ları için Rich Text Editor kullanılmalı mı?

**Seçenekler:**
1. **Rich Text Editor** (TipTap, Quill, etc.)
   - Artı: Bold, italic, link desteği
   - Eksi: HTML output, Flutter render zor, karmaşık

2. **Plain Textarea**
   - Artı: Basit, Flutter uyumlu, güvenli
   - Eksi: Formatting yok

**Karar:** Plain Textarea kullanacağız

**Gerekçe:**
- HTML output Flutter'da render etmek zor
- MVP için gereksiz karmaşıklık
- Security riski (XSS)
- İleride Markdown eklenebilir

**Etkilenen Modüller:** Announcements, Ads, Events, Admin Panel

**Karar Veren:** Kullanıcı (Gemini feedback'den)

---

## 17 Şubat 2026 - Push Notification Provider

**Durum:** ✅ Onaylandı

**Soru:** Push notification için hangi servis?

**Seçenekler:**
1. **Firebase FCM**
   - Artı: Ücretsiz, kolay, cross-platform
   - Eksi: Google'a bağımlılık

2. **OneSignal**
   - Artı: Zengin features, analytics
   - Eksi: Ücretli (100K user'dan sonra)

3. **AWS SNS**
   - Artı: Scalable, AWS ekosistemi
   - Eksi: Karmaşık, pahalı

**Karar:** Firebase FCM

**Gerekçe:**
- Ücretsiz (40K kullanıcı için yeterli)
- Kolay entegrasyon
- Flutter native desteği
- Reliable

**Etkilenen Modüller:** Notifications, Flutter App

**Karar Veren:** Claude

---

## 18 Şubat 2026 - İlan Fotoğraf Limiti

**Durum:** ✅ Onaylandı

**Soru:** İlanlarda maksimum kaç fotoğraf olabilir?

**Seçenekler:**
1. **3 fotoğraf** (Minimum)
2. **5 fotoğraf** (Orta)
3. **10 fotoğraf** (Maksimum)
4. **Sınırsız** (Premium)

**Karar:** 5 fotoğraf

**Gerekçe:**
- 3 az (ürünü tam gösteremezsin)
- 10 çok (storage maliyeti, UI karmaşıklığı)
- 5 dengeli (hem yeterli hem manageable)

**Etkilenen Modüller:** Ads, Admin Panel, Flutter App

**Karar Veren:** Claude (docs/04 API'den)

---

## 22 Şubat 2026 - AdminController Modülerleştirme

**Durum:** ✅ Onaylandı ve uygulandı

**Soru:** Tek büyük AdminController (170+ satır) sürdürülebilir mi?

**Seçenekler:**
1. **Tek büyük AdminController** — Tüm rotalar tek dosyada
   - Artı: Basit
   - Eksi: Bakımı zor, büyüdükçe sorun çıkar
2. **Sub-controller'lara bölme** — Her domain için ayrı controller
   - Artı: Tek sorumluluk, kolay büyüme, okunabilir
   - Eksi: Daha fazla dosya

**Karar:** Her domain için ayrı sub-controller, aynı AdminModule içinde

**Gerekçe:**
- Campaigns/Users/Pharmacy tamamen farklı domainler
- AdminController core sorumluluğa odaklanmalı (dashboard/approvals/ads/scrapers)
- Yeni modül eklemek artık admin.controller.ts'e dokunmayı gerektirmiyor

**Sonuç:**
- `campaign-admin.controller.ts` → /admin/campaigns/*
- `users-admin.controller.ts` → /admin/users/*
- `pharmacy-admin.controller.ts` → /admin/pharmacy/*
- `admin.controller.ts` → 170 satırdan 62 satıra indi

**Etkilenen Modüller:** Admin

**Karar Veren:** Claude (Audit sonrası sürdürülebilirlik değerlendirmesi)

---

## 22 Şubat 2026 - shadcn Form Bileşeni Kullanılmıyor

**Durum:** ✅ Onaylandı

**Soru:** Admin panel formları için shadcn Form bileşeni kullanılmalı mı?

**Karar:** HAYIR — `@/components/ui/form` projede kurulu değil

**Gerekçe:**
- shadcn Form bileşeni `react-hook-form` ile çalışır ve ayrıca yüklenmesi gerekir
- Mevcut projede kurulmamış
- Farmlar için plain controlled inputs + useState + manual validation yeterli

**Etkilenen Modüller:** Tüm admin form bileşenleri (PharmacyForm, vb.)

**Karar Veren:** Claude (hata keşfedilince)

---

## [YENİ KARAR ŞABLONU]

## [Tarih] - [Başlık]

**Durum:** ⏳ Tartışılıyor

**Soru:**

**Seçenekler:**
1.
2.

**Karar:**

**Gerekçe:**

**Etkilenen Modüller:**

**Karar Veren:**

---

**NOT:** Önemli bir karar aldığında buraya ekle!
