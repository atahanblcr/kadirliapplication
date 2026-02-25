import 'package:shared_preferences/shared_preferences.dart';

/// Storage Service
/// Manages SharedPreferences for simple key-value storage
/// Used for: tokens, preferences, simple data

class StorageService {
  static final StorageService _instance = StorageService._internal();
  late SharedPreferences _prefs;

  factory StorageService() {
    return _instance;
  }

  StorageService._internal();

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Token management
  Future<void> setAccessToken(String token) async {
    await _prefs.setString('access_token', token);
  }

  String? getAccessToken() {
    return _prefs.getString('access_token');
  }

  Future<void> setRefreshToken(String token) async {
    await _prefs.setString('refresh_token', token);
  }

  String? getRefreshToken() {
    return _prefs.getString('refresh_token');
  }

  Future<void> clearTokens() async {
    await _prefs.remove('access_token');
    await _prefs.remove('refresh_token');
  }

  // User preference storage
  Future<void> setString(String key, String value) async {
    await _prefs.setString(key, value);
  }

  String? getString(String key) {
    return _prefs.getString(key);
  }

  Future<void> setInt(String key, int value) async {
    await _prefs.setInt(key, value);
  }

  int? getInt(String key) {
    return _prefs.getInt(key);
  }

  Future<void> setBool(String key, bool value) async {
    await _prefs.setBool(key, value);
  }

  bool? getBool(String key) {
    return _prefs.getBool(key);
  }

  Future<void> setDouble(String key, double value) async {
    await _prefs.setDouble(key, value);
  }

  double? getDouble(String key) {
    return _prefs.getDouble(key);
  }

  Future<void> remove(String key) async {
    await _prefs.remove(key);
  }

  Future<void> clear() async {
    await _prefs.clear();
  }

  bool containsKey(String key) {
    return _prefs.containsKey(key);
  }
}
