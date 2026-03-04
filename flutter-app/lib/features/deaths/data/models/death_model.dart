import 'package:freezed_annotation/freezed_annotation.dart';

part 'death_model.freezed.dart';
part 'death_model.g.dart';

@freezed
class DeathNoticeModel with _$DeathNoticeModel {
  const factory DeathNoticeModel({
    required String id,
    @JsonKey(name: 'deceased_name') required String deceasedName,
    int? age,
    @JsonKey(readValue: _readPhotoUrl) String? photoUrl,
    @JsonKey(name: 'funeral_date') required String funeralDate,
    @JsonKey(name: 'funeral_time') required String funeralTime,
    CemeteryModel? cemetery,
    MosqueModel? mosque,
    @JsonKey(name: 'condolence_address') String? condolenceAddress,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _DeathNoticeModel;

  factory DeathNoticeModel.fromJson(Map<String, dynamic> json) =>
      _$DeathNoticeModelFromJson(json);
}

String? _readPhotoUrl(Map<dynamic, dynamic> json, String key) {
  if (json.containsKey('photo_url') && json['photo_url'] != null) {
    return json['photo_url'] as String;
  }
  if (json.containsKey('photo_file') && json['photo_file'] != null) {
    final file = json['photo_file'];
    if (file is Map && file.containsKey('url')) {
      return file['url'] as String;
    }
  }
  if (json.containsKey('photo') && json['photo'] != null) {
    final photo = json['photo'];
    if (photo is Map && photo.containsKey('url')) {
      return photo['url'] as String;
    }
  }
  return null;
}

@freezed
class DeathNoticeDetailModel with _$DeathNoticeDetailModel {
  const factory DeathNoticeDetailModel({
    required String id,
    @JsonKey(name: 'deceased_name') required String deceasedName,
    int? age,
    @JsonKey(readValue: _readPhotoDetail) DeathPhotoModel? photo,
    @JsonKey(name: 'funeral_date') required String funeralDate,
    @JsonKey(name: 'funeral_time') required String funeralTime,
    CemeteryModel? cemetery,
    MosqueModel? mosque,
    @JsonKey(name: 'condolence_address') String? condolenceAddress,
    @JsonKey(name: 'auto_archive_at') DateTime? autoArchiveAt,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _DeathNoticeDetailModel;

  factory DeathNoticeDetailModel.fromJson(Map<String, dynamic> json) =>
      _$DeathNoticeDetailModelFromJson(json);
}

Object? _readPhotoDetail(Map<dynamic, dynamic> json, String key) {
  if (json.containsKey('photo') && json['photo'] != null) {
    return json['photo'];
  }
  if (json.containsKey('photo_file') && json['photo_file'] != null) {
    return json['photo_file'];
  }
  return null;
}

@freezed
class DeathPhotoModel with _$DeathPhotoModel {
  const factory DeathPhotoModel({
    required String id,
    required String url,
    @JsonKey(name: 'thumbnail_url') String? thumbnailUrl,
  }) = _DeathPhotoModel;

  factory DeathPhotoModel.fromJson(Map<String, dynamic> json) =>
      _$DeathPhotoModelFromJson(json);
}

double? _parseDouble(dynamic value) {
  if (value == null) return null;
  if (value is double) return value;
  if (value is int) return value.toDouble();
  if (value is String) return double.tryParse(value);
  return null;
}

@freezed
class CemeteryModel with _$CemeteryModel {
  const factory CemeteryModel({
    required String id,
    required String name,
    String? address,
    @JsonKey(fromJson: _parseDouble) double? latitude,
    @JsonKey(fromJson: _parseDouble) double? longitude,
  }) = _CemeteryModel;

  factory CemeteryModel.fromJson(Map<String, dynamic> json) =>
      _$CemeteryModelFromJson(json);
}

@freezed
class MosqueModel with _$MosqueModel {
  const factory MosqueModel({
    required String id,
    required String name,
    String? address,
    @JsonKey(fromJson: _parseDouble) double? latitude,
    @JsonKey(fromJson: _parseDouble) double? longitude,
  }) = _MosqueModel;

  factory MosqueModel.fromJson(Map<String, dynamic> json) =>
      _$MosqueModelFromJson(json);
}
