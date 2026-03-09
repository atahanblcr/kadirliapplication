import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/features/ads/data/repositories/ads_repository.dart';
import 'package:kadirliapp/features/ads/data/models/ad_model.dart';
import 'package:kadirliapp/features/ads/data/models/category_model.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/core/network/dio_client.dart';

class MockDioClient extends Mock implements DioClient {}

void main() {
  late AdsRepository repository;
  late MockDioClient mockDioClient;

  setUp(() {
    mockDioClient = MockDioClient();
    repository = AdsRepository(client: mockDioClient);
  });

  group('AdsRepository Tests (Mocktail)', () {
    test('getAds should return list of ads and meta', () async {
      // Mock response
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'success': true,
          'data': {
            'ads': [
              {
                'id': '1',
                'title': 'Test Ad',
                'description': 'Test Description',
                'price': '100.00',
                'category': {'id': 'cat1', 'name': 'Cat 1', 'slug': 'cat-1'},
                'created_at': '2026-03-02T12:00:00Z',
                'expires_at': '2026-04-02T12:00:00Z',
                'images_count': 0,
                'view_count': 0,
              }
            ],
            'meta': {
              'total': 1,
              'total_pages': 1,
            }
          }
        },
        statusCode: 200,
      );

      when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters')))
          .thenAnswer((_) async => mockResponse);

      final result = await repository.getAds();

      expect(result.items.length, 1);
      expect(result.items.first.title, 'Test Ad');
      expect(result.total, 1);
    });

    test('getAdById should return single ad', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'success': true,
          'data': {
            'ad': {
              'id': '1',
              'title': 'Test Ad',
              'description': 'Test Description',
              'price': '100.00',
              'category': {'id': 'cat1', 'name': 'Cat 1', 'slug': 'cat-1'},
              'created_at': '2026-03-02T12:00:00Z',
              'expires_at': '2026-04-02T12:00:00Z',
              'images_count': 0,
              'view_count': 0,
            }
          }
        },
        statusCode: 200,
      );

      when(() => mockDioClient.get(any())).thenAnswer((_) async => mockResponse);

      final ad = await repository.getAdById('1');

      expect(ad.id, '1');
      expect(ad.title, 'Test Ad');
    });

    test('getCategories should return list of categories', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'success': true,
          'data': {
            'categories': [
              {'id': 'cat1', 'name': 'Cat 1', 'slug': 'cat-1'}
            ]
          }
        },
        statusCode: 200,
      );

      when(() => mockDioClient.get(any())).thenAnswer((_) async => mockResponse);

      final categories = await repository.getCategories();

      expect(categories.length, 1);
      expect(categories.first.name, 'Cat 1');
    });

    test('getAdById success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {'data': {'ad': {'id': '1', 'title': 'T', 'price': 100, 'category': {'id': '1'}}}},
        statusCode: 200,
      );
      when(() => mockDioClient.get('/ads/1')).thenAnswer((_) async => mockResponse);
      final result = await repository.getAdById('1');
      expect(result.id, '1');
    });

    test('getCategoryProperties success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {'data': {'category': {'id': '1', 'name': 'C', 'slug': 's'}, 'properties': [{'name': 'p1'}]}},
        statusCode: 200,
      );
      when(() => mockDioClient.get('/ads/categories/1/properties')).thenAnswer((_) async => mockResponse);
      final result = await repository.getCategoryProperties('1');
      expect(result.category.name, 'C');
      expect(result.properties.first['name'], 'p1');
    });

    test('createAd success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {'data': {'ad': {'id': '1', 'title': 'T', 'price': 100, 'category': {'id': '1'}}}},
        statusCode: 200,
      );
      when(() => mockDioClient.post(any(), data: any(named: 'data'))).thenAnswer((_) async => mockResponse);
      final result = await repository.createAd({'title': 'T'});
      expect(result.id, '1');
    });

    test('updateAd success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {'data': {'ad': {'id': '1', 'title': 'T', 'price': 100, 'category': {'id': '1'}}}},
        statusCode: 200,
      );
      when(() => mockDioClient.patch('/ads/1', data: any(named: 'data'))).thenAnswer((_) async => mockResponse);
      final result = await repository.updateAd('1', {'title': 'T'});
      expect(result.id, '1');
    });

    test('deleteAd success', () async {
      final mockResponse = Response(requestOptions: RequestOptions(path: ''), statusCode: 200);
      when(() => mockDioClient.delete('/ads/1')).thenAnswer((_) async => mockResponse);
      await repository.deleteAd('1');
      verify(() => mockDioClient.delete('/ads/1')).called(1);
    });

    test('extendAd success', () async {
      final mockResponse = Response(requestOptions: RequestOptions(path: ''), data: {'data': {'success': true}}, statusCode: 200);
      when(() => mockDioClient.post('/ads/1/extend', data: any(named: 'data'))).thenAnswer((_) async => mockResponse);
      final result = await repository.extendAd('1', 3);
      expect(result['success'], true);
    });

    test('toggleFavorite success adding', () async {
      final mockResponse = Response(requestOptions: RequestOptions(path: ''), statusCode: 200);
      when(() => mockDioClient.post('/ads/1/favorite')).thenAnswer((_) async => mockResponse);
      final result = await repository.toggleFavorite('1', true);
      expect(result, true);
    });

    test('toggleFavorite success removing', () async {
      final mockResponse = Response(requestOptions: RequestOptions(path: ''), statusCode: 200);
      when(() => mockDioClient.delete('/ads/1/favorite')).thenAnswer((_) async => mockResponse);
      final result = await repository.toggleFavorite('1', false);
      expect(result, true);
    });

    test('uploadFile success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {'data': {'file': {'id': 'file123'}}},
        statusCode: 200,
      );
      when(() => mockDioClient.post('/files/upload', data: any(named: 'data'))).thenAnswer((_) async => mockResponse);
      
      final tempFile = File('test_temp_file.txt');
      await tempFile.writeAsString('test');
      
      final result = await repository.uploadFile(tempFile.path);
      expect(result, 'file123');
      
      await tempFile.delete();
    });

    group('Error Handling', () {
      test('should throw TimeoutException on timeout', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.connectionTimeout,
        ));

        expect(() => repository.getAds(), throwsA(isA<TimeoutException>()));
      });

      test('should throw NetworkException on connection error', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.connectionError,
        ));

        expect(() => repository.getAds(), throwsA(isA<NetworkException>()));
      });

      test('should throw ValidationException on 400', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(
            requestOptions: RequestOptions(path: ''),
            statusCode: 400,
            data: {'message': 'Bad Request'},
          ),
          type: DioExceptionType.badResponse,
        ));

        expect(() => repository.getAds(), throwsA(isA<ValidationException>()));
      });

      test('should throw ForbiddenException on 403', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 403),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.getAds(), throwsA(isA<ForbiddenException>()));
      });

      test('should throw UnknownException on 418', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 418, data: {'error': {'message': 'Teapot'}}),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.getAds(), throwsA(predicate((e) => e is UnknownException && e.message == 'Teapot')));
      });

      test('should throw UnauthorizedException on 401', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(
            requestOptions: RequestOptions(path: ''),
            statusCode: 401,
          ),
          type: DioExceptionType.badResponse,
        ));

        expect(() => repository.getAds(), throwsA(isA<UnauthorizedException>()));
      });

      test('should throw NotFoundException on 404', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(
            requestOptions: RequestOptions(path: ''),
            statusCode: 404,
          ),
          type: DioExceptionType.badResponse,
        ));

        expect(() => repository.getAds(), throwsA(isA<NotFoundException>()));
      });

      test('should throw ServerException on 500', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters'), options: any(named: 'options'))).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(
            requestOptions: RequestOptions(path: ''),
            statusCode: 500,
          ),
          type: DioExceptionType.badResponse,
        ));

        expect(() => repository.getAds(), throwsA(isA<ServerException>()));
      });
    });
  });
}
