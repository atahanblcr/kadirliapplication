import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/transport/data/datasources/transport_remote_datasource.dart';

class MockDio extends Mock implements Dio {}

void main() {
  late TransportRemoteDatasource datasource;
  late MockDio mockDio;

  setUp(() {
    mockDio = MockDio();
    datasource = TransportRemoteDatasource(mockDio: mockDio);
  });

  group('TransportRemoteDatasource Tests', () {
    test('getIntercityRoutes returns data on success', () async {
      when(() => mockDio.get<Map<String, dynamic>>('/transport/intercity'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                data: {'success': true, 'data': {'routes': []}},
              ));

      final result = await datasource.getIntercityRoutes();
      expect(result, isA<Map<String, dynamic>>());
      expect(result['success'], true);
    });

    test('getIntracityRoutes returns data on success', () async {
      when(() => mockDio.get<Map<String, dynamic>>('/transport/intracity'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                data: {'success': true, 'data': {'routes': []}},
              ));

      final result = await datasource.getIntracityRoutes();
      expect(result, isA<Map<String, dynamic>>());
      expect(result['success'], true);
    });

    test('returns empty map when data is null', () async {
      when(() => mockDio.get<Map<String, dynamic>>('/transport/intercity'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                data: null,
              ));

      final result = await datasource.getIntercityRoutes();
      expect(result, isEmpty);
    });
  });
}
