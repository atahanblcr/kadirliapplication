import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/guide_remote_datasource.dart';
import '../models/guide_model.dart';

class GuideRepository {
  final GuideRemoteDatasource _datasource;

  GuideRepository({GuideRemoteDatasource? datasource})
      : _datasource = datasource ?? GuideRemoteDatasource();

  Future<List<GuideCategoryModel>> getCategories() async {
    try {
      final response = await _datasource.getCategories();
      final data = response['data'] as Map<String, dynamic>;
      
      return List<GuideCategoryModel>.from(
        (data['categories'] as List).map(
          (c) => GuideCategoryModel.fromJson(c as Map<String, dynamic>),
        ),
      );
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse guide categories: $e');
    }
  }

  Future<List<GuideItemModel>> getGuideItems({
    String? categoryId,
    String? search,
  }) async {
    try {
      final response = await _datasource.getGuideItems(
        categoryId: categoryId,
        search: search,
      );
      final data = response['data'] as Map<String, dynamic>;
      
      return List<GuideItemModel>.from(
        (data['items'] as List).map(
          (i) => GuideItemModel.fromJson(i as Map<String, dynamic>),
        ),
      );
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse guide items: $e');
    }
  }
}
