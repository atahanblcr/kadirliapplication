import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/places_repository.dart';
import '../../data/models/place_model.dart';

final placesRepositoryProvider = Provider((ref) {
  return PlacesRepository();
});

class PlacesFilter {
  final String? categoryId;
  final bool? isFree;
  final String sort;
  final double? userLat;
  final double? userLng;

  PlacesFilter({
    this.categoryId,
    this.isFree,
    this.sort = 'name',
    this.userLat,
    this.userLng,
  });

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is PlacesFilter &&
        other.categoryId == categoryId &&
        other.isFree == isFree &&
        other.sort == sort &&
        other.userLat == userLat &&
        other.userLng == userLng;
  }

  @override
  int get hashCode =>
      categoryId.hashCode ^
      isFree.hashCode ^
      sort.hashCode ^
      userLat.hashCode ^
      userLng.hashCode;
}

final placesProvider = FutureProvider.family.autoDispose<
    List<PlaceModel>, PlacesFilter>((ref, filter) async {
  final repository = ref.watch(placesRepositoryProvider);
  return repository.getPlaces(
    categoryId: filter.categoryId,
    isFree: filter.isFree,
    sort: filter.sort,
    userLat: filter.userLat,
    userLng: filter.userLng,
  );
});

final placeDetailProvider = FutureProvider.family.autoDispose<
    PlaceDetailModel, String>((ref, id) async {
  final repository = ref.watch(placesRepositoryProvider);
  return repository.getPlaceDetail(id);
});
