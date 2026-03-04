import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:kadirliapp/core/storage/storage_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late StorageService storageService;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    storageService = StorageService();
    await storageService.init();
  });

  group('StorageService', () {
    test('setAccessToken and getAccessToken', () async {
      expect(storageService.getAccessToken(), isNull);
      await storageService.setAccessToken('test_token');
      expect(storageService.getAccessToken(), 'test_token');
    });

    test('setRefreshToken and getRefreshToken', () async {
      expect(storageService.getRefreshToken(), isNull);
      await storageService.setRefreshToken('refresh_token');
      expect(storageService.getRefreshToken(), 'refresh_token');
    });

    test('clearTokens', () async {
      await storageService.setAccessToken('access');
      await storageService.setRefreshToken('refresh');
      await storageService.clearTokens();
      expect(storageService.getAccessToken(), isNull);
      expect(storageService.getRefreshToken(), isNull);
    });

    test('setString and getString', () async {
      await storageService.setString('key', 'value');
      expect(storageService.getString('key'), 'value');
    });

    test('setInt and getInt', () async {
      await storageService.setInt('key', 123);
      expect(storageService.getInt('key'), 123);
    });

    test('setBool and getBool', () async {
      await storageService.setBool('key', true);
      expect(storageService.getBool('key'), true);
    });

    test('setDouble and getDouble', () async {
      await storageService.setDouble('key', 1.23);
      expect(storageService.getDouble('key'), 1.23);
    });

    test('remove key', () async {
      await storageService.setString('key', 'value');
      await storageService.remove('key');
      expect(storageService.getString('key'), isNull);
    });

    test('clear all', () async {
      await storageService.setString('key1', 'value1');
      await storageService.setString('key2', 'value2');
      await storageService.clear();
      expect(storageService.containsKey('key1'), false);
      expect(storageService.containsKey('key2'), false);
    });

    test('containsKey', () async {
      await storageService.setString('key', 'value');
      expect(storageService.containsKey('key'), true);
      expect(storageService.containsKey('non_existent'), false);
    });
  });
}
