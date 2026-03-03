import 'package:freezed_annotation/freezed_annotation.dart';

part 'pharmacy_model.freezed.dart';
part 'pharmacy_model.g.dart';

double? _parseDouble(dynamic value) {
  if (value == null) return null;
  if (value is double) return value;
  if (value is int) return value.toDouble();
  if (value is String) return double.tryParse(value);
  return null;
}

@freezed
class PharmacyModel with _$PharmacyModel {
  const factory PharmacyModel({
    required String id,
    required String name,
    required String address,
    required String phone,
    @JsonKey(fromJson: _parseDouble) double? latitude,
    @JsonKey(fromJson: _parseDouble) double? longitude,
    @JsonKey(name: 'working_hours') String? workingHours,
    @JsonKey(name: 'duty_hours') String? dutyHours,
    @JsonKey(name: 'pharmacist_name') String? pharmacistName,
    @JsonKey(name: 'duty_date') String? dutyDate,
  }) = _PharmacyModel;

  factory PharmacyModel.fromJson(Map<String, dynamic> json) =>
      _$PharmacyModelFromJson(json);
}

@freezed
class PharmacyScheduleModel with _$PharmacyScheduleModel {
  const factory PharmacyScheduleModel({
    required String date,
    required PharmacyModel pharmacy,
  }) = _PharmacyScheduleModel;

  factory PharmacyScheduleModel.fromJson(Map<String, dynamic> json) =>
      _$PharmacyScheduleModelFromJson(json);
}
