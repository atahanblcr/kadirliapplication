// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'event_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

EventCategoryModel _$EventCategoryModelFromJson(Map<String, dynamic> json) {
  return _EventCategoryModel.fromJson(json);
}

/// @nodoc
mixin _$EventCategoryModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get icon => throw _privateConstructorUsedError;
  @JsonKey(name: 'events_count')
  int? get eventsCount => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $EventCategoryModelCopyWith<EventCategoryModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EventCategoryModelCopyWith<$Res> {
  factory $EventCategoryModelCopyWith(
          EventCategoryModel value, $Res Function(EventCategoryModel) then) =
      _$EventCategoryModelCopyWithImpl<$Res, EventCategoryModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String slug,
      String? icon,
      @JsonKey(name: 'events_count') int? eventsCount});
}

/// @nodoc
class _$EventCategoryModelCopyWithImpl<$Res, $Val extends EventCategoryModel>
    implements $EventCategoryModelCopyWith<$Res> {
  _$EventCategoryModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? icon = freezed,
    Object? eventsCount = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      slug: null == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as String,
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String?,
      eventsCount: freezed == eventsCount
          ? _value.eventsCount
          : eventsCount // ignore: cast_nullable_to_non_nullable
              as int?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$EventCategoryModelImplCopyWith<$Res>
    implements $EventCategoryModelCopyWith<$Res> {
  factory _$$EventCategoryModelImplCopyWith(_$EventCategoryModelImpl value,
          $Res Function(_$EventCategoryModelImpl) then) =
      __$$EventCategoryModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String slug,
      String? icon,
      @JsonKey(name: 'events_count') int? eventsCount});
}

/// @nodoc
class __$$EventCategoryModelImplCopyWithImpl<$Res>
    extends _$EventCategoryModelCopyWithImpl<$Res, _$EventCategoryModelImpl>
    implements _$$EventCategoryModelImplCopyWith<$Res> {
  __$$EventCategoryModelImplCopyWithImpl(_$EventCategoryModelImpl _value,
      $Res Function(_$EventCategoryModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? icon = freezed,
    Object? eventsCount = freezed,
  }) {
    return _then(_$EventCategoryModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      slug: null == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as String,
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String?,
      eventsCount: freezed == eventsCount
          ? _value.eventsCount
          : eventsCount // ignore: cast_nullable_to_non_nullable
              as int?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$EventCategoryModelImpl implements _EventCategoryModel {
  const _$EventCategoryModelImpl(
      {required this.id,
      required this.name,
      required this.slug,
      this.icon,
      @JsonKey(name: 'events_count') this.eventsCount});

  factory _$EventCategoryModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$EventCategoryModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? icon;
  @override
  @JsonKey(name: 'events_count')
  final int? eventsCount;

  @override
  String toString() {
    return 'EventCategoryModel(id: $id, name: $name, slug: $slug, icon: $icon, eventsCount: $eventsCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$EventCategoryModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.eventsCount, eventsCount) ||
                other.eventsCount == eventsCount));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, slug, icon, eventsCount);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$EventCategoryModelImplCopyWith<_$EventCategoryModelImpl> get copyWith =>
      __$$EventCategoryModelImplCopyWithImpl<_$EventCategoryModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$EventCategoryModelImplToJson(
      this,
    );
  }
}

abstract class _EventCategoryModel implements EventCategoryModel {
  const factory _EventCategoryModel(
          {required final String id,
          required final String name,
          required final String slug,
          final String? icon,
          @JsonKey(name: 'events_count') final int? eventsCount}) =
      _$EventCategoryModelImpl;

  factory _EventCategoryModel.fromJson(Map<String, dynamic> json) =
      _$EventCategoryModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get icon;
  @override
  @JsonKey(name: 'events_count')
  int? get eventsCount;
  @override
  @JsonKey(ignore: true)
  _$$EventCategoryModelImplCopyWith<_$EventCategoryModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

EventImageModel _$EventImageModelFromJson(Map<String, dynamic> json) {
  return _EventImageModel.fromJson(json);
}

/// @nodoc
mixin _$EventImageModel {
  String get id => throw _privateConstructorUsedError;
  String get url => throw _privateConstructorUsedError;
  @JsonKey(name: 'thumbnail_url')
  String? get thumbnailUrl => throw _privateConstructorUsedError;
  int? get order => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $EventImageModelCopyWith<EventImageModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EventImageModelCopyWith<$Res> {
  factory $EventImageModelCopyWith(
          EventImageModel value, $Res Function(EventImageModel) then) =
      _$EventImageModelCopyWithImpl<$Res, EventImageModel>;
  @useResult
  $Res call(
      {String id,
      String url,
      @JsonKey(name: 'thumbnail_url') String? thumbnailUrl,
      int? order});
}

/// @nodoc
class _$EventImageModelCopyWithImpl<$Res, $Val extends EventImageModel>
    implements $EventImageModelCopyWith<$Res> {
  _$EventImageModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? url = null,
    Object? thumbnailUrl = freezed,
    Object? order = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      url: null == url
          ? _value.url
          : url // ignore: cast_nullable_to_non_nullable
              as String,
      thumbnailUrl: freezed == thumbnailUrl
          ? _value.thumbnailUrl
          : thumbnailUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      order: freezed == order
          ? _value.order
          : order // ignore: cast_nullable_to_non_nullable
              as int?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$EventImageModelImplCopyWith<$Res>
    implements $EventImageModelCopyWith<$Res> {
  factory _$$EventImageModelImplCopyWith(_$EventImageModelImpl value,
          $Res Function(_$EventImageModelImpl) then) =
      __$$EventImageModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String url,
      @JsonKey(name: 'thumbnail_url') String? thumbnailUrl,
      int? order});
}

/// @nodoc
class __$$EventImageModelImplCopyWithImpl<$Res>
    extends _$EventImageModelCopyWithImpl<$Res, _$EventImageModelImpl>
    implements _$$EventImageModelImplCopyWith<$Res> {
  __$$EventImageModelImplCopyWithImpl(
      _$EventImageModelImpl _value, $Res Function(_$EventImageModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? url = null,
    Object? thumbnailUrl = freezed,
    Object? order = freezed,
  }) {
    return _then(_$EventImageModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      url: null == url
          ? _value.url
          : url // ignore: cast_nullable_to_non_nullable
              as String,
      thumbnailUrl: freezed == thumbnailUrl
          ? _value.thumbnailUrl
          : thumbnailUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      order: freezed == order
          ? _value.order
          : order // ignore: cast_nullable_to_non_nullable
              as int?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$EventImageModelImpl implements _EventImageModel {
  const _$EventImageModelImpl(
      {required this.id,
      required this.url,
      @JsonKey(name: 'thumbnail_url') this.thumbnailUrl,
      this.order});

  factory _$EventImageModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$EventImageModelImplFromJson(json);

  @override
  final String id;
  @override
  final String url;
  @override
  @JsonKey(name: 'thumbnail_url')
  final String? thumbnailUrl;
  @override
  final int? order;

  @override
  String toString() {
    return 'EventImageModel(id: $id, url: $url, thumbnailUrl: $thumbnailUrl, order: $order)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$EventImageModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.url, url) || other.url == url) &&
            (identical(other.thumbnailUrl, thumbnailUrl) ||
                other.thumbnailUrl == thumbnailUrl) &&
            (identical(other.order, order) || other.order == order));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, url, thumbnailUrl, order);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$EventImageModelImplCopyWith<_$EventImageModelImpl> get copyWith =>
      __$$EventImageModelImplCopyWithImpl<_$EventImageModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$EventImageModelImplToJson(
      this,
    );
  }
}

abstract class _EventImageModel implements EventImageModel {
  const factory _EventImageModel(
      {required final String id,
      required final String url,
      @JsonKey(name: 'thumbnail_url') final String? thumbnailUrl,
      final int? order}) = _$EventImageModelImpl;

  factory _EventImageModel.fromJson(Map<String, dynamic> json) =
      _$EventImageModelImpl.fromJson;

  @override
  String get id;
  @override
  String get url;
  @override
  @JsonKey(name: 'thumbnail_url')
  String? get thumbnailUrl;
  @override
  int? get order;
  @override
  @JsonKey(ignore: true)
  _$$EventImageModelImplCopyWith<_$EventImageModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

EventModel _$EventModelFromJson(Map<String, dynamic> json) {
  return _EventModel.fromJson(json);
}

/// @nodoc
mixin _$EventModel {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  EventCategoryModel? get category => throw _privateConstructorUsedError;
  @JsonKey(name: 'event_date')
  String get eventDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'event_time')
  String get eventTime => throw _privateConstructorUsedError;
  @JsonKey(name: 'venue_name')
  String get venueName => throw _privateConstructorUsedError;
  String? get city => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_free')
  bool get isFree => throw _privateConstructorUsedError;
  @JsonKey(readValue: _readCoverImage)
  EventImageModel? get coverImage => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $EventModelCopyWith<EventModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EventModelCopyWith<$Res> {
  factory $EventModelCopyWith(
          EventModel value, $Res Function(EventModel) then) =
      _$EventModelCopyWithImpl<$Res, EventModel>;
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      EventCategoryModel? category,
      @JsonKey(name: 'event_date') String eventDate,
      @JsonKey(name: 'event_time') String eventTime,
      @JsonKey(name: 'venue_name') String venueName,
      String? city,
      @JsonKey(name: 'is_free') bool isFree,
      @JsonKey(readValue: _readCoverImage) EventImageModel? coverImage,
      @JsonKey(name: 'created_at') DateTime createdAt});

  $EventCategoryModelCopyWith<$Res>? get category;
  $EventImageModelCopyWith<$Res>? get coverImage;
}

/// @nodoc
class _$EventModelCopyWithImpl<$Res, $Val extends EventModel>
    implements $EventModelCopyWith<$Res> {
  _$EventModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = freezed,
    Object? category = freezed,
    Object? eventDate = null,
    Object? eventTime = null,
    Object? venueName = null,
    Object? city = freezed,
    Object? isFree = null,
    Object? coverImage = freezed,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as EventCategoryModel?,
      eventDate: null == eventDate
          ? _value.eventDate
          : eventDate // ignore: cast_nullable_to_non_nullable
              as String,
      eventTime: null == eventTime
          ? _value.eventTime
          : eventTime // ignore: cast_nullable_to_non_nullable
              as String,
      venueName: null == venueName
          ? _value.venueName
          : venueName // ignore: cast_nullable_to_non_nullable
              as String,
      city: freezed == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as String?,
      isFree: null == isFree
          ? _value.isFree
          : isFree // ignore: cast_nullable_to_non_nullable
              as bool,
      coverImage: freezed == coverImage
          ? _value.coverImage
          : coverImage // ignore: cast_nullable_to_non_nullable
              as EventImageModel?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $EventCategoryModelCopyWith<$Res>? get category {
    if (_value.category == null) {
      return null;
    }

    return $EventCategoryModelCopyWith<$Res>(_value.category!, (value) {
      return _then(_value.copyWith(category: value) as $Val);
    });
  }

  @override
  @pragma('vm:prefer-inline')
  $EventImageModelCopyWith<$Res>? get coverImage {
    if (_value.coverImage == null) {
      return null;
    }

    return $EventImageModelCopyWith<$Res>(_value.coverImage!, (value) {
      return _then(_value.copyWith(coverImage: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$EventModelImplCopyWith<$Res>
    implements $EventModelCopyWith<$Res> {
  factory _$$EventModelImplCopyWith(
          _$EventModelImpl value, $Res Function(_$EventModelImpl) then) =
      __$$EventModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      EventCategoryModel? category,
      @JsonKey(name: 'event_date') String eventDate,
      @JsonKey(name: 'event_time') String eventTime,
      @JsonKey(name: 'venue_name') String venueName,
      String? city,
      @JsonKey(name: 'is_free') bool isFree,
      @JsonKey(readValue: _readCoverImage) EventImageModel? coverImage,
      @JsonKey(name: 'created_at') DateTime createdAt});

  @override
  $EventCategoryModelCopyWith<$Res>? get category;
  @override
  $EventImageModelCopyWith<$Res>? get coverImage;
}

/// @nodoc
class __$$EventModelImplCopyWithImpl<$Res>
    extends _$EventModelCopyWithImpl<$Res, _$EventModelImpl>
    implements _$$EventModelImplCopyWith<$Res> {
  __$$EventModelImplCopyWithImpl(
      _$EventModelImpl _value, $Res Function(_$EventModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = freezed,
    Object? category = freezed,
    Object? eventDate = null,
    Object? eventTime = null,
    Object? venueName = null,
    Object? city = freezed,
    Object? isFree = null,
    Object? coverImage = freezed,
    Object? createdAt = null,
  }) {
    return _then(_$EventModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as EventCategoryModel?,
      eventDate: null == eventDate
          ? _value.eventDate
          : eventDate // ignore: cast_nullable_to_non_nullable
              as String,
      eventTime: null == eventTime
          ? _value.eventTime
          : eventTime // ignore: cast_nullable_to_non_nullable
              as String,
      venueName: null == venueName
          ? _value.venueName
          : venueName // ignore: cast_nullable_to_non_nullable
              as String,
      city: freezed == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as String?,
      isFree: null == isFree
          ? _value.isFree
          : isFree // ignore: cast_nullable_to_non_nullable
              as bool,
      coverImage: freezed == coverImage
          ? _value.coverImage
          : coverImage // ignore: cast_nullable_to_non_nullable
              as EventImageModel?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$EventModelImpl implements _EventModel {
  const _$EventModelImpl(
      {required this.id,
      required this.title,
      this.description,
      this.category,
      @JsonKey(name: 'event_date') required this.eventDate,
      @JsonKey(name: 'event_time') required this.eventTime,
      @JsonKey(name: 'venue_name') required this.venueName,
      this.city,
      @JsonKey(name: 'is_free') this.isFree = false,
      @JsonKey(readValue: _readCoverImage) this.coverImage,
      @JsonKey(name: 'created_at') required this.createdAt});

  factory _$EventModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$EventModelImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String? description;
  @override
  final EventCategoryModel? category;
  @override
  @JsonKey(name: 'event_date')
  final String eventDate;
  @override
  @JsonKey(name: 'event_time')
  final String eventTime;
  @override
  @JsonKey(name: 'venue_name')
  final String venueName;
  @override
  final String? city;
  @override
  @JsonKey(name: 'is_free')
  final bool isFree;
  @override
  @JsonKey(readValue: _readCoverImage)
  final EventImageModel? coverImage;
  @override
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  @override
  String toString() {
    return 'EventModel(id: $id, title: $title, description: $description, category: $category, eventDate: $eventDate, eventTime: $eventTime, venueName: $venueName, city: $city, isFree: $isFree, coverImage: $coverImage, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$EventModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.eventDate, eventDate) ||
                other.eventDate == eventDate) &&
            (identical(other.eventTime, eventTime) ||
                other.eventTime == eventTime) &&
            (identical(other.venueName, venueName) ||
                other.venueName == venueName) &&
            (identical(other.city, city) || other.city == city) &&
            (identical(other.isFree, isFree) || other.isFree == isFree) &&
            (identical(other.coverImage, coverImage) ||
                other.coverImage == coverImage) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, title, description, category,
      eventDate, eventTime, venueName, city, isFree, coverImage, createdAt);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$EventModelImplCopyWith<_$EventModelImpl> get copyWith =>
      __$$EventModelImplCopyWithImpl<_$EventModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$EventModelImplToJson(
      this,
    );
  }
}

abstract class _EventModel implements EventModel {
  const factory _EventModel(
      {required final String id,
      required final String title,
      final String? description,
      final EventCategoryModel? category,
      @JsonKey(name: 'event_date') required final String eventDate,
      @JsonKey(name: 'event_time') required final String eventTime,
      @JsonKey(name: 'venue_name') required final String venueName,
      final String? city,
      @JsonKey(name: 'is_free') final bool isFree,
      @JsonKey(readValue: _readCoverImage) final EventImageModel? coverImage,
      @JsonKey(name: 'created_at')
      required final DateTime createdAt}) = _$EventModelImpl;

  factory _EventModel.fromJson(Map<String, dynamic> json) =
      _$EventModelImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String? get description;
  @override
  EventCategoryModel? get category;
  @override
  @JsonKey(name: 'event_date')
  String get eventDate;
  @override
  @JsonKey(name: 'event_time')
  String get eventTime;
  @override
  @JsonKey(name: 'venue_name')
  String get venueName;
  @override
  String? get city;
  @override
  @JsonKey(name: 'is_free')
  bool get isFree;
  @override
  @JsonKey(readValue: _readCoverImage)
  EventImageModel? get coverImage;
  @override
  @JsonKey(name: 'created_at')
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$EventModelImplCopyWith<_$EventModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

EventDetailModel _$EventDetailModelFromJson(Map<String, dynamic> json) {
  return _EventDetailModel.fromJson(json);
}

/// @nodoc
mixin _$EventDetailModel {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  EventCategoryModel? get category => throw _privateConstructorUsedError;
  @JsonKey(name: 'event_date')
  String get eventDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'event_time')
  String get eventTime => throw _privateConstructorUsedError;
  @JsonKey(name: 'duration_minutes')
  int? get durationMinutes => throw _privateConstructorUsedError;
  @JsonKey(name: 'venue_name')
  String get venueName => throw _privateConstructorUsedError;
  @JsonKey(name: 'venue_address')
  String? get venueAddress => throw _privateConstructorUsedError;
  String? get city => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _parseDouble)
  double? get latitude => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _parseDouble)
  double? get longitude => throw _privateConstructorUsedError;
  String? get organizer => throw _privateConstructorUsedError;
  @JsonKey(name: 'ticket_price')
  double? get ticketPrice => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_free')
  bool get isFree => throw _privateConstructorUsedError;
  @JsonKey(name: 'age_restriction')
  String? get ageRestriction => throw _privateConstructorUsedError;
  int? get capacity => throw _privateConstructorUsedError;
  @JsonKey(name: 'website_url')
  String? get websiteUrl => throw _privateConstructorUsedError;
  List<EventImageModel> get images => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $EventDetailModelCopyWith<EventDetailModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EventDetailModelCopyWith<$Res> {
  factory $EventDetailModelCopyWith(
          EventDetailModel value, $Res Function(EventDetailModel) then) =
      _$EventDetailModelCopyWithImpl<$Res, EventDetailModel>;
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      EventCategoryModel? category,
      @JsonKey(name: 'event_date') String eventDate,
      @JsonKey(name: 'event_time') String eventTime,
      @JsonKey(name: 'duration_minutes') int? durationMinutes,
      @JsonKey(name: 'venue_name') String venueName,
      @JsonKey(name: 'venue_address') String? venueAddress,
      String? city,
      @JsonKey(fromJson: _parseDouble) double? latitude,
      @JsonKey(fromJson: _parseDouble) double? longitude,
      String? organizer,
      @JsonKey(name: 'ticket_price') double? ticketPrice,
      @JsonKey(name: 'is_free') bool isFree,
      @JsonKey(name: 'age_restriction') String? ageRestriction,
      int? capacity,
      @JsonKey(name: 'website_url') String? websiteUrl,
      List<EventImageModel> images,
      @JsonKey(name: 'created_at') DateTime createdAt});

  $EventCategoryModelCopyWith<$Res>? get category;
}

/// @nodoc
class _$EventDetailModelCopyWithImpl<$Res, $Val extends EventDetailModel>
    implements $EventDetailModelCopyWith<$Res> {
  _$EventDetailModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = freezed,
    Object? category = freezed,
    Object? eventDate = null,
    Object? eventTime = null,
    Object? durationMinutes = freezed,
    Object? venueName = null,
    Object? venueAddress = freezed,
    Object? city = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? organizer = freezed,
    Object? ticketPrice = freezed,
    Object? isFree = null,
    Object? ageRestriction = freezed,
    Object? capacity = freezed,
    Object? websiteUrl = freezed,
    Object? images = null,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as EventCategoryModel?,
      eventDate: null == eventDate
          ? _value.eventDate
          : eventDate // ignore: cast_nullable_to_non_nullable
              as String,
      eventTime: null == eventTime
          ? _value.eventTime
          : eventTime // ignore: cast_nullable_to_non_nullable
              as String,
      durationMinutes: freezed == durationMinutes
          ? _value.durationMinutes
          : durationMinutes // ignore: cast_nullable_to_non_nullable
              as int?,
      venueName: null == venueName
          ? _value.venueName
          : venueName // ignore: cast_nullable_to_non_nullable
              as String,
      venueAddress: freezed == venueAddress
          ? _value.venueAddress
          : venueAddress // ignore: cast_nullable_to_non_nullable
              as String?,
      city: freezed == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as String?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      organizer: freezed == organizer
          ? _value.organizer
          : organizer // ignore: cast_nullable_to_non_nullable
              as String?,
      ticketPrice: freezed == ticketPrice
          ? _value.ticketPrice
          : ticketPrice // ignore: cast_nullable_to_non_nullable
              as double?,
      isFree: null == isFree
          ? _value.isFree
          : isFree // ignore: cast_nullable_to_non_nullable
              as bool,
      ageRestriction: freezed == ageRestriction
          ? _value.ageRestriction
          : ageRestriction // ignore: cast_nullable_to_non_nullable
              as String?,
      capacity: freezed == capacity
          ? _value.capacity
          : capacity // ignore: cast_nullable_to_non_nullable
              as int?,
      websiteUrl: freezed == websiteUrl
          ? _value.websiteUrl
          : websiteUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      images: null == images
          ? _value.images
          : images // ignore: cast_nullable_to_non_nullable
              as List<EventImageModel>,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $EventCategoryModelCopyWith<$Res>? get category {
    if (_value.category == null) {
      return null;
    }

    return $EventCategoryModelCopyWith<$Res>(_value.category!, (value) {
      return _then(_value.copyWith(category: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$EventDetailModelImplCopyWith<$Res>
    implements $EventDetailModelCopyWith<$Res> {
  factory _$$EventDetailModelImplCopyWith(_$EventDetailModelImpl value,
          $Res Function(_$EventDetailModelImpl) then) =
      __$$EventDetailModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      EventCategoryModel? category,
      @JsonKey(name: 'event_date') String eventDate,
      @JsonKey(name: 'event_time') String eventTime,
      @JsonKey(name: 'duration_minutes') int? durationMinutes,
      @JsonKey(name: 'venue_name') String venueName,
      @JsonKey(name: 'venue_address') String? venueAddress,
      String? city,
      @JsonKey(fromJson: _parseDouble) double? latitude,
      @JsonKey(fromJson: _parseDouble) double? longitude,
      String? organizer,
      @JsonKey(name: 'ticket_price') double? ticketPrice,
      @JsonKey(name: 'is_free') bool isFree,
      @JsonKey(name: 'age_restriction') String? ageRestriction,
      int? capacity,
      @JsonKey(name: 'website_url') String? websiteUrl,
      List<EventImageModel> images,
      @JsonKey(name: 'created_at') DateTime createdAt});

  @override
  $EventCategoryModelCopyWith<$Res>? get category;
}

/// @nodoc
class __$$EventDetailModelImplCopyWithImpl<$Res>
    extends _$EventDetailModelCopyWithImpl<$Res, _$EventDetailModelImpl>
    implements _$$EventDetailModelImplCopyWith<$Res> {
  __$$EventDetailModelImplCopyWithImpl(_$EventDetailModelImpl _value,
      $Res Function(_$EventDetailModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = freezed,
    Object? category = freezed,
    Object? eventDate = null,
    Object? eventTime = null,
    Object? durationMinutes = freezed,
    Object? venueName = null,
    Object? venueAddress = freezed,
    Object? city = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? organizer = freezed,
    Object? ticketPrice = freezed,
    Object? isFree = null,
    Object? ageRestriction = freezed,
    Object? capacity = freezed,
    Object? websiteUrl = freezed,
    Object? images = null,
    Object? createdAt = null,
  }) {
    return _then(_$EventDetailModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as EventCategoryModel?,
      eventDate: null == eventDate
          ? _value.eventDate
          : eventDate // ignore: cast_nullable_to_non_nullable
              as String,
      eventTime: null == eventTime
          ? _value.eventTime
          : eventTime // ignore: cast_nullable_to_non_nullable
              as String,
      durationMinutes: freezed == durationMinutes
          ? _value.durationMinutes
          : durationMinutes // ignore: cast_nullable_to_non_nullable
              as int?,
      venueName: null == venueName
          ? _value.venueName
          : venueName // ignore: cast_nullable_to_non_nullable
              as String,
      venueAddress: freezed == venueAddress
          ? _value.venueAddress
          : venueAddress // ignore: cast_nullable_to_non_nullable
              as String?,
      city: freezed == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as String?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      organizer: freezed == organizer
          ? _value.organizer
          : organizer // ignore: cast_nullable_to_non_nullable
              as String?,
      ticketPrice: freezed == ticketPrice
          ? _value.ticketPrice
          : ticketPrice // ignore: cast_nullable_to_non_nullable
              as double?,
      isFree: null == isFree
          ? _value.isFree
          : isFree // ignore: cast_nullable_to_non_nullable
              as bool,
      ageRestriction: freezed == ageRestriction
          ? _value.ageRestriction
          : ageRestriction // ignore: cast_nullable_to_non_nullable
              as String?,
      capacity: freezed == capacity
          ? _value.capacity
          : capacity // ignore: cast_nullable_to_non_nullable
              as int?,
      websiteUrl: freezed == websiteUrl
          ? _value.websiteUrl
          : websiteUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      images: null == images
          ? _value._images
          : images // ignore: cast_nullable_to_non_nullable
              as List<EventImageModel>,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$EventDetailModelImpl implements _EventDetailModel {
  const _$EventDetailModelImpl(
      {required this.id,
      required this.title,
      this.description,
      this.category,
      @JsonKey(name: 'event_date') required this.eventDate,
      @JsonKey(name: 'event_time') required this.eventTime,
      @JsonKey(name: 'duration_minutes') this.durationMinutes,
      @JsonKey(name: 'venue_name') required this.venueName,
      @JsonKey(name: 'venue_address') this.venueAddress,
      this.city,
      @JsonKey(fromJson: _parseDouble) this.latitude,
      @JsonKey(fromJson: _parseDouble) this.longitude,
      this.organizer,
      @JsonKey(name: 'ticket_price') this.ticketPrice,
      @JsonKey(name: 'is_free') this.isFree = false,
      @JsonKey(name: 'age_restriction') this.ageRestriction,
      this.capacity,
      @JsonKey(name: 'website_url') this.websiteUrl,
      final List<EventImageModel> images = const [],
      @JsonKey(name: 'created_at') required this.createdAt})
      : _images = images;

  factory _$EventDetailModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$EventDetailModelImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String? description;
  @override
  final EventCategoryModel? category;
  @override
  @JsonKey(name: 'event_date')
  final String eventDate;
  @override
  @JsonKey(name: 'event_time')
  final String eventTime;
  @override
  @JsonKey(name: 'duration_minutes')
  final int? durationMinutes;
  @override
  @JsonKey(name: 'venue_name')
  final String venueName;
  @override
  @JsonKey(name: 'venue_address')
  final String? venueAddress;
  @override
  final String? city;
  @override
  @JsonKey(fromJson: _parseDouble)
  final double? latitude;
  @override
  @JsonKey(fromJson: _parseDouble)
  final double? longitude;
  @override
  final String? organizer;
  @override
  @JsonKey(name: 'ticket_price')
  final double? ticketPrice;
  @override
  @JsonKey(name: 'is_free')
  final bool isFree;
  @override
  @JsonKey(name: 'age_restriction')
  final String? ageRestriction;
  @override
  final int? capacity;
  @override
  @JsonKey(name: 'website_url')
  final String? websiteUrl;
  final List<EventImageModel> _images;
  @override
  @JsonKey()
  List<EventImageModel> get images {
    if (_images is EqualUnmodifiableListView) return _images;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_images);
  }

  @override
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  @override
  String toString() {
    return 'EventDetailModel(id: $id, title: $title, description: $description, category: $category, eventDate: $eventDate, eventTime: $eventTime, durationMinutes: $durationMinutes, venueName: $venueName, venueAddress: $venueAddress, city: $city, latitude: $latitude, longitude: $longitude, organizer: $organizer, ticketPrice: $ticketPrice, isFree: $isFree, ageRestriction: $ageRestriction, capacity: $capacity, websiteUrl: $websiteUrl, images: $images, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$EventDetailModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.eventDate, eventDate) ||
                other.eventDate == eventDate) &&
            (identical(other.eventTime, eventTime) ||
                other.eventTime == eventTime) &&
            (identical(other.durationMinutes, durationMinutes) ||
                other.durationMinutes == durationMinutes) &&
            (identical(other.venueName, venueName) ||
                other.venueName == venueName) &&
            (identical(other.venueAddress, venueAddress) ||
                other.venueAddress == venueAddress) &&
            (identical(other.city, city) || other.city == city) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.organizer, organizer) ||
                other.organizer == organizer) &&
            (identical(other.ticketPrice, ticketPrice) ||
                other.ticketPrice == ticketPrice) &&
            (identical(other.isFree, isFree) || other.isFree == isFree) &&
            (identical(other.ageRestriction, ageRestriction) ||
                other.ageRestriction == ageRestriction) &&
            (identical(other.capacity, capacity) ||
                other.capacity == capacity) &&
            (identical(other.websiteUrl, websiteUrl) ||
                other.websiteUrl == websiteUrl) &&
            const DeepCollectionEquality().equals(other._images, _images) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hashAll([
        runtimeType,
        id,
        title,
        description,
        category,
        eventDate,
        eventTime,
        durationMinutes,
        venueName,
        venueAddress,
        city,
        latitude,
        longitude,
        organizer,
        ticketPrice,
        isFree,
        ageRestriction,
        capacity,
        websiteUrl,
        const DeepCollectionEquality().hash(_images),
        createdAt
      ]);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$EventDetailModelImplCopyWith<_$EventDetailModelImpl> get copyWith =>
      __$$EventDetailModelImplCopyWithImpl<_$EventDetailModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$EventDetailModelImplToJson(
      this,
    );
  }
}

abstract class _EventDetailModel implements EventDetailModel {
  const factory _EventDetailModel(
          {required final String id,
          required final String title,
          final String? description,
          final EventCategoryModel? category,
          @JsonKey(name: 'event_date') required final String eventDate,
          @JsonKey(name: 'event_time') required final String eventTime,
          @JsonKey(name: 'duration_minutes') final int? durationMinutes,
          @JsonKey(name: 'venue_name') required final String venueName,
          @JsonKey(name: 'venue_address') final String? venueAddress,
          final String? city,
          @JsonKey(fromJson: _parseDouble) final double? latitude,
          @JsonKey(fromJson: _parseDouble) final double? longitude,
          final String? organizer,
          @JsonKey(name: 'ticket_price') final double? ticketPrice,
          @JsonKey(name: 'is_free') final bool isFree,
          @JsonKey(name: 'age_restriction') final String? ageRestriction,
          final int? capacity,
          @JsonKey(name: 'website_url') final String? websiteUrl,
          final List<EventImageModel> images,
          @JsonKey(name: 'created_at') required final DateTime createdAt}) =
      _$EventDetailModelImpl;

  factory _EventDetailModel.fromJson(Map<String, dynamic> json) =
      _$EventDetailModelImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String? get description;
  @override
  EventCategoryModel? get category;
  @override
  @JsonKey(name: 'event_date')
  String get eventDate;
  @override
  @JsonKey(name: 'event_time')
  String get eventTime;
  @override
  @JsonKey(name: 'duration_minutes')
  int? get durationMinutes;
  @override
  @JsonKey(name: 'venue_name')
  String get venueName;
  @override
  @JsonKey(name: 'venue_address')
  String? get venueAddress;
  @override
  String? get city;
  @override
  @JsonKey(fromJson: _parseDouble)
  double? get latitude;
  @override
  @JsonKey(fromJson: _parseDouble)
  double? get longitude;
  @override
  String? get organizer;
  @override
  @JsonKey(name: 'ticket_price')
  double? get ticketPrice;
  @override
  @JsonKey(name: 'is_free')
  bool get isFree;
  @override
  @JsonKey(name: 'age_restriction')
  String? get ageRestriction;
  @override
  int? get capacity;
  @override
  @JsonKey(name: 'website_url')
  String? get websiteUrl;
  @override
  List<EventImageModel> get images;
  @override
  @JsonKey(name: 'created_at')
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$EventDetailModelImplCopyWith<_$EventDetailModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
