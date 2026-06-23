import 'package:url_launcher/url_launcher.dart';

/// Harita / telefon aksiyonları için ortak yardımcılar.
///
/// Tüm modüllerde tutarlı davranış: "Yol Tarifi" gerçekten yön tarifi açar
/// (`maps/dir`), "Haritada Göster" konumu işaretler (`maps/search`). Koordinat
/// yoksa adres metniyle fallback yapılır — böylece koordinatsız kayıtlarda da
/// buton çalışır.
class MapLauncher {
  const MapLauncher._();

  /// Google Haritalar'da hedefe **yön tarifi** açar.
  /// Koordinat varsa onu, yoksa [address] metnini hedef alır.
  static Future<bool> openDirections({
    double? lat,
    double? lng,
    String? address,
  }) {
    final String destination;
    if (lat != null && lng != null) {
      destination = '$lat,$lng';
    } else if (address != null && address.trim().isNotEmpty) {
      destination = Uri.encodeComponent(address.trim());
    } else {
      return Future.value(false);
    }
    return _launch(
      'https://www.google.com/maps/dir/?api=1&destination=$destination',
    );
  }

  /// Konumu Google Haritalar'da **işaretli** gösterir (yön tarifi değil).
  static Future<bool> openLocation({
    double? lat,
    double? lng,
    String? query,
  }) {
    final String q;
    if (lat != null && lng != null) {
      q = '$lat,$lng';
    } else if (query != null && query.trim().isNotEmpty) {
      q = Uri.encodeComponent(query.trim());
    } else {
      return Future.value(false);
    }
    return _launch('https://www.google.com/maps/search/?api=1&query=$q');
  }

  /// Telefon çevirici ile arama başlatır.
  static Future<bool> callPhone(String phone) {
    final clean = phone.replaceAll(RegExp(r'[^\d+]'), '');
    if (clean.isEmpty) return Future.value(false);
    return _launch('tel:$clean');
  }

  static Future<bool> _launch(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      return launchUrl(uri, mode: LaunchMode.externalApplication);
    }
    return false;
  }
}
