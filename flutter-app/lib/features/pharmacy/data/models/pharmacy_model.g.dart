// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pharmacy_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PharmacyModelImpl _$$PharmacyModelImplFromJson(Map<String, dynamic> json) =>
    _$PharmacyModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      address: json['address'] as String,
      phone: json['phone'] as String,
      latitude: _parseDouble(json['latitude']),
      longitude: _parseDouble(json['longitude']),
      workingHours: json['working_hours'] as String?,
      dutyHours: json['duty_hours'] as String?,
      pharmacistName: json['pharmacist_name'] as String?,
      dutyDate: json['duty_date'] as String?,
    );

Map<String, dynamic> _$$PharmacyModelImplToJson(_$PharmacyModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'address': instance.address,
      'phone': instance.phone,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'working_hours': instance.workingHours,
      'duty_hours': instance.dutyHours,
      'pharmacist_name': instance.pharmacistName,
      'duty_date': instance.dutyDate,
    };

_$PharmacyScheduleModelImpl _$$PharmacyScheduleModelImplFromJson(
        Map<String, dynamic> json) =>
    _$PharmacyScheduleModelImpl(
      date: json['date'] as String,
      pharmacy:
          PharmacyModel.fromJson(json['pharmacy'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$PharmacyScheduleModelImplToJson(
        _$PharmacyScheduleModelImpl instance) =>
    <String, dynamic>{
      'date': instance.date,
      'pharmacy': instance.pharmacy,
    };
