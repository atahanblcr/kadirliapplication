import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class NotificationsRemoteDatasource {
  late final Dio dio;

  NotificationsRemoteDatasource({Dio? mockDio}) {
    dio = mockDio ?? DioClient().dio;
  }

  Future<Map<String, dynamic>> getNotifications({int page = 1, int limit = 20, bool unreadOnly = false}) async {
    final response = await dio.get<Map<String, dynamic>>(
      '/notifications',
      queryParameters: {
        'page': page,
        'limit': limit,
        if (unreadOnly) 'unread_only': true,
      },
    );
    return response.data ?? {};
  }

  Future<void> markAsRead(String id) async {
    await dio.patch('/notifications/$id/read');
  }

  Future<void> markAllAsRead() async {
    await dio.post('/notifications/read-all');
  }
}
