import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/deaths_list_provider.dart';
import '../widgets/death_card.dart';

class DeathsListPage extends ConsumerStatefulWidget {
  const DeathsListPage({super.key});

  @override
  ConsumerState<DeathsListPage> createState() => _DeathsListPageState();
}

class _DeathsListPageState extends ConsumerState<DeathsListPage> {
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
      ref.read(deathsListNotifierProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(deathsListNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Vefat İlanları'),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(deathsListNotifierProvider.notifier).refresh(),
        child: state.notices.isEmpty && state.isLoading
            ? const Center(child: CircularProgressIndicator())
            : state.notices.isEmpty && state.error != null
                ? Center(child: Text('Hata: ${state.error}'))
                : state.notices.isEmpty
                    ? const Center(child: Text('Vefat ilanı bulunamadı.'))
                    : ListView.builder(
                        controller: _scrollController,
                        physics: const AlwaysScrollableScrollPhysics(),
                        itemCount: state.notices.length + (state.isLoading ? 1 : 0),
                        itemBuilder: (context, index) {
                          if (index == state.notices.length) {
                            return const Padding(
                              padding: EdgeInsets.all(16.0),
                              child: Center(child: CircularProgressIndicator()),
                            );
                          }
                          return DeathCard(notice: state.notices[index]);
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
