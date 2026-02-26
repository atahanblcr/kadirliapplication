import 'announcement_type_model.dart';

/// Announcement model - used for both list and detail views
/// Detail-only fields are nullable
class AnnouncementModel {
  final String id;
  final AnnouncementTypeModel? type;
  final String title;
  final String body; // Plain text, NO HTML
  final String priority; // emergency | high | normal | low
  final bool hasPdf;
  final String? pdfUrl;
  final bool hasLink;
  final String? externalLink;
  final int viewCount;
  final DateTime createdAt;
  final bool isViewed;

  // Detail-only fields (nullable)
  final List<String>? targetNeighborhoods;
  final Map<String, dynamic>? pdfFile;
  final Map<String, dynamic>? createdBy;

  AnnouncementModel({
    required this.id,
    this.type,
    required this.title,
    required this.body,
    required this.priority,
    required this.hasPdf,
    this.pdfUrl,
    required this.hasLink,
    this.externalLink,
    required this.viewCount,
    required this.createdAt,
    required this.isViewed,
    this.targetNeighborhoods,
    this.pdfFile,
    this.createdBy,
  });

  factory AnnouncementModel.fromJson(Map<String, dynamic> json) {
    final createdAtStr = json['created_at'] as String?;
    DateTime createdAt;
    try {
      createdAt = createdAtStr != null
          ? DateTime.parse(createdAtStr)
          : DateTime.now();
    } catch (_) {
      createdAt = DateTime.now();
    }

    return AnnouncementModel(
      id: json['id'] as String,
      type: json['type'] != null
          ? AnnouncementTypeModel.fromJson(json['type'] as Map<String, dynamic>)
          : null,
      title: json['title'] as String? ?? 'Başlıksız',
      body: json['body'] as String? ?? '',
      priority: json['priority'] as String? ?? 'normal',
      hasPdf: json['has_pdf'] as bool? ?? false,
      pdfUrl: json['pdf_url'] as String?,
      hasLink: json['has_link'] as bool? ?? false,
      externalLink: json['external_link'] as String?,
      viewCount: json['view_count'] as int? ?? 0,
      createdAt: createdAt,
      isViewed: json['is_viewed'] as bool? ?? false,
      targetNeighborhoods: (json['target_neighborhoods'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      pdfFile: json['pdf_file'] as Map<String, dynamic>?,
      createdBy: json['created_by'] as Map<String, dynamic>?,
    );
  }

  @override
  String toString() => 'AnnouncementModel(id: $id, title: $title)';
}
