# Model Strategy - Hangi Claude Model'i Ne Zaman Kullan?

**Tarih:** 16 Şubat 2026  
**Amaç:** Maliyet optimize ederken kaliteli sonuç almak

---

## 🎯 3 Model Var:

| Model | Hız | Maliyet | Kullan |
|-------|-----|---------|--------|
| **Haiku** | ⚡⚡⚡ | $ | Basit, tekrar eden |
| **Sonnet** | ⚡⚡ | $$ | Kodlama, geliştirme |
| **Opus** | ⚡ | $$$ | Kritik, mimari |

---

## 💰 Maliyet Karşılaştırması

### Haiku (Ucuz - Hızlı)
```
Input:  $0.25 / 1M tokens
Output: $1.25 / 1M tokens

Örnek Görev: Progress.md güncelle (500 token)
Maliyet: ~$0.001 (çok ucuz!)
```

### Sonnet (Orta - Dengeli)
```
Input:  $3 / 1M tokens
Output: $15 / 1M tokens

Örnek Görev: Auth modülü yaz (50K token)
Maliyet: ~$0.90 (makul)
```

### Opus (Pahalı - Güçlü)
```
Input:  $15 / 1M tokens
Output: $75 / 1M tokens

Örnek Görev: Mimari karar (10K token)
Maliyet: ~$1.00 (pahalı ama değer)
```

---

## 🎨 HAIKU - Ne Zaman Kullan?

### ✅ Kullan:

**1. Memory Bank Güncellemeleri**
```
Görev: activeContext.md güncelle
Model: Haiku
Sebep: Basit metin düzenleme, hızlı olmalı
Maliyet: ~$0.001
```

**2. Progress Raporları**
```
Görev: progress.md'ye yeni tamamlanan ekle
Model: Haiku
Sebep: Şablon doldurma, karmaşık düşünme gerektirmez
Maliyet: ~$0.002
```

**3. Git Commit Mesajları**
```
Görev: Son değişiklikler için commit mesajı yaz
Model: Haiku
Sebep: Kısa, basit, formatlı metin
Maliyet: ~$0.0005
```

**4. Basit Dosya Okuma**
```
Görev: activeContext.md'yi oku ve özet ver
Model: Haiku
Sebep: Okuma ve özetleme, kod yazmıyor
Maliyet: ~$0.001
```

---

## 🚀 SONNET - Ne Zaman Kullan?

### ✅ Kullan:

**1. Tüm Kod Yazımı** ⭐ EN ÇOK KULLANILACAK
```
Görev: Auth modülü yaz
Model: Sonnet
Sebep: Kod yazma, test yazma, debugging
Maliyet: ~$0.90 per modül
```

**2. API Endpoint Geliştirme**
```
Görev: POST /ads endpoint'i yaz
Model: Sonnet
Sebep: Validation, iş kuralları, error handling
Maliyet: ~$0.50
```

**3. Admin Panel Component'leri**
```
Görev: Dashboard KPI kartları yaz
Model: Sonnet
Sebep: React component, Tailwind, shadcn/ui
Maliyet: ~$0.40
```

**4. Flutter Widget'ları**
```
Görev: Ad card widget yaz
Model: Sonnet
Sebep: Dart kod, state management, UI
Maliyet: ~$0.30
```

**5. Debugging ve Bug Fix**
```
Görev: Redis connection hatası çöz
Model: Sonnet
Sebep: Kod analizi, problem solving
Maliyet: ~$0.20
```

**6. Test Yazma**
```
Görev: Auth service için unit test
Model: Sonnet
Sebep: Test senaryoları, mock'lar, assertions
Maliyet: ~$0.40
```

---

## 👑 OPUS - Ne Zaman Kullan?

### ✅ Kullan (Az ve Öz):

**1. Kritik Mimari Kararlar**
```
Görev: OTP storage Redis mi PostgreSQL mi?
Model: Opus
Sebep: Sistem tasarımı, trade-off analizi
Maliyet: ~$1.00
Ne Zaman: Projenin başında, önemli çatallanmalarda
```

**2. Karmaşık İş Mantığı**
```
Görev: İlan uzatma sistemi tasarla (reklam bazlı)
Model: Opus
Sebep: Multiple constraints, edge cases
Maliyet: ~$1.50
Ne Zaman: Yeni, karmaşık feature'lar için
```

**3. Performance Optimizasyonu**
```
Görev: N+1 query problemini çöz (tüm proje)
Model: Opus
Sebep: Geniş kod analizi, çoklu çözüm önerisi
Maliyet: ~$2.00
Ne Zaman: Performance bottleneck'lerde
```

**4. Security Audit**
```
Görev: API endpoint'lerini security açısından incele
Model: Opus
Sebep: Detaylı güvenlik analizi, vulnerability tespiti
Maliyet: ~$1.50
Ne Zaman: Production'a gitmeden önce
```

**5. Code Review (Major)**
```
Görev: Tüm backend kodunu gözden geçir
Model: Opus
Sebep: Kapsamlı kod kalitesi analizi
Maliyet: ~$3.00
Ne Zaman: Sprint bitiminde
```

---

## 🎯 Pratik Strateji (Günlük Kullanım)

### Sabah (09:00 - 12:00)

```
1. Memory Bank Oku → Haiku ($0.002)
2. Auth Modülü Yaz → Sonnet ($0.90)
3. Progress Güncelle → Haiku ($0.001)

Toplam: ~$0.90
```

### Öğleden Sonra (13:00 - 18:00)

```
1. Announcements Modülü → Sonnet ($1.00)
2. Test Yaz → Sonnet ($0.40)
3. Bug Fix → Sonnet ($0.20)
4. Memory Bank Güncelle → Haiku ($0.002)

Toplam: ~$1.60
```

### Akşam (18:00 - 19:00)

```
1. Code Review → Opus ($1.00) [Haftada 1 kere]
2. Progress Rapor → Haiku ($0.002)
3. Git Commit → Haiku ($0.001)

Toplam: ~$1.00 (sadece review günü)
```

**Günlük Toplam:** ~$2.50 (Opus kullanmazsan ~$1.50)

---

## 💡 Maliyet Optimize Etme İpuçları

### 1. Haiku'yu Maksimum Kullan

```bash
# Memory Bank güncellemeleri → HAIKU
claude --model haiku "activeContext.md'yi güncelle"

# Basit raporlar → HAIKU
claude --model haiku "progress.md'ye şunu ekle"
```

### 2. Sonnet'i Verimli Kullan

```bash
# Tek seferde çok iş yaptır
❌ KÖTÜ: Her dosya için ayrı prompt (5 prompt)
✅ İYİ: "Tüm Auth modülünü yaz" (1 prompt)

Tasarruf: 5x daha az maliyet
```

### 3. Opus'u Sadece Gerektiğinde

```bash
# Basit karar → SONNET yeterli
❌ "Hangi npm package kullanayım?" → Opus gereksiz

# Kritik karar → OPUS gerekli
✅ "Database mimarisini nasıl tasarlayalım?" → Opus
```

---

## 📊 Aylık Maliyet Tahmini (8 Hafta)

### Hafta 1-2: Backend Core

```
Haiku:  200 kullanım × $0.001 = $0.20
Sonnet: 40 modül × $0.80 = $32.00
Opus:   5 karar × $1.50 = $7.50

Toplam: ~$40/hafta
```

### Hafta 3-4: Backend Modules

```
Haiku:  200 kullanım × $0.001 = $0.20
Sonnet: 40 modül × $0.80 = $32.00
Opus:   3 karar × $1.50 = $4.50

Toplam: ~$37/hafta
```

### Hafta 5-6: Admin Panel

```
Haiku:  150 kullanım × $0.001 = $0.15
Sonnet: 30 component × $0.60 = $18.00
Opus:   2 karar × $1.50 = $3.00

Toplam: ~$21/hafta
```

### Hafta 7-8: Flutter App

```
Haiku:  150 kullanım × $0.001 = $0.15
Sonnet: 30 widget × $0.60 = $18.00
Opus:   2 karar × $1.50 = $3.00

Toplam: ~$21/hafta
```

**8 Haftalık Toplam:** ~$240

---

## ⚡ Hız vs Maliyet

| Görev | Haiku | Sonnet | Opus |
|-------|-------|--------|------|
| Memory update | 5 sn | 15 sn | 30 sn |
| Kod yazma | ❌ | 30 sn | 45 sn |
| Mimari karar | ❌ | 60 sn | 90 sn |

**Sonuç:** Sonnet en dengeli (hız + kalite + maliyet)

---

## 🎯 Önerilen Oran

```
Toplam Kullanım:
- 70% Sonnet (Kodlama)
- 25% Haiku (Memory, raporlar)
- 5% Opus (Kritik kararlar)

Maliyet Dağılımı:
- Sonnet: %80 ($192)
- Opus: %15 ($36)
- Haiku: %5 ($12)
```

---

## ✅ Karar Ağacı

```
Görev geldi →

  Kod yazıyor muyum?
    ├─ Evet → SONNET
    │
    └─ Hayır →
        │
        Memory/Rapor mu?
          ├─ Evet → HAIKU
          │
          └─ Hayır →
              │
              Kritik karar mı?
                ├─ Evet → OPUS
                └─ Hayır → SONNET
```

---

## 📱 Claude Code'da Model Seçimi

```bash
# Claude Code başlatırken model belirt
claude --model sonnet

# Görev sırasında değiştir
/model haiku  # Memory güncelleme için
/model sonnet # Kod yazmaya dön
/model opus   # Kritik karar için
```

---

## 💬 Örnek Günlük Akış

```
09:00 → claude --model haiku
        "activeContext.md'yi oku ve özet ver"
        Maliyet: $0.001

09:05 → claude --model sonnet
        "Auth modülünü yaz"
        Maliyet: $0.90

11:30 → claude --model haiku
        "progress.md'yi güncelle"
        Maliyet: $0.001

13:00 → claude --model opus
        "Push notification sistemi Redis mi Postgres mi?"
        Maliyet: $1.00

14:00 → claude --model sonnet
        "Announcements modülünü yaz"
        Maliyet: $1.00

17:00 → claude --model haiku
        "Günlük rapor oluştur"
        Maliyet: $0.002

Günlük Toplam: $2.90
```

---

## 🎓 Öğrendiklerimiz

1. **Haiku:** Hızlı, ucuz, basit işler için
2. **Sonnet:** Ana iş gücü, %70 kullanım
3. **Opus:** Sadece kritik kararlar, %5 kullanım

**Unutma:** Doğru model seçimi = Hem kalite hem tasarruf! 💰

---

**NOT:** Claude Code otomatik model seçimi YOK, sen manuel belirleyeceksin!
