import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/guide_repository.dart';
import '../../data/models/guide_model.dart';

final guideRepositoryProvider = Provider((ref) {
  return GuideRepository();
});

final guideCategoriesProvider = FutureProvider.autoDispose<List<GuideCategoryModel>>((ref) async {
  final repository = ref.watch(guideRepositoryProvider);
  return repository.getCategories();
});

// A provider for search and category filtering
class GuideFilter {
  final String? categoryId;
  final String? search;

  GuideFilter({this.categoryId, this.search});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is GuideFilter &&
        other.categoryId == categoryId &&
        other.search == search;
  }

  @override
  int get hashCode => categoryId.hashCode ^ search.hashCode;
}

final guideItemsProvider = FutureProvider.family.autoDispose<
    List<GuideItemModel>, GuideFilter>((ref, filter) async {
  final repository = ref.watch(guideRepositoryProvider);
  return repository.getGuideItems(
    categoryId: filter.categoryId,
    search: filter.search,
  );
});
