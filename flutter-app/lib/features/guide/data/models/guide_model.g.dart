// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'guide_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GuideCategoryModelImpl _$$GuideCategoryModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GuideCategoryModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      icon: json['icon'] as String?,
      color: json['color'] as String?,
      itemsCount: (json['items_count'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$GuideCategoryModelImplToJson(
        _$GuideCategoryModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'icon': instance.icon,
      'color': instance.color,
      'items_count': instance.itemsCount,
    };

_$GuideItemModelImpl _$$GuideItemModelImplFromJson(Map<String, dynamic> json) =>
    _$GuideItemModelImpl(
      id: json['id'] as String,
      categoryId: json['category_id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      address: json['address'] as String?,
      email: json['email'] as String?,
      websiteUrl: json['website_url'] as String?,
      workingHours: json['working_hours'] as String?,
      latitude: _parseDouble(json['latitude']),
      longitude: _parseDouble(json['longitude']),
      description: json['description'] as String?,
      logoUrl: _readPhotoUrl(json, 'logo') as String?,
      category: json['category'] == null
          ? null
          : GuideCategoryModel.fromJson(
              json['category'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GuideItemModelImplToJson(
        _$GuideItemModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'category_id': instance.categoryId,
      'name': instance.name,
      'phone': instance.phone,
      'address': instance.address,
      'email': instance.email,
      'website_url': instance.websiteUrl,
      'working_hours': instance.workingHours,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'description': instance.description,
      'logo': instance.logoUrl,
      'category': instance.category,
    };
