// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'event_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$EventCategoryModelImpl _$$EventCategoryModelImplFromJson(
        Map<String, dynamic> json) =>
    _$EventCategoryModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      icon: json['icon'] as String?,
      eventsCount: (json['events_count'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$EventCategoryModelImplToJson(
        _$EventCategoryModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'icon': instance.icon,
      'events_count': instance.eventsCount,
    };

_$EventImageModelImpl _$$EventImageModelImplFromJson(
        Map<String, dynamic> json) =>
    _$EventImageModelImpl(
      id: json['id'] as String,
      url: json['url'] as String,
      thumbnailUrl: json['thumbnail_url'] as String?,
      order: (json['order'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$EventImageModelImplToJson(
        _$EventImageModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'thumbnail_url': instance.thumbnailUrl,
      'order': instance.order,
    };

_$EventModelImpl _$$EventModelImplFromJson(Map<String, dynamic> json) =>
    _$EventModelImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      category: json['category'] == null
          ? null
          : EventCategoryModel.fromJson(
              json['category'] as Map<String, dynamic>),
      eventDate: json['event_date'] as String,
      eventTime: json['event_time'] as String,
      venueName: json['venue_name'] as String,
      city: json['city'] as String?,
      isFree: json['is_free'] as bool? ?? false,
      coverImage: _readCoverImage(json, 'coverImage') == null
          ? null
          : EventImageModel.fromJson(
              _readCoverImage(json, 'coverImage') as Map<String, dynamic>),
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$$EventModelImplToJson(_$EventModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'category': instance.category,
      'event_date': instance.eventDate,
      'event_time': instance.eventTime,
      'venue_name': instance.venueName,
      'city': instance.city,
      'is_free': instance.isFree,
      'coverImage': instance.coverImage,
      'created_at': instance.createdAt.toIso8601String(),
    };

_$EventDetailModelImpl _$$EventDetailModelImplFromJson(
        Map<String, dynamic> json) =>
    _$EventDetailModelImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      category: json['category'] == null
          ? null
          : EventCategoryModel.fromJson(
              json['category'] as Map<String, dynamic>),
      eventDate: json['event_date'] as String,
      eventTime: json['event_time'] as String,
      durationMinutes: (json['duration_minutes'] as num?)?.toInt(),
      venueName: json['venue_name'] as String,
      venueAddress: json['venue_address'] as String?,
      city: json['city'] as String?,
      latitude: _parseDouble(json['latitude']),
      longitude: _parseDouble(json['longitude']),
      organizer: json['organizer'] as String?,
      ticketPrice: (json['ticket_price'] as num?)?.toDouble(),
      isFree: json['is_free'] as bool? ?? false,
      ageRestriction: json['age_restriction'] as String?,
      capacity: (json['capacity'] as num?)?.toInt(),
      websiteUrl: json['website_url'] as String?,
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => EventImageModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$$EventDetailModelImplToJson(
        _$EventDetailModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'category': instance.category,
      'event_date': instance.eventDate,
      'event_time': instance.eventTime,
      'duration_minutes': instance.durationMinutes,
      'venue_name': instance.venueName,
      'venue_address': instance.venueAddress,
      'city': instance.city,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'organizer': instance.organizer,
      'ticket_price': instance.ticketPrice,
      'is_free': instance.isFree,
      'age_restriction': instance.ageRestriction,
      'capacity': instance.capacity,
      'website_url': instance.websiteUrl,
      'images': instance.images,
      'created_at': instance.createdAt.toIso8601String(),
    };
