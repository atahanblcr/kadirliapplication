import 'package:freezed_annotation/freezed_annotation.dart';

part 'place_model.freezed.dart';
part 'place_model.g.dart';

double? _parseDouble(dynamic value) {
  if (value == null) return null;
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value);
  return null;
}

Object? _readPhotoUrl(Map<dynamic, dynamic> json, String key) {
  final file = json['file'];
  if (file is Map && file['url'] != null) {
    return file['url'];
  }
  
  final coverImage = json['cover_image'];
  if (coverImage is Map && coverImage['url'] != null) {
    return coverImage['url'];
  }
  
  return json[key];
}

@freezed
class PlaceCategoryModel with _$PlaceCategoryModel {
  const factory PlaceCategoryModel({
    required String id,
    required String name,
    required String slug,
    String? icon,
  }) = _PlaceCategoryModel;

  factory PlaceCategoryModel.fromJson(Map<String, dynamic> json) =>
      _$PlaceCategoryModelFromJson(json);
}

@freezed
class PlaceModel with _$PlaceModel {
  const factory PlaceModel({
    required String id,
    required String name,
    String? description,
    String? address,
    @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
    @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
    @JsonKey(name: 'is_free') @Default(true) bool isFree,
    @JsonKey(name: 'entrance_fee', fromJson: _parseDouble) double? entranceFee,
    @JsonKey(name: 'distance_from_center', fromJson: _parseDouble) double? distanceFromCenter,
    @JsonKey(name: 'user_distance', fromJson: _parseDouble) double? userDistance,
    @JsonKey(name: 'cover_image', readValue: _readPhotoUrl) String? coverImageUrl,
    PlaceCategoryModel? category,
  }) = _PlaceModel;

  factory PlaceModel.fromJson(Map<String, dynamic> json) =>
      _$PlaceModelFromJson(json);
}

@freezed
class PlaceDetailModel with _$PlaceDetailModel {
  const factory PlaceDetailModel({
    required String id,
    required String name,
    String? description,
    String? address,
    @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
    @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
    @JsonKey(name: 'is_free') @Default(true) bool isFree,
    @JsonKey(name: 'entrance_fee', fromJson: _parseDouble) double? entranceFee,
    @JsonKey(name: 'opening_hours') String? openingHours,
    @JsonKey(name: 'best_season') String? bestSeason,
    @JsonKey(name: 'how_to_get_there') String? howToGetThere,
    @JsonKey(name: 'distance_from_center', fromJson: _parseDouble) double? distanceFromCenter,
    @JsonKey(name: 'cover_image', readValue: _readPhotoUrl) String? coverImageUrl,
    @Default([]) List<PlaceImageModel> images,
    PlaceCategoryModel? category,
  }) = _PlaceDetailModel;

  factory PlaceDetailModel.fromJson(Map<String, dynamic> json) =>
      _$PlaceDetailModelFromJson(json);
}

@freezed
class PlaceImageModel with _$PlaceImageModel {
  const factory PlaceImageModel({
    required String id,
    @JsonKey(name: 'display_order') int? displayOrder,
    @JsonKey(name: 'file', readValue: _readPhotoUrl) String? imageUrl,
  }) = _PlaceImageModel;

  factory PlaceImageModel.fromJson(Map<String, dynamic> json) =>
      _$PlaceImageModelFromJson(json);
}
