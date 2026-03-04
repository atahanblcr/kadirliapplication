class ImageModel {
  final String id;
  final String url;
  final String thumbnailUrl;
  final bool isCover;
  final int order;

  ImageModel({
    required this.id,
    required this.url,
    required this.thumbnailUrl,
    required this.isCover,
    required this.order,
  });

  factory ImageModel.fromJson(Map<String, dynamic> json) {
    return ImageModel(
      id: json['id']?.toString() ?? '',
      url: json['url']?.toString() ?? '',
      thumbnailUrl: json['thumbnail_url']?.toString() ?? json['url']?.toString() ?? '',
      isCover: json['is_cover'] as bool? ?? false,
      order: json['order'] as int? ?? 0,
    );
  }

  @override
  String toString() => 'ImageModel(id: $id, url: $url)';
}
