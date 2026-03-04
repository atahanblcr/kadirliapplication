import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/core/network/api_response.dart';

void main() {
  group('ApiResponse', () {
    test('fromJson works correctly', () {
      final json = {
        'success': true,
        'data': {'id': '1'},
        'meta': {
          'page': 1,
          'pageSize': 20,
          'total': 100,
          'totalPages': 5,
          'timestamp': '2026-03-01T10:00:00Z'
        }
      };

      final response = ApiResponse<Map<String, dynamic>>.fromJson(
        json,
        (data) => data as Map<String, dynamic>,
      );

      expect(response.success, true);
      expect(response.data?['id'], '1');
      expect(response.meta?.page, 1);
      expect(response.meta?.total, 100);
    });

    test('toJson works correctly', () {
      final meta = ApiMeta(page: 1, pageSize: 20);
      final response = ApiResponse<String>(
        success: true,
        data: 'test',
        meta: meta,
      );

      final json = response.toJson((data) => data);

      expect(json['success'], true);
      expect(json['data'], 'test');
      expect(json['meta']['page'], 1);
    });
  });

  group('ApiMeta', () {
    test('fromJson and toJson works correctly', () {
      final json = {
        'page': 1,
        'pageSize': 10,
        'total': 50,
        'totalPages': 5,
        'timestamp': 'now'
      };

      final meta = ApiMeta.fromJson(json);
      final resultJson = meta.toJson();

      expect(meta.page, 1);
      expect(meta.total, 50);
      expect(resultJson['pageSize'], 10);
    });
  });
}
