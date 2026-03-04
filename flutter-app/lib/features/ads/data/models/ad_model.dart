import 'category_model.dart';
import 'image_model.dart';

class AdModel {
  final String id;
  final String title;
  final String description;
  final int price;
  final CategoryModel category;
  final ImageModel? coverImage;
  final int imagesCount;
  final int viewCount;
  final DateTime createdAt;
  final DateTime expiresAt;

  // Detail-only fields
  final List<ImageModel>? images;
  final Map<String, dynamic>? neighborhood;
  final List<Map<String, dynamic>>? properties;
  final Map<String, dynamic>? seller;
  final String? contactPhone;
  final String? whatsappUrl;
  final bool isOwn;
  final bool isFavorite;

  AdModel({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.category,
    this.coverImage,
    required this.imagesCount,
    required this.viewCount,
    required this.createdAt,
    required this.expiresAt,
    this.images,
    this.neighborhood,
    this.properties,
    this.seller,
    this.contactPhone,
    this.whatsappUrl,
    this.isOwn = false,
    this.isFavorite = false,
  });

  factory AdModel.fromJson(Map<String, dynamic> json) {
    final createdAtStr = json['created_at'] as String?;
    final expiresAtStr = json['expires_at'] as String?;

    // Parse price safely
    int priceValue = 0;
    final rawPrice = json['price'];
    if (rawPrice is int) {
      priceValue = rawPrice;
    } else if (rawPrice is double) {
      priceValue = rawPrice.toInt();
    } else if (rawPrice is String) {
      priceValue = double.tryParse(rawPrice)?.toInt() ?? 0;
    }

    return AdModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      price: priceValue,
      category: CategoryModel.fromJson(json['category'] as Map<String, dynamic>? ?? {}),
      coverImage: json['cover_image'] != null
          ? ImageModel.fromJson(json['cover_image'] as Map<String, dynamic>)
          : null,
      imagesCount: json['images_count'] as int? ?? 0,
      viewCount: json['view_count'] as int? ?? 0,
      createdAt: createdAtStr != null ? DateTime.parse(createdAtStr) : DateTime.now(),
      expiresAt: expiresAtStr != null ? DateTime.parse(expiresAtStr) : DateTime.now(),
      images: json['images'] != null
          ? (json['images'] as List)
              .map((img) => ImageModel.fromJson(img as Map<String, dynamic>))
              .toList()
          : null,
      neighborhood: json['neighborhood'] as Map<String, dynamic>?,
      properties: json['properties'] != null
          ? (json['properties'] as List)
              .map((prop) => prop as Map<String, dynamic>)
              .toList()
          : null,
      seller: json['seller'] as Map<String, dynamic>?,
      contactPhone: json['contact_phone']?.toString(),
      whatsappUrl: json['whatsapp_url']?.toString(),
      isOwn: json['is_own'] as bool? ?? false,
      isFavorite: json['is_favorite'] as bool? ?? false,
    );
  }

  @override
  String toString() => 'AdModel(id: $id, title: $title)';
}
