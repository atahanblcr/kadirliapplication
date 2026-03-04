import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:kadirliapp/core/exceptions/app_exception.dart';
import 'package:kadirliapp/features/announcements/data/repositories/announcements_repository.dart';
import '../../../../helpers/mock_dio.dart';

void main() {
  late AnnouncementsRepository repository;
  late MockDioClient mockDioClient;

  setUp(() {
    mockDioClient = MockDioClient();
    repository = AnnouncementsRepository(client: mockDioClient);
    setupDioMocks();
  });

  group('AnnouncementsRepository', () {
    test('getAnnouncements success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'data': {
            'announcements': [
              {
                'id': '1',
                'title': 'Test Announcement',
                'content': 'Test Content',
                'created_at': '2026-03-01T10:00:00Z',
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

      final result = await repository.getAnnouncements();

      expect(result.items.length, 1);
      expect(result.items.first.title, 'Test Announcement');
      expect(result.total, 1);
    });

    test('getAnnouncementById success', () async {
      final mockResponse = Response(
        requestOptions: RequestOptions(path: ''),
        data: {
          'data': {
            'announcement': {
              'id': '1',
              'title': 'Test Announcement',
              'content': 'Test Content',
              'created_at': '2026-03-01T10:00:00Z',
            }
          }
        },
        statusCode: 200,
      );

      when(() => mockDioClient.get(any())).thenAnswer((_) async => mockResponse);

      final result = await repository.getAnnouncementById('1');

      expect(result.id, '1');
      expect(result.title, 'Test Announcement');
    });

    group('Error Handling', () {
      test('getAnnouncements should throw UnknownException on parse error', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters')))
            .thenAnswer((_) async => Response(requestOptions: RequestOptions(path: ''), data: {'data': 'invalid'}));
        expect(() => repository.getAnnouncements(), throwsA(isA<UnknownException>()));
      });

      test('getAnnouncements should throw ServerException on 500', () async {
        when(() => mockDioClient.get(any(), queryParameters: any(named: 'queryParameters')))
            .thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 500),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.getAnnouncements(), throwsA(isA<ServerException>()));
      });

      test('getAnnouncementById should throw NotFoundException on 404', () async {
        when(() => mockDioClient.get(any())).thenThrow(DioException(
          requestOptions: RequestOptions(path: ''),
          response: Response(requestOptions: RequestOptions(path: ''), statusCode: 404),
          type: DioExceptionType.badResponse,
        ));
        expect(() => repository.getAnnouncementById('1'), throwsA(isA<NotFoundException>()));
      });
    });
  });
}
