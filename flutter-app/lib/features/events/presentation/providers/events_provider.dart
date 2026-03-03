import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/events_remote_datasource.dart';
import '../../data/repositories/events_repository.dart';
import '../../data/models/event_model.dart';
import '../../../../core/network/dio_client.dart';

final eventsDatasourceProvider = Provider<EventsRemoteDatasource>((ref) {
  return EventsRemoteDatasource(dioClient: DioClient());
});

final eventsRepositoryProvider = Provider<EventsRepository>((ref) {
  return EventsRepository(datasource: ref.read(eventsDatasourceProvider));
});

final eventDetailProvider = FutureProvider.family<EventDetailModel, String>((ref, id) async {
  final repository = ref.read(eventsRepositoryProvider);
  return await repository.getEventDetail(id);
});

final eventCategoriesProvider = FutureProvider<List<EventCategoryModel>>((ref) async {
  final repository = ref.read(eventsRepositoryProvider);
  return await repository.getCategories();
});
