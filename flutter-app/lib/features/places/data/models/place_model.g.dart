// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PlaceCategoryModelImpl _$$PlaceCategoryModelImplFromJson(
        Map<String, dynamic> json) =>
    _$PlaceCategoryModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      icon: json['icon'] as String?,
    );

Map<String, dynamic> _$$PlaceCategoryModelImplToJson(
        _$PlaceCategoryModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'icon': instance.icon,
    };

_$PlaceModelImpl _$$PlaceModelImplFromJson(Map<String, dynamic> json) =>
    _$PlaceModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      address: json['address'] as String?,
      latitude: _parseDouble(json['latitude']),
      longitude: _parseDouble(json['longitude']),
      isFree: json['is_free'] as bool? ?? true,
      entranceFee: _parseDouble(json['entrance_fee']),
      distanceFromCenter: _parseDouble(json['distance_from_center']),
      userDistance: _parseDouble(json['user_distance']),
      coverImageUrl: _readPhotoUrl(json, 'cover_image') as String?,
      category: json['category'] == null
          ? null
          : PlaceCategoryModel.fromJson(
              json['category'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$PlaceModelImplToJson(_$PlaceModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'is_free': instance.isFree,
      'entrance_fee': instance.entranceFee,
      'distance_from_center': instance.distanceFromCenter,
      'user_distance': instance.userDistance,
      'cover_image': instance.coverImageUrl,
      'category': instance.category,
    };

_$PlaceDetailModelImpl _$$PlaceDetailModelImplFromJson(
        Map<String, dynamic> json) =>
    _$PlaceDetailModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      address: json['address'] as String?,
      latitude: _parseDouble(json['latitude']),
      longitude: _parseDouble(json['longitude']),
      isFree: json['is_free'] as bool? ?? true,
      entranceFee: _parseDouble(json['entrance_fee']),
      openingHours: json['opening_hours'] as String?,
      bestSeason: json['best_season'] as String?,
      howToGetThere: json['how_to_get_there'] as String?,
      distanceFromCenter: _parseDouble(json['distance_from_center']),
      coverImageUrl: _readPhotoUrl(json, 'cover_image') as String?,
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => PlaceImageModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      category: json['category'] == null
          ? null
          : PlaceCategoryModel.fromJson(
              json['category'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$PlaceDetailModelImplToJson(
        _$PlaceDetailModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'is_free': instance.isFree,
      'entrance_fee': instance.entranceFee,
      'opening_hours': instance.openingHours,
      'best_season': instance.bestSeason,
      'how_to_get_there': instance.howToGetThere,
      'distance_from_center': instance.distanceFromCenter,
      'cover_image': instance.coverImageUrl,
      'images': instance.images,
      'category': instance.category,
    };

_$PlaceImageModelImpl _$$PlaceImageModelImplFromJson(
        Map<String, dynamic> json) =>
    _$PlaceImageModelImpl(
      id: json['id'] as String,
      displayOrder: (json['display_order'] as num?)?.toInt(),
      imageUrl: _readPhotoUrl(json, 'file') as String?,
    );

Map<String, dynamic> _$$PlaceImageModelImplToJson(
        _$PlaceImageModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'display_order': instance.displayOrder,
      'file': instance.imageUrl,
    };
