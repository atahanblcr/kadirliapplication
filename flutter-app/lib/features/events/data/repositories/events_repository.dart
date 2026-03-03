import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/events_remote_datasource.dart';
import '../models/event_model.dart';

class EventsRepository {
  final EventsRemoteDatasource _datasource;

  EventsRepository({EventsRemoteDatasource? datasource})
      : _datasource = datasource ?? EventsRemoteDatasource();

  Future<Map<String, dynamic>> getEvents({
    int page = 1,
    int limit = 20,
    String? categoryId,
    String? city,
  }) async {
    try {
      final response = await _datasource.getEvents(
        page: page,
        limit: limit,
        categoryId: categoryId,
        city: city,
      );

      final data = response['data'] as Map<String, dynamic>? ?? {};
      final eventsJson = data['events'] as List<dynamic>? ?? [];
      final events = List<EventModel>.from(
        eventsJson.map((event) => EventModel.fromJson(event as Map<String, dynamic>)),
      );

      return {
        'events': events,
        'meta': data['meta'] ?? response['meta'] ?? {},
      };
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message: 'Failed to parse events: $e');
    }
  }

  Future<EventDetailModel> getEventDetail(String id) async {
    try {
      final response = await _datasource.getEventDetail(id);
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final eventJson = data['event'] as Map<String, dynamic>;
      return EventDetailModel.fromJson(eventJson);
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message: 'Failed to parse event detail: $e');
    }
  }

  Future<List<EventCategoryModel>> getCategories() async {
    try {
      final response = await _datasource.getCategories();
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final categoriesJson = data['categories'] as List<dynamic>? ?? [];
      return List<EventCategoryModel>.from(
        categoriesJson.map((c) => EventCategoryModel.fromJson(c as Map<String, dynamic>)),
      );
    } catch (e) {
      if (e is DioException) rethrow;
      throw UnknownException(message: 'Failed to parse event categories: $e');
    }
  }
}
