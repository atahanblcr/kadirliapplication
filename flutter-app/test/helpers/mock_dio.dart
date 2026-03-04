import 'package:dio/dio.dart';
import 'package:mocktail/mocktail.dart';
import 'package:kadirliapp/core/network/dio_client.dart';

class MockDio extends Mock implements Dio {}

class MockResponse<T> extends Mock implements Response<T> {}

class MockDioClient extends Mock implements DioClient {}

void setupDioMocks() {
  registerFallbackValue(RequestOptions(path: ''));
  registerFallbackValue(Options());
}
