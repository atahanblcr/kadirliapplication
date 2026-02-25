/// API Response Model
/// Standard response format from backend API

class ApiResponse<T> {
  final bool success;
  final T? data;
  final ApiMeta? meta;

  ApiResponse({
    required this.success,
    this.data,
    this.meta,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'] as bool? ?? false,
      data: json['data'] != null ? fromJsonT(json['data']) : null,
      meta: json['meta'] != null
          ? ApiMeta.fromJson(json['meta'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson(Object? Function(T)? toJsonT) => {
        'success': success,
        'data': data != null ? toJsonT?.call(data) : null,
        'meta': meta?.toJson(),
      };
}

/// API Meta Information
/// Contains pagination and timestamp info
class ApiMeta {
  final int? page;
  final int? pageSize;
  final int? total;
  final int? totalPages;
  final String? timestamp;

  ApiMeta({
    this.page,
    this.pageSize,
    this.total,
    this.totalPages,
    this.timestamp,
  });

  factory ApiMeta.fromJson(Map<String, dynamic> json) {
    return ApiMeta(
      page: json['page'] as int?,
      pageSize: json['pageSize'] as int?,
      total: json['total'] as int?,
      totalPages: json['totalPages'] as int?,
      timestamp: json['timestamp'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'page': page,
        'pageSize': pageSize,
        'total': total,
        'totalPages': totalPages,
        'timestamp': timestamp,
      };
}
