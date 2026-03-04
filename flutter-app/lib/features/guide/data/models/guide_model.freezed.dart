// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'guide_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

GuideCategoryModel _$GuideCategoryModelFromJson(Map<String, dynamic> json) {
  return _GuideCategoryModel.fromJson(json);
}

/// @nodoc
mixin _$GuideCategoryModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get icon => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  @JsonKey(name: 'items_count')
  int get itemsCount => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $GuideCategoryModelCopyWith<GuideCategoryModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GuideCategoryModelCopyWith<$Res> {
  factory $GuideCategoryModelCopyWith(
          GuideCategoryModel value, $Res Function(GuideCategoryModel) then) =
      _$GuideCategoryModelCopyWithImpl<$Res, GuideCategoryModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String slug,
      String? icon,
      String? color,
      @JsonKey(name: 'items_count') int itemsCount});
}

/// @nodoc
class _$GuideCategoryModelCopyWithImpl<$Res, $Val extends GuideCategoryModel>
    implements $GuideCategoryModelCopyWith<$Res> {
  _$GuideCategoryModelCopyWithImpl(this._value, this._then);

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
    Object? color = freezed,
    Object? itemsCount = null,
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
      color: freezed == color
          ? _value.color
          : color // ignore: cast_nullable_to_non_nullable
              as String?,
      itemsCount: null == itemsCount
          ? _value.itemsCount
          : itemsCount // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GuideCategoryModelImplCopyWith<$Res>
    implements $GuideCategoryModelCopyWith<$Res> {
  factory _$$GuideCategoryModelImplCopyWith(_$GuideCategoryModelImpl value,
          $Res Function(_$GuideCategoryModelImpl) then) =
      __$$GuideCategoryModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String slug,
      String? icon,
      String? color,
      @JsonKey(name: 'items_count') int itemsCount});
}

/// @nodoc
class __$$GuideCategoryModelImplCopyWithImpl<$Res>
    extends _$GuideCategoryModelCopyWithImpl<$Res, _$GuideCategoryModelImpl>
    implements _$$GuideCategoryModelImplCopyWith<$Res> {
  __$$GuideCategoryModelImplCopyWithImpl(_$GuideCategoryModelImpl _value,
      $Res Function(_$GuideCategoryModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? icon = freezed,
    Object? color = freezed,
    Object? itemsCount = null,
  }) {
    return _then(_$GuideCategoryModelImpl(
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
      color: freezed == color
          ? _value.color
          : color // ignore: cast_nullable_to_non_nullable
              as String?,
      itemsCount: null == itemsCount
          ? _value.itemsCount
          : itemsCount // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GuideCategoryModelImpl implements _GuideCategoryModel {
  const _$GuideCategoryModelImpl(
      {required this.id,
      required this.name,
      required this.slug,
      this.icon,
      this.color,
      @JsonKey(name: 'items_count') this.itemsCount = 0});

  factory _$GuideCategoryModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GuideCategoryModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? icon;
  @override
  final String? color;
  @override
  @JsonKey(name: 'items_count')
  final int itemsCount;

  @override
  String toString() {
    return 'GuideCategoryModel(id: $id, name: $name, slug: $slug, icon: $icon, color: $color, itemsCount: $itemsCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GuideCategoryModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.itemsCount, itemsCount) ||
                other.itemsCount == itemsCount));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, slug, icon, color, itemsCount);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$GuideCategoryModelImplCopyWith<_$GuideCategoryModelImpl> get copyWith =>
      __$$GuideCategoryModelImplCopyWithImpl<_$GuideCategoryModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GuideCategoryModelImplToJson(
      this,
    );
  }
}

abstract class _GuideCategoryModel implements GuideCategoryModel {
  const factory _GuideCategoryModel(
          {required final String id,
          required final String name,
          required final String slug,
          final String? icon,
          final String? color,
          @JsonKey(name: 'items_count') final int itemsCount}) =
      _$GuideCategoryModelImpl;

  factory _GuideCategoryModel.fromJson(Map<String, dynamic> json) =
      _$GuideCategoryModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get icon;
  @override
  String? get color;
  @override
  @JsonKey(name: 'items_count')
  int get itemsCount;
  @override
  @JsonKey(ignore: true)
  _$$GuideCategoryModelImplCopyWith<_$GuideCategoryModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

GuideItemModel _$GuideItemModelFromJson(Map<String, dynamic> json) {
  return _GuideItemModel.fromJson(json);
}

/// @nodoc
mixin _$GuideItemModel {
  String get id => throw _privateConstructorUsedError;
  @JsonKey(name: 'category_id')
  String get categoryId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get phone => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  String? get email => throw _privateConstructorUsedError;
  @JsonKey(name: 'website_url')
  String? get websiteUrl => throw _privateConstructorUsedError;
  @JsonKey(name: 'working_hours')
  String? get workingHours => throw _privateConstructorUsedError;
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  double? get latitude => throw _privateConstructorUsedError;
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  double? get longitude => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  @JsonKey(name: 'logo', readValue: _readPhotoUrl)
  String? get logoUrl => throw _privateConstructorUsedError;
  GuideCategoryModel? get category => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $GuideItemModelCopyWith<GuideItemModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GuideItemModelCopyWith<$Res> {
  factory $GuideItemModelCopyWith(
          GuideItemModel value, $Res Function(GuideItemModel) then) =
      _$GuideItemModelCopyWithImpl<$Res, GuideItemModel>;
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'category_id') String categoryId,
      String name,
      String phone,
      String? address,
      String? email,
      @JsonKey(name: 'website_url') String? websiteUrl,
      @JsonKey(name: 'working_hours') String? workingHours,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
      String? description,
      @JsonKey(name: 'logo', readValue: _readPhotoUrl) String? logoUrl,
      GuideCategoryModel? category});

  $GuideCategoryModelCopyWith<$Res>? get category;
}

/// @nodoc
class _$GuideItemModelCopyWithImpl<$Res, $Val extends GuideItemModel>
    implements $GuideItemModelCopyWith<$Res> {
  _$GuideItemModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? categoryId = null,
    Object? name = null,
    Object? phone = null,
    Object? address = freezed,
    Object? email = freezed,
    Object? websiteUrl = freezed,
    Object? workingHours = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? description = freezed,
    Object? logoUrl = freezed,
    Object? category = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      categoryId: null == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      email: freezed == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String?,
      websiteUrl: freezed == websiteUrl
          ? _value.websiteUrl
          : websiteUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      workingHours: freezed == workingHours
          ? _value.workingHours
          : workingHours // ignore: cast_nullable_to_non_nullable
              as String?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      logoUrl: freezed == logoUrl
          ? _value.logoUrl
          : logoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as GuideCategoryModel?,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $GuideCategoryModelCopyWith<$Res>? get category {
    if (_value.category == null) {
      return null;
    }

    return $GuideCategoryModelCopyWith<$Res>(_value.category!, (value) {
      return _then(_value.copyWith(category: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$GuideItemModelImplCopyWith<$Res>
    implements $GuideItemModelCopyWith<$Res> {
  factory _$$GuideItemModelImplCopyWith(_$GuideItemModelImpl value,
          $Res Function(_$GuideItemModelImpl) then) =
      __$$GuideItemModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'category_id') String categoryId,
      String name,
      String phone,
      String? address,
      String? email,
      @JsonKey(name: 'website_url') String? websiteUrl,
      @JsonKey(name: 'working_hours') String? workingHours,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude,
      String? description,
      @JsonKey(name: 'logo', readValue: _readPhotoUrl) String? logoUrl,
      GuideCategoryModel? category});

  @override
  $GuideCategoryModelCopyWith<$Res>? get category;
}

/// @nodoc
class __$$GuideItemModelImplCopyWithImpl<$Res>
    extends _$GuideItemModelCopyWithImpl<$Res, _$GuideItemModelImpl>
    implements _$$GuideItemModelImplCopyWith<$Res> {
  __$$GuideItemModelImplCopyWithImpl(
      _$GuideItemModelImpl _value, $Res Function(_$GuideItemModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? categoryId = null,
    Object? name = null,
    Object? phone = null,
    Object? address = freezed,
    Object? email = freezed,
    Object? websiteUrl = freezed,
    Object? workingHours = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? description = freezed,
    Object? logoUrl = freezed,
    Object? category = freezed,
  }) {
    return _then(_$GuideItemModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      categoryId: null == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      email: freezed == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String?,
      websiteUrl: freezed == websiteUrl
          ? _value.websiteUrl
          : websiteUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      workingHours: freezed == workingHours
          ? _value.workingHours
          : workingHours // ignore: cast_nullable_to_non_nullable
              as String?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      logoUrl: freezed == logoUrl
          ? _value.logoUrl
          : logoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as GuideCategoryModel?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GuideItemModelImpl implements _GuideItemModel {
  const _$GuideItemModelImpl(
      {required this.id,
      @JsonKey(name: 'category_id') required this.categoryId,
      required this.name,
      required this.phone,
      this.address,
      this.email,
      @JsonKey(name: 'website_url') this.websiteUrl,
      @JsonKey(name: 'working_hours') this.workingHours,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) this.latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) this.longitude,
      this.description,
      @JsonKey(name: 'logo', readValue: _readPhotoUrl) this.logoUrl,
      this.category});

  factory _$GuideItemModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GuideItemModelImplFromJson(json);

  @override
  final String id;
  @override
  @JsonKey(name: 'category_id')
  final String categoryId;
  @override
  final String name;
  @override
  final String phone;
  @override
  final String? address;
  @override
  final String? email;
  @override
  @JsonKey(name: 'website_url')
  final String? websiteUrl;
  @override
  @JsonKey(name: 'working_hours')
  final String? workingHours;
  @override
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  final double? latitude;
  @override
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  final double? longitude;
  @override
  final String? description;
  @override
  @JsonKey(name: 'logo', readValue: _readPhotoUrl)
  final String? logoUrl;
  @override
  final GuideCategoryModel? category;

  @override
  String toString() {
    return 'GuideItemModel(id: $id, categoryId: $categoryId, name: $name, phone: $phone, address: $address, email: $email, websiteUrl: $websiteUrl, workingHours: $workingHours, latitude: $latitude, longitude: $longitude, description: $description, logoUrl: $logoUrl, category: $category)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GuideItemModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.websiteUrl, websiteUrl) ||
                other.websiteUrl == websiteUrl) &&
            (identical(other.workingHours, workingHours) ||
                other.workingHours == workingHours) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.logoUrl, logoUrl) || other.logoUrl == logoUrl) &&
            (identical(other.category, category) ||
                other.category == category));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      categoryId,
      name,
      phone,
      address,
      email,
      websiteUrl,
      workingHours,
      latitude,
      longitude,
      description,
      logoUrl,
      category);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$GuideItemModelImplCopyWith<_$GuideItemModelImpl> get copyWith =>
      __$$GuideItemModelImplCopyWithImpl<_$GuideItemModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GuideItemModelImplToJson(
      this,
    );
  }
}

abstract class _GuideItemModel implements GuideItemModel {
  const factory _GuideItemModel(
      {required final String id,
      @JsonKey(name: 'category_id') required final String categoryId,
      required final String name,
      required final String phone,
      final String? address,
      final String? email,
      @JsonKey(name: 'website_url') final String? websiteUrl,
      @JsonKey(name: 'working_hours') final String? workingHours,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) final double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble)
      final double? longitude,
      final String? description,
      @JsonKey(name: 'logo', readValue: _readPhotoUrl) final String? logoUrl,
      final GuideCategoryModel? category}) = _$GuideItemModelImpl;

  factory _GuideItemModel.fromJson(Map<String, dynamic> json) =
      _$GuideItemModelImpl.fromJson;

  @override
  String get id;
  @override
  @JsonKey(name: 'category_id')
  String get categoryId;
  @override
  String get name;
  @override
  String get phone;
  @override
  String? get address;
  @override
  String? get email;
  @override
  @JsonKey(name: 'website_url')
  String? get websiteUrl;
  @override
  @JsonKey(name: 'working_hours')
  String? get workingHours;
  @override
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  double? get latitude;
  @override
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  double? get longitude;
  @override
  String? get description;
  @override
  @JsonKey(name: 'logo', readValue: _readPhotoUrl)
  String? get logoUrl;
  @override
  GuideCategoryModel? get category;
  @override
  @JsonKey(ignore: true)
  _$$GuideItemModelImplCopyWith<_$GuideItemModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
