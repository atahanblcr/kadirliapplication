// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'death_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

DeathNoticeModel _$DeathNoticeModelFromJson(Map<String, dynamic> json) {
  return _DeathNoticeModel.fromJson(json);
}

/// @nodoc
mixin _$DeathNoticeModel {
  String get id => throw _privateConstructorUsedError;
  @JsonKey(name: 'deceased_name')
  String get deceasedName => throw _privateConstructorUsedError;
  int? get age => throw _privateConstructorUsedError;
  @JsonKey(readValue: _readPhotoUrl)
  String? get photoUrl => throw _privateConstructorUsedError;
  @JsonKey(name: 'funeral_date')
  String get funeralDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'funeral_time')
  String get funeralTime => throw _privateConstructorUsedError;
  CemeteryModel? get cemetery => throw _privateConstructorUsedError;
  MosqueModel? get mosque => throw _privateConstructorUsedError;
  @JsonKey(name: 'condolence_address')
  String? get condolenceAddress => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $DeathNoticeModelCopyWith<DeathNoticeModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DeathNoticeModelCopyWith<$Res> {
  factory $DeathNoticeModelCopyWith(
          DeathNoticeModel value, $Res Function(DeathNoticeModel) then) =
      _$DeathNoticeModelCopyWithImpl<$Res, DeathNoticeModel>;
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'deceased_name') String deceasedName,
      int? age,
      @JsonKey(readValue: _readPhotoUrl) String? photoUrl,
      @JsonKey(name: 'funeral_date') String funeralDate,
      @JsonKey(name: 'funeral_time') String funeralTime,
      CemeteryModel? cemetery,
      MosqueModel? mosque,
      @JsonKey(name: 'condolence_address') String? condolenceAddress,
      @JsonKey(name: 'created_at') DateTime createdAt});

  $CemeteryModelCopyWith<$Res>? get cemetery;
  $MosqueModelCopyWith<$Res>? get mosque;
}

/// @nodoc
class _$DeathNoticeModelCopyWithImpl<$Res, $Val extends DeathNoticeModel>
    implements $DeathNoticeModelCopyWith<$Res> {
  _$DeathNoticeModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? deceasedName = null,
    Object? age = freezed,
    Object? photoUrl = freezed,
    Object? funeralDate = null,
    Object? funeralTime = null,
    Object? cemetery = freezed,
    Object? mosque = freezed,
    Object? condolenceAddress = freezed,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      deceasedName: null == deceasedName
          ? _value.deceasedName
          : deceasedName // ignore: cast_nullable_to_non_nullable
              as String,
      age: freezed == age
          ? _value.age
          : age // ignore: cast_nullable_to_non_nullable
              as int?,
      photoUrl: freezed == photoUrl
          ? _value.photoUrl
          : photoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      funeralDate: null == funeralDate
          ? _value.funeralDate
          : funeralDate // ignore: cast_nullable_to_non_nullable
              as String,
      funeralTime: null == funeralTime
          ? _value.funeralTime
          : funeralTime // ignore: cast_nullable_to_non_nullable
              as String,
      cemetery: freezed == cemetery
          ? _value.cemetery
          : cemetery // ignore: cast_nullable_to_non_nullable
              as CemeteryModel?,
      mosque: freezed == mosque
          ? _value.mosque
          : mosque // ignore: cast_nullable_to_non_nullable
              as MosqueModel?,
      condolenceAddress: freezed == condolenceAddress
          ? _value.condolenceAddress
          : condolenceAddress // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $CemeteryModelCopyWith<$Res>? get cemetery {
    if (_value.cemetery == null) {
      return null;
    }

    return $CemeteryModelCopyWith<$Res>(_value.cemetery!, (value) {
      return _then(_value.copyWith(cemetery: value) as $Val);
    });
  }

  @override
  @pragma('vm:prefer-inline')
  $MosqueModelCopyWith<$Res>? get mosque {
    if (_value.mosque == null) {
      return null;
    }

    return $MosqueModelCopyWith<$Res>(_value.mosque!, (value) {
      return _then(_value.copyWith(mosque: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$DeathNoticeModelImplCopyWith<$Res>
    implements $DeathNoticeModelCopyWith<$Res> {
  factory _$$DeathNoticeModelImplCopyWith(_$DeathNoticeModelImpl value,
          $Res Function(_$DeathNoticeModelImpl) then) =
      __$$DeathNoticeModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'deceased_name') String deceasedName,
      int? age,
      @JsonKey(readValue: _readPhotoUrl) String? photoUrl,
      @JsonKey(name: 'funeral_date') String funeralDate,
      @JsonKey(name: 'funeral_time') String funeralTime,
      CemeteryModel? cemetery,
      MosqueModel? mosque,
      @JsonKey(name: 'condolence_address') String? condolenceAddress,
      @JsonKey(name: 'created_at') DateTime createdAt});

  @override
  $CemeteryModelCopyWith<$Res>? get cemetery;
  @override
  $MosqueModelCopyWith<$Res>? get mosque;
}

/// @nodoc
class __$$DeathNoticeModelImplCopyWithImpl<$Res>
    extends _$DeathNoticeModelCopyWithImpl<$Res, _$DeathNoticeModelImpl>
    implements _$$DeathNoticeModelImplCopyWith<$Res> {
  __$$DeathNoticeModelImplCopyWithImpl(_$DeathNoticeModelImpl _value,
      $Res Function(_$DeathNoticeModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? deceasedName = null,
    Object? age = freezed,
    Object? photoUrl = freezed,
    Object? funeralDate = null,
    Object? funeralTime = null,
    Object? cemetery = freezed,
    Object? mosque = freezed,
    Object? condolenceAddress = freezed,
    Object? createdAt = null,
  }) {
    return _then(_$DeathNoticeModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      deceasedName: null == deceasedName
          ? _value.deceasedName
          : deceasedName // ignore: cast_nullable_to_non_nullable
              as String,
      age: freezed == age
          ? _value.age
          : age // ignore: cast_nullable_to_non_nullable
              as int?,
      photoUrl: freezed == photoUrl
          ? _value.photoUrl
          : photoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      funeralDate: null == funeralDate
          ? _value.funeralDate
          : funeralDate // ignore: cast_nullable_to_non_nullable
              as String,
      funeralTime: null == funeralTime
          ? _value.funeralTime
          : funeralTime // ignore: cast_nullable_to_non_nullable
              as String,
      cemetery: freezed == cemetery
          ? _value.cemetery
          : cemetery // ignore: cast_nullable_to_non_nullable
              as CemeteryModel?,
      mosque: freezed == mosque
          ? _value.mosque
          : mosque // ignore: cast_nullable_to_non_nullable
              as MosqueModel?,
      condolenceAddress: freezed == condolenceAddress
          ? _value.condolenceAddress
          : condolenceAddress // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DeathNoticeModelImpl implements _DeathNoticeModel {
  const _$DeathNoticeModelImpl(
      {required this.id,
      @JsonKey(name: 'deceased_name') required this.deceasedName,
      this.age,
      @JsonKey(readValue: _readPhotoUrl) this.photoUrl,
      @JsonKey(name: 'funeral_date') required this.funeralDate,
      @JsonKey(name: 'funeral_time') required this.funeralTime,
      this.cemetery,
      this.mosque,
      @JsonKey(name: 'condolence_address') this.condolenceAddress,
      @JsonKey(name: 'created_at') required this.createdAt});

  factory _$DeathNoticeModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$DeathNoticeModelImplFromJson(json);

  @override
  final String id;
  @override
  @JsonKey(name: 'deceased_name')
  final String deceasedName;
  @override
  final int? age;
  @override
  @JsonKey(readValue: _readPhotoUrl)
  final String? photoUrl;
  @override
  @JsonKey(name: 'funeral_date')
  final String funeralDate;
  @override
  @JsonKey(name: 'funeral_time')
  final String funeralTime;
  @override
  final CemeteryModel? cemetery;
  @override
  final MosqueModel? mosque;
  @override
  @JsonKey(name: 'condolence_address')
  final String? condolenceAddress;
  @override
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  @override
  String toString() {
    return 'DeathNoticeModel(id: $id, deceasedName: $deceasedName, age: $age, photoUrl: $photoUrl, funeralDate: $funeralDate, funeralTime: $funeralTime, cemetery: $cemetery, mosque: $mosque, condolenceAddress: $condolenceAddress, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DeathNoticeModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.deceasedName, deceasedName) ||
                other.deceasedName == deceasedName) &&
            (identical(other.age, age) || other.age == age) &&
            (identical(other.photoUrl, photoUrl) ||
                other.photoUrl == photoUrl) &&
            (identical(other.funeralDate, funeralDate) ||
                other.funeralDate == funeralDate) &&
            (identical(other.funeralTime, funeralTime) ||
                other.funeralTime == funeralTime) &&
            (identical(other.cemetery, cemetery) ||
                other.cemetery == cemetery) &&
            (identical(other.mosque, mosque) || other.mosque == mosque) &&
            (identical(other.condolenceAddress, condolenceAddress) ||
                other.condolenceAddress == condolenceAddress) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, deceasedName, age, photoUrl,
      funeralDate, funeralTime, cemetery, mosque, condolenceAddress, createdAt);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$DeathNoticeModelImplCopyWith<_$DeathNoticeModelImpl> get copyWith =>
      __$$DeathNoticeModelImplCopyWithImpl<_$DeathNoticeModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DeathNoticeModelImplToJson(
      this,
    );
  }
}

abstract class _DeathNoticeModel implements DeathNoticeModel {
  const factory _DeathNoticeModel(
          {required final String id,
          @JsonKey(name: 'deceased_name') required final String deceasedName,
          final int? age,
          @JsonKey(readValue: _readPhotoUrl) final String? photoUrl,
          @JsonKey(name: 'funeral_date') required final String funeralDate,
          @JsonKey(name: 'funeral_time') required final String funeralTime,
          final CemeteryModel? cemetery,
          final MosqueModel? mosque,
          @JsonKey(name: 'condolence_address') final String? condolenceAddress,
          @JsonKey(name: 'created_at') required final DateTime createdAt}) =
      _$DeathNoticeModelImpl;

  factory _DeathNoticeModel.fromJson(Map<String, dynamic> json) =
      _$DeathNoticeModelImpl.fromJson;

  @override
  String get id;
  @override
  @JsonKey(name: 'deceased_name')
  String get deceasedName;
  @override
  int? get age;
  @override
  @JsonKey(readValue: _readPhotoUrl)
  String? get photoUrl;
  @override
  @JsonKey(name: 'funeral_date')
  String get funeralDate;
  @override
  @JsonKey(name: 'funeral_time')
  String get funeralTime;
  @override
  CemeteryModel? get cemetery;
  @override
  MosqueModel? get mosque;
  @override
  @JsonKey(name: 'condolence_address')
  String? get condolenceAddress;
  @override
  @JsonKey(name: 'created_at')
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$DeathNoticeModelImplCopyWith<_$DeathNoticeModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

DeathNoticeDetailModel _$DeathNoticeDetailModelFromJson(
    Map<String, dynamic> json) {
  return _DeathNoticeDetailModel.fromJson(json);
}

/// @nodoc
mixin _$DeathNoticeDetailModel {
  String get id => throw _privateConstructorUsedError;
  @JsonKey(name: 'deceased_name')
  String get deceasedName => throw _privateConstructorUsedError;
  int? get age => throw _privateConstructorUsedError;
  @JsonKey(readValue: _readPhotoDetail)
  DeathPhotoModel? get photo => throw _privateConstructorUsedError;
  @JsonKey(name: 'funeral_date')
  String get funeralDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'funeral_time')
  String get funeralTime => throw _privateConstructorUsedError;
  CemeteryModel? get cemetery => throw _privateConstructorUsedError;
  MosqueModel? get mosque => throw _privateConstructorUsedError;
  @JsonKey(name: 'condolence_address')
  String? get condolenceAddress => throw _privateConstructorUsedError;
  @JsonKey(name: 'auto_archive_at')
  DateTime? get autoArchiveAt => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $DeathNoticeDetailModelCopyWith<DeathNoticeDetailModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DeathNoticeDetailModelCopyWith<$Res> {
  factory $DeathNoticeDetailModelCopyWith(DeathNoticeDetailModel value,
          $Res Function(DeathNoticeDetailModel) then) =
      _$DeathNoticeDetailModelCopyWithImpl<$Res, DeathNoticeDetailModel>;
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'deceased_name') String deceasedName,
      int? age,
      @JsonKey(readValue: _readPhotoDetail) DeathPhotoModel? photo,
      @JsonKey(name: 'funeral_date') String funeralDate,
      @JsonKey(name: 'funeral_time') String funeralTime,
      CemeteryModel? cemetery,
      MosqueModel? mosque,
      @JsonKey(name: 'condolence_address') String? condolenceAddress,
      @JsonKey(name: 'auto_archive_at') DateTime? autoArchiveAt,
      @JsonKey(name: 'created_at') DateTime createdAt});

  $DeathPhotoModelCopyWith<$Res>? get photo;
  $CemeteryModelCopyWith<$Res>? get cemetery;
  $MosqueModelCopyWith<$Res>? get mosque;
}

/// @nodoc
class _$DeathNoticeDetailModelCopyWithImpl<$Res,
        $Val extends DeathNoticeDetailModel>
    implements $DeathNoticeDetailModelCopyWith<$Res> {
  _$DeathNoticeDetailModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? deceasedName = null,
    Object? age = freezed,
    Object? photo = freezed,
    Object? funeralDate = null,
    Object? funeralTime = null,
    Object? cemetery = freezed,
    Object? mosque = freezed,
    Object? condolenceAddress = freezed,
    Object? autoArchiveAt = freezed,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      deceasedName: null == deceasedName
          ? _value.deceasedName
          : deceasedName // ignore: cast_nullable_to_non_nullable
              as String,
      age: freezed == age
          ? _value.age
          : age // ignore: cast_nullable_to_non_nullable
              as int?,
      photo: freezed == photo
          ? _value.photo
          : photo // ignore: cast_nullable_to_non_nullable
              as DeathPhotoModel?,
      funeralDate: null == funeralDate
          ? _value.funeralDate
          : funeralDate // ignore: cast_nullable_to_non_nullable
              as String,
      funeralTime: null == funeralTime
          ? _value.funeralTime
          : funeralTime // ignore: cast_nullable_to_non_nullable
              as String,
      cemetery: freezed == cemetery
          ? _value.cemetery
          : cemetery // ignore: cast_nullable_to_non_nullable
              as CemeteryModel?,
      mosque: freezed == mosque
          ? _value.mosque
          : mosque // ignore: cast_nullable_to_non_nullable
              as MosqueModel?,
      condolenceAddress: freezed == condolenceAddress
          ? _value.condolenceAddress
          : condolenceAddress // ignore: cast_nullable_to_non_nullable
              as String?,
      autoArchiveAt: freezed == autoArchiveAt
          ? _value.autoArchiveAt
          : autoArchiveAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $DeathPhotoModelCopyWith<$Res>? get photo {
    if (_value.photo == null) {
      return null;
    }

    return $DeathPhotoModelCopyWith<$Res>(_value.photo!, (value) {
      return _then(_value.copyWith(photo: value) as $Val);
    });
  }

  @override
  @pragma('vm:prefer-inline')
  $CemeteryModelCopyWith<$Res>? get cemetery {
    if (_value.cemetery == null) {
      return null;
    }

    return $CemeteryModelCopyWith<$Res>(_value.cemetery!, (value) {
      return _then(_value.copyWith(cemetery: value) as $Val);
    });
  }

  @override
  @pragma('vm:prefer-inline')
  $MosqueModelCopyWith<$Res>? get mosque {
    if (_value.mosque == null) {
      return null;
    }

    return $MosqueModelCopyWith<$Res>(_value.mosque!, (value) {
      return _then(_value.copyWith(mosque: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$DeathNoticeDetailModelImplCopyWith<$Res>
    implements $DeathNoticeDetailModelCopyWith<$Res> {
  factory _$$DeathNoticeDetailModelImplCopyWith(
          _$DeathNoticeDetailModelImpl value,
          $Res Function(_$DeathNoticeDetailModelImpl) then) =
      __$$DeathNoticeDetailModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      @JsonKey(name: 'deceased_name') String deceasedName,
      int? age,
      @JsonKey(readValue: _readPhotoDetail) DeathPhotoModel? photo,
      @JsonKey(name: 'funeral_date') String funeralDate,
      @JsonKey(name: 'funeral_time') String funeralTime,
      CemeteryModel? cemetery,
      MosqueModel? mosque,
      @JsonKey(name: 'condolence_address') String? condolenceAddress,
      @JsonKey(name: 'auto_archive_at') DateTime? autoArchiveAt,
      @JsonKey(name: 'created_at') DateTime createdAt});

  @override
  $DeathPhotoModelCopyWith<$Res>? get photo;
  @override
  $CemeteryModelCopyWith<$Res>? get cemetery;
  @override
  $MosqueModelCopyWith<$Res>? get mosque;
}

/// @nodoc
class __$$DeathNoticeDetailModelImplCopyWithImpl<$Res>
    extends _$DeathNoticeDetailModelCopyWithImpl<$Res,
        _$DeathNoticeDetailModelImpl>
    implements _$$DeathNoticeDetailModelImplCopyWith<$Res> {
  __$$DeathNoticeDetailModelImplCopyWithImpl(
      _$DeathNoticeDetailModelImpl _value,
      $Res Function(_$DeathNoticeDetailModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? deceasedName = null,
    Object? age = freezed,
    Object? photo = freezed,
    Object? funeralDate = null,
    Object? funeralTime = null,
    Object? cemetery = freezed,
    Object? mosque = freezed,
    Object? condolenceAddress = freezed,
    Object? autoArchiveAt = freezed,
    Object? createdAt = null,
  }) {
    return _then(_$DeathNoticeDetailModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      deceasedName: null == deceasedName
          ? _value.deceasedName
          : deceasedName // ignore: cast_nullable_to_non_nullable
              as String,
      age: freezed == age
          ? _value.age
          : age // ignore: cast_nullable_to_non_nullable
              as int?,
      photo: freezed == photo
          ? _value.photo
          : photo // ignore: cast_nullable_to_non_nullable
              as DeathPhotoModel?,
      funeralDate: null == funeralDate
          ? _value.funeralDate
          : funeralDate // ignore: cast_nullable_to_non_nullable
              as String,
      funeralTime: null == funeralTime
          ? _value.funeralTime
          : funeralTime // ignore: cast_nullable_to_non_nullable
              as String,
      cemetery: freezed == cemetery
          ? _value.cemetery
          : cemetery // ignore: cast_nullable_to_non_nullable
              as CemeteryModel?,
      mosque: freezed == mosque
          ? _value.mosque
          : mosque // ignore: cast_nullable_to_non_nullable
              as MosqueModel?,
      condolenceAddress: freezed == condolenceAddress
          ? _value.condolenceAddress
          : condolenceAddress // ignore: cast_nullable_to_non_nullable
              as String?,
      autoArchiveAt: freezed == autoArchiveAt
          ? _value.autoArchiveAt
          : autoArchiveAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DeathNoticeDetailModelImpl implements _DeathNoticeDetailModel {
  const _$DeathNoticeDetailModelImpl(
      {required this.id,
      @JsonKey(name: 'deceased_name') required this.deceasedName,
      this.age,
      @JsonKey(readValue: _readPhotoDetail) this.photo,
      @JsonKey(name: 'funeral_date') required this.funeralDate,
      @JsonKey(name: 'funeral_time') required this.funeralTime,
      this.cemetery,
      this.mosque,
      @JsonKey(name: 'condolence_address') this.condolenceAddress,
      @JsonKey(name: 'auto_archive_at') this.autoArchiveAt,
      @JsonKey(name: 'created_at') required this.createdAt});

  factory _$DeathNoticeDetailModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$DeathNoticeDetailModelImplFromJson(json);

  @override
  final String id;
  @override
  @JsonKey(name: 'deceased_name')
  final String deceasedName;
  @override
  final int? age;
  @override
  @JsonKey(readValue: _readPhotoDetail)
  final DeathPhotoModel? photo;
  @override
  @JsonKey(name: 'funeral_date')
  final String funeralDate;
  @override
  @JsonKey(name: 'funeral_time')
  final String funeralTime;
  @override
  final CemeteryModel? cemetery;
  @override
  final MosqueModel? mosque;
  @override
  @JsonKey(name: 'condolence_address')
  final String? condolenceAddress;
  @override
  @JsonKey(name: 'auto_archive_at')
  final DateTime? autoArchiveAt;
  @override
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  @override
  String toString() {
    return 'DeathNoticeDetailModel(id: $id, deceasedName: $deceasedName, age: $age, photo: $photo, funeralDate: $funeralDate, funeralTime: $funeralTime, cemetery: $cemetery, mosque: $mosque, condolenceAddress: $condolenceAddress, autoArchiveAt: $autoArchiveAt, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DeathNoticeDetailModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.deceasedName, deceasedName) ||
                other.deceasedName == deceasedName) &&
            (identical(other.age, age) || other.age == age) &&
            (identical(other.photo, photo) || other.photo == photo) &&
            (identical(other.funeralDate, funeralDate) ||
                other.funeralDate == funeralDate) &&
            (identical(other.funeralTime, funeralTime) ||
                other.funeralTime == funeralTime) &&
            (identical(other.cemetery, cemetery) ||
                other.cemetery == cemetery) &&
            (identical(other.mosque, mosque) || other.mosque == mosque) &&
            (identical(other.condolenceAddress, condolenceAddress) ||
                other.condolenceAddress == condolenceAddress) &&
            (identical(other.autoArchiveAt, autoArchiveAt) ||
                other.autoArchiveAt == autoArchiveAt) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      deceasedName,
      age,
      photo,
      funeralDate,
      funeralTime,
      cemetery,
      mosque,
      condolenceAddress,
      autoArchiveAt,
      createdAt);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$DeathNoticeDetailModelImplCopyWith<_$DeathNoticeDetailModelImpl>
      get copyWith => __$$DeathNoticeDetailModelImplCopyWithImpl<
          _$DeathNoticeDetailModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DeathNoticeDetailModelImplToJson(
      this,
    );
  }
}

abstract class _DeathNoticeDetailModel implements DeathNoticeDetailModel {
  const factory _DeathNoticeDetailModel(
          {required final String id,
          @JsonKey(name: 'deceased_name') required final String deceasedName,
          final int? age,
          @JsonKey(readValue: _readPhotoDetail) final DeathPhotoModel? photo,
          @JsonKey(name: 'funeral_date') required final String funeralDate,
          @JsonKey(name: 'funeral_time') required final String funeralTime,
          final CemeteryModel? cemetery,
          final MosqueModel? mosque,
          @JsonKey(name: 'condolence_address') final String? condolenceAddress,
          @JsonKey(name: 'auto_archive_at') final DateTime? autoArchiveAt,
          @JsonKey(name: 'created_at') required final DateTime createdAt}) =
      _$DeathNoticeDetailModelImpl;

  factory _DeathNoticeDetailModel.fromJson(Map<String, dynamic> json) =
      _$DeathNoticeDetailModelImpl.fromJson;

  @override
  String get id;
  @override
  @JsonKey(name: 'deceased_name')
  String get deceasedName;
  @override
  int? get age;
  @override
  @JsonKey(readValue: _readPhotoDetail)
  DeathPhotoModel? get photo;
  @override
  @JsonKey(name: 'funeral_date')
  String get funeralDate;
  @override
  @JsonKey(name: 'funeral_time')
  String get funeralTime;
  @override
  CemeteryModel? get cemetery;
  @override
  MosqueModel? get mosque;
  @override
  @JsonKey(name: 'condolence_address')
  String? get condolenceAddress;
  @override
  @JsonKey(name: 'auto_archive_at')
  DateTime? get autoArchiveAt;
  @override
  @JsonKey(name: 'created_at')
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$DeathNoticeDetailModelImplCopyWith<_$DeathNoticeDetailModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

DeathPhotoModel _$DeathPhotoModelFromJson(Map<String, dynamic> json) {
  return _DeathPhotoModel.fromJson(json);
}

/// @nodoc
mixin _$DeathPhotoModel {
  String get id => throw _privateConstructorUsedError;
  String get url => throw _privateConstructorUsedError;
  @JsonKey(name: 'thumbnail_url')
  String? get thumbnailUrl => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $DeathPhotoModelCopyWith<DeathPhotoModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DeathPhotoModelCopyWith<$Res> {
  factory $DeathPhotoModelCopyWith(
          DeathPhotoModel value, $Res Function(DeathPhotoModel) then) =
      _$DeathPhotoModelCopyWithImpl<$Res, DeathPhotoModel>;
  @useResult
  $Res call(
      {String id,
      String url,
      @JsonKey(name: 'thumbnail_url') String? thumbnailUrl});
}

/// @nodoc
class _$DeathPhotoModelCopyWithImpl<$Res, $Val extends DeathPhotoModel>
    implements $DeathPhotoModelCopyWith<$Res> {
  _$DeathPhotoModelCopyWithImpl(this._value, this._then);

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
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$DeathPhotoModelImplCopyWith<$Res>
    implements $DeathPhotoModelCopyWith<$Res> {
  factory _$$DeathPhotoModelImplCopyWith(_$DeathPhotoModelImpl value,
          $Res Function(_$DeathPhotoModelImpl) then) =
      __$$DeathPhotoModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String url,
      @JsonKey(name: 'thumbnail_url') String? thumbnailUrl});
}

/// @nodoc
class __$$DeathPhotoModelImplCopyWithImpl<$Res>
    extends _$DeathPhotoModelCopyWithImpl<$Res, _$DeathPhotoModelImpl>
    implements _$$DeathPhotoModelImplCopyWith<$Res> {
  __$$DeathPhotoModelImplCopyWithImpl(
      _$DeathPhotoModelImpl _value, $Res Function(_$DeathPhotoModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? url = null,
    Object? thumbnailUrl = freezed,
  }) {
    return _then(_$DeathPhotoModelImpl(
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
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DeathPhotoModelImpl implements _DeathPhotoModel {
  const _$DeathPhotoModelImpl(
      {required this.id,
      required this.url,
      @JsonKey(name: 'thumbnail_url') this.thumbnailUrl});

  factory _$DeathPhotoModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$DeathPhotoModelImplFromJson(json);

  @override
  final String id;
  @override
  final String url;
  @override
  @JsonKey(name: 'thumbnail_url')
  final String? thumbnailUrl;

  @override
  String toString() {
    return 'DeathPhotoModel(id: $id, url: $url, thumbnailUrl: $thumbnailUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DeathPhotoModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.url, url) || other.url == url) &&
            (identical(other.thumbnailUrl, thumbnailUrl) ||
                other.thumbnailUrl == thumbnailUrl));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, url, thumbnailUrl);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$DeathPhotoModelImplCopyWith<_$DeathPhotoModelImpl> get copyWith =>
      __$$DeathPhotoModelImplCopyWithImpl<_$DeathPhotoModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DeathPhotoModelImplToJson(
      this,
    );
  }
}

abstract class _DeathPhotoModel implements DeathPhotoModel {
  const factory _DeathPhotoModel(
          {required final String id,
          required final String url,
          @JsonKey(name: 'thumbnail_url') final String? thumbnailUrl}) =
      _$DeathPhotoModelImpl;

  factory _DeathPhotoModel.fromJson(Map<String, dynamic> json) =
      _$DeathPhotoModelImpl.fromJson;

  @override
  String get id;
  @override
  String get url;
  @override
  @JsonKey(name: 'thumbnail_url')
  String? get thumbnailUrl;
  @override
  @JsonKey(ignore: true)
  _$$DeathPhotoModelImplCopyWith<_$DeathPhotoModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CemeteryModel _$CemeteryModelFromJson(Map<String, dynamic> json) {
  return _CemeteryModel.fromJson(json);
}

/// @nodoc
mixin _$CemeteryModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _parseDouble)
  double? get latitude => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _parseDouble)
  double? get longitude => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $CemeteryModelCopyWith<CemeteryModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CemeteryModelCopyWith<$Res> {
  factory $CemeteryModelCopyWith(
          CemeteryModel value, $Res Function(CemeteryModel) then) =
      _$CemeteryModelCopyWithImpl<$Res, CemeteryModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String? address,
      @JsonKey(fromJson: _parseDouble) double? latitude,
      @JsonKey(fromJson: _parseDouble) double? longitude});
}

/// @nodoc
class _$CemeteryModelCopyWithImpl<$Res, $Val extends CemeteryModel>
    implements $CemeteryModelCopyWith<$Res> {
  _$CemeteryModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
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
abstract class _$$CemeteryModelImplCopyWith<$Res>
    implements $CemeteryModelCopyWith<$Res> {
  factory _$$CemeteryModelImplCopyWith(
          _$CemeteryModelImpl value, $Res Function(_$CemeteryModelImpl) then) =
      __$$CemeteryModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String? address,
      @JsonKey(fromJson: _parseDouble) double? latitude,
      @JsonKey(fromJson: _parseDouble) double? longitude});
}

/// @nodoc
class __$$CemeteryModelImplCopyWithImpl<$Res>
    extends _$CemeteryModelCopyWithImpl<$Res, _$CemeteryModelImpl>
    implements _$$CemeteryModelImplCopyWith<$Res> {
  __$$CemeteryModelImplCopyWithImpl(
      _$CemeteryModelImpl _value, $Res Function(_$CemeteryModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? address = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
  }) {
    return _then(_$CemeteryModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
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
class _$CemeteryModelImpl implements _CemeteryModel {
  const _$CemeteryModelImpl(
      {required this.id,
      required this.name,
      this.address,
      @JsonKey(fromJson: _parseDouble) this.latitude,
      @JsonKey(fromJson: _parseDouble) this.longitude});

  factory _$CemeteryModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CemeteryModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? address;
  @override
  @JsonKey(fromJson: _parseDouble)
  final double? latitude;
  @override
  @JsonKey(fromJson: _parseDouble)
  final double? longitude;

  @override
  String toString() {
    return 'CemeteryModel(id: $id, name: $name, address: $address, latitude: $latitude, longitude: $longitude)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CemeteryModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, address, latitude, longitude);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$CemeteryModelImplCopyWith<_$CemeteryModelImpl> get copyWith =>
      __$$CemeteryModelImplCopyWithImpl<_$CemeteryModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CemeteryModelImplToJson(
      this,
    );
  }
}

abstract class _CemeteryModel implements CemeteryModel {
  const factory _CemeteryModel(
          {required final String id,
          required final String name,
          final String? address,
          @JsonKey(fromJson: _parseDouble) final double? latitude,
          @JsonKey(fromJson: _parseDouble) final double? longitude}) =
      _$CemeteryModelImpl;

  factory _CemeteryModel.fromJson(Map<String, dynamic> json) =
      _$CemeteryModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get address;
  @override
  @JsonKey(fromJson: _parseDouble)
  double? get latitude;
  @override
  @JsonKey(fromJson: _parseDouble)
  double? get longitude;
  @override
  @JsonKey(ignore: true)
  _$$CemeteryModelImplCopyWith<_$CemeteryModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MosqueModel _$MosqueModelFromJson(Map<String, dynamic> json) {
  return _MosqueModel.fromJson(json);
}

/// @nodoc
mixin _$MosqueModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _parseDouble)
  double? get latitude => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _parseDouble)
  double? get longitude => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $MosqueModelCopyWith<MosqueModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MosqueModelCopyWith<$Res> {
  factory $MosqueModelCopyWith(
          MosqueModel value, $Res Function(MosqueModel) then) =
      _$MosqueModelCopyWithImpl<$Res, MosqueModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String? address,
      @JsonKey(fromJson: _parseDouble) double? latitude,
      @JsonKey(fromJson: _parseDouble) double? longitude});
}

/// @nodoc
class _$MosqueModelCopyWithImpl<$Res, $Val extends MosqueModel>
    implements $MosqueModelCopyWith<$Res> {
  _$MosqueModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
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
abstract class _$$MosqueModelImplCopyWith<$Res>
    implements $MosqueModelCopyWith<$Res> {
  factory _$$MosqueModelImplCopyWith(
          _$MosqueModelImpl value, $Res Function(_$MosqueModelImpl) then) =
      __$$MosqueModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String? address,
      @JsonKey(fromJson: _parseDouble) double? latitude,
      @JsonKey(fromJson: _parseDouble) double? longitude});
}

/// @nodoc
class __$$MosqueModelImplCopyWithImpl<$Res>
    extends _$MosqueModelCopyWithImpl<$Res, _$MosqueModelImpl>
    implements _$$MosqueModelImplCopyWith<$Res> {
  __$$MosqueModelImplCopyWithImpl(
      _$MosqueModelImpl _value, $Res Function(_$MosqueModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? address = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
  }) {
    return _then(_$MosqueModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
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
class _$MosqueModelImpl implements _MosqueModel {
  const _$MosqueModelImpl(
      {required this.id,
      required this.name,
      this.address,
      @JsonKey(fromJson: _parseDouble) this.latitude,
      @JsonKey(fromJson: _parseDouble) this.longitude});

  factory _$MosqueModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$MosqueModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? address;
  @override
  @JsonKey(fromJson: _parseDouble)
  final double? latitude;
  @override
  @JsonKey(fromJson: _parseDouble)
  final double? longitude;

  @override
  String toString() {
    return 'MosqueModel(id: $id, name: $name, address: $address, latitude: $latitude, longitude: $longitude)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MosqueModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, address, latitude, longitude);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$MosqueModelImplCopyWith<_$MosqueModelImpl> get copyWith =>
      __$$MosqueModelImplCopyWithImpl<_$MosqueModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MosqueModelImplToJson(
      this,
    );
  }
}

abstract class _MosqueModel implements MosqueModel {
  const factory _MosqueModel(
          {required final String id,
          required final String name,
          final String? address,
          @JsonKey(fromJson: _parseDouble) final double? latitude,
          @JsonKey(fromJson: _parseDouble) final double? longitude}) =
      _$MosqueModelImpl;

  factory _MosqueModel.fromJson(Map<String, dynamic> json) =
      _$MosqueModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get address;
  @override
  @JsonKey(fromJson: _parseDouble)
  double? get latitude;
  @override
  @JsonKey(fromJson: _parseDouble)
  double? get longitude;
  @override
  @JsonKey(ignore: true)
  _$$MosqueModelImplCopyWith<_$MosqueModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
