import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/campaigns/presentation/providers/campaigns_provider.dart';
import 'package:kadirliapp/features/campaigns/data/repositories/campaigns_repository.dart';
import 'package:kadirliapp/features/campaigns/data/models/campaign_model.dart';

class MockCampaignsRepository extends Mock implements CampaignsRepository {}

void main() {
  group('Campaigns Providers', () {
    late MockCampaignsRepository mockRepository;

    setUp(() {
      mockRepository = MockCampaignsRepository();
    });

    test('campaignsProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          campaignsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getCampaigns(page: 1)).thenAnswer((_) async => {'campaigns': [], 'meta': {}});

      final result = await container.read(campaignsProvider(1).future);

      expect(result['campaigns'], isEmpty);
      verify(() => mockRepository.getCampaigns(page: 1)).called(1);
    });

    test('campaignDetailProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          campaignsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final campaign = CampaignDetailModel(id: '1', title: 'Test');
      when(() => mockRepository.getCampaignDetail('1')).thenAnswer((_) async => campaign);

      final result = await container.read(campaignDetailProvider('1').future);

      expect(result.id, '1');
      verify(() => mockRepository.getCampaignDetail('1')).called(1);
    });
  });
}
