# KadirliApp - Database Documentation

**Version:** 1.0  
**Date:** 16 Şubat 2026  
**PostgreSQL:** 15+

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Core Tables](#core-tables)
3. [Modül Tabloları](#modül-tabloları)
4. [Önemli Noktalar](#önemli-noktalar)
5. [Performans İpuçları](#performans-ipuçları)

---

## Genel Bakış

### Toplam Tablo Sayısı: 50+

**Kategori Dağılımı:**
- Core: 5 tablo
- Announcements: 4 tablo
- Ads: 7 tablo
- Taxi: 2 tablo
- Deaths: 3 tablo
- Pharmacy: 2 tablo
- Events: 3 tablo
- Campaigns: 5 tablo
- Guide: 2 tablo
- Places: 3 tablo
- Transport: 4 tablo
- Notifications: 1 tablo
- Admin: 5 tablo

---

## Core Tables

### 1. users (Kullanıcılar)

**Amaç:** Tüm kullanıcı tipleri (normal, taksi şoförü, işletme, admin)

**Önemli Kolonlar:**
```sql
phone VARCHAR(15) UNIQUE NOT NULL  -- OTP ile giriş
username VARCHAR(50) UNIQUE        -- Ayda 1 kere değiştirilebilir
role user_role                     -- Enum: user, taxi_driver, business, moderator, admin, super_admin
primary_neighborhood_id UUID       -- Kayıtta seçilen mahalle
notification_preferences JSONB     -- Bildirim tercihleri
fcm_token TEXT                     -- Firebase Cloud Messaging
username_last_changed_at TIMESTAMP -- Değişiklik kontrolü için
```

**İş Kuralları:**
- Kullanıcı adı minimum 3 karakter
- Yaş 13-120 arası
- Mahalle ayda 1 kere değiştirilebilir
- Kullanıcı adı ayda 1 kere değiştirilebilir
- Ban durumunda ban_reason zorunlu

**Indexes:**
```sql
idx_users_phone (phone)
idx_users_username (username)
idx_users_role (role)
idx_users_neighborhood (primary_neighborhood_id)
idx_users_active (is_active) WHERE is_active = true
```

---

### 2. neighborhoods (Mahalleler ve Köyler)

**Amaç:** Kadirli'nin tüm mahalle ve köyleri

**Önemli Kolonlar:**
```sql
name VARCHAR(100) NOT NULL
slug VARCHAR(100) UNIQUE           -- URL-friendly isim
type VARCHAR(20)                   -- 'neighborhood' veya 'village'
population INTEGER                 -- Opsiyonel
latitude/longitude                 -- Gelecekte kullanılabilir
display_order INTEGER              -- Dropdown'da sıralama
```

**Seed Data Örneği:**
```sql
INSERT INTO neighborhoods (name, slug, type, display_order) VALUES
('Merkez Mahallesi', 'merkez', 'neighborhood', 1),
('Akdam Mahallesi', 'akdam', 'neighborhood', 2),
('Yeniköy', 'yenikoy', 'village', 10);
```

---

### 3. files (Dosya Yönetimi)

**Amaç:** Merkezi dosya depolama (CloudFlare R2 + BunnyCDN)

**Önemli Kolonlar:**
```sql
storage_path TEXT NOT NULL         -- CloudFlare R2 path
cdn_url TEXT                       -- BunnyCDN URL (hızlı erişim)
thumbnail_url TEXT                 -- Thumbnail (varsa)
module_type VARCHAR(50)            -- Polimorfik ilişki
module_id UUID                     -- İlişkili kayıt ID
metadata JSONB                     -- width, height, etc.
```

**Polimorfik Kullanım:**
```sql
-- İlan görseli
module_type = 'ad'
module_id = '123e4567-e89b-12d3-a456-426614174000'

-- Duyuru PDF'i
module_type = 'announcement'
module_id = '...'
```

**Örnek Query:**
```sql
-- Bir ilanın tüm görselleri
SELECT f.* FROM files f
JOIN ad_images ai ON f.id = ai.file_id
WHERE ai.ad_id = $1
ORDER BY ai.display_order;
```

---

## Modül Tabloları

### ANNOUNCEMENTS (Duyurular)

#### announcement_types
**Amaç:** Duyuru tiplerini yönetmek (Admin tarafından)

```sql
name VARCHAR(100)                  -- "Elektrik Kesintisi"
slug VARCHAR(100)                  -- "power-outage"
icon VARCHAR(50)                   -- "flash_on" (Material icon)
color VARCHAR(7)                   -- "#FFC107" (HEX)
```

**Seed Data:**
```sql
INSERT INTO announcement_types VALUES
('Elektrik Kesintisi', 'power-outage', 'flash_on', '#FFC107'),
('Su Kesintisi', 'water-outage', 'water_drop', '#2196F3'),
('Acil Durum', 'emergency', 'warning', '#F44336');
```

#### announcements
**Amaç:** Tüm duyurular (manuel + scraping)

**Hedefleme Mekanizması:**
```sql
-- Herkese
target_type = 'all'
target_neighborhoods = NULL

-- Belirli mahallelere
target_type = 'neighborhoods'
target_neighborhoods = '["merkez", "akdam"]'::jsonb

-- Belirli kullanıcılara (test)
target_type = 'users'
target_user_ids = '["uuid1", "uuid2"]'::jsonb
```

**Zamanlama:**
```sql
-- Hemen gönder
scheduled_for = NULL
sent_at = NOW()

-- Zamanlanmış
scheduled_for = '2026-05-15 09:00:00'
sent_at = NULL

-- Tekrarlayan (her gün 09:00)
is_recurring = true
recurrence_pattern = '0 9 * * *'
```

**Kaynak Önceliği (KRİTİK KARAR):**
```sql
-- Manuel her zaman öncelikli
source = 'manual' → status = 'published'

-- Scraping onay bekler
source = 'scraping' → status = 'draft'
-- Admin onaylarsa → status = 'published'
```

**Query Örnekleri:**
```sql
-- Aktif duyurular
SELECT * FROM announcements
WHERE status = 'published'
  AND (visible_until IS NULL OR visible_until > NOW())
  AND deleted_at IS NULL
ORDER BY priority DESC, created_at DESC;

-- Mahalle bazlı filtreleme
SELECT * FROM announcements
WHERE status = 'published'
  AND (
    target_type = 'all' 
    OR (
      target_type = 'neighborhoods' 
      AND target_neighborhoods ? 'merkez'
    )
  );
```

---

### ADS (İlanlar)

#### ad_categories (2 Seviye)
**Amaç:** Hiyerarşik kategori yapısı

```sql
-- Ana kategori
parent_id = NULL
name = 'Vasıta'

-- Alt kategori
parent_id = (Vasıta ID)
name = 'Otomobil'
```

**Query:**
```sql
-- Tüm ana kategoriler
SELECT * FROM ad_categories WHERE parent_id IS NULL;

-- Vasıta alt kategorileri
SELECT * FROM ad_categories 
WHERE parent_id = (SELECT id FROM ad_categories WHERE slug = 'vasita');
```

#### category_properties (Dinamik Özellikler)
**Amaç:** Her kategori için özel özellikler

**Özellik Tipleri:**
- `text`: Serbest yazı
- `number`: Sayı
- `dropdown`: Tek seçim listesi
- `radio`: Tek seçim (görünür)
- `checkbox`: Evet/Hayır
- `date`: Tarih

**Örnek: Vasıta > Otomobil Özellikleri:**
```sql
INSERT INTO category_properties (category_id, property_name, property_type, is_required) VALUES
((SELECT id FROM ad_categories WHERE slug = 'otomobil'), 'Marka', 'dropdown', true),
((SELECT id FROM ad_categories WHERE slug = 'otomobil'), 'Model', 'text', true),
((SELECT id FROM ad_categories WHERE slug = 'otomobil'), 'Yıl', 'number', true),
((SELECT id FROM ad_categories WHERE slug = 'otomobil'), 'Kilometre', 'number', true);

-- Dropdown seçenekleri
INSERT INTO property_options (property_id, option_value) VALUES
((SELECT id FROM category_properties WHERE property_name = 'Marka'), 'Renault'),
((SELECT id FROM category_properties WHERE property_name = 'Marka'), 'Fiat'),
((SELECT id FROM category_properties WHERE property_name = 'Marka'), 'Toyota');
```

#### ads
**Amaç:** İlanlar

**Durum Akışı:**
```
pending → approved → expired
        ↓
     rejected

NOT: Soft delete (deleted_at) ile arşiv
```

**Süre Yönetimi:**
```sql
-- Yeni ilan
expires_at = NOW() + INTERVAL '7 days'

-- Uzatma (3 reklam = 3 gün)
expires_at = expires_at + INTERVAL '3 days'
extension_count = extension_count + 1
```

**Moderasyon:**
```sql
-- Onaylama
status = 'approved'
approved_by = admin_user_id
approved_at = NOW()

-- Reddetme (Dropdown seçenekleri)
status = 'rejected'
rejected_reason = 'Müstehcen içerik' | 'Hatalı bilgiler' | 'Kural dışı'
```

**Query Örnekleri:**
```sql
-- Aktif ilanlar (fiyata göre)
SELECT * FROM ads
WHERE status = 'approved'
  AND expires_at > NOW()
  AND deleted_at IS NULL
ORDER BY price ASC;

-- Popülerliğe göre
ORDER BY view_count DESC;

-- Kategori filtreleme
WHERE category_id IN (
  SELECT id FROM ad_categories 
  WHERE parent_id = (SELECT id FROM ad_categories WHERE slug = 'vasita')
);

-- Text search
WHERE to_tsvector('turkish', title || ' ' || description) 
      @@ plainto_tsquery('turkish', $1);
```

---

### TAXI (Basit Sistem)

#### taxi_drivers
**Amaç:** Taksici bilgileri

**Önemli NOT:**
- Konum takibi YOK
- Random sıralama
- Sadece liste + ara butonu

```sql
name VARCHAR(100)
phone VARCHAR(15)
plaka VARCHAR(20)
vehicle_info VARCHAR(200)          -- "Beyaz Renault Megane"
is_verified BOOLEAN                -- Admin onayı
total_calls INTEGER                -- Basit istatistik
```

**Query:**
```sql
-- Aktif taksiciler (RANDOM sıralama - KRİTİK!)
SELECT * FROM taxi_drivers
WHERE is_verified = true
  AND is_active = true
ORDER BY RANDOM();
```

#### taxi_calls
**Amaç:** Çağrı kaydı (sadece istatistik)

```sql
passenger_id UUID
driver_id UUID
called_at TIMESTAMP                -- Sadece kayıt
```

---

### DEATHS (Vefat İlanları)

#### death_notices
**Amaç:** Vefat ilanları

**Otomatik Arşivleme (KRİTİK!):**
```sql
-- Trigger otomatik hesaplar
auto_archive_at = funeral_date + INTERVAL '7 days'

-- Cron job her gün kontrol eder
UPDATE death_notices
SET deleted_at = NOW()
WHERE auto_archive_at <= NOW()
  AND deleted_at IS NULL;
```

**Moderasyon:**
```sql
status = 'pending' | 'approved' | 'rejected'

-- Hızlı onay (2-6 saat içinde)
approved_by = admin_id
approved_at = NOW()
```

**Query:**
```sql
-- Aktif vefat ilanları
SELECT dn.*, c.name as cemetery_name, m.name as mosque_name
FROM death_notices dn
LEFT JOIN cemeteries c ON dn.cemetery_id = c.id
LEFT JOIN mosques m ON dn.mosque_id = m.id
WHERE dn.status = 'approved'
  AND dn.deleted_at IS NULL
ORDER BY dn.funeral_date DESC, dn.funeral_time DESC;
```

---

### CAMPAIGNS (Kampanyalar)

#### campaigns
**Amaç:** İşletme kampanyaları

**İndirim Kodu:**
```sql
discount_code VARCHAR(50)          -- "KAHVE50" (herkese aynı)
code_view_count INTEGER            -- Kaç kişi görüntüledi
```

**İstatistik (Yöntem 2 - Tıklama Sayısı):**
```sql
-- Kullanıcı "Kodu Göster" butonuna basar
INSERT INTO campaign_code_views (campaign_id, user_id) VALUES ($1, $2);

-- Kampanya view_count güncellenir
UPDATE campaigns 
SET code_view_count = code_view_count + 1
WHERE id = $1;
```

**Query:**
```sql
-- Aktif kampanyalar
SELECT c.*, b.business_name
FROM campaigns c
JOIN businesses b ON c.business_id = b.id
WHERE c.status = 'approved'
  AND c.start_date <= CURRENT_DATE
  AND c.end_date >= CURRENT_DATE
ORDER BY c.created_at DESC;
```

---

## Önemli Noktalar

### 1. Soft Delete Stratejisi

**Soft Delete Kullanan Tablolar:**
- users
- announcements
- ads (6 ay sonra hard delete)
- death_notices (arşiv)
- events
- campaigns

**Neden Soft Delete?**
- İstatistik için
- KVKK/yasal gereklilikler
- Geri getirme ihtiyacı

**Cron Job (6 ay):**
```sql
-- Pasif ilanları hard delete
DELETE FROM ads
WHERE deleted_at < NOW() - INTERVAL '6 months';
```

---

### 2. JSONB Kullanımı

**notification_preferences:**
```json
{
  "announcements": true,
  "deaths": true,
  "pharmacy": true,
  "events": false,
  "ads": false,
  "campaigns": false
}
```

**Query:**
```sql
-- Duyuru bildirimi açık kullanıcılar
SELECT * FROM users
WHERE notification_preferences->>'announcements' = 'true';
```

**target_neighborhoods:**
```json
["merkez", "akdam", "yenikoy"]
```

**Query:**
```sql
-- Merkez mahallesine gönderilecek duyurular
SELECT * FROM announcements
WHERE target_neighborhoods ? 'merkez';
```

---

### 3. Enum Types

**user_role:**
```sql
CREATE TYPE user_role AS ENUM (
    'user',
    'taxi_driver',
    'business',
    'moderator',
    'admin',
    'super_admin'
);
```

**Avantajlar:**
- Tip güvenliği
- Hızlı sorgulama
- Validasyon

**Dezavantajlar:**
- Yeni değer eklemek zor (ALTER TYPE gerekir)

---

### 4. Polimorfik İlişkiler

**files tablosu:**
```sql
module_type VARCHAR(50)            -- 'ad', 'event', 'campaign'
module_id UUID                     -- İlişkili kayıt ID
```

**Kullanım:**
```sql
-- Bir etkinliğin kapak görseli
SELECT * FROM files
WHERE module_type = 'event'
  AND module_id = $1;
```

---

## Performans İpuçları

### 1. Indexleme

**Mutlaka Index Olmalı:**
- Foreign keys
- Sık filtrelenen kolonlar (status, is_active)
- Sık sıralanan kolonlar (created_at, expires_at)
- Text search kolonları

**Composite Index:**
```sql
CREATE INDEX idx_notifications_unread 
ON notifications(user_id, is_read) 
WHERE is_read = false;
```

**Partial Index:**
```sql
CREATE INDEX idx_ads_expires 
ON ads(expires_at) 
WHERE status = 'approved';
```

---

### 2. N+1 Query Önleme

**Kötü:**
```sql
-- 1. Query
SELECT * FROM ads WHERE status = 'approved';

-- N queries (her ilan için)
SELECT * FROM ad_images WHERE ad_id = $1;
```

**İyi:**
```sql
-- Tek query (JOIN)
SELECT a.*, 
       json_agg(json_build_object(
         'id', f.id,
         'url', f.cdn_url
       )) as images
FROM ads a
LEFT JOIN ad_images ai ON a.id = ai.ad_id
LEFT JOIN files f ON ai.file_id = f.id
WHERE a.status = 'approved'
GROUP BY a.id;
```

---

### 3. Pagination

**Offset/Limit (Basit):**
```sql
SELECT * FROM ads
WHERE status = 'approved'
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;  -- Sayfa 3
```

**Cursor-based (Daha Hızlı):**
```sql
SELECT * FROM ads
WHERE status = 'approved'
  AND created_at < $1  -- Son kayıttan devam
ORDER BY created_at DESC
LIMIT 20;
```

---

### 4. Connection Pooling

**Önerilen Ayarlar (40K kullanıcı için):**
```
max_connections = 100
shared_buffers = 2GB
effective_cache_size = 6GB
work_mem = 16MB
```

---

### 5. Materialized Views

**Günlük istatistikler için:**
```sql
CREATE MATERIALIZED VIEW daily_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) FILTER (WHERE role = 'user') as new_users,
    COUNT(*) FILTER (WHERE role = 'business') as new_businesses
FROM users
GROUP BY DATE(created_at);

-- Her gece yenile
REFRESH MATERIALIZED VIEW daily_stats;
```

---

## Bakım ve Monitoring

### 1. Vacuum

```sql
-- Her hafta
VACUUM ANALYZE;

-- Ayda 1
VACUUM FULL;
```

### 2. Dead Tuples

```sql
-- Kontrol
SELECT schemaname, relname, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

### 3. Slow Queries

```sql
-- Slow query log'u aktif et
log_min_duration_statement = 1000  -- 1 saniye
```

### 4. Database Size

```sql
-- Total
SELECT pg_size_pretty(pg_database_size('kadirliapp'));

-- Tablo bazlı
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Güvenlik

### 1. Role-based Access

```sql
-- Read-only user (API için)
CREATE ROLE api_user WITH LOGIN PASSWORD '...';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO api_user;

-- Admin user (backend için)
CREATE ROLE app_admin WITH LOGIN PASSWORD '...';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
```

### 2. Row Level Security (İlerde)

```sql
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY ads_isolation ON ads
    FOR ALL
    TO api_user
    USING (user_id = current_user_id());
```

---

## Migration Stratejisi

### 1. Versiyon Kontrolü

```sql
CREATE TABLE schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Rollback Stratejisi

Her migration için:
- UP script (migration)
- DOWN script (rollback)

---

## Yedekleme

### 1. Daily Backup

```bash
# Full backup
pg_dump kadirliapp > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_$(date +%Y%m%d).sql
```

### 2. Point-in-Time Recovery

```bash
# WAL archiving
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'
```

---

## Sonuç

Bu schema:
- ✅ 12 modülü destekler
- ✅ 40K+ kullanıcıya ölçeklenir
- ✅ Performans optimize edilmiş
- ✅ Güvenli ve bakımı kolay
- ✅ Genişletilebilir

**Tahmini Database Boyutu (1 yıl sonra):**
- Users: ~50 MB
- Announcements: ~100 MB
- Ads: ~500 MB (çok ilan)
- Images (files): ~5 GB
- **Total: ~6 GB**

**PostgreSQL 15 ile rahatça çalışır!** 🚀
