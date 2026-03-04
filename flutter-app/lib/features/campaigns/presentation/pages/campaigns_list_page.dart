import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/campaigns_provider.dart';
import '../widgets/campaign_card.dart';
import '../../../../core/exceptions/app_exception.dart';

class CampaignsListPage extends ConsumerStatefulWidget {
  const CampaignsListPage({Key? key}) : super(key: key);

  @override
  ConsumerState<CampaignsListPage> createState() => _CampaignsListPageState();
}

class _CampaignsListPageState extends ConsumerState<CampaignsListPage> {
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  final List<dynamic> _allCampaigns = [];
  bool _isLoadingMore = false;
  bool _hasNextPage = true;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isLoadingMore &&
        _hasNextPage) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    setState(() {
      _isLoadingMore = true;
    });

    try {
      final nextPage = _currentPage + 1;
      final response = await ref.read(campaignsProvider(nextPage).future);
      
      if (mounted) {
        setState(() {
          final newCampaigns = response['campaigns'] as List;
          _allCampaigns.addAll(newCampaigns);
          _currentPage = nextPage;
          
          final meta = response['meta'] as Map<String, dynamic>;
          _hasNextPage = meta['has_next'] ?? false;
          _isLoadingMore = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoadingMore = false;
        });
      }
    }
  }

  Future<void> _refresh() async {
    setState(() {
      _currentPage = 1;
      _allCampaigns.clear();
      _hasNextPage = true;
    });
    // ignore: unused_result
    ref.refresh(campaignsProvider(1));
  }

  @override
  Widget build(BuildContext context) {
    final campaignsAsync = ref.watch(campaignsProvider(_currentPage));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kampanyalar'),
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: campaignsAsync.when(
          data: (response) {
            if (_currentPage == 1 && _allCampaigns.isEmpty) {
              final campaigns = response['campaigns'] as List;
              _allCampaigns.addAll(campaigns);
              
              final meta = response['meta'] as Map<String, dynamic>;
              _hasNextPage = meta['has_next'] ?? false;
            }

            if (_allCampaigns.isEmpty) {
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.7,
                    child: const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.campaign_outlined, size: 64, color: Colors.grey),
                          SizedBox(height: 16),
                          Text(
                            'Şu an aktif bir kampanya bulunmuyor.',
                            style: TextStyle(color: Colors.grey, fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            }

            return ListView.builder(
              controller: _scrollController,
              physics: const AlwaysScrollableScrollPhysics(),
              itemCount: _allCampaigns.length + (_hasNextPage ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _allCampaigns.length) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Center(child: CircularProgressIndicator()),
                  );
                }
                
                final campaign = _allCampaigns[index];
                return CampaignCard(campaign: campaign);
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stack) {
            String message = 'Bir hata oluştu.';
            if (error is AppException) {
              message = error.message;
            }
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, color: Colors.red, size: 48),
                  const SizedBox(height: 16),
                  Text(message, textAlign: TextAlign.center),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _refresh,
                    child: const Text('Tekrar Dene'),
                  ),
                ],
              ),
            );
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
