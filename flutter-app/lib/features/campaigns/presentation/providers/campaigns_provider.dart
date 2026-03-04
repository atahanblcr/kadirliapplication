import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/campaigns_repository.dart';
import '../../data/models/campaign_model.dart';

final campaignsRepositoryProvider = Provider((ref) {
  return CampaignsRepository();
});

final campaignsProvider = FutureProvider.family.autoDispose<
    Map<String, dynamic>,
    int>((ref, page) async {
  final repository = ref.watch(campaignsRepositoryProvider);
  return repository.getCampaigns(page: page);
});

final campaignDetailProvider = FutureProvider.family.autoDispose<
    CampaignDetailModel,
    String>((ref, id) async {
  final repository = ref.watch(campaignsRepositoryProvider);
  return repository.getCampaignDetail(id);
});
