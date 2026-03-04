import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/announcements/presentation/providers/announcements_provider.dart';
import 'package:kadirliapp/features/announcements/data/repositories/announcements_repository.dart';
import 'package:kadirliapp/features/announcements/data/models/announcement_model.dart';

class MockAnnouncementsRepository extends Mock implements AnnouncementsRepository {}

void main() {
  group('Announcements Providers', () {
    late MockAnnouncementsRepository mockRepository;

    setUp(() {
      mockRepository = MockAnnouncementsRepository();
    });

    test('loadAnnouncements success', () async {
      final container = ProviderContainer(
        overrides: [
          announcementsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final announcements = [
        AnnouncementModel(
          id: '1',
          title: 'Test',
          body: 'Desc',
          priority: 'normal',
          hasPdf: false,
          hasLink: false,
          viewCount: 0,
          isViewed: false,
          createdAt: DateTime.now(),
        )
      ];
      
      when(() => mockRepository.getAnnouncements(page: 1, limit: 20))
          .thenAnswer((_) async => (items: announcements, total: 1, totalPages: 1));

      await container.read(announcementsProvider.notifier).loadAnnouncements();

      expect(container.read(announcementsProvider).items.length, 1);
      expect(container.read(announcementsProvider).isLoading, false);
    });

    test('loadMore success', () async {
      final container = ProviderContainer(
        overrides: [
          announcementsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      container.read(announcementsProvider.notifier).state = 
          container.read(announcementsProvider.notifier).state.copyWith(currentPage: 1, totalPages: 2);

      final announcements = [
        AnnouncementModel(
          id: '2',
          title: 'Test 2',
          body: 'Desc 2',
          priority: 'normal',
          hasPdf: false,
          hasLink: false,
          viewCount: 0,
          isViewed: false,
          createdAt: DateTime.now(),
        )
      ];

      when(() => mockRepository.getAnnouncements(page: 2, limit: 20))
          .thenAnswer((_) async => (items: announcements, total: 2, totalPages: 2));

      await container.read(announcementsProvider.notifier).loadMore();

      expect(container.read(announcementsProvider).items.length, 1); // Because it was empty in this container
      expect(container.read(announcementsProvider).currentPage, 2);
    });

    test('loadMore failure handles error silently', () async {
      final container = ProviderContainer(
        overrides: [
          announcementsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      container.read(announcementsProvider.notifier).state = 
          container.read(announcementsProvider.notifier).state.copyWith(currentPage: 1, totalPages: 2);

      when(() => mockRepository.getAnnouncements(page: 2, limit: 20)).thenThrow(Exception());

      await container.read(announcementsProvider.notifier).loadMore();

      expect(container.read(announcementsProvider).isLoadingMore, false);
    });

    test('refresh calls loadAnnouncements', () async {
      final container = ProviderContainer(
        overrides: [
          announcementsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getAnnouncements(page: 1, limit: 20))
          .thenAnswer((_) async => (items: <AnnouncementModel>[], total: 0, totalPages: 1));

      await container.read(announcementsProvider.notifier).refresh();

      verify(() => mockRepository.getAnnouncements(page: 1, limit: 20)).called(1);
    });

    test('announcementDetailProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          announcementsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final announcement = AnnouncementModel(
        id: '1', 
        title: 'Test', 
        body: 'Desc', 
        priority: 'normal',
        hasPdf: false,
        hasLink: false,
        viewCount: 0,
        isViewed: false,
        createdAt: DateTime.now(),
      );
      when(() => mockRepository.getAnnouncementById('1')).thenAnswer((_) async => announcement);

      final result = await container.read(announcementDetailProvider('1').future);

      expect(result.id, '1');
      verify(() => mockRepository.getAnnouncementById('1')).called(1);
    });
  });
}
