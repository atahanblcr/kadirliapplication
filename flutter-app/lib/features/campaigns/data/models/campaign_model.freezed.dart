// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'campaign_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CampaignModel _$CampaignModelFromJson(Map<String, dynamic> json) {
  return _CampaignModel.fromJson(json);
}

/// @nodoc
mixin _$CampaignModel {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  @JsonKey(name: 'discount_percentage')
  int? get discountPercentage => throw _privateConstructorUsedError;
  @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
  double? get minimumAmount => throw _privateConstructorUsedError;
  @JsonKey(name: 'stock_limit')
  int? get stockLimit => throw _privateConstructorUsedError;
  @JsonKey(name: 'start_date')
  String? get startDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'end_date')
  String? get endDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'code_view_count')
  int? get codeViewCount => throw _privateConstructorUsedError;
  CampaignBusinessModel? get business => throw _privateConstructorUsedError;
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  String? get coverImageUrl => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $CampaignModelCopyWith<CampaignModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CampaignModelCopyWith<$Res> {
  factory $CampaignModelCopyWith(
          CampaignModel value, $Res Function(CampaignModel) then) =
      _$CampaignModelCopyWithImpl<$Res, CampaignModel>;
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      @JsonKey(name: 'discount_percentage') int? discountPercentage,
      @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
      double? minimumAmount,
      @JsonKey(name: 'stock_limit') int? stockLimit,
      @JsonKey(name: 'start_date') String? startDate,
      @JsonKey(name: 'end_date') String? endDate,
      @JsonKey(name: 'code_view_count') int? codeViewCount,
      CampaignBusinessModel? business,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      String? coverImageUrl});

  $CampaignBusinessModelCopyWith<$Res>? get business;
}

/// @nodoc
class _$CampaignModelCopyWithImpl<$Res, $Val extends CampaignModel>
    implements $CampaignModelCopyWith<$Res> {
  _$CampaignModelCopyWithImpl(this._value, this._then);

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
    Object? discountPercentage = freezed,
    Object? minimumAmount = freezed,
    Object? stockLimit = freezed,
    Object? startDate = freezed,
    Object? endDate = freezed,
    Object? codeViewCount = freezed,
    Object? business = freezed,
    Object? coverImageUrl = freezed,
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
      discountPercentage: freezed == discountPercentage
          ? _value.discountPercentage
          : discountPercentage // ignore: cast_nullable_to_non_nullable
              as int?,
      minimumAmount: freezed == minimumAmount
          ? _value.minimumAmount
          : minimumAmount // ignore: cast_nullable_to_non_nullable
              as double?,
      stockLimit: freezed == stockLimit
          ? _value.stockLimit
          : stockLimit // ignore: cast_nullable_to_non_nullable
              as int?,
      startDate: freezed == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as String?,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as String?,
      codeViewCount: freezed == codeViewCount
          ? _value.codeViewCount
          : codeViewCount // ignore: cast_nullable_to_non_nullable
              as int?,
      business: freezed == business
          ? _value.business
          : business // ignore: cast_nullable_to_non_nullable
              as CampaignBusinessModel?,
      coverImageUrl: freezed == coverImageUrl
          ? _value.coverImageUrl
          : coverImageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $CampaignBusinessModelCopyWith<$Res>? get business {
    if (_value.business == null) {
      return null;
    }

    return $CampaignBusinessModelCopyWith<$Res>(_value.business!, (value) {
      return _then(_value.copyWith(business: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$CampaignModelImplCopyWith<$Res>
    implements $CampaignModelCopyWith<$Res> {
  factory _$$CampaignModelImplCopyWith(
          _$CampaignModelImpl value, $Res Function(_$CampaignModelImpl) then) =
      __$$CampaignModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      @JsonKey(name: 'discount_percentage') int? discountPercentage,
      @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
      double? minimumAmount,
      @JsonKey(name: 'stock_limit') int? stockLimit,
      @JsonKey(name: 'start_date') String? startDate,
      @JsonKey(name: 'end_date') String? endDate,
      @JsonKey(name: 'code_view_count') int? codeViewCount,
      CampaignBusinessModel? business,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      String? coverImageUrl});

  @override
  $CampaignBusinessModelCopyWith<$Res>? get business;
}

/// @nodoc
class __$$CampaignModelImplCopyWithImpl<$Res>
    extends _$CampaignModelCopyWithImpl<$Res, _$CampaignModelImpl>
    implements _$$CampaignModelImplCopyWith<$Res> {
  __$$CampaignModelImplCopyWithImpl(
      _$CampaignModelImpl _value, $Res Function(_$CampaignModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = freezed,
    Object? discountPercentage = freezed,
    Object? minimumAmount = freezed,
    Object? stockLimit = freezed,
    Object? startDate = freezed,
    Object? endDate = freezed,
    Object? codeViewCount = freezed,
    Object? business = freezed,
    Object? coverImageUrl = freezed,
  }) {
    return _then(_$CampaignModelImpl(
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
      discountPercentage: freezed == discountPercentage
          ? _value.discountPercentage
          : discountPercentage // ignore: cast_nullable_to_non_nullable
              as int?,
      minimumAmount: freezed == minimumAmount
          ? _value.minimumAmount
          : minimumAmount // ignore: cast_nullable_to_non_nullable
              as double?,
      stockLimit: freezed == stockLimit
          ? _value.stockLimit
          : stockLimit // ignore: cast_nullable_to_non_nullable
              as int?,
      startDate: freezed == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as String?,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as String?,
      codeViewCount: freezed == codeViewCount
          ? _value.codeViewCount
          : codeViewCount // ignore: cast_nullable_to_non_nullable
              as int?,
      business: freezed == business
          ? _value.business
          : business // ignore: cast_nullable_to_non_nullable
              as CampaignBusinessModel?,
      coverImageUrl: freezed == coverImageUrl
          ? _value.coverImageUrl
          : coverImageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CampaignModelImpl implements _CampaignModel {
  const _$CampaignModelImpl(
      {required this.id,
      required this.title,
      this.description,
      @JsonKey(name: 'discount_percentage') this.discountPercentage,
      @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
      this.minimumAmount,
      @JsonKey(name: 'stock_limit') this.stockLimit,
      @JsonKey(name: 'start_date') this.startDate,
      @JsonKey(name: 'end_date') this.endDate,
      @JsonKey(name: 'code_view_count') this.codeViewCount,
      this.business,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      this.coverImageUrl});

  factory _$CampaignModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CampaignModelImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String? description;
  @override
  @JsonKey(name: 'discount_percentage')
  final int? discountPercentage;
  @override
  @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
  final double? minimumAmount;
  @override
  @JsonKey(name: 'stock_limit')
  final int? stockLimit;
  @override
  @JsonKey(name: 'start_date')
  final String? startDate;
  @override
  @JsonKey(name: 'end_date')
  final String? endDate;
  @override
  @JsonKey(name: 'code_view_count')
  final int? codeViewCount;
  @override
  final CampaignBusinessModel? business;
  @override
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  final String? coverImageUrl;

  @override
  String toString() {
    return 'CampaignModel(id: $id, title: $title, description: $description, discountPercentage: $discountPercentage, minimumAmount: $minimumAmount, stockLimit: $stockLimit, startDate: $startDate, endDate: $endDate, codeViewCount: $codeViewCount, business: $business, coverImageUrl: $coverImageUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CampaignModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.discountPercentage, discountPercentage) ||
                other.discountPercentage == discountPercentage) &&
            (identical(other.minimumAmount, minimumAmount) ||
                other.minimumAmount == minimumAmount) &&
            (identical(other.stockLimit, stockLimit) ||
                other.stockLimit == stockLimit) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.codeViewCount, codeViewCount) ||
                other.codeViewCount == codeViewCount) &&
            (identical(other.business, business) ||
                other.business == business) &&
            (identical(other.coverImageUrl, coverImageUrl) ||
                other.coverImageUrl == coverImageUrl));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      title,
      description,
      discountPercentage,
      minimumAmount,
      stockLimit,
      startDate,
      endDate,
      codeViewCount,
      business,
      coverImageUrl);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$CampaignModelImplCopyWith<_$CampaignModelImpl> get copyWith =>
      __$$CampaignModelImplCopyWithImpl<_$CampaignModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CampaignModelImplToJson(
      this,
    );
  }
}

abstract class _CampaignModel implements CampaignModel {
  const factory _CampaignModel(
      {required final String id,
      required final String title,
      final String? description,
      @JsonKey(name: 'discount_percentage') final int? discountPercentage,
      @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
      final double? minimumAmount,
      @JsonKey(name: 'stock_limit') final int? stockLimit,
      @JsonKey(name: 'start_date') final String? startDate,
      @JsonKey(name: 'end_date') final String? endDate,
      @JsonKey(name: 'code_view_count') final int? codeViewCount,
      final CampaignBusinessModel? business,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      final String? coverImageUrl}) = _$CampaignModelImpl;

  factory _CampaignModel.fromJson(Map<String, dynamic> json) =
      _$CampaignModelImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String? get description;
  @override
  @JsonKey(name: 'discount_percentage')
  int? get discountPercentage;
  @override
  @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
  double? get minimumAmount;
  @override
  @JsonKey(name: 'stock_limit')
  int? get stockLimit;
  @override
  @JsonKey(name: 'start_date')
  String? get startDate;
  @override
  @JsonKey(name: 'end_date')
  String? get endDate;
  @override
  @JsonKey(name: 'code_view_count')
  int? get codeViewCount;
  @override
  CampaignBusinessModel? get business;
  @override
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  String? get coverImageUrl;
  @override
  @JsonKey(ignore: true)
  _$$CampaignModelImplCopyWith<_$CampaignModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CampaignDetailModel _$CampaignDetailModelFromJson(Map<String, dynamic> json) {
  return _CampaignDetailModel.fromJson(json);
}

/// @nodoc
mixin _$CampaignDetailModel {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  @JsonKey(name: 'discount_percentage')
  int? get discountPercentage => throw _privateConstructorUsedError;
  @JsonKey(name: 'discount_code')
  String? get discountCode => throw _privateConstructorUsedError;
  String? get terms => throw _privateConstructorUsedError;
  @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
  double? get minimumAmount => throw _privateConstructorUsedError;
  @JsonKey(name: 'stock_limit')
  int? get stockLimit => throw _privateConstructorUsedError;
  @JsonKey(name: 'start_date')
  String? get startDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'end_date')
  String? get endDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'code_view_count')
  int? get codeViewCount => throw _privateConstructorUsedError;
  CampaignBusinessModel? get business => throw _privateConstructorUsedError;
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  String? get coverImageUrl => throw _privateConstructorUsedError;
  List<CampaignImageModel> get images => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $CampaignDetailModelCopyWith<CampaignDetailModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CampaignDetailModelCopyWith<$Res> {
  factory $CampaignDetailModelCopyWith(
          CampaignDetailModel value, $Res Function(CampaignDetailModel) then) =
      _$CampaignDetailModelCopyWithImpl<$Res, CampaignDetailModel>;
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      @JsonKey(name: 'discount_percentage') int? discountPercentage,
      @JsonKey(name: 'discount_code') String? discountCode,
      String? terms,
      @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
      double? minimumAmount,
      @JsonKey(name: 'stock_limit') int? stockLimit,
      @JsonKey(name: 'start_date') String? startDate,
      @JsonKey(name: 'end_date') String? endDate,
      @JsonKey(name: 'code_view_count') int? codeViewCount,
      CampaignBusinessModel? business,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      String? coverImageUrl,
      List<CampaignImageModel> images});

  $CampaignBusinessModelCopyWith<$Res>? get business;
}

/// @nodoc
class _$CampaignDetailModelCopyWithImpl<$Res, $Val extends CampaignDetailModel>
    implements $CampaignDetailModelCopyWith<$Res> {
  _$CampaignDetailModelCopyWithImpl(this._value, this._then);

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
    Object? discountPercentage = freezed,
    Object? discountCode = freezed,
    Object? terms = freezed,
    Object? minimumAmount = freezed,
    Object? stockLimit = freezed,
    Object? startDate = freezed,
    Object? endDate = freezed,
    Object? codeViewCount = freezed,
    Object? business = freezed,
    Object? coverImageUrl = freezed,
    Object? images = null,
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
      discountPercentage: freezed == discountPercentage
          ? _value.discountPercentage
          : discountPercentage // ignore: cast_nullable_to_non_nullable
              as int?,
      discountCode: freezed == discountCode
          ? _value.discountCode
          : discountCode // ignore: cast_nullable_to_non_nullable
              as String?,
      terms: freezed == terms
          ? _value.terms
          : terms // ignore: cast_nullable_to_non_nullable
              as String?,
      minimumAmount: freezed == minimumAmount
          ? _value.minimumAmount
          : minimumAmount // ignore: cast_nullable_to_non_nullable
              as double?,
      stockLimit: freezed == stockLimit
          ? _value.stockLimit
          : stockLimit // ignore: cast_nullable_to_non_nullable
              as int?,
      startDate: freezed == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as String?,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as String?,
      codeViewCount: freezed == codeViewCount
          ? _value.codeViewCount
          : codeViewCount // ignore: cast_nullable_to_non_nullable
              as int?,
      business: freezed == business
          ? _value.business
          : business // ignore: cast_nullable_to_non_nullable
              as CampaignBusinessModel?,
      coverImageUrl: freezed == coverImageUrl
          ? _value.coverImageUrl
          : coverImageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      images: null == images
          ? _value.images
          : images // ignore: cast_nullable_to_non_nullable
              as List<CampaignImageModel>,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $CampaignBusinessModelCopyWith<$Res>? get business {
    if (_value.business == null) {
      return null;
    }

    return $CampaignBusinessModelCopyWith<$Res>(_value.business!, (value) {
      return _then(_value.copyWith(business: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$CampaignDetailModelImplCopyWith<$Res>
    implements $CampaignDetailModelCopyWith<$Res> {
  factory _$$CampaignDetailModelImplCopyWith(_$CampaignDetailModelImpl value,
          $Res Function(_$CampaignDetailModelImpl) then) =
      __$$CampaignDetailModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      @JsonKey(name: 'discount_percentage') int? discountPercentage,
      @JsonKey(name: 'discount_code') String? discountCode,
      String? terms,
      @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
      double? minimumAmount,
      @JsonKey(name: 'stock_limit') int? stockLimit,
      @JsonKey(name: 'start_date') String? startDate,
      @JsonKey(name: 'end_date') String? endDate,
      @JsonKey(name: 'code_view_count') int? codeViewCount,
      CampaignBusinessModel? business,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      String? coverImageUrl,
      List<CampaignImageModel> images});

  @override
  $CampaignBusinessModelCopyWith<$Res>? get business;
}

/// @nodoc
class __$$CampaignDetailModelImplCopyWithImpl<$Res>
    extends _$CampaignDetailModelCopyWithImpl<$Res, _$CampaignDetailModelImpl>
    implements _$$CampaignDetailModelImplCopyWith<$Res> {
  __$$CampaignDetailModelImplCopyWithImpl(_$CampaignDetailModelImpl _value,
      $Res Function(_$CampaignDetailModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = freezed,
    Object? discountPercentage = freezed,
    Object? discountCode = freezed,
    Object? terms = freezed,
    Object? minimumAmount = freezed,
    Object? stockLimit = freezed,
    Object? startDate = freezed,
    Object? endDate = freezed,
    Object? codeViewCount = freezed,
    Object? business = freezed,
    Object? coverImageUrl = freezed,
    Object? images = null,
  }) {
    return _then(_$CampaignDetailModelImpl(
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
      discountPercentage: freezed == discountPercentage
          ? _value.discountPercentage
          : discountPercentage // ignore: cast_nullable_to_non_nullable
              as int?,
      discountCode: freezed == discountCode
          ? _value.discountCode
          : discountCode // ignore: cast_nullable_to_non_nullable
              as String?,
      terms: freezed == terms
          ? _value.terms
          : terms // ignore: cast_nullable_to_non_nullable
              as String?,
      minimumAmount: freezed == minimumAmount
          ? _value.minimumAmount
          : minimumAmount // ignore: cast_nullable_to_non_nullable
              as double?,
      stockLimit: freezed == stockLimit
          ? _value.stockLimit
          : stockLimit // ignore: cast_nullable_to_non_nullable
              as int?,
      startDate: freezed == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as String?,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as String?,
      codeViewCount: freezed == codeViewCount
          ? _value.codeViewCount
          : codeViewCount // ignore: cast_nullable_to_non_nullable
              as int?,
      business: freezed == business
          ? _value.business
          : business // ignore: cast_nullable_to_non_nullable
              as CampaignBusinessModel?,
      coverImageUrl: freezed == coverImageUrl
          ? _value.coverImageUrl
          : coverImageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      images: null == images
          ? _value._images
          : images // ignore: cast_nullable_to_non_nullable
              as List<CampaignImageModel>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CampaignDetailModelImpl implements _CampaignDetailModel {
  const _$CampaignDetailModelImpl(
      {required this.id,
      required this.title,
      this.description,
      @JsonKey(name: 'discount_percentage') this.discountPercentage,
      @JsonKey(name: 'discount_code') this.discountCode,
      this.terms,
      @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
      this.minimumAmount,
      @JsonKey(name: 'stock_limit') this.stockLimit,
      @JsonKey(name: 'start_date') this.startDate,
      @JsonKey(name: 'end_date') this.endDate,
      @JsonKey(name: 'code_view_count') this.codeViewCount,
      this.business,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      this.coverImageUrl,
      final List<CampaignImageModel> images = const []})
      : _images = images;

  factory _$CampaignDetailModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CampaignDetailModelImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String? description;
  @override
  @JsonKey(name: 'discount_percentage')
  final int? discountPercentage;
  @override
  @JsonKey(name: 'discount_code')
  final String? discountCode;
  @override
  final String? terms;
  @override
  @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
  final double? minimumAmount;
  @override
  @JsonKey(name: 'stock_limit')
  final int? stockLimit;
  @override
  @JsonKey(name: 'start_date')
  final String? startDate;
  @override
  @JsonKey(name: 'end_date')
  final String? endDate;
  @override
  @JsonKey(name: 'code_view_count')
  final int? codeViewCount;
  @override
  final CampaignBusinessModel? business;
  @override
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  final String? coverImageUrl;
  final List<CampaignImageModel> _images;
  @override
  @JsonKey()
  List<CampaignImageModel> get images {
    if (_images is EqualUnmodifiableListView) return _images;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_images);
  }

  @override
  String toString() {
    return 'CampaignDetailModel(id: $id, title: $title, description: $description, discountPercentage: $discountPercentage, discountCode: $discountCode, terms: $terms, minimumAmount: $minimumAmount, stockLimit: $stockLimit, startDate: $startDate, endDate: $endDate, codeViewCount: $codeViewCount, business: $business, coverImageUrl: $coverImageUrl, images: $images)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CampaignDetailModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.discountPercentage, discountPercentage) ||
                other.discountPercentage == discountPercentage) &&
            (identical(other.discountCode, discountCode) ||
                other.discountCode == discountCode) &&
            (identical(other.terms, terms) || other.terms == terms) &&
            (identical(other.minimumAmount, minimumAmount) ||
                other.minimumAmount == minimumAmount) &&
            (identical(other.stockLimit, stockLimit) ||
                other.stockLimit == stockLimit) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.codeViewCount, codeViewCount) ||
                other.codeViewCount == codeViewCount) &&
            (identical(other.business, business) ||
                other.business == business) &&
            (identical(other.coverImageUrl, coverImageUrl) ||
                other.coverImageUrl == coverImageUrl) &&
            const DeepCollectionEquality().equals(other._images, _images));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      title,
      description,
      discountPercentage,
      discountCode,
      terms,
      minimumAmount,
      stockLimit,
      startDate,
      endDate,
      codeViewCount,
      business,
      coverImageUrl,
      const DeepCollectionEquality().hash(_images));

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$CampaignDetailModelImplCopyWith<_$CampaignDetailModelImpl> get copyWith =>
      __$$CampaignDetailModelImplCopyWithImpl<_$CampaignDetailModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CampaignDetailModelImplToJson(
      this,
    );
  }
}

abstract class _CampaignDetailModel implements CampaignDetailModel {
  const factory _CampaignDetailModel(
      {required final String id,
      required final String title,
      final String? description,
      @JsonKey(name: 'discount_percentage') final int? discountPercentage,
      @JsonKey(name: 'discount_code') final String? discountCode,
      final String? terms,
      @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
      final double? minimumAmount,
      @JsonKey(name: 'stock_limit') final int? stockLimit,
      @JsonKey(name: 'start_date') final String? startDate,
      @JsonKey(name: 'end_date') final String? endDate,
      @JsonKey(name: 'code_view_count') final int? codeViewCount,
      final CampaignBusinessModel? business,
      @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
      final String? coverImageUrl,
      final List<CampaignImageModel> images}) = _$CampaignDetailModelImpl;

  factory _CampaignDetailModel.fromJson(Map<String, dynamic> json) =
      _$CampaignDetailModelImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String? get description;
  @override
  @JsonKey(name: 'discount_percentage')
  int? get discountPercentage;
  @override
  @JsonKey(name: 'discount_code')
  String? get discountCode;
  @override
  String? get terms;
  @override
  @JsonKey(name: 'minimum_amount', fromJson: _parseDouble)
  double? get minimumAmount;
  @override
  @JsonKey(name: 'stock_limit')
  int? get stockLimit;
  @override
  @JsonKey(name: 'start_date')
  String? get startDate;
  @override
  @JsonKey(name: 'end_date')
  String? get endDate;
  @override
  @JsonKey(name: 'code_view_count')
  int? get codeViewCount;
  @override
  CampaignBusinessModel? get business;
  @override
  @JsonKey(name: 'cover_image', readValue: _readPhotoUrl)
  String? get coverImageUrl;
  @override
  List<CampaignImageModel> get images;
  @override
  @JsonKey(ignore: true)
  _$$CampaignDetailModelImplCopyWith<_$CampaignDetailModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CampaignBusinessModel _$CampaignBusinessModelFromJson(
    Map<String, dynamic> json) {
  return _CampaignBusinessModel.fromJson(json);
}

/// @nodoc
mixin _$CampaignBusinessModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  @JsonKey(name: 'phone_number')
  String? get phone => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  double? get latitude => throw _privateConstructorUsedError;
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  double? get longitude => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $CampaignBusinessModelCopyWith<CampaignBusinessModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CampaignBusinessModelCopyWith<$Res> {
  factory $CampaignBusinessModelCopyWith(CampaignBusinessModel value,
          $Res Function(CampaignBusinessModel) then) =
      _$CampaignBusinessModelCopyWithImpl<$Res, CampaignBusinessModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      @JsonKey(name: 'phone_number') String? phone,
      String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude});
}

/// @nodoc
class _$CampaignBusinessModelCopyWithImpl<$Res,
        $Val extends CampaignBusinessModel>
    implements $CampaignBusinessModelCopyWith<$Res> {
  _$CampaignBusinessModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? phone = freezed,
    Object? address = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
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
      phone: freezed == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
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
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CampaignBusinessModelImplCopyWith<$Res>
    implements $CampaignBusinessModelCopyWith<$Res> {
  factory _$$CampaignBusinessModelImplCopyWith(
          _$CampaignBusinessModelImpl value,
          $Res Function(_$CampaignBusinessModelImpl) then) =
      __$$CampaignBusinessModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      @JsonKey(name: 'phone_number') String? phone,
      String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) double? longitude});
}

/// @nodoc
class __$$CampaignBusinessModelImplCopyWithImpl<$Res>
    extends _$CampaignBusinessModelCopyWithImpl<$Res,
        _$CampaignBusinessModelImpl>
    implements _$$CampaignBusinessModelImplCopyWith<$Res> {
  __$$CampaignBusinessModelImplCopyWithImpl(_$CampaignBusinessModelImpl _value,
      $Res Function(_$CampaignBusinessModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? phone = freezed,
    Object? address = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
  }) {
    return _then(_$CampaignBusinessModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      phone: freezed == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
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
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CampaignBusinessModelImpl implements _CampaignBusinessModel {
  const _$CampaignBusinessModelImpl(
      {required this.id,
      required this.name,
      @JsonKey(name: 'phone_number') this.phone,
      this.address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) this.latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble) this.longitude});

  factory _$CampaignBusinessModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CampaignBusinessModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  @JsonKey(name: 'phone_number')
  final String? phone;
  @override
  final String? address;
  @override
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  final double? latitude;
  @override
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  final double? longitude;

  @override
  String toString() {
    return 'CampaignBusinessModel(id: $id, name: $name, phone: $phone, address: $address, latitude: $latitude, longitude: $longitude)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CampaignBusinessModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, phone, address, latitude, longitude);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$CampaignBusinessModelImplCopyWith<_$CampaignBusinessModelImpl>
      get copyWith => __$$CampaignBusinessModelImplCopyWithImpl<
          _$CampaignBusinessModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CampaignBusinessModelImplToJson(
      this,
    );
  }
}

abstract class _CampaignBusinessModel implements CampaignBusinessModel {
  const factory _CampaignBusinessModel(
      {required final String id,
      required final String name,
      @JsonKey(name: 'phone_number') final String? phone,
      final String? address,
      @JsonKey(name: 'latitude', fromJson: _parseDouble) final double? latitude,
      @JsonKey(name: 'longitude', fromJson: _parseDouble)
      final double? longitude}) = _$CampaignBusinessModelImpl;

  factory _CampaignBusinessModel.fromJson(Map<String, dynamic> json) =
      _$CampaignBusinessModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  @JsonKey(name: 'phone_number')
  String? get phone;
  @override
  String? get address;
  @override
  @JsonKey(name: 'latitude', fromJson: _parseDouble)
  double? get latitude;
  @override
  @JsonKey(name: 'longitude', fromJson: _parseDouble)
  double? get longitude;
  @override
  @JsonKey(ignore: true)
  _$$CampaignBusinessModelImplCopyWith<_$CampaignBusinessModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

CampaignImageModel _$CampaignImageModelFromJson(Map<String, dynamic> json) {
  return _CampaignImageModel.fromJson(json);
}

/// @nodoc
mixin _$CampaignImageModel {
  String get id => throw _privateConstructorUsedError;
  @JsonKey(name: 'display_order')
  int? get displayOrder => throw _privateConstructorUsedError;
  @JsonKey(name: 'file', readValue: _readPhotoUrl)
  String? get imageUrl => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $CampaignImageModelCopyWith<CampaignImageModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CampaignImageModelCopyWith<$Res> {
  factory $CampaignImageModelCopyWith(
          CampaignImageModel value, $Res Function(CampaignImageModel) then) =
      _$CampaignImageModelCopyWithImpl<$Res, CampaignImageModel>;
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'display_order') int? displayOrder,
      @JsonKey(name: 'file', readValue: _readPhotoUrl) String? imageUrl});
}

/// @nodoc
class _$CampaignImageModelCopyWithImpl<$Res, $Val extends CampaignImageModel>
    implements $CampaignImageModelCopyWith<$Res> {
  _$CampaignImageModelCopyWithImpl(this._value, this._then);

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
abstract class _$$CampaignImageModelImplCopyWith<$Res>
    implements $CampaignImageModelCopyWith<$Res> {
  factory _$$CampaignImageModelImplCopyWith(_$CampaignImageModelImpl value,
          $Res Function(_$CampaignImageModelImpl) then) =
      __$$CampaignImageModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'display_order') int? displayOrder,
      @JsonKey(name: 'file', readValue: _readPhotoUrl) String? imageUrl});
}

/// @nodoc
class __$$CampaignImageModelImplCopyWithImpl<$Res>
    extends _$CampaignImageModelCopyWithImpl<$Res, _$CampaignImageModelImpl>
    implements _$$CampaignImageModelImplCopyWith<$Res> {
  __$$CampaignImageModelImplCopyWithImpl(_$CampaignImageModelImpl _value,
      $Res Function(_$CampaignImageModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? displayOrder = freezed,
    Object? imageUrl = freezed,
  }) {
    return _then(_$CampaignImageModelImpl(
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
class _$CampaignImageModelImpl implements _CampaignImageModel {
  const _$CampaignImageModelImpl(
      {required this.id,
      @JsonKey(name: 'display_order') this.displayOrder,
      @JsonKey(name: 'file', readValue: _readPhotoUrl) this.imageUrl});

  factory _$CampaignImageModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CampaignImageModelImplFromJson(json);

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
    return 'CampaignImageModel(id: $id, displayOrder: $displayOrder, imageUrl: $imageUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CampaignImageModelImpl &&
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
  _$$CampaignImageModelImplCopyWith<_$CampaignImageModelImpl> get copyWith =>
      __$$CampaignImageModelImplCopyWithImpl<_$CampaignImageModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CampaignImageModelImplToJson(
      this,
    );
  }
}

abstract class _CampaignImageModel implements CampaignImageModel {
  const factory _CampaignImageModel(
      {required final String id,
      @JsonKey(name: 'display_order') final int? displayOrder,
      @JsonKey(name: 'file', readValue: _readPhotoUrl)
      final String? imageUrl}) = _$CampaignImageModelImpl;

  factory _CampaignImageModel.fromJson(Map<String, dynamic> json) =
      _$CampaignImageModelImpl.fromJson;

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
  _$$CampaignImageModelImplCopyWith<_$CampaignImageModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
