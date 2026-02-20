-- ============================================================================
-- KadirliApp - PostgreSQL Database Schema
-- Version: 1.0
-- Date: 16 Şubat 2026
-- Author: Claude AI (Anthropic)
-- ============================================================================
-- 
-- GENEL BİLGİLER:
-- - PostgreSQL 15+
-- - UTF-8 encoding
-- - Timezone: Europe/Istanbul (UTC+3)
-- - Naming: snake_case
-- - Soft delete: deleted_at column
-- - Timestamps: created_at, updated_at (automatic)
--
-- MODÜLLER:
-- 1. Core (Users, Neighborhoods, Files)
-- 2. Announcements (Duyurular)
-- 3. Ads (İlanlar)
-- 4. Taxi (Taksi - Basit sistem)
-- 5. Deaths (Vefat İlanları)
-- 6. Pharmacy (Nöbetçi Eczane)
-- 7. Events (Etkinlikler)
-- 8. Campaigns (Kampanyalar)
-- 9. Guide (Altın Rehber)
-- 10. Places (Gezilecek Yerler)
-- 11. Transport (Ulaşım)
-- 12. Notifications
-- 13. Admin (Roles, Permissions, Logs)
--
-- ============================================================================

-- Önce eski şemayı temizle (DİKKAT: Production'da KULLANMA!)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Text search için

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Roller Enum
CREATE TYPE user_role AS ENUM (
    'user',           -- Normal kullanıcı
    'taxi_driver',    -- Taksi şoförü
    'business',       -- İşletme sahibi
    'moderator',      -- Moderatör
    'admin',          -- Admin
    'super_admin'     -- Süper admin
);

-- Kullanıcılar
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    age INTEGER,
    role user_role NOT NULL DEFAULT 'user',
    
    -- Mahalle ilişkisi
    primary_neighborhood_id UUID, -- Foreign key aşağıda eklenecek
    location_type VARCHAR(20) CHECK (location_type IN ('neighborhood', 'village')),
    
    -- Bildirim tercihleri (JSONB)
    notification_preferences JSONB DEFAULT '{
        "announcements": true,
        "deaths": true,
        "pharmacy": true,
        "events": true,
        "ads": false,
        "campaigns": false
    }'::jsonb,
    
    -- FCM token
    fcm_token TEXT,
    
    -- Profil
    profile_photo_url TEXT,
    
    -- Değişiklik limitleri
    username_last_changed_at TIMESTAMP,
    neighborhood_last_changed_at TIMESTAMP,
    
    -- Durum
    is_active BOOLEAN DEFAULT true,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    banned_at TIMESTAMP,
    banned_by UUID,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT username_min_length CHECK (char_length(username) >= 3),
    CONSTRAINT age_range CHECK (age >= 13 AND age <= 120)
);

-- Mahalleler ve Köyler
CREATE TABLE neighborhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('neighborhood', 'village')),
    
    -- Opsiyonel: Nüfus bilgisi
    population INTEGER,
    
    -- Opsiyonel: Koordinatlar (gelecekte kullanılabilir)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Sıralama
    display_order INTEGER DEFAULT 0,
    
    -- Durum
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Foreign key ekle (circular dependency nedeniyle ayrı)
ALTER TABLE users 
ADD CONSTRAINT fk_users_neighborhood 
FOREIGN KEY (primary_neighborhood_id) 
REFERENCES neighborhoods(id) ON DELETE SET NULL;

-- Gelecek için: Çoklu mahalle desteği (şimdilik kullanılmıyor)
CREATE TABLE user_neighborhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, neighborhood_id)
);

-- Dosyalar (Merkezi dosya yönetimi)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Dosya bilgileri
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL UNIQUE,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes INTEGER NOT NULL,
    
    -- Storage
    storage_path TEXT NOT NULL, -- CloudFlare R2 path
    cdn_url TEXT, -- BunnyCDN URL
    thumbnail_url TEXT, -- Thumbnail URL (varsa)
    
    -- İlişki (polimorfik)
    module_type VARCHAR(50), -- 'announcement', 'ad', 'death', 'event', etc.
    module_id UUID,
    
    -- Yükleyen
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Metadata
    metadata JSONB, -- width, height, duration, etc.
    
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- ============================================================================
-- ANNOUNCEMENTS (DUYURULAR)
-- ============================================================================

-- Duyuru tipleri (Admin tarafından yönetilir)
CREATE TABLE announcement_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50), -- Material icon name
    color VARCHAR(7), -- HEX color (#FF5722)
    description TEXT,
    
    -- Sıralama
    display_order INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Duyurular
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- İçerik
    type_id UUID NOT NULL REFERENCES announcement_types(id),
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    
    -- Öncelik
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' 
        CHECK (priority IN ('low', 'normal', 'high', 'emergency')),
    
    -- Hedefleme
    target_type VARCHAR(20) NOT NULL DEFAULT 'all'
        CHECK (target_type IN ('all', 'neighborhoods', 'users')),
    target_neighborhoods JSONB, -- ['merkez', 'akdam'] array
    target_user_ids JSONB, -- [uuid1, uuid2] array (test için)
    
    -- Zamanlama
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    
    -- Tekrarlayan (cron format: "0 9 * * *")
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(100), -- Cron pattern
    
    -- Bildirim
    send_push_notification BOOLEAN DEFAULT true,
    
    -- Kaynak (manuel vs scraping)
    source VARCHAR(50) DEFAULT 'manual' 
        CHECK (source IN ('manual', 'scraping', 'api')),
    source_url TEXT, -- Scraping URL (varsa)
    
    -- Görünürlük
    visible_until TIMESTAMP, -- Bu tarihten sonra gizle
    
    -- Ek dosyalar
    has_pdf BOOLEAN DEFAULT false,
    pdf_file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    has_link BOOLEAN DEFAULT false,
    external_link TEXT,
    
    -- İstatistik
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    
    -- Durum
    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    
    -- Oluşturan
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Duyuru görüntülenme takibi (opsiyonel, performans için)
CREATE TABLE announcement_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(announcement_id, user_id)
);

-- Elektrik kesintisi verisi (scraping için)
CREATE TABLE power_outages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
    
    neighborhood VARCHAR(100),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    reason TEXT,
    
    source VARCHAR(50) DEFAULT 'scraping',
    source_url TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ADS (İLANLAR)
-- ============================================================================

-- İlan kategorileri (2 seviye: Ana > Alt)
CREATE TABLE ad_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    
    -- Hiyerarşi (2 seviye)
    parent_id UUID REFERENCES ad_categories(id) ON DELETE CASCADE,
    
    -- Icon
    icon VARCHAR(50),
    
    -- Sıralama
    display_order INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Kategori özellikleri (Her kategori için ayrı)
CREATE TABLE category_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES ad_categories(id) ON DELETE CASCADE,
    
    -- Özellik bilgisi
    property_name VARCHAR(100) NOT NULL,
    property_type VARCHAR(20) NOT NULL 
        CHECK (property_type IN ('text', 'number', 'dropdown', 'radio', 'checkbox', 'date')),
    
    -- Zorunluluk
    is_required BOOLEAN DEFAULT false,
    
    -- Varsayılan değer
    default_value TEXT,
    
    -- Sıralama
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(category_id, property_name)
);

-- Özellik seçenekleri (Dropdown/Radio için)
CREATE TABLE property_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES category_properties(id) ON DELETE CASCADE,
    
    option_value VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- İlanlar
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Kategori
    category_id UUID NOT NULL REFERENCES ad_categories(id),
    
    -- İçerik
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12, 2),
    
    -- İlan sahibi
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_name VARCHAR(100),
    contact_phone VARCHAR(15) NOT NULL,
    
    -- Durum
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'sold')),
    
    -- Moderasyon
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejected_reason VARCHAR(50), -- Dropdown seçeneği
    rejected_at TIMESTAMP,
    
    -- Süre (7 gün)
    expires_at TIMESTAMP NOT NULL,
    
    -- Uzatma (Reklam bazlı: 3 reklam = 3 gün)
    extension_count INTEGER DEFAULT 0,
    max_extensions INTEGER DEFAULT 3,
    
    -- İstatistik
    view_count INTEGER DEFAULT 0,
    phone_click_count INTEGER DEFAULT 0,
    whatsapp_click_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP -- Pasif ilanlar 6 ay sonra silinir
);

-- İlan özellik değerleri
CREATE TABLE ad_property_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES category_properties(id),
    value TEXT NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(ad_id, property_id)
);

-- İlan görselleri
CREATE TABLE ad_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    
    is_cover BOOLEAN DEFAULT false, -- Kullanıcı seçer
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(ad_id, file_id)
);

-- Favori ilanlar
CREATE TABLE ad_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, ad_id)
);

-- Reklam izleme (İlan uzatma için)
CREATE TABLE ad_extensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Kaç reklam izlendi
    ads_watched INTEGER DEFAULT 0,
    
    -- Kaç gün uzatıldı (3 reklam = 3 gün)
    days_extended INTEGER DEFAULT 0,
    
    extended_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TAXI (TAKSİ - BASİT SİSTEM)
-- ============================================================================

-- Taksiciler
CREATE TABLE taxi_drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    
    -- Taksici bilgileri
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    plaka VARCHAR(20),
    vehicle_info VARCHAR(200), -- Marka, model, renk
    
    -- Belge (admin kontrolü için)
    license_file_id UUID REFERENCES files(id),
    registration_file_id UUID REFERENCES files(id),
    
    -- Onay
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    
    -- Durum (aktif/pasif)
    is_active BOOLEAN DEFAULT true,
    
    -- İstatistik (basit)
    total_calls INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Taksi çağrıları (basit kayıt - istatistik için)
CREATE TABLE taxi_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passenger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES taxi_drivers(id) ON DELETE CASCADE,
    
    -- Sadece kayıt (telefon araması yapıldı mı bilgisi YOK)
    called_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DEATHS (VEFAT İLANLARI)
-- ============================================================================

-- Mezarlıklar
CREATE TABLE cemeteries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Camiler
CREATE TABLE mosques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vefat ilanları
CREATE TABLE death_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Vefat eden bilgisi
    deceased_name VARCHAR(150) NOT NULL,
    age INTEGER,
    photo_file_id UUID REFERENCES files(id),
    
    -- Cenaze bilgileri
    funeral_date DATE NOT NULL,
    funeral_time TIME NOT NULL,
    
    -- Lokasyonlar
    cemetery_id UUID REFERENCES cemeteries(id),
    mosque_id UUID REFERENCES mosques(id),
    condolence_address TEXT, -- Taziye evi adresi
    
    -- Ekleyen
    added_by UUID NOT NULL REFERENCES users(id),
    
    -- Moderasyon
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejected_reason TEXT,
    
    -- Otomatik silme (Defin tarihinden 7 gün sonra)
    auto_archive_at TIMESTAMP NOT NULL, -- funeral_date + 7 days
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP -- Soft delete (arşiv)
);

-- ============================================================================
-- PHARMACY (NÖBETÇİ ECZANE)
-- ============================================================================

-- Eczaneler
CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15),
    
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Çalışma saatleri (normal günler)
    working_hours VARCHAR(50), -- "08:30-19:00"
    
    pharmacist_name VARCHAR(100),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Nöbetçi eczane takvimi
CREATE TABLE pharmacy_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    
    duty_date DATE NOT NULL,
    start_time TIME DEFAULT '19:00',
    end_time TIME DEFAULT '09:00', -- Ertesi gün
    
    -- Kaynak (manuel vs scraping)
    source VARCHAR(20) DEFAULT 'manual'
        CHECK (source IN ('manual', 'scraping')),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(pharmacy_id, duty_date)
);

-- ============================================================================
-- EVENTS (ETKİNLİKLER)
-- ============================================================================

-- Etkinlik kategorileri
CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Etkinlikler
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- İçerik
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES event_categories(id),
    
    -- Tarih/Saat
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    duration_minutes INTEGER,
    
    -- Lokasyon
    venue_name VARCHAR(100),
    venue_address TEXT,
    city VARCHAR(50), -- Kadirli, Adana, Osmaniye
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Detaylar
    organizer VARCHAR(100),
    ticket_price DECIMAL(10, 2),
    is_free BOOLEAN DEFAULT true,
    age_restriction VARCHAR(20), -- '18+', '21+', 'all'
    capacity INTEGER,
    
    -- Link
    website_url TEXT,
    ticket_url TEXT,
    
    -- Görseller
    cover_image_id UUID REFERENCES files(id),
    
    -- Tekrarlayan (Her Cumartesi gibi)
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(100),
    
    -- Durum
    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'cancelled', 'archived')),
    
    -- Oluşturan
    created_by UUID NOT NULL REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Etkinlik görselleri
CREATE TABLE event_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- CAMPAIGNS (KAMPANYALAR)
-- ============================================================================

-- İşletme kategorileri
CREATE TABLE business_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    parent_id UUID REFERENCES business_categories(id),
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- İşletmeler (business role'ü olanlar)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    
    -- İşletme bilgileri
    business_name VARCHAR(150) NOT NULL,
    category_id UUID REFERENCES business_categories(id),
    tax_number VARCHAR(20),
    
    -- İletişim
    address TEXT,
    phone VARCHAR(15),
    email VARCHAR(100),
    website_url TEXT,
    instagram_handle VARCHAR(50),
    
    -- Görsel
    logo_file_id UUID REFERENCES files(id),
    
    -- Onay
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Kampanyalar
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- İçerik
    title VARCHAR(200) NOT NULL,
    description TEXT,
    discount_percentage INTEGER, -- %50
    
    -- İndirim kodu (herkese aynı)
    discount_code VARCHAR(50),
    
    -- Kullanım şartları
    terms TEXT,
    minimum_amount DECIMAL(10, 2),
    stock_limit INTEGER, -- "İlk 100 kişiye"
    
    -- Süre
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Görsel
    cover_image_id UUID REFERENCES files(id),
    
    -- İstatistik (Tıklama sayısı - Yöntem 2)
    code_view_count INTEGER DEFAULT 0,
    
    -- Durum
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'expired')),
    
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejected_reason TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Kampanya görselleri
CREATE TABLE campaign_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Kod görüntüleme takibi (İstatistik için)
CREATE TABLE campaign_code_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- GUIDE (ALTIN REHBER)
-- ============================================================================

-- Rehber kategorileri
CREATE TABLE guide_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    parent_id UUID REFERENCES guide_categories(id),
    
    icon VARCHAR(50),
    color VARCHAR(7),
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rehber kayıtları (İşletme/Kişi)
CREATE TABLE guide_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES guide_categories(id),
    
    -- Bilgiler
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    email VARCHAR(100),
    website_url TEXT,
    
    -- Çalışma saatleri
    working_hours VARCHAR(100),
    
    -- Konum
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Görsel
    logo_file_id UUID REFERENCES files(id),
    
    -- Açıklama
    description TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PLACES (GEZİLECEK YERLER)
-- ============================================================================

-- Yer kategorileri
CREATE TABLE place_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Gezilecek yerler
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES place_categories(id),
    
    -- İçerik
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Lokasyon
    address TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Bilgiler
    entrance_fee DECIMAL(10, 2),
    is_free BOOLEAN DEFAULT true,
    opening_hours VARCHAR(100),
    best_season VARCHAR(50), -- 'spring', 'summer', etc.
    
    -- Ulaşım
    how_to_get_there TEXT,
    distance_from_center DECIMAL(5, 2), -- km
    
    -- Görsel
    cover_image_id UUID REFERENCES files(id),
    
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Yer görselleri
CREATE TABLE place_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TRANSPORT (ULAŞIM)
-- ============================================================================

-- Şehir dışı hatlar
CREATE TABLE intercity_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination VARCHAR(100) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    duration_minutes INTEGER,
    company VARCHAR(100),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Şehir dışı sefer saatleri
CREATE TABLE intercity_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES intercity_routes(id) ON DELETE CASCADE,
    departure_time TIME NOT NULL,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Şehir içi rotalar
CREATE TABLE intracity_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_number VARCHAR(20) NOT NULL,
    route_name VARCHAR(200) NOT NULL, -- "Otogar - Hastane - Fakülte"
    
    first_departure TIME,
    last_departure TIME,
    frequency_minutes INTEGER, -- 30 dakikada bir
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Şehir içi duraklar
CREATE TABLE intracity_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES intracity_routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(100) NOT NULL,
    stop_order INTEGER NOT NULL,
    time_from_start INTEGER, -- Dakika cinsinden
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS (BİLDİRİMLER)
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- İçerik
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    
    -- Tip
    type VARCHAR(50) NOT NULL, -- 'announcement', 'ad', 'death', 'campaign', etc.
    
    -- İlgili kayıt
    related_id UUID,
    related_type VARCHAR(50),
    
    -- Durum
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    -- FCM gönderim
    fcm_sent BOOLEAN DEFAULT false,
    fcm_sent_at TIMESTAMP,
    fcm_error TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ADMIN (YÖNETİM)
-- ============================================================================

-- İzinler (Modül bazlı)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module VARCHAR(50) NOT NULL, -- 'announcements', 'ads', 'users', etc.
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'approve'
    description TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(module, action)
);

-- Rol-İzin ilişkisi (Süper admin tarafından yönetilir)
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(role, permission_id)
);

-- Audit log (Önemli işlemler)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    action VARCHAR(100) NOT NULL, -- 'ad_approved', 'user_banned', etc.
    module VARCHAR(50) NOT NULL,
    
    -- Etkilenen kayıt
    affected_id UUID,
    affected_type VARCHAR(50),
    
    -- Detaylar
    details JSONB,
    
    -- IP ve cihaz
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scraper logları
CREATE TABLE scraper_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scraper_name VARCHAR(100) NOT NULL, -- 'power_outage', 'pharmacy', etc.
    
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
    
    -- Sonuç
    records_found INTEGER DEFAULT 0,
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    
    -- Hata
    error_message TEXT,
    
    -- Süre
    duration_seconds DECIMAL(8, 2),
    
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Şikayet ve öneriler
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    type VARCHAR(20) NOT NULL CHECK (type IN ('complaint', 'suggestion')),
    
    -- İlgili modül/kayıt
    related_module VARCHAR(50),
    related_id UUID,
    
    -- İçerik
    subject VARCHAR(200),
    message TEXT NOT NULL,
    
    -- Durum
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'reviewing', 'resolved', 'rejected')),
    
    -- Admin notu
    admin_notes TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES (PERFORMANS İÇİN)
-- ============================================================================

-- Users
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_neighborhood ON users(primary_neighborhood_id);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- Neighborhoods
CREATE INDEX idx_neighborhoods_slug ON neighborhoods(slug);
CREATE INDEX idx_neighborhoods_type ON neighborhoods(type);

-- Announcements
CREATE INDEX idx_announcements_type ON announcements(type_id);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_scheduled ON announcements(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX idx_announcements_created ON announcements(created_at DESC);

-- Ads
CREATE INDEX idx_ads_category ON ads(category_id);
CREATE INDEX idx_ads_user ON ads(user_id);
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_expires ON ads(expires_at) WHERE status = 'approved';
CREATE INDEX idx_ads_created ON ads(created_at DESC);

-- Text search
CREATE INDEX idx_ads_title_search ON ads USING gin(to_tsvector('turkish', title));
CREATE INDEX idx_ads_description_search ON ads USING gin(to_tsvector('turkish', description));

-- Deaths
CREATE INDEX idx_deaths_status ON death_notices(status);
CREATE INDEX idx_deaths_funeral_date ON death_notices(funeral_date);
CREATE INDEX idx_deaths_auto_archive ON death_notices(auto_archive_at) WHERE deleted_at IS NULL;

-- Pharmacy
CREATE INDEX idx_pharmacy_schedule_date ON pharmacy_schedules(duty_date);

-- Events
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_category ON events(category_id);

-- Campaigns
CREATE INDEX idx_campaigns_business ON campaigns(business_id);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Audit logs
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_module ON audit_logs(module);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================================
-- TRIGGERS (OTOMATİK İŞLEMLER)
-- ============================================================================

-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları ekle
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vefat ilanı için otomatik arşivleme tarihi
CREATE OR REPLACE FUNCTION set_death_notice_auto_archive()
RETURNS TRIGGER AS $$
BEGIN
    NEW.auto_archive_at = (NEW.funeral_date + INTERVAL '7 days')::timestamp;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_death_auto_archive BEFORE INSERT ON death_notices
    FOR EACH ROW EXECUTE FUNCTION set_death_notice_auto_archive();

-- ============================================================================
-- INITIAL DATA (SEED DATA)
-- ============================================================================

-- Varsayılan duyuru tipleri
INSERT INTO announcement_types (name, slug, icon, color) VALUES
('Elektrik Kesintisi', 'power-outage', 'flash_on', '#FFC107'),
('Su Kesintisi', 'water-outage', 'water_drop', '#2196F3'),
('Eğitim & Sınav', 'education', 'school', '#4CAF50'),
('Genel Duyuru', 'general', 'info', '#9E9E9E'),
('Acil Durum', 'emergency', 'warning', '#F44336');

-- Varsayılan izinler
INSERT INTO permissions (module, action, description) VALUES
-- Announcements
('announcements', 'create', 'Duyuru oluşturma'),
('announcements', 'read', 'Duyuruları görüntüleme'),
('announcements', 'update', 'Duyuru düzenleme'),
('announcements', 'delete', 'Duyuru silme'),
('announcements', 'send', 'Duyuru gönderme'),
-- Ads
('ads', 'create', 'İlan oluşturma'),
('ads', 'read', 'İlanları görüntüleme'),
('ads', 'approve', 'İlan onaylama'),
('ads', 'reject', 'İlan reddetme'),
('ads', 'delete', 'İlan silme'),
-- Users
('users', 'read', 'Kullanıcıları görüntüleme'),
('users', 'update', 'Kullanıcı düzenleme'),
('users', 'ban', 'Kullanıcı banlama'),
('users', 'delete', 'Kullanıcı silme'),
-- Campaigns
('campaigns', 'create', 'Kampanya oluşturma'),
('campaigns', 'approve', 'Kampanya onaylama'),
('campaigns', 'reject', 'Kampanya reddetme');

-- Super admin için tüm izinler
INSERT INTO role_permissions (role, permission_id)
SELECT 'super_admin', id FROM permissions;

-- ============================================================================
-- VIEWS (KOLAY ERİŞİM İÇİN)
-- ============================================================================

-- Aktif nöbetçi eczane view
CREATE OR REPLACE VIEW current_duty_pharmacy AS
SELECT 
    p.*,
    ps.duty_date,
    ps.start_time,
    ps.end_time
FROM pharmacies p
JOIN pharmacy_schedules ps ON p.id = ps.pharmacy_id
WHERE ps.duty_date = CURRENT_DATE
  AND p.is_active = true;

-- Onay bekleyen içerikler
CREATE OR REPLACE VIEW pending_approvals AS
SELECT 
    'ad' as type,
    id,
    title as content,
    created_at,
    user_id as creator_id
FROM ads 
WHERE status = 'pending'
UNION ALL
SELECT 
    'death' as type,
    id,
    deceased_name as content,
    created_at,
    added_by as creator_id
FROM death_notices
WHERE status = 'pending'
UNION ALL
SELECT 
    'campaign' as type,
    id,
    title as content,
    created_at,
    (SELECT user_id FROM businesses WHERE id = business_id) as creator_id
FROM campaigns
WHERE status = 'pending'
ORDER BY created_at ASC;

-- ============================================================================
-- COMMENTS (Tablo açıklamaları)
-- ============================================================================

COMMENT ON TABLE users IS 'Kullanıcılar - tüm roller (user, taxi_driver, business, moderator, admin, super_admin)';
COMMENT ON TABLE neighborhoods IS 'Mahalleler ve köyler';
COMMENT ON TABLE announcements IS 'Duyurular - manuel ve otomatik (scraping)';
COMMENT ON TABLE ads IS 'İlanlar - 2 seviye kategori + dinamik özellikler';
COMMENT ON TABLE taxi_drivers IS 'Taksiciler - basit sistem (random sıralama)';
COMMENT ON TABLE death_notices IS 'Vefat ilanları - defin tarihinden 7 gün sonra arşiv';
COMMENT ON TABLE pharmacy_schedules IS 'Nöbetçi eczane takvimi';
COMMENT ON TABLE events IS 'Etkinlikler - Kadirli + Adana + Osmaniye';
COMMENT ON TABLE campaigns IS 'Kampanyalar - işletmeler için indirim kodları';
COMMENT ON TABLE guide_items IS 'Altın Rehber - işletme ve kişi kayıtları';
COMMENT ON TABLE places IS 'Gezilecek yerler - turizm noktaları';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
