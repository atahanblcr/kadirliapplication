// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'pharmacy_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

PharmacyModel _$PharmacyModelFromJson(Map<String, dynamic> json) {
  return _PharmacyModel.fromJson(json);
}

/// @nodoc
mixin _$PharmacyModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get address => throw _privateConstructorUsedError;
  String get phone => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _parseDouble)
  double? get latitude => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _parseDouble)
  double? get longitude => throw _privateConstructorUsedError;
  @JsonKey(name: 'working_hours')
  String? get workingHours => throw _privateConstructorUsedError;
  @JsonKey(name: 'duty_hours')
  String? get dutyHours => throw _privateConstructorUsedError;
  @JsonKey(name: 'pharmacist_name')
  String? get pharmacistName => throw _privateConstructorUsedError;
  @JsonKey(name: 'duty_date')
  String? get dutyDate => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $PharmacyModelCopyWith<PharmacyModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PharmacyModelCopyWith<$Res> {
  factory $PharmacyModelCopyWith(
          PharmacyModel value, $Res Function(PharmacyModel) then) =
      _$PharmacyModelCopyWithImpl<$Res, PharmacyModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String address,
      String phone,
      @JsonKey(fromJson: _parseDouble) double? latitude,
      @JsonKey(fromJson: _parseDouble) double? longitude,
      @JsonKey(name: 'working_hours') String? workingHours,
      @JsonKey(name: 'duty_hours') String? dutyHours,
      @JsonKey(name: 'pharmacist_name') String? pharmacistName,
      @JsonKey(name: 'duty_date') String? dutyDate});
}

/// @nodoc
class _$PharmacyModelCopyWithImpl<$Res, $Val extends PharmacyModel>
    implements $PharmacyModelCopyWith<$Res> {
  _$PharmacyModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? address = null,
    Object? phone = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? workingHours = freezed,
    Object? dutyHours = freezed,
    Object? pharmacistName = freezed,
    Object? dutyDate = freezed,
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
      address: null == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      workingHours: freezed == workingHours
          ? _value.workingHours
          : workingHours // ignore: cast_nullable_to_non_nullable
              as String?,
      dutyHours: freezed == dutyHours
          ? _value.dutyHours
          : dutyHours // ignore: cast_nullable_to_non_nullable
              as String?,
      pharmacistName: freezed == pharmacistName
          ? _value.pharmacistName
          : pharmacistName // ignore: cast_nullable_to_non_nullable
              as String?,
      dutyDate: freezed == dutyDate
          ? _value.dutyDate
          : dutyDate // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PharmacyModelImplCopyWith<$Res>
    implements $PharmacyModelCopyWith<$Res> {
  factory _$$PharmacyModelImplCopyWith(
          _$PharmacyModelImpl value, $Res Function(_$PharmacyModelImpl) then) =
      __$$PharmacyModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String address,
      String phone,
      @JsonKey(fromJson: _parseDouble) double? latitude,
      @JsonKey(fromJson: _parseDouble) double? longitude,
      @JsonKey(name: 'working_hours') String? workingHours,
      @JsonKey(name: 'duty_hours') String? dutyHours,
      @JsonKey(name: 'pharmacist_name') String? pharmacistName,
      @JsonKey(name: 'duty_date') String? dutyDate});
}

/// @nodoc
class __$$PharmacyModelImplCopyWithImpl<$Res>
    extends _$PharmacyModelCopyWithImpl<$Res, _$PharmacyModelImpl>
    implements _$$PharmacyModelImplCopyWith<$Res> {
  __$$PharmacyModelImplCopyWithImpl(
      _$PharmacyModelImpl _value, $Res Function(_$PharmacyModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? address = null,
    Object? phone = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? workingHours = freezed,
    Object? dutyHours = freezed,
    Object? pharmacistName = freezed,
    Object? dutyDate = freezed,
  }) {
    return _then(_$PharmacyModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      address: null == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      workingHours: freezed == workingHours
          ? _value.workingHours
          : workingHours // ignore: cast_nullable_to_non_nullable
              as String?,
      dutyHours: freezed == dutyHours
          ? _value.dutyHours
          : dutyHours // ignore: cast_nullable_to_non_nullable
              as String?,
      pharmacistName: freezed == pharmacistName
          ? _value.pharmacistName
          : pharmacistName // ignore: cast_nullable_to_non_nullable
              as String?,
      dutyDate: freezed == dutyDate
          ? _value.dutyDate
          : dutyDate // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PharmacyModelImpl implements _PharmacyModel {
  const _$PharmacyModelImpl(
      {required this.id,
      required this.name,
      required this.address,
      required this.phone,
      @JsonKey(fromJson: _parseDouble) this.latitude,
      @JsonKey(fromJson: _parseDouble) this.longitude,
      @JsonKey(name: 'working_hours') this.workingHours,
      @JsonKey(name: 'duty_hours') this.dutyHours,
      @JsonKey(name: 'pharmacist_name') this.pharmacistName,
      @JsonKey(name: 'duty_date') this.dutyDate});

  factory _$PharmacyModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PharmacyModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String address;
  @override
  final String phone;
  @override
  @JsonKey(fromJson: _parseDouble)
  final double? latitude;
  @override
  @JsonKey(fromJson: _parseDouble)
  final double? longitude;
  @override
  @JsonKey(name: 'working_hours')
  final String? workingHours;
  @override
  @JsonKey(name: 'duty_hours')
  final String? dutyHours;
  @override
  @JsonKey(name: 'pharmacist_name')
  final String? pharmacistName;
  @override
  @JsonKey(name: 'duty_date')
  final String? dutyDate;

  @override
  String toString() {
    return 'PharmacyModel(id: $id, name: $name, address: $address, phone: $phone, latitude: $latitude, longitude: $longitude, workingHours: $workingHours, dutyHours: $dutyHours, pharmacistName: $pharmacistName, dutyDate: $dutyDate)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PharmacyModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.workingHours, workingHours) ||
                other.workingHours == workingHours) &&
            (identical(other.dutyHours, dutyHours) ||
                other.dutyHours == dutyHours) &&
            (identical(other.pharmacistName, pharmacistName) ||
                other.pharmacistName == pharmacistName) &&
            (identical(other.dutyDate, dutyDate) ||
                other.dutyDate == dutyDate));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, address, phone,
      latitude, longitude, workingHours, dutyHours, pharmacistName, dutyDate);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$PharmacyModelImplCopyWith<_$PharmacyModelImpl> get copyWith =>
      __$$PharmacyModelImplCopyWithImpl<_$PharmacyModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PharmacyModelImplToJson(
      this,
    );
  }
}

abstract class _PharmacyModel implements PharmacyModel {
  const factory _PharmacyModel(
          {required final String id,
          required final String name,
          required final String address,
          required final String phone,
          @JsonKey(fromJson: _parseDouble) final double? latitude,
          @JsonKey(fromJson: _parseDouble) final double? longitude,
          @JsonKey(name: 'working_hours') final String? workingHours,
          @JsonKey(name: 'duty_hours') final String? dutyHours,
          @JsonKey(name: 'pharmacist_name') final String? pharmacistName,
          @JsonKey(name: 'duty_date') final String? dutyDate}) =
      _$PharmacyModelImpl;

  factory _PharmacyModel.fromJson(Map<String, dynamic> json) =
      _$PharmacyModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get address;
  @override
  String get phone;
  @override
  @JsonKey(fromJson: _parseDouble)
  double? get latitude;
  @override
  @JsonKey(fromJson: _parseDouble)
  double? get longitude;
  @override
  @JsonKey(name: 'working_hours')
  String? get workingHours;
  @override
  @JsonKey(name: 'duty_hours')
  String? get dutyHours;
  @override
  @JsonKey(name: 'pharmacist_name')
  String? get pharmacistName;
  @override
  @JsonKey(name: 'duty_date')
  String? get dutyDate;
  @override
  @JsonKey(ignore: true)
  _$$PharmacyModelImplCopyWith<_$PharmacyModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PharmacyScheduleModel _$PharmacyScheduleModelFromJson(
    Map<String, dynamic> json) {
  return _PharmacyScheduleModel.fromJson(json);
}

/// @nodoc
mixin _$PharmacyScheduleModel {
  String get date => throw _privateConstructorUsedError;
  PharmacyModel get pharmacy => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $PharmacyScheduleModelCopyWith<PharmacyScheduleModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PharmacyScheduleModelCopyWith<$Res> {
  factory $PharmacyScheduleModelCopyWith(PharmacyScheduleModel value,
          $Res Function(PharmacyScheduleModel) then) =
      _$PharmacyScheduleModelCopyWithImpl<$Res, PharmacyScheduleModel>;
  @useResult
  $Res call({String date, PharmacyModel pharmacy});

  $PharmacyModelCopyWith<$Res> get pharmacy;
}

/// @nodoc
class _$PharmacyScheduleModelCopyWithImpl<$Res,
        $Val extends PharmacyScheduleModel>
    implements $PharmacyScheduleModelCopyWith<$Res> {
  _$PharmacyScheduleModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? pharmacy = null,
  }) {
    return _then(_value.copyWith(
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as String,
      pharmacy: null == pharmacy
          ? _value.pharmacy
          : pharmacy // ignore: cast_nullable_to_non_nullable
              as PharmacyModel,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $PharmacyModelCopyWith<$Res> get pharmacy {
    return $PharmacyModelCopyWith<$Res>(_value.pharmacy, (value) {
      return _then(_value.copyWith(pharmacy: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PharmacyScheduleModelImplCopyWith<$Res>
    implements $PharmacyScheduleModelCopyWith<$Res> {
  factory _$$PharmacyScheduleModelImplCopyWith(
          _$PharmacyScheduleModelImpl value,
          $Res Function(_$PharmacyScheduleModelImpl) then) =
      __$$PharmacyScheduleModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String date, PharmacyModel pharmacy});

  @override
  $PharmacyModelCopyWith<$Res> get pharmacy;
}

/// @nodoc
class __$$PharmacyScheduleModelImplCopyWithImpl<$Res>
    extends _$PharmacyScheduleModelCopyWithImpl<$Res,
        _$PharmacyScheduleModelImpl>
    implements _$$PharmacyScheduleModelImplCopyWith<$Res> {
  __$$PharmacyScheduleModelImplCopyWithImpl(_$PharmacyScheduleModelImpl _value,
      $Res Function(_$PharmacyScheduleModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? pharmacy = null,
  }) {
    return _then(_$PharmacyScheduleModelImpl(
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as String,
      pharmacy: null == pharmacy
          ? _value.pharmacy
          : pharmacy // ignore: cast_nullable_to_non_nullable
              as PharmacyModel,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PharmacyScheduleModelImpl implements _PharmacyScheduleModel {
  const _$PharmacyScheduleModelImpl(
      {required this.date, required this.pharmacy});

  factory _$PharmacyScheduleModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PharmacyScheduleModelImplFromJson(json);

  @override
  final String date;
  @override
  final PharmacyModel pharmacy;

  @override
  String toString() {
    return 'PharmacyScheduleModel(date: $date, pharmacy: $pharmacy)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PharmacyScheduleModelImpl &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.pharmacy, pharmacy) ||
                other.pharmacy == pharmacy));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, date, pharmacy);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$PharmacyScheduleModelImplCopyWith<_$PharmacyScheduleModelImpl>
      get copyWith => __$$PharmacyScheduleModelImplCopyWithImpl<
          _$PharmacyScheduleModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PharmacyScheduleModelImplToJson(
      this,
    );
  }
}

abstract class _PharmacyScheduleModel implements PharmacyScheduleModel {
  const factory _PharmacyScheduleModel(
      {required final String date,
      required final PharmacyModel pharmacy}) = _$PharmacyScheduleModelImpl;

  factory _PharmacyScheduleModel.fromJson(Map<String, dynamic> json) =
      _$PharmacyScheduleModelImpl.fromJson;

  @override
  String get date;
  @override
  PharmacyModel get pharmacy;
  @override
  @JsonKey(ignore: true)
  _$$PharmacyScheduleModelImplCopyWith<_$PharmacyScheduleModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}
