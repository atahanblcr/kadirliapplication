import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kadirliapp/app.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: KadirliApp()),
    );

    // App should show loading initially
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(find.text('KadirliApp'), findsOneWidget);
  });
}
