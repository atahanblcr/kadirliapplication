// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'campaign_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CampaignModelImpl _$$CampaignModelImplFromJson(Map<String, dynamic> json) =>
    _$CampaignModelImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      discountPercentage: (json['discount_percentage'] as num?)?.toInt(),
      minimumAmount: _parseDouble(json['minimum_amount']),
      stockLimit: (json['stock_limit'] as num?)?.toInt(),
      startDate: json['start_date'] as String?,
      endDate: json['end_date'] as String?,
      codeViewCount: (json['code_view_count'] as num?)?.toInt(),
      business: json['business'] == null
          ? null
          : CampaignBusinessModel.fromJson(
              json['business'] as Map<String, dynamic>),
      coverImageUrl: _readPhotoUrl(json, 'cover_image') as String?,
    );

Map<String, dynamic> _$$CampaignModelImplToJson(_$CampaignModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'discount_percentage': instance.discountPercentage,
      'minimum_amount': instance.minimumAmount,
      'stock_limit': instance.stockLimit,
      'start_date': instance.startDate,
      'end_date': instance.endDate,
      'code_view_count': instance.codeViewCount,
      'business': instance.business,
      'cover_image': instance.coverImageUrl,
    };

_$CampaignDetailModelImpl _$$CampaignDetailModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CampaignDetailModelImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      discountPercentage: (json['discount_percentage'] as num?)?.toInt(),
      discountCode: json['discount_code'] as String?,
      terms: json['terms'] as String?,
      minimumAmount: _parseDouble(json['minimum_amount']),
      stockLimit: (json['stock_limit'] as num?)?.toInt(),
      startDate: json['start_date'] as String?,
      endDate: json['end_date'] as String?,
      codeViewCount: (json['code_view_count'] as num?)?.toInt(),
      business: json['business'] == null
          ? null
          : CampaignBusinessModel.fromJson(
              json['business'] as Map<String, dynamic>),
      coverImageUrl: _readPhotoUrl(json, 'cover_image') as String?,
      images: (json['images'] as List<dynamic>?)
              ?.map(
                  (e) => CampaignImageModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$$CampaignDetailModelImplToJson(
        _$CampaignDetailModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'discount_percentage': instance.discountPercentage,
      'discount_code': instance.discountCode,
      'terms': instance.terms,
      'minimum_amount': instance.minimumAmount,
      'stock_limit': instance.stockLimit,
      'start_date': instance.startDate,
      'end_date': instance.endDate,
      'code_view_count': instance.codeViewCount,
      'business': instance.business,
      'cover_image': instance.coverImageUrl,
      'images': instance.images,
    };

_$CampaignBusinessModelImpl _$$CampaignBusinessModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CampaignBusinessModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone_number'] as String?,
      address: json['address'] as String?,
      latitude: _parseDouble(json['latitude']),
      longitude: _parseDouble(json['longitude']),
    );

Map<String, dynamic> _$$CampaignBusinessModelImplToJson(
        _$CampaignBusinessModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'phone_number': instance.phone,
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };

_$CampaignImageModelImpl _$$CampaignImageModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CampaignImageModelImpl(
      id: json['id'] as String,
      displayOrder: (json['display_order'] as num?)?.toInt(),
      imageUrl: _readPhotoUrl(json, 'file') as String?,
    );

Map<String, dynamic> _$$CampaignImageModelImplToJson(
        _$CampaignImageModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'display_order': instance.displayOrder,
      'file': instance.imageUrl,
    };
