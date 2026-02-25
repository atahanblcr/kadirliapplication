# Flutter Auth Skill - OTP + JWT Authentication

**Dosya:** SKILLS/flutter-auth.md
**Tarih:** 24 Şubat 2026
**Amaç:** KadirliApp mobil uygulaması için auth flow rehberi

---

## 📋 AUTH AKIŞI (3 ADIMLI)

### ADIM 1: OTP İSTEME (Phone Input)

**Ekran:** `lib/features/auth/presentation/pages/phone_input_page.dart`

**UI Bileşenleri:**
```
- Logo (üstte, ortalı)
- Başlık: "Telefon Numaranızla Giriş Yapın"
- Telefon input (Türkiye +90 prefix)
- "Devam Et" butonu
- Loading indicator (istek sırasında)
```

**Validasyon:**
- Türkiye telefon formatı: 5XX XXX XX XX
- 10 hane zorunlu
- Boş olamaz

**API Call:**
```dart
POST /v1/auth/request-otp
Body: { "phone": "05551234567" }

Response:
{
  "success": true,
  "message": "OTP gönderildi"
}
```

**Hata Durumları:**
- Rate limit (çok fazla istek)
- Geçersiz telefon formatı
- Sunucu hatası

---

### ADIM 2: OTP DOĞRULAMA (6 Haneli Kod)

**Ekran:** `lib/features/auth/presentation/pages/otp_verify_page.dart`

**UI Bileşenleri:**
```
- "Doğrulama Kodu" başlık
- Telefon numarası göster (05** *** ** 67)
- 6 haneli kod input (auto-focus, sayısal klavye)
- "Kodu Doğrula" butonu
- "Tekrar Gönder" linki (60 saniye timer)
- Geri dön butonu
```

**Kod Input Pattern:**
- 6 ayrı kutu veya tek input (mask)
- Otomatik SMS okuma (sms_autofill paketi)
- Sayısal klavye

**API Call:**
```dart
POST /v1/auth/verify-otp
Body: {
  "phone": "05551234567",
  "code": "123456"
}

Response:
{
  "success": true,
  "data": {
    "temp_token": "eyJhbGc...",
    "is_new_user": true  // veya false
  }
}
```

**Dallanma:**
- `is_new_user = true` → Kayıt ekranına git (ADIM 3)
- `is_new_user = false` → Ana sayfaya git (token kaydet)

**Timer:**
- 60 saniye geri sayım
- "Tekrar Gönder" aktif olunca OTP yeniden iste

---

### ADIM 3: KAYIT TAMAMLAMA (Sadece Yeni Kullanıcı)

**Ekran:** `lib/features/auth/presentation/pages/register_page.dart`

**UI Bileşenleri:**
```
- Profil fotoğrafı (opsiyonel, circle avatar)
- Kullanıcı adı input *
- Yaş input *
- Mahalle seçimi (dropdown) *
- "Kayıt Ol" butonu
```

**Validasyon:**
- Kullanıcı adı: 3-20 karakter, sadece harf/rakam/_
- Yaş: 13-120 arası
- Mahalle: Boş olamaz

**API Call:**
```dart
POST /v1/auth/register
Headers: { "Authorization": "Bearer {temp_token}" }
Body: {
  "username": "ahmet123",
  "age": 25,
  "primary_neighborhood_id": "uuid-mahalle",
  "profile_picture_id": "uuid-file" // opsiyonel
}

Response:
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "phone": "05551234567",
      "username": "ahmet123",
      "role": "USER"
    }
  }
}
```

**Mahalle Listesi:**
```dart
// Kayıt ekranı açılınca mahalle listesini çek
GET /v1/neighborhoods

// Dropdown'a doldur
```

---

## 🔐 TOKEN YÖNETİMİ

### Token Saklama (SharedPreferences)

```dart
import 'package:shared_preferences/shared_preferences.dart';

class AuthStorage {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userKey = 'user';

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_accessTokenKey, accessToken);
    await prefs.setString(_refreshTokenKey, refreshToken);
  }

  Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_accessTokenKey);
  }

  Future<String?> getRefreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_refreshTokenKey);
  }

  Future<void> clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_accessTokenKey);
    await prefs.remove(_refreshTokenKey);
    await prefs.remove(_userKey);
  }
}
```

### Token Otomatik Ekleme (Dio Interceptor)

```dart
import 'package:dio/dio.dart';

class AuthInterceptor extends Interceptor {
  final AuthStorage authStorage;

  AuthInterceptor(this.authStorage);

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Token'ı header'a ekle
    final token = await authStorage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    // 401 → Token yenile
    if (err.response?.statusCode == 401) {
      try {
        await _refreshToken();
        // Retry original request
        final opts = err.requestOptions;
        final response = await Dio().request(
          opts.path,
          options: Options(
            method: opts.method,
            headers: opts.headers,
          ),
          data: opts.data,
          queryParameters: opts.queryParameters,
        );
        handler.resolve(response);
      } catch (e) {
        // Refresh başarısız → Logout
        await authStorage.clearTokens();
        // Login sayfasına yönlendir
        handler.next(err);
      }
    } else {
      handler.next(err);
    }
  }

  Future<void> _refreshToken() async {
    final refreshToken = await authStorage.getRefreshToken();
    if (refreshToken == null) throw Exception('No refresh token');

    final dio = Dio();
    final response = await dio.post(
      'http://api.kadirliapp.com/v1/auth/refresh',
      data: {'refresh_token': refreshToken},
    );

    await authStorage.saveTokens(
      accessToken: response.data['data']['access_token'],
      refreshToken: response.data['data']['refresh_token'],
    );
  }
}
```

---

## 🎨 UI/UX KURALLARI

### Renk Paleti
```dart
// Primary: Mavi
const Color primaryColor = Color(0xFF1E88E5);

// Secondary: Turuncu/Yeşil (başarı)
const Color secondaryColor = Color(0xFF43A047);

// Error: Kırmızı
const Color errorColor = Color(0xFFE53935);

// Background: Beyaz/Gri
const Color backgroundColor = Color(0xFFF5F5F5);
```

### Button Styles
```dart
ElevatedButton(
  style: ElevatedButton.styleFrom(
    backgroundColor: primaryColor,
    foregroundColor: Colors.white,
    padding: EdgeInsets.symmetric(vertical: 16, horizontal: 32),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    elevation: 2,
  ),
  onPressed: () {},
  child: Text('Devam Et'),
)
```

### Input Field Style
```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Telefon Numarası',
    hintText: '5XX XXX XX XX',
    prefixIcon: Icon(Icons.phone),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    filled: true,
    fillColor: Colors.white,
  ),
  keyboardType: TextInputType.phone,
)
```

---

## 🔒 GÜVENLİK KURALLARI

### 1. Token Güvenliği
- ✅ SharedPreferences'da sakla (encrypted değil ama mobil güvenli)
- ✅ Ağ isteklerinde HTTPS kullan
- ❌ Token'ı log'lama (print etme)

### 2. Otomatik Logout
```dart
// Token expire olduğunda
if (response.statusCode == 401) {
  await authStorage.clearTokens();
  Navigator.pushAndRemoveUntil(
    context,
    MaterialPageRoute(builder: (_) => PhoneInputPage()),
    (route) => false,
  );
}
```

### 3. Biometric Auth (Gelecek)
- TouchID/FaceID desteği eklenebilir
- local_auth paketi kullan

---

## 📦 KULLANILACAK PAKETLER

```yaml
dependencies:
  # HTTP
  dio: ^5.4.0
  
  # Storage
  shared_preferences: ^2.2.2
  
  # Phone Input
  intl_phone_field: ^3.2.0
  
  # SMS Auto-read (Android)
  sms_autofill: ^2.3.0
  
  # Loading Indicators
  flutter_spinkit: ^5.2.0
  
  # State Management
  flutter_riverpod: ^2.4.0
```

---

## 🧪 TEST SENARYOLARI

### 1. Başarılı Akış
```
1. Telefon gir (05551234567)
2. "Devam Et" → OTP gönderildi
3. Kod gir (123456 - dev mode)
4. is_new_user = true → Kayıt ekranı
5. Bilgileri doldur → Ana sayfa
```

### 2. Mevcut Kullanıcı
```
1. Telefon gir
2. OTP gir
3. is_new_user = false → Direkt ana sayfa
```

### 3. Hata Durumları
```
- Geçersiz telefon → "Geçerli bir telefon numarası girin"
- Yanlış OTP → "Doğrulama kodu hatalı"
- Zaman aşımı → "Kod süresi doldu, tekrar gönderin"
- Ağ hatası → "Bağlantı hatası, tekrar deneyin"
```

---

## 🎯 ÖNEMLİ NOTLAR

1. **Development OTP:**
   - Backend dev mode'da tüm telefonlar için: `123456`
   - Production'da gerçek SMS gelir

2. **temp_token:**
   - 5 dakika geçerli
   - Sadece /auth/register endpoint'i için kullanılır
   - Kayıt sonrası silinir

3. **Token Süresi:**
   - access_token: 7 gün
   - refresh_token: 30 gün

4. **Mahalle Seçimi:**
   - Kayıt sırasında zorunlu
   - Daha sonra profil'den değiştirilebilir (30 gün limiti var!)

5. **Profil Fotoğrafı:**
   - Kayıt sırasında opsiyonel
   - Daha sonra eklenebilir

---

## 📱 EKRAN AKIŞ ŞEMASI

```
PhoneInputPage
    ↓ (OTP request başarılı)
OtpVerifyPage
    ↓
    ├─→ is_new_user = true  → RegisterPage → HomePage
    └─→ is_new_user = false → HomePage
```

---

**Son Güncelleme:** 24 Şubat 2026
**Versiyon:** 1.0
