// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'place_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

PlaceCategoryModel _$PlaceCategoryModelFromJson(Map<String, dynamic> json) {
  return _PlaceCategoryModel.fromJson(json);
}

/// @nodoc
mixin _$PlaceCategoryModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get icon => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $PlaceCategoryModelCopyWith<PlaceCategoryModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PlaceCategoryModelCopyWith<$Res> {
  factory $PlaceCategoryModelCopyWith(
          PlaceCategoryModel value, $Res Function(PlaceCategoryModel) then) =
      _$PlaceCategoryModelCopyWithImpl<$Res, PlaceCategoryModel>;
  @useResult
  $Res call({String id, String name, String slug, String? icon});
}

/// @nodoc
class _$PlaceCategoryModelCopyWithImpl<$Res, $Val extends PlaceCategoryModel>
    implements $PlaceCategoryModelCopyWith<$Res> {
  _$PlaceCategoryModelCopyWithImpl(this._value, this._then);

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
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PlaceCategoryModelImplCopyWith<$Res>
    implements $PlaceCategoryModelCopyWith<$Res> {
  factory _$$PlaceCategoryModelImplCopyWith(_$PlaceCategoryModelImpl value,
          $Res Function(_$PlaceCategoryModelImpl) then) =
      __$$PlaceCategoryModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, String slug, String? icon});
}

/// @nodoc
class __$$PlaceCategoryModelImplCopyWithImpl<$Res>
    extends _$PlaceCategoryModelCopyWithImpl<$Res, _$PlaceCategoryModelImpl>
    implements _$$PlaceCategoryModelImplCopyWith<$Res> {
  __$$PlaceCategoryModelImplCopyWithImpl(_$PlaceCategoryModelImpl _value,
      $Res Function(_$PlaceCategoryModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? icon = freezed,
  }) {
    return _then(_$PlaceCategoryModelImpl(
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
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PlaceCategoryModelImpl implements _PlaceCategoryModel {
  const _$PlaceCategoryModelImpl(
      {required this.id, required this.name, required this.slug, this.icon});

  factory _$PlaceCategoryModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PlaceCategoryModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? icon;

  @override
  String toString() {
    return 'PlaceCategoryModel(id: $id, name: $name, slug: $slug, icon: $icon)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PlaceCategoryModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.icon, icon) || other.icon == icon));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, slug, icon);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$PlaceCategoryModelImplCopyWith<_$PlaceCategoryModelImpl> get copyWith =>
      __$$PlaceCategoryModelImplCopyWithImpl<_$PlaceCategoryModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PlaceCategoryModelImplToJson(
      this,
    );
  }
}

abstract class _PlaceCategoryModel implements PlaceCategoryModel {
  const factory _PlaceCategoryModel(
      {required final String id,
      required final String name,
      required final String slug,
      final String? icon}) = _$PlaceCategoryModelImpl;

  factory _PlaceCategoryModel.fromJson(Map<String, dynamic> json) =
      _$PlaceCategoryModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get icon;
  @override
  @JsonKey(ignore: true)
  _$$PlaceCategoryModelImplCopyWith<_$PlaceCategoryModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PlaceModel _$PlaceModelFromJson(Map<String, dynamic> json) {
  return _PlaceModel.fromJson(json);
}

/// @nodoc
mixin _$PlaceModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  double? get latitude => throw _privateConstructorUsedError;
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  double? get longitude => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_free')
  bool get isFree => throw _privateConstructorUsedError;
  @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
  double? get entranceFee => throw _privateConstructorUsedError;
  @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
  double? get distanceFromCenter => throw _privateConstructorUsedError;
  @JsonKey(name: 'user_distance', fromJson: _parseDouble)
  double? get userDistance => throw _privateConstructorUsedError;
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  String? get coverImageUrl => throw _privateConstructorUsedError;
  PlaceCategoryModel? get category => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $PlaceModelCopyWith<PlaceModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PlaceModelCopyWith<$Res> {
  factory $PlaceModelCopyWith(
          PlaceModel value, $Res Function(PlaceModel) then) =
      _$PlaceModelCopyWithImpl<$Res, PlaceModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
      @JsonKey(name: 'is_free') bool isFree,
      @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
      double? entranceFee,
      @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
      double? distanceFromCenter,
      @JsonKey(name: 'user_distance', fromJson: _parseDouble)
      double? userDistance,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      String? coverImageUrl,
      PlaceCategoryModel? category});

  $PlaceCategoryModelCopyWith<$Res>? get category;
}

/// @nodoc
class _$PlaceModelCopyWithImpl<$Res, $Val extends PlaceModel>
    implements $PlaceModelCopyWith<$Res> {
  _$PlaceModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? address = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? isFree = null,
    Object? entranceFee = freezed,
    Object? distanceFromCenter = freezed,
    Object? userDistance = freezed,
    Object? coverImageUrl = freezed,
    Object? category = freezed,
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
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      isFree: null == isFree
          ? _value.isFree
          : isFree // ignore: cast_nullable_to_non_nullable
              as bool,
      entranceFee: freezed == entranceFee
          ? _value.entranceFee
          : entranceFee // ignore: cast_nullable_to_non_nullable
              as double?,
      distanceFromCenter: freezed == distanceFromCenter
          ? _value.distanceFromCenter
          : distanceFromCenter // ignore: cast_nullable_to_non_nullable
              as double?,
      userDistance: freezed == userDistance
          ? _value.userDistance
          : userDistance // ignore: cast_nullable_to_non_nullable
              as double?,
      coverImageUrl: freezed == coverImageUrl
          ? _value.coverImageUrl
          : coverImageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as PlaceCategoryModel?,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $PlaceCategoryModelCopyWith<$Res>? get category {
    if (_value.category == null) {
      return null;
    }

    return $PlaceCategoryModelCopyWith<$Res>(_value.category!, (value) {
      return _then(_value.copyWith(category: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PlaceModelImplCopyWith<$Res>
    implements $PlaceModelCopyWith<$Res> {
  factory _$$PlaceModelImplCopyWith(
          _$PlaceModelImpl value, $Res Function(_$PlaceModelImpl) then) =
      __$$PlaceModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
      @JsonKey(name: 'is_free') bool isFree,
      @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
      double? entranceFee,
      @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
      double? distanceFromCenter,
      @JsonKey(name: 'user_distance', fromJson: _parseDouble)
      double? userDistance,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      String? coverImageUrl,
      PlaceCategoryModel? category});

  @override
  $PlaceCategoryModelCopyWith<$Res>? get category;
}

/// @nodoc
class __$$PlaceModelImplCopyWithImpl<$Res>
    extends _$PlaceModelCopyWithImpl<$Res, _$PlaceModelImpl>
    implements _$$PlaceModelImplCopyWith<$Res> {
  __$$PlaceModelImplCopyWithImpl(
      _$PlaceModelImpl _value, $Res Function(_$PlaceModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? address = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? isFree = null,
    Object? entranceFee = freezed,
    Object? distanceFromCenter = freezed,
    Object? userDistance = freezed,
    Object? coverImageUrl = freezed,
    Object? category = freezed,
  }) {
    return _then(_$PlaceModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      isFree: null == isFree
          ? _value.isFree
          : isFree // ignore: cast_nullable_to_non_nullable
              as bool,
      entranceFee: freezed == entranceFee
          ? _value.entranceFee
          : entranceFee // ignore: cast_nullable_to_non_nullable
              as double?,
      distanceFromCenter: freezed == distanceFromCenter
          ? _value.distanceFromCenter
          : distanceFromCenter // ignore: cast_nullable_to_non_nullable
              as double?,
      userDistance: freezed == userDistance
          ? _value.userDistance
          : userDistance // ignore: cast_nullable_to_non_nullable
              as double?,
      coverImageUrl: freezed == coverImageUrl
          ? _value.coverImageUrl
          : coverImageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as PlaceCategoryModel?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PlaceModelImpl implements _PlaceModel {
  const _$PlaceModelImpl(
      {required this.id,
      required this.name,
      this.description,
      this.address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) this.latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) this.longitude,
      @JsonKey(name: 'is_free') this.isFree = true,
      @JsonKey(name: 'entrance_fee', fromJson: _parseDouble) this.entranceFee,
      @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
      this.distanceFromCenter,
      @JsonKey(name: 'user_distance', fromJson: _parseDouble) this.userDistance,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      this.coverImageUrl,
      this.category});

  factory _$PlaceModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PlaceModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? description;
  @override
  final String? address;
  @override
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  final double? latitude;
  @override
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  final double? longitude;
  @override
  @JsonKey(name: 'is_free')
  final bool isFree;
  @override
  @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
  final double? entranceFee;
  @override
  @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
  final double? distanceFromCenter;
  @override
  @JsonKey(name: 'user_distance', fromJson: _parseDouble)
  final double? userDistance;
  @override
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  final String? coverImageUrl;
  @override
  final PlaceCategoryModel? category;

  @override
  String toString() {
    return 'PlaceModel(id: $id, name: $name, description: $description, address: $address, latitude: $latitude, longitude: $longitude, isFree: $isFree, entranceFee: $entranceFee, distanceFromCenter: $distanceFromCenter, userDistance: $userDistance, coverImageUrl: $coverImageUrl, category: $category)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PlaceModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.isFree, isFree) || other.isFree == isFree) &&
            (identical(other.entranceFee, entranceFee) ||
                other.entranceFee == entranceFee) &&
            (identical(other.distanceFromCenter, distanceFromCenter) ||
                other.distanceFromCenter == distanceFromCenter) &&
            (identical(other.userDistance, userDistance) ||
                other.userDistance == userDistance) &&
            (identical(other.coverImageUrl, coverImageUrl) ||
                other.coverImageUrl == coverImageUrl) &&
            (identical(other.category, category) ||
                other.category == category));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      name,
      description,
      address,
      latitude,
      longitude,
      isFree,
      entranceFee,
      distanceFromCenter,
      userDistance,
      coverImageUrl,
      category);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$PlaceModelImplCopyWith<_$PlaceModelImpl> get copyWith =>
      __$$PlaceModelImplCopyWithImpl<_$PlaceModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PlaceModelImplToJson(
      this,
    );
  }
}

abstract class _PlaceModel implements PlaceModel {
  const factory _PlaceModel(
      {required final String id,
      required final String name,
      final String? description,
      final String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) final double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble)
      final double? longitude,
      @JsonKey(name: 'is_free') final bool isFree,
      @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
      final double? entranceFee,
      @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
      final double? distanceFromCenter,
      @JsonKey(name: 'user_distance', fromJson: _parseDouble)
      final double? userDistance,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      final String? coverImageUrl,
      final PlaceCategoryModel? category}) = _$PlaceModelImpl;

  factory _PlaceModel.fromJson(Map<String, dynamic> json) =
      _$PlaceModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get description;
  @override
  String? get address;
  @override
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  double? get latitude;
  @override
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  double? get longitude;
  @override
  @JsonKey(name: 'is_free')
  bool get isFree;
  @override
  @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
  double? get entranceFee;
  @override
  @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
  double? get distanceFromCenter;
  @override
  @JsonKey(name: 'user_distance', fromJson: _parseDouble)
  double? get userDistance;
  @override
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  String? get coverImageUrl;
  @override
  PlaceCategoryModel? get category;
  @override
  @JsonKey(ignore: true)
  _$$PlaceModelImplCopyWith<_$PlaceModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PlaceDetailModel _$PlaceDetailModelFromJson(Map<String, dynamic> json) {
  return _PlaceDetailModel.fromJson(json);
}

/// @nodoc
mixin _$PlaceDetailModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  double? get latitude => throw _privateConstructorUsedError;
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  double? get longitude => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_free')
  bool get isFree => throw _privateConstructorUsedError;
  @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
  double? get entranceFee => throw _privateConstructorUsedError;
  @JsonKey(name: 'opening_hours')
  String? get openingHours => throw _privateConstructorUsedError;
  @JsonKey(name: 'best_season')
  String? get bestSeason => throw _privateConstructorUsedError;
  @JsonKey(name: 'how_to_get_there')
  String? get howToGetThere => throw _privateConstructorUsedError;
  @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
  double? get distanceFromCenter => throw _privateConstructorUsedError;
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  String? get coverImageUrl => throw _privateConstructorUsedError;
  List<PlaceImageModel> get images => throw _privateConstructorUsedError;
  PlaceCategoryModel? get category => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $PlaceDetailModelCopyWith<PlaceDetailModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PlaceDetailModelCopyWith<$Res> {
  factory $PlaceDetailModelCopyWith(
          PlaceDetailModel value, $Res Function(PlaceDetailModel) then) =
      _$PlaceDetailModelCopyWithImpl<$Res, PlaceDetailModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
      @JsonKey(name: 'is_free') bool isFree,
      @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
      double? entranceFee,
      @JsonKey(name: 'opening_hours') String? openingHours,
      @JsonKey(name: 'best_season') String? bestSeason,
      @JsonKey(name: 'how_to_get_there') String? howToGetThere,
      @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
      double? distanceFromCenter,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      String? coverImageUrl,
      List<PlaceImageModel> images,
      PlaceCategoryModel? category});

  $PlaceCategoryModelCopyWith<$Res>? get category;
}

/// @nodoc
class _$PlaceDetailModelCopyWithImpl<$Res, $Val extends PlaceDetailModel>
    implements $PlaceDetailModelCopyWith<$Res> {
  _$PlaceDetailModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? address = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? isFree = null,
    Object? entranceFee = freezed,
    Object? openingHours = freezed,
    Object? bestSeason = freezed,
    Object? howToGetThere = freezed,
    Object? distanceFromCenter = freezed,
    Object? coverImageUrl = freezed,
    Object? images = null,
    Object? category = freezed,
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
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      isFree: null == isFree
          ? _value.isFree
          : isFree // ignore: cast_nullable_to_non_nullable
              as bool,
      entranceFee: freezed == entranceFee
          ? _value.entranceFee
          : entranceFee // ignore: cast_nullable_to_non_nullable
              as double?,
      openingHours: freezed == openingHours
          ? _value.openingHours
          : openingHours // ignore: cast_nullable_to_non_nullable
              as String?,
      bestSeason: freezed == bestSeason
          ? _value.bestSeason
          : bestSeason // ignore: cast_nullable_to_non_nullable
              as String?,
      howToGetThere: freezed == howToGetThere
          ? _value.howToGetThere
          : howToGetThere // ignore: cast_nullable_to_non_nullable
              as String?,
      distanceFromCenter: freezed == distanceFromCenter
          ? _value.distanceFromCenter
          : distanceFromCenter // ignore: cast_nullable_to_non_nullable
              as double?,
      coverImageUrl: freezed == coverImageUrl
          ? _value.coverImageUrl
          : coverImageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      images: null == images
          ? _value.images
          : images // ignore: cast_nullable_to_non_nullable
              as List<PlaceImageModel>,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as PlaceCategoryModel?,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $PlaceCategoryModelCopyWith<$Res>? get category {
    if (_value.category == null) {
      return null;
    }

    return $PlaceCategoryModelCopyWith<$Res>(_value.category!, (value) {
      return _then(_value.copyWith(category: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PlaceDetailModelImplCopyWith<$Res>
    implements $PlaceDetailModelCopyWith<$Res> {
  factory _$$PlaceDetailModelImplCopyWith(_$PlaceDetailModelImpl value,
          $Res Function(_$PlaceDetailModelImpl) then) =
      __$$PlaceDetailModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
      @JsonKey(name: 'is_free') bool isFree,
      @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
      double? entranceFee,
      @JsonKey(name: 'opening_hours') String? openingHours,
      @JsonKey(name: 'best_season') String? bestSeason,
      @JsonKey(name: 'how_to_get_there') String? howToGetThere,
      @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
      double? distanceFromCenter,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      String? coverImageUrl,
      List<PlaceImageModel> images,
      PlaceCategoryModel? category});

  @override
  $PlaceCategoryModelCopyWith<$Res>? get category;
}

/// @nodoc
class __$$PlaceDetailModelImplCopyWithImpl<$Res>
    extends _$PlaceDetailModelCopyWithImpl<$Res, _$PlaceDetailModelImpl>
    implements _$$PlaceDetailModelImplCopyWith<$Res> {
  __$$PlaceDetailModelImplCopyWithImpl(_$PlaceDetailModelImpl _value,
      $Res Function(_$PlaceDetailModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? address = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? isFree = null,
    Object? entranceFee = freezed,
    Object? openingHours = freezed,
    Object? bestSeason = freezed,
    Object? howToGetThere = freezed,
    Object? distanceFromCenter = freezed,
    Object? coverImageUrl = freezed,
    Object? images = null,
    Object? category = freezed,
  }) {
    return _then(_$PlaceDetailModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      isFree: null == isFree
          ? _value.isFree
          : isFree // ignore: cast_nullable_to_non_nullable
              as bool,
      entranceFee: freezed == entranceFee
          ? _value.entranceFee
          : entranceFee // ignore: cast_nullable_to_non_nullable
              as double?,
      openingHours: freezed == openingHours
          ? _value.openingHours
          : openingHours // ignore: cast_nullable_to_non_nullable
              as String?,
      bestSeason: freezed == bestSeason
          ? _value.bestSeason
          : bestSeason // ignore: cast_nullable_to_non_nullable
              as String?,
      howToGetThere: freezed == howToGetThere
          ? _value.howToGetThere
          : howToGetThere // ignore: cast_nullable_to_non_nullable
              as String?,
      distanceFromCenter: freezed == distanceFromCenter
          ? _value.distanceFromCenter
          : distanceFromCenter // ignore: cast_nullable_to_non_nullable
              as double?,
      coverImageUrl: freezed == coverImageUrl
          ? _value.coverImageUrl
          : coverImageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      images: null == images
          ? _value._images
          : images // ignore: cast_nullable_to_non_nullable
              as List<PlaceImageModel>,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as PlaceCategoryModel?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PlaceDetailModelImpl implements _PlaceDetailModel {
  const _$PlaceDetailModelImpl(
      {required this.id,
      required this.name,
      this.description,
      this.address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) this.latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) this.longitude,
      @JsonKey(name: 'is_free') this.isFree = true,
      @JsonKey(name: 'entrance_fee', fromJson: _parseDouble) this.entranceFee,
      @JsonKey(name: 'opening_hours') this.openingHours,
      @JsonKey(name: 'best_season') this.bestSeason,
      @JsonKey(name: 'how_to_get_there') this.howToGetThere,
      @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
      this.distanceFromCenter,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      this.coverImageUrl,
      final List<PlaceImageModel> images = const [],
      this.category})
      : _images = images;

  factory _$PlaceDetailModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PlaceDetailModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? description;
  @override
  final String? address;
  @override
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  final double? latitude;
  @override
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  final double? longitude;
  @override
  @JsonKey(name: 'is_free')
  final bool isFree;
  @override
  @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
  final double? entranceFee;
  @override
  @JsonKey(name: 'opening_hours')
  final String? openingHours;
  @override
  @JsonKey(name: 'best_season')
  final String? bestSeason;
  @override
  @JsonKey(name: 'how_to_get_there')
  final String? howToGetThere;
  @override
  @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
  final double? distanceFromCenter;
  @override
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  final String? coverImageUrl;
  final List<PlaceImageModel> _images;
  @override
  @JsonKey()
  List<PlaceImageModel> get images {
    if (_images is EqualUnmodifiableListView) return _images;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_images);
  }

  @override
  final PlaceCategoryModel? category;

  @override
  String toString() {
    return 'PlaceDetailModel(id: $id, name: $name, description: $description, address: $address, latitude: $latitude, longitude: $longitude, isFree: $isFree, entranceFee: $entranceFee, openingHours: $openingHours, bestSeason: $bestSeason, howToGetThere: $howToGetThere, distanceFromCenter: $distanceFromCenter, coverImageUrl: $coverImageUrl, images: $images, category: $category)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PlaceDetailModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.isFree, isFree) || other.isFree == isFree) &&
            (identical(other.entranceFee, entranceFee) ||
                other.entranceFee == entranceFee) &&
            (identical(other.openingHours, openingHours) ||
                other.openingHours == openingHours) &&
            (identical(other.bestSeason, bestSeason) ||
                other.bestSeason == bestSeason) &&
            (identical(other.howToGetThere, howToGetThere) ||
                other.howToGetThere == howToGetThere) &&
            (identical(other.distanceFromCenter, distanceFromCenter) ||
                other.distanceFromCenter == distanceFromCenter) &&
            (identical(other.coverImageUrl, coverImageUrl) ||
                other.coverImageUrl == coverImageUrl) &&
            const DeepCollectionEquality().equals(other._images, _images) &&
            (identical(other.category, category) ||
                other.category == category));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      name,
      description,
      address,
      latitude,
      longitude,
      isFree,
      entranceFee,
      openingHours,
      bestSeason,
      howToGetThere,
      distanceFromCenter,
      coverImageUrl,
      const DeepCollectionEquality().hash(_images),
      category);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$PlaceDetailModelImplCopyWith<_$PlaceDetailModelImpl> get copyWith =>
      __$$PlaceDetailModelImplCopyWithImpl<_$PlaceDetailModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PlaceDetailModelImplToJson(
      this,
    );
  }
}

abstract class _PlaceDetailModel implements PlaceDetailModel {
  const factory _PlaceDetailModel(
      {required final String id,
      required final String name,
      final String? description,
      final String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) final double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble)
      final double? longitude,
      @JsonKey(name: 'is_free') final bool isFree,
      @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
      final double? entranceFee,
      @JsonKey(name: 'opening_hours') final String? openingHours,
      @JsonKey(name: 'best_season') final String? bestSeason,
      @JsonKey(name: 'how_to_get_there') final String? howToGetThere,
      @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
      final double? distanceFromCenter,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      final String? coverImageUrl,
      final List<PlaceImageModel> images,
      final PlaceCategoryModel? category}) = _$PlaceDetailModelImpl;

  factory _PlaceDetailModel.fromJson(Map<String, dynamic> json) =
      _$PlaceDetailModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get description;
  @override
  String? get address;
  @override
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  double? get latitude;
  @override
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  double? get longitude;
  @override
  @JsonKey(name: 'is_free')
  bool get isFree;
  @override
  @JsonKey(name: 'entrance_fee', fromJson: _parseDouble)
  double? get entranceFee;
  @override
  @JsonKey(name: 'opening_hours')
  String? get openingHours;
  @override
  @JsonKey(name: 'best_season')
  String? get bestSeason;
  @override
  @JsonKey(name: 'how_to_get_there')
  String? get howToGetThere;
  @override
  @JsonKey(name: 'distance_from_center', fromJson: _parseDouble)
  double? get distanceFromCenter;
  @override
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  String? get coverImageUrl;
  @override
  List<PlaceImageModel> get images;
  @override
  PlaceCategoryModel? get category;
  @override
  @JsonKey(ignore: true)
  _$$PlaceDetailModelImplCopyWith<_$PlaceDetailModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PlaceImageModel _$PlaceImageModelFromJson(Map<String, dynamic> json) {
  return _PlaceImageModel.fromJson(json);
}

/// @nodoc
mixin _$PlaceImageModel {
  String get id => throw _privateConstructorUsedError;
  @JsonKey(name: 'display_order')
  int? get displayOrder => throw _privateConstructorUsedError;
  @JsonKey(name: 'file', readValue: _readPhotoUrl)
  String? get imageUrl => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $PlaceImageModelCopyWith<PlaceImageModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PlaceImageModelCopyWith<$Res> {
  factory $PlaceImageModelCopyWith(
          PlaceImageModel value, $Res Function(PlaceImageModel) then) =
      _$PlaceImageModelCopyWithImpl<$Res, PlaceImageModel>;
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'display_order') int? displayOrder,
      @JsonKey(name: 'file', readValue: _readPhotoUrl) String? imageUrl});
}

/// @nodoc
class _$PlaceImageModelCopyWithImpl<$Res, $Val extends PlaceImageModel>
    implements $PlaceImageModelCopyWith<$Res> {
  _$PlaceImageModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? displayOrder = freezed,
    Object? imageUrl = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      displayOrder: freezed == displayOrder
          ? _value.displayOrder
          : displayOrder // ignore: cast_nullable_to_non_nullable
              as int?,
      imageUrl: freezed == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PlaceImageModelImplCopyWith<$Res>
    implements $PlaceImageModelCopyWith<$Res> {
  factory _$$PlaceImageModelImplCopyWith(_$PlaceImageModelImpl value,
          $Res Function(_$PlaceImageModelImpl) then) =
      __$$PlaceImageModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'display_order') int? displayOrder,
      @JsonKey(name: 'file', readValue: _readPhotoUrl) String? imageUrl});
}

/// @nodoc
class __$$PlaceImageModelImplCopyWithImpl<$Res>
    extends _$PlaceImageModelCopyWithImpl<$Res, _$PlaceImageModelImpl>
    implements _$$PlaceImageModelImplCopyWith<$Res> {
  __$$PlaceImageModelImplCopyWithImpl(
      _$PlaceImageModelImpl _value, $Res Function(_$PlaceImageModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? displayOrder = freezed,
    Object? imageUrl = freezed,
  }) {
    return _then(_$PlaceImageModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      displayOrder: freezed == displayOrder
          ? _value.displayOrder
          : displayOrder // ignore: cast_nullable_to_non_nullable
              as int?,
      imageUrl: freezed == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PlaceImageModelImpl implements _PlaceImageModel {
  const _$PlaceImageModelImpl(
      {required this.id,
      @JsonKey(name: 'display_order') this.displayOrder,
      @JsonKey(name: 'file', readValue: _readPhotoUrl) this.imageUrl});

  factory _$PlaceImageModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PlaceImageModelImplFromJson(json);

  @override
  final String id;
  @override
  @JsonKey(name: 'display_order')
  final int? displayOrder;
  @override
  @JsonKey(name: 'file', readValue: _readPhotoUrl)
  final String? imageUrl;

  @override
  String toString() {
    return 'PlaceImageModel(id: $id, displayOrder: $displayOrder, imageUrl: $imageUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PlaceImageModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.displayOrder, displayOrder) ||
                other.displayOrder == displayOrder) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, displayOrder, imageUrl);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$PlaceImageModelImplCopyWith<_$PlaceImageModelImpl> get copyWith =>
      __$$PlaceImageModelImplCopyWithImpl<_$PlaceImageModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PlaceImageModelImplToJson(
      this,
    );
  }
}

abstract class _PlaceImageModel implements PlaceImageModel {
  const factory _PlaceImageModel(
      {required final String id,
      @JsonKey(name: 'display_order') final int? displayOrder,
      @JsonKey(name: 'file', readValue: _readPhotoUrl)
      final String? imageUrl}) = _$PlaceImageModelImpl;

  factory _PlaceImageModel.fromJson(Map<String, dynamic> json) =
      _$PlaceImageModelImpl.fromJson;

  @override
  String get id;
  @override
  @JsonKey(name: 'display_order')
  int? get displayOrder;
  @override
  @JsonKey(name: 'file', readValue: _readPhotoUrl)
  String? get imageUrl;
  @override
  @JsonKey(ignore: true)
  _$$PlaceImageModelImplCopyWith<_$PlaceImageModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
