// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'death_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DeathNoticeModelImpl _$$DeathNoticeModelImplFromJson(
        Map<String, dynamic> json) =>
    _$DeathNoticeModelImpl(
      id: json['id'] as String,
      deceasedName: json['deceased_name'] as String,
      age: (json['age'] as num?)?.toInt(),
      photoUrl: _readPhotoUrl(json, 'photoUrl') as String?,
      funeralDate: json['funeral_date'] as String,
      funeralTime: json['funeral_time'] as String,
      cemetery: json['cemetery'] == null
          ? null
          : CemeteryModel.fromJson(json['cemetery'] as Map<String, dynamic>),
      mosque: json['mosque'] == null
          ? null
          : MosqueModel.fromJson(json['mosque'] as Map<String, dynamic>),
      condolenceAddress: json['condolence_address'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$$DeathNoticeModelImplToJson(
        _$DeathNoticeModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'deceased_name': instance.deceasedName,
      'age': instance.age,
      'photoUrl': instance.photoUrl,
      'funeral_date': instance.funeralDate,
      'funeral_time': instance.funeralTime,
      'cemetery': instance.cemetery,
      'mosque': instance.mosque,
      'condolence_address': instance.condolenceAddress,
      'created_at': instance.createdAt.toIso8601String(),
    };

_$DeathNoticeDetailModelImpl _$$DeathNoticeDetailModelImplFromJson(
        Map<String, dynamic> json) =>
    _$DeathNoticeDetailModelImpl(
      id: json['id'] as String,
      deceasedName: json['deceased_name'] as String,
      age: (json['age'] as num?)?.toInt(),
      photo: _readPhotoDetail(json, 'photo') == null
          ? null
          : DeathPhotoModel.fromJson(
              _readPhotoDetail(json, 'photo') as Map<String, dynamic>),
      funeralDate: json['funeral_date'] as String,
      funeralTime: json['funeral_time'] as String,
      cemetery: json['cemetery'] == null
          ? null
          : CemeteryModel.fromJson(json['cemetery'] as Map<String, dynamic>),
      mosque: json['mosque'] == null
          ? null
          : MosqueModel.fromJson(json['mosque'] as Map<String, dynamic>),
      condolenceAddress: json['condolence_address'] as String?,
      autoArchiveAt: json['auto_archive_at'] == null
          ? null
          : DateTime.parse(json['auto_archive_at'] as String),
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$$DeathNoticeDetailModelImplToJson(
        _$DeathNoticeDetailModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'deceased_name': instance.deceasedName,
      'age': instance.age,
      'photo': instance.photo,
      'funeral_date': instance.funeralDate,
      'funeral_time': instance.funeralTime,
      'cemetery': instance.cemetery,
      'mosque': instance.mosque,
      'condolence_address': instance.condolenceAddress,
      'auto_archive_at': instance.autoArchiveAt?.toIso8601String(),
      'created_at': instance.createdAt.toIso8601String(),
    };

_$DeathPhotoModelImpl _$$DeathPhotoModelImplFromJson(
        Map<String, dynamic> json) =>
    _$DeathPhotoModelImpl(
      id: json['id'] as String,
      url: json['url'] as String,
      thumbnailUrl: json['thumbnail_url'] as String?,
    );

Map<String, dynamic> _$$DeathPhotoModelImplToJson(
        _$DeathPhotoModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'thumbnail_url': instance.thumbnailUrl,
    };

_$CemeteryModelImpl _$$CemeteryModelImplFromJson(Map<String, dynamic> json) =>
    _$CemeteryModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      address: json['address'] as String?,
      latitude: _parseDouble(json['latitude']),
      longitude: _parseDouble(json['longitude']),
    );

Map<String, dynamic> _$$CemeteryModelImplToJson(_$CemeteryModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };

_$MosqueModelImpl _$$MosqueModelImplFromJson(Map<String, dynamic> json) =>
    _$MosqueModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      address: json['address'] as String?,
      latitude: _parseDouble(json['latitude']),
      longitude: _parseDouble(json['longitude']),
    );

Map<String, dynamic> _$$MosqueModelImplToJson(_$MosqueModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };
