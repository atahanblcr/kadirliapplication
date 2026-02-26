import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kadirliapp/core/constants/app_colors.dart';
import 'package:kadirliapp/core/constants/app_spacing.dart';
import 'package:kadirliapp/features/home/presentation/providers/home_provider.dart';
import 'package:kadirliapp/features/home/presentation/widgets/greeting_header.dart';
import 'package:kadirliapp/features/home/presentation/widgets/module_card.dart';
import 'package:kadirliapp/features/home/presentation/widgets/user_menu.dart';
import 'package:kadirliapp/features/announcements/presentation/pages/announcements_list_page.dart';

/// Home Page with 12 module grid and bottom navigation
class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final modules = ref.watch(moduleListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('KadirliApp'),
        elevation: 1,
        actions: const [
          UserMenu(),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          // Tab 0: Home - Module Grid
          _HomeTab(modules: modules),
          // Tab 1: Ads - Placeholder
          const _PlaceholderTab(title: 'İlanlar'),
          // Tab 2: Favorites - Placeholder
          const _PlaceholderTab(title: 'Favoriler'),
          // Tab 3: Profile - Placeholder
          const _PlaceholderTab(title: 'Profil'),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Ana Sayfa',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_bag),
            label: 'İlanlar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favoriler',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}

/// Home Tab - Shows greeting and module grid
class _HomeTab extends StatelessWidget {
  final List<ModuleItem> modules;

  const _HomeTab({required this.modules});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Greeting header
        const SliverToBoxAdapter(
          child: GreetingHeader(),
        ),
        // Module grid
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.md,
            0,
            AppSpacing.md,
            AppSpacing.lg,
          ),
          sliver: SliverGrid.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: AppSpacing.md,
              mainAxisSpacing: AppSpacing.md,
              childAspectRatio: 1.0,
            ),
            itemCount: modules.length,
            itemBuilder: (context, index) {
              final module = modules[index];
              return ModuleCard(
                module: module,
                onTap: () {
                  switch (module.key) {
                    case 'announcements':
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const AnnouncementsListPage(),
                        ),
                      );
                      break;
                    default:
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('${module.title} sayfası yakında açılacak.'),
                        ),
                      );
                  }
                },
              );
            },
          ),
        ),
      ],
    );
  }
}

/// Placeholder Tab - Shows for unimplemented sections
class _PlaceholderTab extends StatelessWidget {
  final String title;

  const _PlaceholderTab({required this.title});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.construction,
            size: 64,
            color: AppColors.grey300,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'Yakında açılacak',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textHint,
            ),
          ),
        ],
      ),
    );
  }
}
