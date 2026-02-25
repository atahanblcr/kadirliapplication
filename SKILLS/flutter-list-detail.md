# Flutter Read-Only List-Detail Pattern

**Dosya:** SKILLS/flutter-list-detail.md
**Tarih:** 24 Şubat 2026
**Amaç:** Sadece okuma (READ-ONLY) modülleri için ortak pattern

---

## 📋 KAPSAM

Bu pattern **şu modüllerde** kullanılır:

✅ **Duyurular** (Announcements) - Belediye duyuruları
✅ **Vefat İlanları** (Deaths) - Cenaze bilgileri
✅ **Kampanyalar** (Campaigns) - İşletme indirimleri
✅ **Etkinlikler** (Events) - Şehir etkinlikleri
✅ **Rehber** (Guide) - Bilgi rehberi
✅ **Mekanlar** (Places) - Gezilecek yerler
✅ **Eczane** (Pharmacy) - Nöbetçi eczane
✅ **Ulaşım** (Transport) - Otobüs hatları
✅ **Taksi** (Taxi) - Taksi listesi (ÇAĞIRMA YOK!)
✅ **İş İlanları** (Jobs) - İş ilanları

**ORTAK ÖZELLİK:**
- ❌ Ekleme YOK
- ❌ Düzenleme YOK
- ❌ Silme YOK
- ✅ Sadece Görüntüleme

---

## 🎨 EKRAN YAPISI (2 EKRAN)

### EKRAN 1: LİSTE SAYFASI

**Genel Template:**
```dart
Scaffold(
  appBar: AppBar(
    title: Text('[Modül Adı]'), // örn: "Duyurular"
    actions: [
      IconButton(
        icon: Icon(Icons.search),
        onPressed: () => showSearch(...),
      ),
      IconButton(
        icon: Icon(Icons.filter_list),
        onPressed: () => showFilterSheet(),
      ),
    ],
  ),
  body: RefreshIndicator(
    onRefresh: () async => await refresh(),
    child: ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        return ItemCard(item: items[index]);
      },
    ),
  ),
)
```

**Ortak Özellikler:**
- Pull-to-refresh ✅
- Pagination (lazy loading) ✅
- Search (optional) ✅
- Filter (optional) ✅
- Empty state (boş durum) ✅
- Error state (hata durumu) ✅
- Loading state (shimmer) ✅

---

### EKRAN 2: DETAY SAYFASI

**Genel Template:**
```dart
Scaffold(
  appBar: AppBar(
    title: Text('[Başlık]'),
    actions: [
      IconButton(
        icon: Icon(Icons.share),
        onPressed: () => share(),
      ),
    ],
  ),
  body: SingleChildScrollView(
    padding: EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Görsel (varsa)
        if (item.imageUrl != null)
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: CachedNetworkImage(imageUrl: item.imageUrl),
          ),
        
        // Başlık
        SizedBox(height: 16),
        Text(item.title, style: Theme.of(context).textTheme.headlineMedium),
        
        // Meta bilgiler (tarih, konum, vb.)
        SizedBox(height: 8),
        Row(
          children: [
            Icon(Icons.calendar_today, size: 16),
            SizedBox(width: 4),
            Text(formatDate(item.date)),
            SizedBox(width: 16),
            Icon(Icons.location_on, size: 16),
            SizedBox(width: 4),
            Text(item.location),
          ],
        ),
        
        // Açıklama
        SizedBox(height: 16),
        Text(item.description),
        
        // Ek bilgiler (modüle göre değişir)
        ...buildAdditionalInfo(),
      ],
    ),
  ),
)
```

---

## 📱 MODÜL ÖZEL ŞABLONLAR

### 1. DUYURULAR (Announcements)

**Liste Kartı:**
```dart
Card(
  child: ListTile(
    leading: CircleAvatar(
      backgroundColor: getTypeColor(announcement.type),
      child: Icon(getTypeIcon(announcement.type)),
    ),
    title: Text(announcement.title, maxLines: 2),
    subtitle: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(announcement.type.name),
        SizedBox(height: 4),
        Text(formatDate(announcement.published_at)),
      ],
    ),
    trailing: Icon(Icons.chevron_right),
    onTap: () => goToDetail(announcement.id),
  ),
)
```

**Detay Ekranı Özel:**
```
- Tip badge (Duyuru, Etkinlik, Acil, vb.)
- Yayın tarihi
- Hedef mahalleler (varsa)
- Açıklama (plain text, uzunsa "Daha Fazla")
```

**API:**
```dart
GET /v1/announcements?page=1&limit=20
GET /v1/announcements/:id
```

---

### 2. VEFAT İLANLARI (Deaths)

**Liste Kartı:**
```dart
Card(
  child: Padding(
    padding: EdgeInsets.all(12),
    child: Row(
      children: [
        // Fotoğraf (siyah-beyaz filtre)
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: ColorFiltered(
            colorFilter: ColorFilter.mode(
              Colors.grey,
              BlendMode.saturation,
            ),
            child: CachedNetworkImage(
              imageUrl: death.photoUrl,
              width: 80,
              height: 80,
              fit: BoxFit.cover,
            ),
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(death.name, style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Yaş: ${death.age}'),
              Text('Cenaze: ${formatDateTime(death.funeralDate)}'),
              Text('${death.cemeteryName}'),
            ],
          ),
        ),
      ],
    ),
  ),
)
```

**Detay Ekranı Özel:**
```
- Fotoğraf (siyah-beyaz)
- Ad Soyad + Yaş
- Cenaze tarihi/saati
- Mezarlık + [Haritada Gör] butonu
- Cenaze namazı yeri + [Haritada Gör] butonu
- Taziye evi adresi + [Haritada Gör] butonu (varsa)
- Mahalle bilgisi
```

**Harita Butonu:**
```dart
ElevatedButton.icon(
  icon: Icon(Icons.map),
  label: Text('Haritada Gör'),
  onPressed: () async {
    final url = 'https://www.google.com/maps/search/?api=1&query=${death.latitude},${death.longitude}';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  },
)
```

**API:**
```dart
GET /v1/deaths?page=1&limit=20
GET /v1/deaths/:id
```

---

### 3. KAMPANYALAR (Campaigns)

**Liste Kartı:**
```dart
Card(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // Kampanya görseli
      AspectRatio(
        aspectRatio: 16 / 9,
        child: CachedNetworkImage(
          imageUrl: campaign.imageUrl,
          fit: BoxFit.cover,
        ),
      ),
      Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(campaign.businessName, style: TextStyle(fontSize: 12)),
            Text(campaign.title, style: TextStyle(fontWeight: FontWeight.bold)),
            Row(
              children: [
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text('%${campaign.discountRate}', style: TextStyle(color: Colors.white)),
                ),
                Spacer(),
                Text('${formatDate(campaign.validUntil)} tarihine kadar'),
              ],
            ),
          ],
        ),
      ),
    ],
  ),
)
```

**Detay Ekranı Özel:**
```
- İşletme bilgileri
- Kampanya görselleri (galeri)
- İndirim oranı (büyük, bold)
- Açıklama
- Geçerlilik tarihi
- Kampanya kodu (varsa, kopyalanabilir)
- İşletme telefon + WhatsApp butonları
```

**API:**
```dart
GET /v1/campaigns?page=1&limit=20
GET /v1/campaigns/:id
```

---

### 4. ETKİNLİKLER (Events)

**Liste Kartı:**
```dart
Card(
  child: Row(
    children: [
      // Tarih badge (sol taraf)
      Container(
        width: 60,
        padding: EdgeInsets.all(8),
        color: Colors.blue,
        child: Column(
          children: [
            Text('${event.date.day}', style: TextStyle(fontSize: 24, color: Colors.white)),
            Text('${getMonthName(event.date.month)}', style: TextStyle(color: Colors.white)),
          ],
        ),
      ),
      Expanded(
        child: Padding(
          padding: EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(event.title, maxLines: 2),
              Text(event.location),
              Text(event.categoryName),
            ],
          ),
        ),
      ),
    ],
  ),
)
```

**Detay Ekranı Özel:**
```
- Etkinlik görseli (varsa)
- Başlık
- Kategori badge
- Tarih/saat
- Konum + [Haritada Gör] butonu
- Açıklama
- Kapasite (varsa)
- Kayıt gerekli mi? (varsa)
```

**API:**
```dart
GET /v1/events?page=1&limit=20
GET /v1/events/:id
```

---

### 5. REHBER (Guide)

**Özel Yapı:** Hiyerarşik kategoriler

**Ana Ekran:**
```
Kategoriler:
- Acil Durumlar
  - İtfaiye: 110
  - Polis: 155
  - Ambulans: 112
- Resmi Kurumlar
  - Belediye
  - Vergi Dairesi
  - Nüfus Müdürlüğü
```

**Liste (Genişletilebilir):**
```dart
ExpansionTile(
  title: Text(category.name),
  children: category.items.map((item) {
    return ListTile(
      title: Text(item.name),
      subtitle: Text(item.address ?? ''),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (item.phone != null)
            IconButton(
              icon: Icon(Icons.phone),
              onPressed: () => launch('tel:${item.phone}'),
            ),
          if (item.url != null)
            IconButton(
              icon: Icon(Icons.language),
              onPressed: () => launch(item.url),
            ),
        ],
      ),
    );
  }).toList(),
)
```

**API:**
```dart
GET /v1/guide/categories // Hiyerarşik
GET /v1/guide/items?category_id=xxx
```

---

### 6. MEKANLAR (Places)

**Liste Kartı:**
```dart
Card(
  child: Column(
    children: [
      AspectRatio(
        aspectRatio: 16 / 9,
        child: Stack(
          children: [
            CachedNetworkImage(
              imageUrl: place.coverImage,
              fit: BoxFit.cover,
            ),
            // Kategori badge (üstte)
            Positioned(
              top: 8,
              left: 8,
              child: Chip(label: Text(place.categoryName)),
            ),
          ],
        ),
      ),
      Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(place.name, style: TextStyle(fontWeight: FontWeight.bold)),
            Text(place.address),
            Row(
              children: place.features.map((f) => 
                Chip(label: Text(f), avatar: Icon(getFeatureIcon(f)))
              ).toList(),
            ),
          ],
        ),
      ),
    ],
  ),
)
```

**Detay Ekranı Özel:**
```
- Fotoğraf galeri (swipeable)
- Ad, kategori
- Açıklama
- Adres + [Haritada Gör] butonu
- Özellikler (Otopark, WiFi, vb.) - chips
- Telefon + Website butonları (varsa)
- Çalışma saatleri (varsa)
```

**API:**
```dart
GET /v1/places?page=1&limit=20
GET /v1/places/:id
```

---

### 7. NÖBETÇI ECZANE (Pharmacy)

**Özel Ekran:** Takvim görünümü

**Ana Ekran:**
```
2 Tab:
- [Bugün Nöbetçi] [Takvim]
```

**Bugün Nöbetçi Tab:**
```dart
// Bugünkü eczane (büyük kart)
Card(
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Column(
      children: [
        Icon(Icons.local_pharmacy, size: 48, color: Colors.green),
        SizedBox(height: 8),
        Text('BUGÜN NÖBETÇİ', style: TextStyle(fontSize: 12)),
        Text(pharmacy.name, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        SizedBox(height: 8),
        Text(pharmacy.address),
        SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton.icon(
              icon: Icon(Icons.phone),
              label: Text('Ara'),
              onPressed: () => launch('tel:${pharmacy.phone}'),
            ),
            SizedBox(width: 8),
            ElevatedButton.icon(
              icon: Icon(Icons.map),
              label: Text('Haritada Gör'),
              onPressed: () => openMap(pharmacy.latitude, pharmacy.longitude),
            ),
          ],
        ),
      ],
    ),
  ),
)
```

**Takvim Tab:**
```dart
// Aylık takvim görünümü
// table_calendar paketi kullan
TableCalendar(
  calendarFormat: CalendarFormat.month,
  eventLoader: (day) {
    // O gün nöbetçi eczane varsa göster
    return schedule[day] ?? [];
  },
  onDaySelected: (selectedDay, focusedDay) {
    // Detay göster
    showPharmacyDetail(schedule[selectedDay]);
  },
)
```

**API:**
```dart
GET /v1/pharmacy/current // Bugün nöbetçi
GET /v1/pharmacy/schedule?month=2&year=2026 // Aylık takvim
```

---

### 8. ULAŞIM (Transport)

**2 Tab:**
- [Şehirlerarası] [Şehir İçi]

**Şehirlerarası Tab:**
```dart
// Otobüs firmalar listesi
ListView.builder(
  itemBuilder: (context, index) {
    final route = intercityRoutes[index];
    return ListTile(
      leading: Icon(Icons.directions_bus),
      title: Text(route.companyName),
      subtitle: Text('${route.fromCity} → ${route.toCity}'),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('${route.price} ₺', style: TextStyle(fontWeight: FontWeight.bold)),
          Text('${route.durationMinutes ~/ 60}s ${route.durationMinutes % 60}dk'),
        ],
      ),
      onTap: () => showSchedule(route.id),
    );
  },
)
```

**Sefer Saatleri Dialog:**
```dart
// Bottom sheet
showModalBottomSheet(
  context: context,
  builder: (context) {
    return Column(
      children: route.schedules.map((schedule) {
        return ListTile(
          leading: Icon(Icons.schedule),
          title: Text(schedule.departureTime), // "08:00"
          subtitle: Text(getDaysText(schedule.daysOfWeek)), // "Pzt, Sal, Çar..."
        );
      }).toList(),
    );
  },
);
```

**Şehir İçi Tab:**
```dart
// Belediye otobüs hatları
ListView.builder(
  itemBuilder: (context, index) {
    final route = intracityRoutes[index];
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: route.color,
          child: Text(route.lineNumber, style: TextStyle(color: Colors.white)),
        ),
        title: Text(route.name),
        subtitle: Text('İlk: ${route.firstDeparture} - Son: ${route.lastDeparture}'),
        trailing: Text('Her ${route.frequencyMinutes} dk'),
        onTap: () => showStops(route.id),
      ),
    );
  },
)
```

**Duraklar Dialog:**
```dart
// Liste (sıralı)
showModalBottomSheet(
  context: context,
  builder: (context) {
    return ListView.builder(
      itemCount: stops.length,
      itemBuilder: (context, index) {
        final stop = stops[index];
        return ListTile(
          leading: CircleAvatar(child: Text('${index + 1}')),
          title: Text(stop.name),
          subtitle: Text(stop.neighborhoodName),
          trailing: Text('${stop.timeFromStart} dk'),
        );
      },
    );
  },
);
```

**API:**
```dart
GET /v1/transport/intercity
GET /v1/transport/intercity/:id
GET /v1/transport/intracity
GET /v1/transport/intracity/:id
```

---

### 9. TAKSİ (SADECE LİSTE - ÇAĞIRMA YOK!)

**ÖNEMLİ:** Taksi çağırma butonu İPTAL EDİLDİ!

**Liste Ekranı:**
```dart
// RANDOM sıralama (her yenilemede değişir)
ListView.builder(
  itemBuilder: (context, index) {
    final driver = taxiDrivers[index];
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          child: Icon(Icons.local_taxi),
        ),
        title: Text(driver.name),
        subtitle: Text(driver.neighborhoodName),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: Icon(Icons.phone),
              onPressed: () => launch('tel:${driver.phone}'),
            ),
            IconButton(
              icon: Icon(Icons.chat),
              onPressed: () => launch('https://wa.me/90${driver.phone}'),
            ),
          ],
        ),
      ),
    );
  },
)
```

**Özellikler:**
```
✅ Liste gösterimi
✅ Random sıralama (adil dağılım)
✅ Telefon arama
✅ WhatsApp mesaj
❌ Çağırma butonu YOK
❌ Konum tracking YOK
❌ Durum (meşgul/boş) YOK
```

**API:**
```dart
GET /v1/taxi/drivers // RANDOM ORDER BY

// Tracking (telefon tıklama)
POST /v1/taxi/calls { driver_id, type: 'phone' }
```

---

### 10. İŞ İLANLARI (Jobs)

**Liste Kartı:**
```dart
Card(
  child: Padding(
    padding: EdgeInsets.all(12),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(job.companyName, style: TextStyle(fontSize: 12, color: Colors.grey)),
            Spacer(),
            Chip(label: Text(job.employmentType)), // Tam zamanlı/Yarı zamanlı
          ],
        ),
        Text(job.title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        SizedBox(height: 4),
        Text('${job.minSalary} - ${job.maxSalary} ₺'),
        SizedBox(height: 4),
        Row(
          children: [
            Icon(Icons.location_on, size: 14),
            Text(job.location),
            SizedBox(width: 16),
            Icon(Icons.calendar_today, size: 14),
            Text(formatDate(job.postedAt)),
          ],
        ),
      ],
    ),
  ),
)
```

**Detay Ekranı:**
```
- Şirket bilgileri
- Pozisyon
- İş tanımı
- Aranan özellikler
- Maaş aralığı
- Çalışma şekli (Tam/Yarı zamanlı, Uzaktan)
- Konum
- Başvuru telefon/email
- [Başvur] butonu (telefon veya email açar)
```

**API:**
```dart
GET /v1/jobs?page=1&limit=20
GET /v1/jobs/:id
```

---

## 🎨 ORTAK UI BİLEŞENLERİ

### Empty State
```dart
Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(Icons.inbox_outlined, size: 64, color: Colors.grey),
      SizedBox(height: 16),
      Text('Henüz içerik yok', style: TextStyle(fontSize: 18)),
      SizedBox(height: 8),
      Text('Yakında eklenecek', style: TextStyle(color: Colors.grey)),
    ],
  ),
)
```

### Loading State (Shimmer)
```dart
ListView.builder(
  itemCount: 5,
  itemBuilder: (context, index) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Card(
        child: ListTile(
          leading: CircleAvatar(),
          title: Container(height: 16, color: Colors.white),
          subtitle: Container(height: 12, color: Colors.white),
        ),
      ),
    );
  },
)
```

### Error State
```dart
Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(Icons.error_outline, size: 64, color: Colors.red),
      SizedBox(height: 16),
      Text('Bir hata oluştu', style: TextStyle(fontSize: 18)),
      SizedBox(height: 8),
      Text(errorMessage, style: TextStyle(color: Colors.grey)),
      SizedBox(height: 16),
      ElevatedButton(
        onPressed: () => retry(),
        child: Text('Tekrar Dene'),
      ),
    ],
  ),
)
```

---

## 📦 KULLANILACAK PAKETLER

```yaml
dependencies:
  # UI
  shimmer: ^3.0.0
  pull_to_refresh: ^2.0.0
  cached_network_image: ^3.3.0
  
  # Utils
  intl: ^0.18.1
  url_launcher: ^6.2.2
  share_plus: ^7.2.1
  
  # Calendar (Pharmacy için)
  table_calendar: ^3.0.9
```

---

## 🎯 GENEL NOTLAR

1. **Tüm modüller READ-ONLY:**
   - Sadece görüntüleme
   - Ekleme/düzenleme/silme YOK

2. **Taksi modülü özel:**
   - Çağırma butonu İPTAL
   - Sadece liste + telefon/WhatsApp

3. **Harita entegrasyonu:**
   - Deaths, Places, Events, Pharmacy
   - "Haritada Gör" butonu
   - Google Maps açılır (url_launcher)

4. **Plain text:**
   - Tüm açıklamalar plain text
   - HTML rendering YOK

5. **Paylaşma:**
   - Detay ekranında share butonu
   - share_plus paketi kullan

---

**Son Güncelleme:** 24 Şubat 2026
**Versiyon:** 1.0
