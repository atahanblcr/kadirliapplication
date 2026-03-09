import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/transport/data/repositories/transport_repository.dart';
import 'package:kadirliapp/features/transport/data/datasources/transport_remote_datasource.dart';

class MockTransportRemoteDatasource extends Mock implements TransportRemoteDatasource {}

void main() {
  late TransportRepository repository;
  late MockTransportRemoteDatasource mockDatasource;

  setUp(() {
    mockDatasource = MockTransportRemoteDatasource();
    repository = TransportRepository(datasource: mockDatasource);
  });

  group('TransportRepository Tests', () {
    test('getIntercityRoutes returns list', () async {
      when(() => mockDatasource.getIntercityRoutes()).thenAnswer((_) async => {
        'data': {
          'routes': [
            {'id': '1', 'destination': 'Adana', 'company': 'Test'}
          ]
        }
      });

      final result = await repository.getIntercityRoutes();
      expect(result, isNotEmpty);
      expect(result.first.destination, 'Adana');
    });

    test('getIntracityRoutes returns list', () async {
      when(() => mockDatasource.getIntracityRoutes()).thenAnswer((_) async => {
        'data': {
          'routes': [
            {'id': '1', 'route_name': 'Test Route', 'route_number': '1'}
          ]
        }
      });

      final result = await repository.getIntracityRoutes();
      expect(result, isNotEmpty);
      expect(result.first.routeName, 'Test Route');
    });

    group('Error Handling', () {
      test('getIntercityRoutes throws UnknownException on parse error', () async {
        when(() => mockDatasource.getIntercityRoutes()).thenAnswer((_) async => {'data': {'routes': ['invalid']}});
        expect(() => repository.getIntercityRoutes(), throwsA(isA<UnknownException>()));
      });

      test('getIntercityRoutes rethrows DioException', () async {
        when(() => mockDatasource.getIntercityRoutes()).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.getIntercityRoutes(), throwsA(isA<DioException>()));
      });

      test('getIntracityRoutes throws UnknownException on parse error', () async {
        when(() => mockDatasource.getIntracityRoutes()).thenAnswer((_) async => {'data': {'routes': ['invalid']}});
        expect(() => repository.getIntracityRoutes(), throwsA(isA<UnknownException>()));
      });

      test('getIntracityRoutes rethrows DioException', () async {
        when(() => mockDatasource.getIntracityRoutes()).thenThrow(DioException(requestOptions: RequestOptions(path: '')));
        expect(() => repository.getIntracityRoutes(), throwsA(isA<DioException>()));
      });
    });
  });
}
