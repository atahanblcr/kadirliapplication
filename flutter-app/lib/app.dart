import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/constants/app_colors.dart';
import 'core/network/session_expiry_notifier.dart';
import 'features/auth/presentation/providers/auth_provider.dart';
import 'features/auth/presentation/pages/phone_input_page.dart';
import 'features/home/presentation/pages/home_page.dart';

class KadirliApp extends ConsumerWidget {
  const KadirliApp({super.key});

  ThemeData _buildTheme(Brightness brightness) {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.primary,
      brightness: brightness,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: GoogleFonts.poppinsTextTheme(
        brightness == Brightness.dark
            ? ThemeData.dark().textTheme
            : ThemeData.light().textTheme,
      ),
      scaffoldBackgroundColor: brightness == Brightness.dark
          ? AppColors.backgroundDark
          : AppColors.background,
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'KadirliApp',
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(Brightness.light),
      darkTheme: _buildTheme(Brightness.dark),
      themeMode: ThemeMode.system,
      home: const _AuthGate(),
    );
  }
}

class _AuthGate extends ConsumerStatefulWidget {
  const _AuthGate();

  @override
  ConsumerState<_AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends ConsumerState<_AuthGate> {
  @override
  void initState() {
    super.initState();
    // Check auth status when the app starts
    Future.microtask(
      () => ref.read(authProvider.notifier).checkAuthStatus(),
    );
    SessionExpiryNotifier.instance.addListener(_onSessionExpired);
  }

  @override
  void dispose() {
    SessionExpiryNotifier.instance.removeListener(_onSessionExpired);
    super.dispose();
  }

  void _onSessionExpired() {
    ref.read(authProvider.notifier).handleSessionExpired();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    switch (authState.status) {
      case AuthStatus.initial:
        // Splash / loading screen
        return const Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text('KadirliApp'),
              ],
            ),
          ),
        );

      case AuthStatus.unauthenticated:
        return const PhoneInputPage();

      case AuthStatus.authenticated:
        return const HomePage();
    }
  }
}
