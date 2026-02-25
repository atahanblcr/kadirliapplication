# Flutter Ads Skill - İlan Modülü (TEK YAZMA YETKİSİ!)

**Dosya:** SKILLS/flutter-ads.md
**Tarih:** 24 Şubat 2026
**Amaç:** İlan CRUD sistemi - Mobil kullanıcının TEK yazma yetkisi olan modül

---

## ⚠️ KRİTİK BİLGİ

**MOBİL KULLANICI YETKİLERİ:**
- ✅ İlan Ekleyebilir (CREATE)
- ✅ Kendi İlanını Düzenleyebilir (UPDATE)
- ✅ Kendi İlanını Silebilir (DELETE)
- ✅ Tüm İlanları Görüntüleyebilir (READ)
- ✅ Favori Ekleyebilir/Çıkarabilir

**DİĞER TÜM MODÜLLER (Duyuru, Vefat, Kampanya, vb.):**
- ❌ SADECE OKUMA (READ-ONLY)
- ❌ İçerik ekleme/düzenleme/silme YOK

---

## 📋 EKRAN YAPISI (4 ANA EKRAN)

### 1. İLAN LİSTESİ (Ana Ekran)

**Dosya:** `lib/features/ads/presentation/pages/ads_list_page.dart`

**UI Bileşenleri:**
```
TopBar:
- Başlık: "İlanlar"
- Arama ikonu (sağ üst)
- Filtre ikonu (sağ üst)

Content:
- Kategori scroll (yatay)
- İlan listesi (vertical scroll)
- Floating Action Button: "+" (yeni ilan)
- Pull-to-refresh

BottomBar:
- Ana Sayfa, İlanlar*, Favoriler, Profil
```

**İlan Kartı (Tekrarlayan):**
```
┌─────────────────────────────────────┐
│ [Fotoğraf]      Başlık              │
│ 200x200         Fiyat: 5.000 ₺      │
│                 Konum: Merkez Mah.  │
│                 Tarih: 2 saat önce  │
│                 [❤️ Favori]         │
└─────────────────────────────────────┘
```

**Kategori Scroll (Yatay):**
```
[ Tümü ] [ Emlak ] [ Araç ] [ Elektronik ] [ İş İlanı ] ...
```

**Filtreleme:**
```dart
Bottom Sheet:
- Kategori (dropdown)
- Fiyat Aralığı (min-max slider)
- Konum (mahalle dropdown)
- Sıralama (yeni, ucuz, pahalı)
- [Temizle] [Uygula] butonlar
```

**API Call:**
```dart
GET /v1/ads?page=1&limit=20&category_id=xxx&min_price=0&max_price=10000

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "2020 Model Volkswagen Polo",
      "price": 450000,
      "cover_image": {
        "id": "uuid",
        "url": "http://api.../uploads/xxx.jpg"
      },
      "neighborhood": {
        "id": "uuid",
        "name": "Merkez Mahallesi"
      },
      "category": {
        "id": "uuid",
        "name": "Araçlar"
      },
      "created_at": "2026-02-24T10:00:00Z",
      "is_favorite": false
    }
  ],
  "meta": { "page": 1, "total": 150, ... }
}
```

**Pagination:**
- Lazy loading (scroll'da yeni sayfa yükle)
- Loading indicator (alt kısımda)

---

### 2. İLAN DETAY EKRANI

**Dosya:** `lib/features/ads/presentation/pages/ad_detail_page.dart`

**UI Bileşenleri:**
```
Top:
- Fotoğraf galeri (swipeable, indicator)
- Geri butonu (sol üst)
- Favori butonu (sağ üst)
- Paylaş butonu (sağ üst)

Content:
- Başlık
- Fiyat (büyük, bold)
- Kategori (badge)
- Konum (icon + mahalle)
- Tarih (X saat/gün önce)
- Açıklama (genişletilebilir "Daha Fazla")
- Özellikler (dinamik, key-value)
- İlan Sahibi:
  * Kullanıcı adı
  * Telefon (maskeli)
  * [Telefon] [WhatsApp] butonlar

Bottom (Sabit):
- EĞER kendi ilanınsa:
  * [Düzenle] [Sil] butonlar
- EĞER başkasının ilanıysa:
  * [Telefonu Göster] butonu
```

**API Call:**
```dart
GET /v1/ads/:id

// View count tracking otomatik (+1)

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "...",
    "description": "...",
    "price": 450000,
    "category": { ... },
    "neighborhood": { ... },
    "images": [
      { "id": "uuid", "url": "..." },
      { "id": "uuid", "url": "..." }
    ],
    "properties": [
      { "key": "Yıl", "value": "2020" },
      { "key": "Kilometre", "value": "45.000" }
    ],
    "owner": {
      "id": "uuid",
      "username": "ahmet123",
      "phone": "05551234567"
    },
    "is_own": false, // Kendi ilanı mı?
    "is_favorite": false,
    "views": 234,
    "created_at": "..."
  }
}
```

**Telefon Göster:**
```dart
// Tıklayınca tracking yap + telefonu göster
POST /v1/ads/:id/track-phone

// Sonra telefonu göster + tel: linki
// href="tel:05551234567"
```

**WhatsApp:**
```dart
POST /v1/ads/:id/track-whatsapp

// WhatsApp URL oluştur
// https://wa.me/905551234567?text=Merhaba...
```

---

### 3. İLAN EKLEME/DÜZENLEME EKRANI

**Dosya:** `lib/features/ads/presentation/pages/ad_form_page.dart`

**UI Bileşenleri:**
```
AppBar:
- Başlık: "Yeni İlan" / "İlan Düzenle"
- Geri butonu
- [Kaydet] butonu (sağ üst)

Form (Scroll):
1. Fotoğraf Ekleme (1-5 adet) *
   - Grid layout (2 sütun)
   - [+] placeholder
   - Kamera / Galeri seçimi
   - İlk fotoğraf otomatik kapak

2. Kategori Seçimi *
   - Dropdown (hiyerarşik)
   - Ana Kategori → Alt Kategori

3. Başlık *
   - TextField (max 100 karakter)

4. Fiyat *
   - Number input
   - Türk Lirası (₺)

5. Açıklama *
   - TextArea (max 2000 karakter)
   - Plain text only

6. DİNAMİK ÖZELLİKLER *
   (Seçilen kategoriye göre backend'den gelir)
   - Dropdown / TextField / Number
   - Örn: Araba → Yıl, Marka, Model, Kilometre

7. Mahalle *
   - Dropdown (kullanıcının primary'si default)

8. İletişim
   - Telefon (readonly, otomatik dolu)

Bottom:
- [İptal] [Kaydet] butonlar
```

**Validation:**
```dart
- Fotoğraf: Min 1, Max 5
- Kategori: Boş olamaz, leaf category (alt kategori) olmalı
- Başlık: 10-100 karakter
- Fiyat: > 0
- Açıklama: 20-2000 karakter
- Dinamik özellikler: Backend'e göre required/optional
- Mahalle: Boş olamaz
```

**API Calls:**

**Kategori Listesi:**
```dart
GET /v1/ads/categories

Response: Hiyerarşik kategori ağacı
```

**Dinamik Özellikler:**
```dart
GET /v1/ads/categories/:id/properties

Response:
{
  "data": [
    {
      "id": "uuid",
      "name": "Marka",
      "type": "dropdown",
      "required": true,
      "options": [
        { "id": "uuid", "value": "Volkswagen" },
        { "id": "uuid", "value": "Toyota" }
      ]
    },
    {
      "id": "uuid",
      "name": "Yıl",
      "type": "number",
      "required": true
    }
  ]
}
```

**Fotoğraf Upload:**
```dart
POST /v1/files/upload
Content-Type: multipart/form-data

Response:
{
  "data": {
    "id": "uuid",
    "url": "http://api.../uploads/xxx.jpg"
  }
}

// Her fotoğraf tek tek upload et
// UUID'leri topla: image_ids[]
```

**İlan Oluştur:**
```dart
POST /v1/ads
Body: {
  "title": "...",
  "description": "...",
  "price": 450000,
  "category_id": "uuid",
  "neighborhood_id": "uuid",
  "image_ids": ["uuid1", "uuid2"],
  "cover_image_id": "uuid1", // İlk fotoğraf
  "property_values": {
    "property_id_1": "value1",
    "property_id_2": "value2"
  }
}

Response:
{
  "success": true,
  "data": { ... } // Yeni ilan
}
```

**İlan Güncelle:**
```dart
PATCH /v1/ads/:id
Body: { ... } // Aynı format

// Güncelleme sonrası status → pending (re-moderation)
```

**İlan Sil:**
```dart
DELETE /v1/ads/:id

// Soft delete
```

---

### 4. FAVORİLER EKRANI

**Dosya:** `lib/features/ads/presentation/pages/favorites_page.dart`

**UI Bileşenleri:**
```
AppBar:
- Başlık: "Favorilerim"
- [Tümünü Temizle] ikonu (sağ üst)

Content:
- İlan listesi (aynı kart tasarımı)
- Boş durum: "Henüz favori eklemediniz"
```

**API Call:**
```dart
GET /v1/users/me/favorites?page=1&limit=20

Response: İlan listesi (aynı format)
```

**Favori Ekle/Çıkar:**
```dart
// Ekle
POST /v1/ads/:id/favorite

// Çıkar
DELETE /v1/ads/:id/favorite

// Sonrası liste yenile (state update)
```

---

## 📊 STATE YÖNETİMİ (Riverpod)

### Providers

```dart
// lib/features/ads/presentation/providers/ads_providers.dart

// İlan listesi state
final adsListProvider = StateNotifierProvider<AdsListNotifier, AsyncValue<List<Ad>>>(
  (ref) => AdsListNotifier(ref.read(adsRepositoryProvider)),
);

// Filtre state
final adsFilterProvider = StateProvider<AdFilters>((ref) => AdFilters());

// Favori state
final favoritesProvider = StateNotifierProvider<FavoritesNotifier, List<String>>(
  (ref) => FavoritesNotifier(ref.read(adsRepositoryProvider)),
);

// Kategoriler
final categoriesProvider = FutureProvider<List<Category>>((ref) async {
  return ref.read(adsRepositoryProvider).getCategories();
});
```

---

## 🎨 UI/UX KURALLARI

### İlan Kartı Tasarımı
```dart
Card(
  elevation: 2,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(12),
  ),
  child: Column(
    children: [
      // Fotoğraf (aspect ratio 1:1)
      AspectRatio(
        aspectRatio: 1,
        child: CachedNetworkImage(
          imageUrl: ad.coverImage.url,
          fit: BoxFit.cover,
          placeholder: (context, url) => Shimmer(...),
        ),
      ),
      // Bilgiler
      Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(ad.title, maxLines: 2, overflow: TextOverflow.ellipsis),
            SizedBox(height: 4),
            Text('${ad.price.toStringAsFixed(0)} ₺', 
              style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.location_on, size: 14),
                Text(ad.neighborhood.name),
                Spacer(),
                IconButton(
                  icon: Icon(ad.isFavorite ? Icons.favorite : Icons.favorite_border),
                  onPressed: () => toggleFavorite(ad.id),
                ),
              ],
            ),
          ],
        ),
      ),
    ],
  ),
)
```

### Fotoğraf Galeri (Detay)
```dart
// Swipeable gallery with PageView
PageView.builder(
  itemCount: ad.images.length,
  itemBuilder: (context, index) {
    return CachedNetworkImage(
      imageUrl: ad.images[index].url,
      fit: BoxFit.contain,
    );
  },
)

// Indicator (altta)
Row(
  mainAxisAlignment: MainAxisAlignment.center,
  children: List.generate(
    ad.images.length,
    (index) => Container(
      width: 8,
      height: 8,
      margin: EdgeInsets.symmetric(horizontal: 4),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: currentIndex == index ? Colors.white : Colors.white54,
      ),
    ),
  ),
)
```

### Boş Durum (Empty State)
```dart
Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(Icons.inbox_outlined, size: 64, color: Colors.grey),
      SizedBox(height: 16),
      Text('Henüz ilan yok', style: TextStyle(fontSize: 18)),
      SizedBox(height: 8),
      Text('İlk ilanı siz ekleyin!', style: TextStyle(color: Colors.grey)),
      SizedBox(height: 24),
      ElevatedButton.icon(
        icon: Icon(Icons.add),
        label: Text('İlan Ekle'),
        onPressed: () => Navigator.push(...),
      ),
    ],
  ),
)
```

---

## 🔍 ARAMA VE FİLTRE

### Arama Ekranı
```dart
// AppBar'da search icon → Yeni sayfa
SearchDelegate implementation

// Real-time arama (debounce 500ms)
GET /v1/ads?search=volkswagen&page=1
```

### Filtre Bottom Sheet
```dart
showModalBottomSheet(
  context: context,
  builder: (context) => Container(
    padding: EdgeInsets.all(16),
    child: Column(
      children: [
        // Kategori dropdown
        DropdownButton<String>(...),
        
        // Fiyat slider
        RangeSlider(
          min: 0,
          max: 1000000,
          values: RangeValues(minPrice, maxPrice),
          onChanged: (values) { ... },
        ),
        
        // Mahalle dropdown
        DropdownButton<String>(...),
        
        // Sıralama
        SegmentedButton(
          segments: [
            ButtonSegment(value: 'newest', label: Text('En Yeni')),
            ButtonSegment(value: 'cheapest', label: Text('En Ucuz')),
            ButtonSegment(value: 'expensive', label: Text('En Pahalı')),
          ],
        ),
        
        // Butonlar
        Row(
          children: [
            TextButton(
              onPressed: () => clearFilters(),
              child: Text('Temizle'),
            ),
            Spacer(),
            ElevatedButton(
              onPressed: () => applyFilters(),
              child: Text('Uygula'),
            ),
          ],
        ),
      ],
    ),
  ),
);
```

---

## ⚠️ İŞ KURALLARI (KRİTİK!)

### 1. Günlük İlan Limiti
```
Kullanıcı başına: 10 ilan/gün

Backend kontrolü var
Frontend: İlan ekle butonunu disable et (limit doluysa)
```

### 2. Fotoğraf Kuralları
```
Min: 1 fotoğraf (zorunlu)
Max: 5 fotoğraf
İlk fotoğraf otomatik kapak
Max boyut: 10MB/fotoğraf
```

### 3. Kategori Seçimi
```
Hiyerarşik: Ana Kategori → Alt Kategori
Leaf category zorunlu (childCount === 0)
```

### 4. Moderation
```
Yeni ilan: status = pending
Güncelleme: approved → pending (re-moderation)
Kullanıcı sadece pending/approved/rejected görebilir
```

### 5. İlan Süresi
```
Yeni ilan: expires_at = NOW() + 7 gün
Süre bitince: Otomatik archive
Uzatma: Reklam izleyerek +1 gün (max 3 kez)
```

### 6. Favoriler
```
Max 30 favori
Backend kontrolü var
```

---

## 📦 KULLANILACAK PAKETLER

```yaml
dependencies:
  # Image
  cached_network_image: ^3.3.0
  image_picker: ^1.0.5
  photo_view: ^0.14.0
  
  # UI
  shimmer: ^3.0.0
  pull_to_refresh: ^2.0.0
  flutter_staggered_grid_view: ^0.7.0
  
  # Utils
  intl: ^0.18.1
  url_launcher: ^6.2.2
  share_plus: ^7.2.1
```

---

## 🧪 TEST SENARYOLARI

### 1. İlan Listeleme
```
- Liste yükleniyor
- Pagination çalışıyor
- Pull-to-refresh çalışıyor
- Filtre uygulanıyor
- Arama çalışıyor
- Favori toggle çalışıyor
```

### 2. İlan Detay
```
- Detay yükleniyor
- Fotoğraf galeri çalışıyor
- Telefon göster çalışıyor (tracking)
- WhatsApp açılıyor (tracking)
- Paylaş çalışıyor
- Kendi ilanı: Düzenle/Sil görünüyor
- Başkasının ilanı: Telefon/WhatsApp görünüyor
```

### 3. İlan Ekleme
```
- Fotoğraf upload çalışıyor (1-5 adet)
- Kategori seçimi çalışıyor (hiyerarşik)
- Dinamik özellikler yükleniyor
- Validation çalışıyor
- Kaydet: API'ye gidiyor
- Başarılı: Liste güncelleniyor
```

### 4. İlan Düzenleme
```
- Form dolu geliyor (mevcut değerler)
- Fotoğraf değişimi çalışıyor
- Güncelleme: API'ye gidiyor
- status → pending (re-moderation)
```

### 5. İlan Silme
```
- Onay dialog'u gösteriliyor
- Sil: API'ye gidiyor
- Liste güncelleniyor
- Soft delete (geri alınabilir - admin tarafında)
```

---

## 🎯 ÖNEMLİ NOTLAR

1. **Plain Text Only:**
   - Açıklama HTML içermez
   - Backend validation var
   - Frontend: TextArea (rich text YOK)

2. **Telefon Göster:**
   - İlk tıklayışta tracking yap
   - Sonra telefonu göster
   - tel: linki ile arama

3. **Moderation:**
   - Yeni ilan → pending
   - Admin onayla → approved
   - Güncelleme → yeniden pending

4. **İlan Uzatma:**
   - Reklam izle → +1 gün
   - Max 3 uzatma
   - Bu özellik mobilde var (future feature)

5. **Favoriler:**
   - Max 30 favori
   - Local state + backend sync
   - Liste'de heart icon toggle

---

**Son Güncelleme:** 24 Şubat 2026
**Versiyon:** 1.0
