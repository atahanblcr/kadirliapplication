// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'taxi_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

TaxiDriverModel _$TaxiDriverModelFromJson(Map<String, dynamic> json) {
  return _TaxiDriverModel.fromJson(json);
}

/// @nodoc
mixin _$TaxiDriverModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get phone => throw _privateConstructorUsedError;
  String get plaka => throw _privateConstructorUsedError;
  @JsonKey(name: 'vehicle_info')
  String? get vehicleInfo => throw _privateConstructorUsedError;
  @JsonKey(name: 'total_calls')
  int get totalCalls => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $TaxiDriverModelCopyWith<TaxiDriverModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TaxiDriverModelCopyWith<$Res> {
  factory $TaxiDriverModelCopyWith(
          TaxiDriverModel value, $Res Function(TaxiDriverModel) then) =
      _$TaxiDriverModelCopyWithImpl<$Res, TaxiDriverModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String phone,
      String plaka,
      @JsonKey(name: 'vehicle_info') String? vehicleInfo,
      @JsonKey(name: 'total_calls') int totalCalls});
}

/// @nodoc
class _$TaxiDriverModelCopyWithImpl<$Res, $Val extends TaxiDriverModel>
    implements $TaxiDriverModelCopyWith<$Res> {
  _$TaxiDriverModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? phone = null,
    Object? plaka = null,
    Object? vehicleInfo = freezed,
    Object? totalCalls = null,
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
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      plaka: null == plaka
          ? _value.plaka
          : plaka // ignore: cast_nullable_to_non_nullable
              as String,
      vehicleInfo: freezed == vehicleInfo
          ? _value.vehicleInfo
          : vehicleInfo // ignore: cast_nullable_to_non_nullable
              as String?,
      totalCalls: null == totalCalls
          ? _value.totalCalls
          : totalCalls // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$TaxiDriverModelImplCopyWith<$Res>
    implements $TaxiDriverModelCopyWith<$Res> {
  factory _$$TaxiDriverModelImplCopyWith(_$TaxiDriverModelImpl value,
          $Res Function(_$TaxiDriverModelImpl) then) =
      __$$TaxiDriverModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String phone,
      String plaka,
      @JsonKey(name: 'vehicle_info') String? vehicleInfo,
      @JsonKey(name: 'total_calls') int totalCalls});
}

/// @nodoc
class __$$TaxiDriverModelImplCopyWithImpl<$Res>
    extends _$TaxiDriverModelCopyWithImpl<$Res, _$TaxiDriverModelImpl>
    implements _$$TaxiDriverModelImplCopyWith<$Res> {
  __$$TaxiDriverModelImplCopyWithImpl(
      _$TaxiDriverModelImpl _value, $Res Function(_$TaxiDriverModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? phone = null,
    Object? plaka = null,
    Object? vehicleInfo = freezed,
    Object? totalCalls = null,
  }) {
    return _then(_$TaxiDriverModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      plaka: null == plaka
          ? _value.plaka
          : plaka // ignore: cast_nullable_to_non_nullable
              as String,
      vehicleInfo: freezed == vehicleInfo
          ? _value.vehicleInfo
          : vehicleInfo // ignore: cast_nullable_to_non_nullable
              as String?,
      totalCalls: null == totalCalls
          ? _value.totalCalls
          : totalCalls // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TaxiDriverModelImpl implements _TaxiDriverModel {
  const _$TaxiDriverModelImpl(
      {required this.id,
      required this.name,
      required this.phone,
      required this.plaka,
      @JsonKey(name: 'vehicle_info') this.vehicleInfo,
      @JsonKey(name: 'total_calls') this.totalCalls = 0});

  factory _$TaxiDriverModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$TaxiDriverModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String phone;
  @override
  final String plaka;
  @override
  @JsonKey(name: 'vehicle_info')
  final String? vehicleInfo;
  @override
  @JsonKey(name: 'total_calls')
  final int totalCalls;

  @override
  String toString() {
    return 'TaxiDriverModel(id: $id, name: $name, phone: $phone, plaka: $plaka, vehicleInfo: $vehicleInfo, totalCalls: $totalCalls)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TaxiDriverModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.plaka, plaka) || other.plaka == plaka) &&
            (identical(other.vehicleInfo, vehicleInfo) ||
                other.vehicleInfo == vehicleInfo) &&
            (identical(other.totalCalls, totalCalls) ||
                other.totalCalls == totalCalls));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, phone, plaka, vehicleInfo, totalCalls);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$TaxiDriverModelImplCopyWith<_$TaxiDriverModelImpl> get copyWith =>
      __$$TaxiDriverModelImplCopyWithImpl<_$TaxiDriverModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TaxiDriverModelImplToJson(
      this,
    );
  }
}

abstract class _TaxiDriverModel implements TaxiDriverModel {
  const factory _TaxiDriverModel(
          {required final String id,
          required final String name,
          required final String phone,
          required final String plaka,
          @JsonKey(name: 'vehicle_info') final String? vehicleInfo,
          @JsonKey(name: 'total_calls') final int totalCalls}) =
      _$TaxiDriverModelImpl;

  factory _TaxiDriverModel.fromJson(Map<String, dynamic> json) =
      _$TaxiDriverModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get phone;
  @override
  String get plaka;
  @override
  @JsonKey(name: 'vehicle_info')
  String? get vehicleInfo;
  @override
  @JsonKey(name: 'total_calls')
  int get totalCalls;
  @override
  @JsonKey(ignore: true)
  _$$TaxiDriverModelImplCopyWith<_$TaxiDriverModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
