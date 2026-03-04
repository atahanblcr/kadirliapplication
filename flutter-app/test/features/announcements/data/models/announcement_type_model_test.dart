import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/announcements/data/models/announcement_type_model.dart';

void main() {
  group('AnnouncementTypeModel', () {
    test('fromJson works correctly', () {
      final json = {
        'id': '1',
        'name': 'Haber',
        'slug': 'haber',
        'icon': 'flash_on',
        'color': '#FF0000'
      };

      final model = AnnouncementTypeModel.fromJson(json);

      expect(model.id, '1');
      expect(model.name, 'Haber');
      expect(model.iconData, Icons.flash_on);
      expect(model.typeColor.value, 0xFFFF0000);
    });

    test('iconData fallback works', () {
      final model = AnnouncementTypeModel(id: '1', name: 'N', slug: 's', icon: 'unknown');
      expect(model.iconData, Icons.campaign);
    });

    test('typeColor fallback works', () {
      final model = AnnouncementTypeModel(id: '1', name: 'N', slug: 's', color: 'invalid');
      expect(model.typeColor, const Color(0xFF2196F3));
    });
  });
}
