import 'package:freezed_annotation/freezed_annotation.dart';

part 'taxi_model.freezed.dart';
part 'taxi_model.g.dart';

@freezed
class TaxiDriverModel with _$TaxiDriverModel {
  const factory TaxiDriverModel({
    required String id,
    required String name,
    required String phone,
    required String plaka,
    @JsonKey(name: 'vehicle_info') String? vehicleInfo,
    @JsonKey(name: 'total_calls') @Default(0) int totalCalls,
  }) = _TaxiDriverModel;

  factory TaxiDriverModel.fromJson(Map<String, dynamic> json) =>
      _$TaxiDriverModelFromJson(json);
}
