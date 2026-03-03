import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/events_list_provider.dart';
import '../widgets/event_card.dart';

class EventsListPage extends ConsumerStatefulWidget {
  const EventsListPage({super.key});

  @override
  ConsumerState<EventsListPage> createState() => _EventsListPageState();
}

class _EventsListPageState extends ConsumerState<EventsListPage> {
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(eventsListNotifierProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(eventsListNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Etkinlikler'),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(eventsListNotifierProvider.notifier).refresh(),
        child: state.events.isEmpty && state.isLoading
            ? const Center(child: CircularProgressIndicator())
            : state.events.isEmpty && state.error != null
                ? Center(child: Text('Hata: ${state.error}'))
                : state.events.isEmpty
                    ? const Center(child: Text('Henüz etkinlik bulunmuyor.'))
                    : ListView.builder(
                        controller: _scrollController,
                        physics: const AlwaysScrollableScrollPhysics(),
                        itemCount: state.events.length + (state.isLoading ? 1 : 0),
                        itemBuilder: (context, index) {
                          if (index == state.events.length) {
                            return const Padding(
                              padding: EdgeInsets.all(16.0),
                              child: Center(child: CircularProgressIndicator()),
                            );
                          }
                          return EventCard(event: state.events[index]);
                        },
                      ),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}
