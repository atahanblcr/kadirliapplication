import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/features/events/presentation/providers/events_provider.dart';
import 'package:kadirliapp/features/events/presentation/providers/events_list_provider.dart';
import 'package:kadirliapp/features/events/data/repositories/events_repository.dart';
import 'package:kadirliapp/features/events/data/models/event_model.dart';

class MockEventsRepository extends Mock implements EventsRepository {}

void main() {
  group('Events Providers', () {
    late MockEventsRepository mockRepository;

    setUp(() {
      mockRepository = MockEventsRepository();
    });

    test('eventsListNotifierProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          eventsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final event = EventModel(
        id: '1', title: 'T', eventDate: 'D', eventTime: 'T', venueName: 'V',
        createdAt: DateTime.now(),
      );
      
      when(() => mockRepository.getEvents(
        page: any(named: 'page'),
        categoryId: any(named: 'categoryId'),
        city: any(named: 'city'),
      )).thenAnswer((_) async => {
        'events': [event],
        'meta': {'has_next': true}
      });

      final notifier = container.read(eventsListNotifierProvider.notifier);
      await notifier.loadMore(refresh: true);

      expect(container.read(eventsListNotifierProvider).events.length, 1);
      expect(container.read(eventsListNotifierProvider).hasNext, true);
    });

    test('eventsListNotifierProvider failure sets error', () async {
      final container = ProviderContainer(
        overrides: [
          eventsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getEvents(page: any(named: 'page'))).thenThrow(Exception('error'));

      await container.read(eventsListNotifierProvider.notifier).loadMore(refresh: true);

      expect(container.read(eventsListNotifierProvider).error, contains('error'));
    });

    test('setFilters should reset and reload', () async {
      final container = ProviderContainer(
        overrides: [
          eventsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getEvents(page: 1, categoryId: 'cat')).thenAnswer((_) async => {'events': [], 'meta': {}});

      container.read(eventsListNotifierProvider.notifier).setFilters(categoryId: 'cat');

      expect(container.read(eventsListNotifierProvider).categoryId, 'cat');
      verify(() => mockRepository.getEvents(page: 1, categoryId: 'cat')).called(greaterThanOrEqualTo(1));
    });

    test('eventDetailProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          eventsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      final event = EventDetailModel(
        id: '1',
        title: 'Test',
        eventDate: '2026-03-10',
        eventTime: '20:00',
        venueName: 'Venue',
        isFree: true,
        createdAt: DateTime.now(),
      );
      when(() => mockRepository.getEventDetail('1')).thenAnswer((_) async => event);

      final result = await container.read(eventDetailProvider('1').future);

      expect(result.id, '1');
      verify(() => mockRepository.getEventDetail('1')).called(1);
    });

    test('eventCategoriesProvider should call repository', () async {
      final container = ProviderContainer(
        overrides: [
          eventsRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      addTearDown(container.dispose);

      when(() => mockRepository.getCategories()).thenAnswer((_) async => []);

      final result = await container.read(eventCategoriesProvider.future);

      expect(result, isEmpty);
      verify(() => mockRepository.getCategories()).called(1);
    });
  });
}
