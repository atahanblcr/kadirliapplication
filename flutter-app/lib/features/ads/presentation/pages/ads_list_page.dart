import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/ads_provider.dart';
import '../widgets/ad_card.dart';
import '../widgets/ad_shimmer.dart';
import '../../../../core/constants/app_spacing.dart';
import 'ad_detail_page.dart';
import 'ad_create_page.dart';

class AdsListPage extends ConsumerStatefulWidget {
  const AdsListPage({super.key});

  @override
  ConsumerState<AdsListPage> createState() => _AdsListPageState();
}

class _AdsListPageState extends ConsumerState<AdsListPage> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(adsProvider.notifier).loadAds();
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(adsProvider.notifier).loadMore();
    }
  }

  /// Filtreleme menüsünü açar
  void _showFilterSheet() {
    final state = ref.read(adsProvider);
    final minPriceController = TextEditingController(text: state.minPrice?.toString());
    final maxPriceController = TextEditingController(text: state.maxPrice?.toString());

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 20,
          right: 20,
          top: 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Filtrele ve Sırala',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            const Text('Fiyat Aralığı', style: TextStyle(fontWeight: FontWeight.w600)),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: minPriceController,
                    decoration: const InputDecoration(hintText: 'Min ₺'),
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: TextField(
                    controller: maxPriceController,
                    decoration: const InputDecoration(hintText: 'Max ₺'),
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Text('Sıralama', style: TextStyle(fontWeight: FontWeight.w600)),
            DropdownButtonFormField<String>(
              value: state.sort ?? 'newest',
              items: const [
                DropdownMenuItem(value: 'newest', child: Text('En Yeni')),
                DropdownMenuItem(value: 'price_asc', child: Text('Fiyat: Düşükten Yükseğe')),
                DropdownMenuItem(value: 'price_desc', child: Text('Fiyat: Yüksekten Düşüğe')),
              ],
              onChanged: (val) {
                // local value change
              },
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  ref.read(adsProvider.notifier).updateFilters(
                    minPrice: int.tryParse(minPriceController.text),
                    maxPrice: int.tryParse(maxPriceController.text),
                    sort: 'newest', // Basitleştirme için şimdilik sabit
                  );
                  Navigator.pop(context);
                },
                child: const Text('Uygula'),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(adsProvider);
    final categoriesAsync = ref.watch(adCategoriesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('İlanlar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterSheet, // Filtre butonu bağlandı
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'İlan ara...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          ref.read(adsProvider.notifier).updateFilters(search: '', clearSearch: true);
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
              onChanged: (value) {
                // Arama butonuna basmayı beklemeden anlık arama
                ref.read(adsProvider.notifier).updateFilters(search: value);
              },
            ),
          ),
          
          SizedBox(
            height: 40,
            child: categoriesAsync.when(
              data: (categories) => ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                itemCount: categories.length + 1,
                itemBuilder: (context, index) {
                  final isAll = index == 0;
                  final category = isAll ? null : categories[index - 1];
                  final isSelected = isAll 
                      ? state.categoryId == null 
                      : state.categoryId == category?.id;

                  return Padding(
                    padding: const EdgeInsets.only(right: AppSpacing.sm),
                    child: FilterChip(
                      label: Text(isAll ? 'Tümü' : category!.name),
                      selected: isSelected,
                      onSelected: (selected) {
                        if (isAll) {
                          ref.read(adsProvider.notifier).updateFilters(clearCategoryId: true);
                        } else {
                          ref.read(adsProvider.notifier).updateFilters(categoryId: category?.id);
                        }
                      },
                    ),
                  );
                },
              ),
              loading: () => const SizedBox.shrink(),
              error: (_, __) => const SizedBox.shrink(),
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          Expanded(
            child: RefreshIndicator(
              onRefresh: () => ref.read(adsProvider.notifier).refresh(),
              child: state.isLoading
                  ? const AdShimmer()
                  : state.items.isEmpty
                      ? _buildEmptyState()
                      : ListView.builder(
                          controller: _scrollController,
                          itemCount: state.items.length + (state.isLoadingMore ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == state.items.length) {
                              return const Padding(
                                padding: EdgeInsets.all(AppSpacing.md),
                                child: Center(child: CircularProgressIndicator()),
                              );
                            }
                            final ad = state.items[index];
                            return AdCard(
                              ad: ad,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => AdDetailPage(adId: ad.id),
                                  ),
                                );
                              },
                              onFavoriteTap: () {
                                ref.read(favoritesProvider.notifier).toggleFavorite(ad.id, ad.isFavorite);
                              },
                            );
                          },
                        ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // İlan verme sayfası kesin olarak açılacak
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AdCreatePage()),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off, size: 64, color: Colors.grey[400]),
          const SizedBox(height: AppSpacing.md),
          const Text(
            'İlan bulunamadı',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'Farklı bir arama veya filtre deneyebilirsiniz.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
