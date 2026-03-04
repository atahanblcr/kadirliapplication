import 'package:freezed_annotation/freezed_annotation.dart';

part 'campaign_model.freezed.dart';
part 'campaign_model.g.dart';

double? _parseDouble(dynamic value) {
  if (value == null) return null;
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value);
  return null;
}

Object? _readPhotoUrl(Map<dynamic, dynamic> json, String key) {
  final photoFile = json['photo_file'];
  if (photoFile is Map && photoFile['url'] != null) {
    return photoFile['url'];
  }
  
  final coverImage = json['cover_image'];
  if (coverImage is Map && coverImage['url'] != null) {
    return coverImage['url'];
  }

  final file = json['file'];
  if (file is Map && file['url'] != null) {
    return file['url'];
  }
  
  return json[key];
}

@freezed
class CampaignModel with _$CampaignModel {
  const factory CampaignModel({
    required String id,
    required String title,
    String? description,
    @JsonKey(name: 'discount_percentage') int? discountPercentage,
    @JsonKey(name: 'minimum_amount', fromJson: _parseDouble) double? minimumAmount,
    @JsonKey(name: 'stock_limit') int? stockLimit,
    @JsonKey(name: 'start_date') String? startDate,
    @JsonKey(name: 'end_date') String? endDate,
    @JsonKey(name: 'code_view_count') int? codeViewCount,
    CampaignBusinessModel? business,
    @JsonKey(name: 'cover_image', readValue: _readPhotoUrl) String? coverImageUrl,
  }) = _CampaignModel;

  factory CampaignModel.fromJson(Map<String, dynamic> json) =>
      _$CampaignModelFromJson(json);
}

@freezed
class CampaignDetailModel with _$CampaignDetailModel {
  const factory CampaignDetailModel({
    required String id,
    required String title,
    String? description,
    @JsonKey(name: 'discount_percentage') int? discountPercentage,
    @JsonKey(name: 'discount_code') String? discountCode,
    String? terms,
    @JsonKey(name: 'minimum_amount', fromJson: _parseDouble) double? minimumAmount,
    @JsonKey(name: 'stock_limit') int? stockLimit,
    @JsonKey(name: 'start_date') String? startDate,
    @JsonKey(name: 'end_date') String? endDate,
    @JsonKey(name: 'code_view_count') int? codeViewCount,
    CampaignBusinessModel? business,
    @JsonKey(name: 'cover_image', readValue: _readPhotoUrl) String? coverImageUrl,
    @Default([]) List<CampaignImageModel> images,
  }) = _CampaignDetailModel;

  factory CampaignDetailModel.fromJson(Map<String, dynamic> json) =>
      _$CampaignDetailModelFromJson(json);
}

@freezed
class CampaignBusinessModel with _$CampaignBusinessModel {
  const factory CampaignBusinessModel({
    required String id,
    required String name,
    @JsonKey(name: 'phone_number') String? phone,
    String? address,
    @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
    @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
  }) = _CampaignBusinessModel;

  factory CampaignBusinessModel.fromJson(Map<String, dynamic> json) =>
      _$CampaignBusinessModelFromJson(json);
}

@freezed
class CampaignImageModel with _$CampaignImageModel {
  const factory CampaignImageModel({
    required String id,
    @JsonKey(name: 'display_order') int? displayOrder,
    @JsonKey(name: 'file', readValue: _readPhotoUrl) String? imageUrl,
  }) = _CampaignImageModel;

  factory CampaignImageModel.fromJson(Map<String, dynamic> json) =>
      _$CampaignImageModelFromJson(json);
}
