import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/campaigns_remote_datasource.dart';
import '../models/campaign_model.dart';

class CampaignsRepository {
  final CampaignsRemoteDatasource _datasource;

  CampaignsRepository({CampaignsRemoteDatasource? datasource})
      : _datasource = datasource ?? CampaignsRemoteDatasource();

  Future<Map<String, dynamic>> getCampaigns({
    int page = 1,
    int limit = 20,
    String? categoryId,
    bool activeOnly = true,
  }) async {
    try {
      final response = await _datasource.getCampaigns(
        page: page,
        limit: limit,
        categoryId: categoryId,
        activeOnly: activeOnly,
      );

      final data = response['data'] as Map<String, dynamic>;
      final campaigns = List<CampaignModel>.from(
        (data['campaigns'] as List).map(
          (c) => CampaignModel.fromJson(c as Map<String, dynamic>),
        ),
      );

      return {
        'campaigns': campaigns,
        'meta': data['meta'] as Map<String, dynamic>,
      };
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse campaigns: $e');
    }
  }

  Future<CampaignDetailModel> getCampaignDetail(String campaignId) async {
    try {
      final response = await _datasource.getCampaignDetail(campaignId);
      final campaignJson = response['data']['campaign'] as Map<String, dynamic>;
      return CampaignDetailModel.fromJson(campaignJson);
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse campaign detail: $e');
    }
  }

  Future<Map<String, dynamic>> viewCode(String campaignId) async {
    try {
      final response = await _datasource.viewCode(campaignId);
      return response['data'] as Map<String, dynamic>;
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse view code response: $e');
    }
  }
}
