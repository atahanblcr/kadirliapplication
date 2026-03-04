import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/campaigns/data/models/campaign_model.dart';

void main() {
  group('Campaign Models', () {
    test('CampaignModel.fromJson', () {
      final json = {
        'id': '1',
        'title': 'Indirim',
        'discount_percentage': 20,
        'cover_image': {'url': 'http://url'}
      };
      final model = CampaignModel.fromJson(json);
      expect(model.discountPercentage, 20);
      expect(model.coverImageUrl, 'http://url');
    });

    test('CampaignModel.fromJson with alternative photo fields', () {
      final json1 = {'id': '1', 'title': 'T', 'photo_file': {'url': 'url1'}};
      expect(CampaignModel.fromJson(json1).coverImageUrl, 'url1');

      final json2 = {'id': '1', 'title': 'T', 'file': {'url': 'url2'}};
      expect(CampaignModel.fromJson(json2).coverImageUrl, 'url2');
    });

    test('CampaignDetailModel.fromJson', () {
      final json = {
        'id': '1', 'title': 'T', 'minimum_amount': '100.5',
        'images': [{'id': 'i1', 'file': {'url': 'url1'}}]
      };
      final model = CampaignDetailModel.fromJson(json);
      expect(model.minimumAmount, 100.5);
      expect(model.images.first.imageUrl, 'url1');
    });

    test('CampaignImageModel.fromJson', () {
      final json = {'id': '1', 'file': {'url': 'url1'}};
      final model = CampaignImageModel.fromJson(json);
      expect(model.imageUrl, 'url1');
    });
  });
}
