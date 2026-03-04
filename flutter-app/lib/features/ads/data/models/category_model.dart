class CategoryModel {
  final String id;
  final String name;
  final String slug;
  final String? icon;
  final String? parentId;
  final CategoryModel? parent;
  final int? subcategoriesCount;
  final int? adsCount;

  CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.icon,
    this.parentId,
    this.parent,
    this.subcategoriesCount,
    this.adsCount,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Kategorisiz',
      slug: json['slug']?.toString() ?? '',
      icon: json['icon']?.toString(),
      parentId: json['parent_id']?.toString(),
      parent: json['parent'] != null
          ? CategoryModel.fromJson(json['parent'] as Map<String, dynamic>)
          : null,
      subcategoriesCount: json['subcategories_count'] as int?,
      adsCount: json['ads_count'] as int?,
    );
  }

  @override
  String toString() => 'CategoryModel(id: $id, name: $name)';
}
