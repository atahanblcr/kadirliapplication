import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/notifications/data/models/notification_model.dart';

void main() {
  group('NotificationModel', () {
    test('fromJson parses data correctly', () {
      final json = {
        'id': 'notif-1',
        'title': 'Test Title',
        'body': 'Test Body',
        'type': 'ad_approved',
        'is_read': false,
        'created_at': '2026-02-16T10:30:00Z',
      };

      final model = NotificationModel.fromJson(json);

      expect(model.id, 'notif-1');
      expect(model.title, 'Test Title');
      expect(model.body, 'Test Body');
      expect(model.type, 'ad_approved');
      expect(model.isRead, false);
      expect(model.createdAt.year, 2026);
    });

    test('copyWith updates fields', () {
      final model = NotificationModel(
        id: '1',
        title: 'T',
        body: 'B',
        type: 'A',
        isRead: false,
        createdAt: DateTime.now(),
      );

      final updated = model.copyWith(isRead: true);
      expect(updated.isRead, true);
      expect(updated.id, '1'); // remains the same
    });
  });
}
