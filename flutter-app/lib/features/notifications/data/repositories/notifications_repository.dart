import 'package:dio/dio.dart';
import '../../../../core/exceptions/app_exception.dart';
import '../datasources/notifications_remote_datasource.dart';
import '../models/notification_model.dart';

class NotificationsResponse {
  final List<NotificationModel> notifications;
  final int unreadCount;
  final int page;
  final int totalPages;
  final bool hasNext;

  NotificationsResponse({
    required this.notifications,
    required this.unreadCount,
    required this.page,
    required this.totalPages,
    required this.hasNext,
  });
}

class NotificationsRepository {
  final NotificationsRemoteDatasource _datasource;

  NotificationsRepository({NotificationsRemoteDatasource? datasource})
      : _datasource = datasource ?? NotificationsRemoteDatasource();

  Future<NotificationsResponse> getNotifications({int page = 1, int limit = 20, bool unreadOnly = false}) async {
    try {
      final response = await _datasource.getNotifications(page: page, limit: limit, unreadOnly: unreadOnly);
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final meta = data['meta'] as Map<String, dynamic>? ?? {};
      final notifsData = data['notifications'] as List?;

      final notifications = notifsData != null
          ? List<NotificationModel>.from(
              notifsData.map((d) => NotificationModel.fromJson(d as Map<String, dynamic>)))
          : <NotificationModel>[];

      return NotificationsResponse(
        notifications: notifications,
        unreadCount: data['unread_count'] as int? ?? 0,
        page: meta['page'] as int? ?? 1,
        totalPages: meta['total_pages'] as int? ?? 1,
        hasNext: meta['has_next'] as bool? ?? false,
      );
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to parse notifications: $e');
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _datasource.markAsRead(id);
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to mark notification as read: $e');
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _datasource.markAllAsRead();
    } on DioException catch (_) {
      rethrow;
    } catch (e) {
      throw UnknownException(message: 'Failed to mark all notifications as read: $e');
    }
  }
}
