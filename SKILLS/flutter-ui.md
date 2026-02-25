# Flutter UI/UX Skill - Genel Tasarım Kuralları

**Dosya:** SKILLS/flutter-ui.md
**Tarih:** 24 Şubat 2026
**Amaç:** KadirliApp mobil UI/UX standartları ve best practices

---

## 🎨 RENK PALETİ

### Ana Renkler
```dart
class AppColors {
  // Primary (Mavi - Kadirli teması)
  static const Color primary = Color(0xFF1E88E5);
  static const Color primaryDark = Color(0xFF1565C0);
  static const Color primaryLight = Color(0xFF64B5F6);
  
  // Secondary (Yeşil - Başarı)
  static const Color secondary = Color(0xFF43A047);
  static const Color secondaryDark = Color(0xFF2E7D32);
  static const Color secondaryLight = Color(0xFF66BB6A);
  
  // Accent (Turuncu - Vurgu)
  static const Color accent = Color(0xFFFF9800);
  
  // Error (Kırmızı)
  static const Color error = Color(0xFFE53935);
  
  // Background
  static const Color background = Color(0xFFF5F5F5);
  static const Color surface = Color(0xFFFFFFFF);
  
  // Text
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textHint = Color(0xFFBDBDBD);
  
  // Divider
  static const Color divider = Color(0xFFE0E0E0);
}
```

### Modül Özel Renkler
```dart
// Duyurular - Tip bazlı
const Map<String, Color> announcementColors = {
  'ANNOUNCEMENT': Color(0xFF2196F3), // Mavi
  'EVENT': Color(0xFF4CAF50),        // Yeşil
  'EMERGENCY': Color(0xFFE53935),    // Kırmızı
  'WARNING': Color(0xFFFF9800),      // Turuncu
};

// Vefat İlanları
const Color deathColor = Color(0xFF424242); // Koyu gri

// Kampanyalar
const Color campaignColor = Color(0xFFE91E63); // Pembe

// Taksi
const Color taxiColor = Color(0xFFFFEB3B); // Sarı
```

---

## 📐 BOYUTLAR VE SPACING

### Padding ve Margin
```dart
class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 24.0;
  static const double xxl = 32.0;
}
```

### Border Radius
```dart
class AppBorderRadius {
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double circle = 999.0;
}
```

### Elevation
```dart
class AppElevation {
  static const double none = 0.0;
  static const double low = 2.0;
  static const double medium = 4.0;
  static const double high = 8.0;
}
```

---

## ✏️ TYPOGRAPHY

### Text Styles
```dart
class AppTextStyles {
  // Display (Büyük başlıklar)
  static const TextStyle displayLarge = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle displayMedium = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  
  // Headline (Sayfa başlıkları)
  static const TextStyle headlineLarge = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle headlineMedium = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );
  
  // Title (Kart başlıkları)
  static const TextStyle titleLarge = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle titleMedium = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
  );
  
  // Body (Normal içerik)
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
  );
  
  // Caption (Küçük açıklamalar)
  static const TextStyle caption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    color: AppColors.textSecondary,
  );
}
```

---

## 🔘 BUTTON STYLES

### Primary Button
```dart
ElevatedButton(
  style: ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,
    foregroundColor: Colors.white,
    padding: EdgeInsets.symmetric(vertical: 16, horizontal: 32),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppBorderRadius.md),
    ),
    elevation: AppElevation.low,
    minimumSize: Size(double.infinity, 48), // Full width
  ),
  onPressed: () {},
  child: Text('Devam Et', style: TextStyle(fontSize: 16)),
)
```

### Secondary Button
```dart
OutlinedButton(
  style: OutlinedButton.styleFrom(
    foregroundColor: AppColors.primary,
    side: BorderSide(color: AppColors.primary, width: 2),
    padding: EdgeInsets.symmetric(vertical: 16, horizontal: 32),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppBorderRadius.md),
    ),
    minimumSize: Size(double.infinity, 48),
  ),
  onPressed: () {},
  child: Text('İptal', style: TextStyle(fontSize: 16)),
)
```

### Text Button
```dart
TextButton(
  style: TextButton.styleFrom(
    foregroundColor: AppColors.primary,
    padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
  ),
  onPressed: () {},
  child: Text('Daha Fazla'),
)
```

### Icon Button
```dart
IconButton(
  icon: Icon(Icons.favorite),
  color: AppColors.error,
  iconSize: 24,
  onPressed: () {},
)
```

---

## 📝 INPUT FIELDS

### Text Field
```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Kullanıcı Adı',
    hintText: 'Kullanıcı adınızı girin',
    prefixIcon: Icon(Icons.person),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppBorderRadius.md),
    ),
    filled: true,
    fillColor: Colors.white,
    contentPadding: EdgeInsets.symmetric(vertical: 16, horizontal: 16),
  ),
  style: AppTextStyles.bodyMedium,
)
```

### Phone Input (intl_phone_field)
```dart
IntlPhoneField(
  decoration: InputDecoration(
    labelText: 'Telefon Numarası',
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppBorderRadius.md),
    ),
  ),
  initialCountryCode: 'TR',
  onChanged: (phone) {
    print(phone.completeNumber);
  },
)
```

### Dropdown
```dart
DropdownButtonFormField<String>(
  decoration: InputDecoration(
    labelText: 'Mahalle',
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppBorderRadius.md),
    ),
  ),
  items: neighborhoods.map((n) {
    return DropdownMenuItem(
      value: n.id,
      child: Text(n.name),
    );
  }).toList(),
  onChanged: (value) {},
)
```

---

## 🃏 CARD DESIGNS

### Standard Card
```dart
Card(
  elevation: AppElevation.low,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(AppBorderRadius.md),
  ),
  child: Padding(
    padding: EdgeInsets.all(AppSpacing.lg),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Başlık', style: AppTextStyles.titleMedium),
        SizedBox(height: AppSpacing.sm),
        Text('İçerik', style: AppTextStyles.bodyMedium),
      ],
    ),
  ),
)
```

### Image Card (İlan, Kampanya)
```dart
Card(
  clipBehavior: Clip.antiAlias,
  elevation: AppElevation.low,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(AppBorderRadius.md),
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      AspectRatio(
        aspectRatio: 16 / 9,
        child: CachedNetworkImage(
          imageUrl: imageUrl,
          fit: BoxFit.cover,
          placeholder: (context, url) => Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Container(color: Colors.white),
          ),
        ),
      ),
      Padding(
        padding: EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Başlık', style: AppTextStyles.titleMedium),
            SizedBox(height: AppSpacing.xs),
            Text('Açıklama', style: AppTextStyles.bodyMedium),
          ],
        ),
      ),
    ],
  ),
)
```

---

## 🏷️ BADGES VE CHIPS

### Badge (Durum gösterimi)
```dart
Container(
  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
  decoration: BoxDecoration(
    color: AppColors.primary,
    borderRadius: BorderRadius.circular(AppBorderRadius.sm),
  ),
  child: Text(
    'YENİ',
    style: TextStyle(
      color: Colors.white,
      fontSize: 12,
      fontWeight: FontWeight.bold,
    ),
  ),
)
```

### Chip (Kategori, Etiket)
```dart
Chip(
  avatar: Icon(Icons.category, size: 16),
  label: Text('Kategori'),
  backgroundColor: AppColors.primaryLight.withOpacity(0.2),
  padding: EdgeInsets.symmetric(horizontal: 8),
)
```

### Filter Chip (Seçilebilir)
```dart
FilterChip(
  label: Text('Tümü'),
  selected: isSelected,
  onSelected: (selected) {},
  selectedColor: AppColors.primary,
  checkmarkColor: Colors.white,
  labelStyle: TextStyle(
    color: isSelected ? Colors.white : AppColors.textPrimary,
  ),
)
```

---

## 📱 APP BAR DESIGNS

### Standard AppBar
```dart
AppBar(
  title: Text('Başlık'),
  backgroundColor: AppColors.primary,
  elevation: 0,
  actions: [
    IconButton(
      icon: Icon(Icons.search),
      onPressed: () {},
    ),
    IconButton(
      icon: Icon(Icons.filter_list),
      onPressed: () {},
    ),
  ],
)
```

### Transparent AppBar (Detay sayfaları)
```dart
AppBar(
  backgroundColor: Colors.transparent,
  elevation: 0,
  leading: Container(
    margin: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Colors.white,
      shape: BoxShape.circle,
      boxShadow: [
        BoxShadow(
          color: Colors.black26,
          blurRadius: 4,
          offset: Offset(0, 2),
        ),
      ],
    ),
    child: IconButton(
      icon: Icon(Icons.arrow_back, color: AppColors.textPrimary),
      onPressed: () => Navigator.pop(context),
    ),
  ),
)
```

---

## 🔔 BOTTOM NAVIGATION BAR

```dart
BottomNavigationBar(
  currentIndex: currentIndex,
  onTap: (index) {
    setState(() => currentIndex = index);
  },
  type: BottomNavigationBarType.fixed,
  selectedItemColor: AppColors.primary,
  unselectedItemColor: AppColors.textSecondary,
  selectedLabelStyle: TextStyle(fontWeight: FontWeight.w600),
  items: [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: 'Ana Sayfa',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.shopping_bag),
      label: 'İlanlar',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.favorite),
      label: 'Favoriler',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.person),
      label: 'Profil',
    ),
  ],
)
```

---

## 🔄 LOADING STATES

### Circular Progress
```dart
Center(
  child: CircularProgressIndicator(
    color: AppColors.primary,
  ),
)
```

### Linear Progress (Üstte)
```dart
LinearProgressIndicator(
  backgroundColor: AppColors.primaryLight.withOpacity(0.2),
  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
)
```

### Shimmer Effect
```dart
Shimmer.fromColors(
  baseColor: Colors.grey[300]!,
  highlightColor: Colors.grey[100]!,
  child: Column(
    children: List.generate(
      5,
      (index) => Card(
        child: ListTile(
          leading: CircleAvatar(),
          title: Container(height: 16, color: Colors.white),
          subtitle: Container(height: 12, color: Colors.white),
        ),
      ),
    ),
  ),
)
```

---

## ⚠️ SNACKBAR VE DIALOGS

### SnackBar (Bildirim)
```dart
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: Text('İşlem başarılı!'),
    backgroundColor: AppColors.secondary,
    duration: Duration(seconds: 3),
    action: SnackBarAction(
      label: 'GERİ AL',
      textColor: Colors.white,
      onPressed: () {},
    ),
  ),
);
```

### AlertDialog (Onay)
```dart
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: Text('Emin misiniz?'),
    content: Text('Bu işlem geri alınamaz.'),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: Text('İptal'),
      ),
      ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.error,
        ),
        onPressed: () {
          // Sil
          Navigator.pop(context);
        },
        child: Text('Sil'),
      ),
    ],
  ),
);
```

### Bottom Sheet (Filtre, Seçim)
```dart
showModalBottomSheet(
  context: context,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.vertical(
      top: Radius.circular(AppBorderRadius.lg),
    ),
  ),
  builder: (context) {
    return Container(
      padding: EdgeInsets.all(AppSpacing.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.divider,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          SizedBox(height: AppSpacing.lg),
          // Content
          Text('Filtreler', style: AppTextStyles.headlineMedium),
          // ...
        ],
      ),
    );
  },
);
```

---

## 🖼️ IMAGE HANDLING

### Cached Network Image
```dart
CachedNetworkImage(
  imageUrl: imageUrl,
  fit: BoxFit.cover,
  placeholder: (context, url) => Shimmer.fromColors(
    baseColor: Colors.grey[300]!,
    highlightColor: Colors.grey[100]!,
    child: Container(color: Colors.white),
  ),
  errorWidget: (context, url, error) => Container(
    color: Colors.grey[200],
    child: Icon(Icons.broken_image, color: Colors.grey),
  ),
)
```

### Circle Avatar
```dart
CircleAvatar(
  radius: 40,
  backgroundImage: userPhotoUrl != null
    ? CachedNetworkImageProvider(userPhotoUrl)
    : null,
  backgroundColor: AppColors.primaryLight,
  child: userPhotoUrl == null
    ? Icon(Icons.person, size: 40, color: Colors.white)
    : null,
)
```

---

## 📋 LIST TILES

### Standard List Tile
```dart
ListTile(
  leading: CircleAvatar(
    backgroundColor: AppColors.primary,
    child: Icon(Icons.notifications, color: Colors.white),
  ),
  title: Text('Başlık', style: AppTextStyles.titleMedium),
  subtitle: Text('Alt başlık', style: AppTextStyles.bodyMedium),
  trailing: Icon(Icons.chevron_right),
  onTap: () {},
)
```

### Custom List Tile (İlanlar)
```dart
InkWell(
  onTap: () {},
  child: Padding(
    padding: EdgeInsets.all(AppSpacing.md),
    child: Row(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(AppBorderRadius.sm),
          child: CachedNetworkImage(
            imageUrl: imageUrl,
            width: 80,
            height: 80,
            fit: BoxFit.cover,
          ),
        ),
        SizedBox(width: AppSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: AppTextStyles.titleMedium),
              SizedBox(height: AppSpacing.xs),
              Text('$price ₺', style: AppTextStyles.bodyMedium.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              )),
              SizedBox(height: AppSpacing.xs),
              Row(
                children: [
                  Icon(Icons.location_on, size: 14, color: AppColors.textSecondary),
                  SizedBox(width: 4),
                  Text(location, style: AppTextStyles.caption),
                ],
              ),
            ],
          ),
        ),
        IconButton(
          icon: Icon(
            isFavorite ? Icons.favorite : Icons.favorite_border,
            color: AppColors.error,
          ),
          onPressed: () {},
        ),
      ],
    ),
  ),
)
```

---

## 🔍 SEARCH BAR

### Search Delegate
```dart
class CustomSearchDelegate extends SearchDelegate {
  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.arrow_back),
      onPressed: () {
        close(context, null);
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    // Search results
    return ListView.builder(
      itemBuilder: (context, index) {
        // Result items
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    // Search suggestions
    return ListView(
      children: [
        ListTile(
          leading: Icon(Icons.history),
          title: Text('Son aramalar'),
        ),
      ],
    );
  }
}
```

---

## 🎯 EMPTY & ERROR STATES

### Empty State
```dart
Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(
        Icons.inbox_outlined,
        size: 80,
        color: Colors.grey[300],
      ),
      SizedBox(height: AppSpacing.lg),
      Text(
        'Henüz içerik yok',
        style: AppTextStyles.headlineMedium.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
      SizedBox(height: AppSpacing.sm),
      Text(
        'İlk içeriği siz ekleyin!',
        style: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.textHint,
        ),
      ),
      SizedBox(height: AppSpacing.xl),
      ElevatedButton.icon(
        icon: Icon(Icons.add),
        label: Text('Ekle'),
        onPressed: () {},
      ),
    ],
  ),
)
```

### Error State
```dart
Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(
        Icons.error_outline,
        size: 80,
        color: AppColors.error,
      ),
      SizedBox(height: AppSpacing.lg),
      Text(
        'Bir hata oluştu',
        style: AppTextStyles.headlineMedium,
      ),
      SizedBox(height: AppSpacing.sm),
      Text(
        errorMessage,
        style: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.textSecondary,
        ),
        textAlign: TextAlign.center,
      ),
      SizedBox(height: AppSpacing.xl),
      ElevatedButton.icon(
        icon: Icon(Icons.refresh),
        label: Text('Tekrar Dene'),
        onPressed: () => retry(),
      ),
    ],
  ),
)
```

---

## 🌐 ANIMATIONS

### Fade In Animation
```dart
FadeTransition(
  opacity: animation,
  child: child,
)
```

### Slide Transition
```dart
SlideTransition(
  position: Tween<Offset>(
    begin: Offset(1, 0),
    end: Offset.zero,
  ).animate(animation),
  child: child,
)
```

### Hero Animation (Detay geçişi)
```dart
// Liste
Hero(
  tag: 'item-${item.id}',
  child: Image.network(item.imageUrl),
)

// Detay
Hero(
  tag: 'item-${item.id}',
  child: Image.network(item.imageUrl),
)
```

---

## 📏 RESPONSIVE DESIGN

### Media Query Kullanımı
```dart
final screenWidth = MediaQuery.of(context).size.width;
final screenHeight = MediaQuery.of(context).size.height;

// Responsive padding
EdgeInsets.symmetric(
  horizontal: screenWidth * 0.05, // 5% of screen width
  vertical: 16,
)

// Responsive grid
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: screenWidth > 600 ? 3 : 2, // Tablet vs Mobile
    crossAxisSpacing: AppSpacing.md,
    mainAxisSpacing: AppSpacing.md,
  ),
)
```

---

## ✅ BEST PRACTICES

1. **Const Widgets:** Mümkün olduğunca `const` kullan (performans)
2. **Key Kullanımı:** Liste itemları için `Key` ver
3. **SizedBox:** Spacing için `SizedBox` kullan (Container yerine)
4. **Theme:** Material Theme kullan (tutarlılık)
5. **Accessibility:** Semantics ekle (erişilebilirlik)
6. **Error Handling:** Her async işlemde try-catch
7. **Loading States:** Her API call için loading göster
8. **Pull-to-Refresh:** Liste sayfalarında ekle

---

**Son Güncelleme:** 24 Şubat 2026
**Versiyon:** 1.0
