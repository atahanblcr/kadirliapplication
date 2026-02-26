import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/announcements_provider.dart';
import '../widgets/announcement_card.dart';
import '../widgets/announcement_shimmer.dart';
import 'announcement_detail_page.dart';

/// Announcements list page
/// Features: pull-to-refresh, infinite scroll, error handling
class AnnouncementsListPage extends ConsumerStatefulWidget {
  const AnnouncementsListPage({super.key});

  @override
  ConsumerState<AnnouncementsListPage> createState() =>
      _AnnouncementsListPageState();
}

class _AnnouncementsListPageState extends ConsumerState<AnnouncementsListPage> {
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);

    // Load announcements on init
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(announcementsProvider.notifier).loadAnnouncements();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  /// Infinite scroll listener
  void _onScroll() {
    if (!_scrollController.hasClients) return;

    final position = _scrollController.position;
    if (position.pixels > position.maxScrollExtent * 0.9) {
      final state = ref.read(announcementsProvider);
      if (!state.isLoadingMore && state.hasMore) {
        ref.read(announcementsProvider.notifier).loadMore();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(announcementsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Duyurular'),
        elevation: 0,
      ),
      body: _buildBody(state),
    );
  }

  Widget _buildBody(AnnouncementsState state) {
    // Initial loading
    if (state.isLoading) {
      return const AnnouncementShimmer();
    }

    // Error state
    if (state.error != null && state.items.isEmpty) {
      return _buildErrorState(state.error!);
    }

    // Empty state
    if (state.items.isEmpty) {
      return _buildEmptyState();
    }

    // List state
    return RefreshIndicator(
      onRefresh: () async {
        await ref.read(announcementsProvider.notifier).refresh();
      },
      child: ListView.builder(
        controller: _scrollController,
        itemCount: state.items.length + (state.isLoadingMore ? 1 : 0),
        itemBuilder: (context, index) {
          // Loading indicator at bottom
          if (index == state.items.length) {
            return const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: CircularProgressIndicator(
                strokeWidth: 2,
              ),
            );
          }

          final announcement = state.items[index];
          return AnnouncementCard(
            announcement: announcement,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      AnnouncementDetailPage(id: announcement.id),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inbox_outlined,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'Henüz duyuru yok',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          Text(
            'Yakında eklenecek 📭',
            style: TextStyle(color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 64,
            color: Colors.red[400],
          ),
          const SizedBox(height: 16),
          Text(
            'Bir hata oluştu',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[500]),
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            icon: const Icon(Icons.refresh),
            label: const Text('Tekrar Dene'),
            onPressed: () {
              ref.read(announcementsProvider.notifier).loadAnnouncements();
            },
          ),
        ],
      ),
    );
  }
}
