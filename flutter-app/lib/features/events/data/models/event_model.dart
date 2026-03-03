import 'package:freezed_annotation/freezed_annotation.dart';

part 'event_model.freezed.dart';
part 'event_model.g.dart';

@freezed
class EventCategoryModel with _$EventCategoryModel {
  const factory EventCategoryModel({
    required String id,
    required String name,
    required String slug,
    String? icon,
    @JsonKey(name: 'events_count') int? eventsCount,
  }) = _EventCategoryModel;

  factory EventCategoryModel.fromJson(Map<String, dynamic> json) =>
      _$EventCategoryModelFromJson(json);
}

@freezed
class EventImageModel with _$EventImageModel {
  const factory EventImageModel({
    required String id,
    required String url,
    @JsonKey(name: 'thumbnail_url') String? thumbnailUrl,
    int? order,
  }) = _EventImageModel;

  factory EventImageModel.fromJson(Map<String, dynamic> json) =>
      _$EventImageModelFromJson(json);
}

Object? _readCoverImage(Map<dynamic, dynamic> json, String key) {
  if (json.containsKey('cover_image') && json['cover_image'] != null) {
    return json['cover_image'];
  }
  return null;
}

double? _parseDouble(dynamic value) {
  if (value == null) return null;
  if (value is double) return value;
  if (value is int) return value.toDouble();
  if (value is String) return double.tryParse(value);
  return null;
}

@freezed
class EventModel with _$EventModel {
  const factory EventModel({
    required String id,
    required String title,
    String? description,
    EventCategoryModel? category,
    @JsonKey(name: 'event_date') required String eventDate,
    @JsonKey(name: 'event_time') required String eventTime,
    @JsonKey(name: 'venue_name') required String venueName,
    String? city,
    @JsonKey(name: 'is_free') @Default(false) bool isFree,
    @JsonKey(readValue: _readCoverImage) EventImageModel? coverImage,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _EventModel;

  factory EventModel.fromJson(Map<String, dynamic> json) =>
      _$EventModelFromJson(json);
}

@freezed
class EventDetailModel with _$EventDetailModel {
  const factory EventDetailModel({
    required String id,
    required String title,
    String? description,
    EventCategoryModel? category,
    @JsonKey(name: 'event_date') required String eventDate,
    @JsonKey(name: 'event_time') required String eventTime,
    @JsonKey(name: 'duration_minutes') int? durationMinutes,
    @JsonKey(name: 'venue_name') required String venueName,
    @JsonKey(name: 'venue_address') String? venueAddress,
    String? city,
    @JsonKey(fromJson: _parseDouble) double? latitude,
    @JsonKey(fromJson: _parseDouble) double? longitude,
    String? organizer,
    @JsonKey(name: 'ticket_price') double? ticketPrice,
    @JsonKey(name: 'is_free') @Default(false) bool isFree,
    @JsonKey(name: 'age_restriction') String? ageRestriction,
    int? capacity,
    @JsonKey(name: 'website_url') String? websiteUrl,
    @Default([]) List<EventImageModel> images,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _EventDetailModel;

  factory EventDetailModel.fromJson(Map<String, dynamic> json) =>
      _$EventDetailModelFromJson(json);
}
