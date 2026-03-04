import 'package:freezed_annotation/freezed_annotation.dart';

part 'guide_model.freezed.dart';
part 'guide_model.g.dart';

double? _parseDouble(dynamic value) {
  if (value == null) return null;
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value);
  return null;
}

Object? _readPhotoUrl(Map<dynamic, dynamic> json, String key) {
  final logoFile = json['logo'];
  if (logoFile is Map && logoFile['url'] != null) {
    return logoFile['url'];
  }
  return json[key];
}

@freezed
class GuideCategoryModel with _$GuideCategoryModel {
  const factory GuideCategoryModel({
    required String id,
    required String name,
    required String slug,
    String? icon,
    String? color,
    @JsonKey(name: 'items_count') @Default(0) int itemsCount,
  }) = _GuideCategoryModel;

  factory GuideCategoryModel.fromJson(Map<String, dynamic> json) =>
      _$GuideCategoryModelFromJson(json);
}

@freezed
class GuideItemModel with _$GuideItemModel {
  const factory GuideItemModel({
    required String id,
    @JsonKey(name: 'category_id') required String categoryId,
    required String name,
    required String phone,
    String? address,
    String? email,
    @JsonKey(name: 'website_url') String? websiteUrl,
    @JsonKey(name: 'working_hours') String? workingHours,
    @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
    @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
    String? description,
    @JsonKey(name: 'logo', readValue: _readPhotoUrl) String? logoUrl,
    GuideCategoryModel? category,
  }) = _GuideItemModel;

  factory GuideItemModel.fromJson(Map<String, dynamic> json) =>
      _$GuideItemModelFromJson(json);
}
