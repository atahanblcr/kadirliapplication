// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'taxi_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$TaxiDriverModelImpl _$$TaxiDriverModelImplFromJson(
        Map<String, dynamic> json) =>
    _$TaxiDriverModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      plaka: json['plaka'] as String,
      vehicleInfo: json['vehicle_info'] as String?,
      totalCalls: (json['total_calls'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$TaxiDriverModelImplToJson(
        _$TaxiDriverModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'phone': instance.phone,
      'plaka': instance.plaka,
      'vehicle_info': instance.vehicleInfo,
      'total_calls': instance.totalCalls,
    };
