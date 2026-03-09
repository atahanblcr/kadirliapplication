import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kadirliapp/features/home/presentation/providers/home_provider.dart';

void main() {
  group('moduleListProvider', () {
    test('returns a list of 11 module items', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final modules = container.read(moduleListProvider);

      expect(modules.length, 11);
      expect(modules[0].key, 'announcements');
      expect(modules[10].key, 'notifications');
    });

    test('ModuleItem has correct properties', () {
      final item = ModuleItem(
        key: 'test',
        title: 'Test',
        icon: Icons.abc,
        color: Colors.red,
      );

      expect(item.key, 'test');
      expect(item.title, 'Test');
      expect(item.icon, Icons.abc);
      expect(item.color, Colors.red);
    });
  });
}
