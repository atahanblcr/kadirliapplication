import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/features/transport/data/models/transport_model.dart';

void main() {
  group('Transport Models', () {
    test('IntercityRoute.fromJson parses data correctly', () {
      final json = {
        'id': 'route-1',
        'destination': 'Adana',
        'price': 150,
        'duration_minutes': 90,
        'company': 'Test Turizm',
        'schedules': [
          {'departure_time': '08:00'}
        ]
      };

      final route = IntercityRoute.fromJson(json);

      expect(route.id, 'route-1');
      expect(route.destination, 'Adana');
      expect(route.price, 150);
      expect(route.durationMinutes, 90);
      expect(route.company, 'Test Turizm');
      expect(route.schedules.length, 1);
      expect(route.schedules.first.departureTime, '08:00');
    });

    test('IntracityRoute.fromJson parses data correctly', () {
      final json = {
        'id': 'route-2',
        'route_number': '1',
        'route_name': 'Otogar',
        'first_departure': '06:00',
        'last_departure': '22:00',
        'frequency_minutes': 30,
        'stops': [
          {'stop_name': 'Hastane', 'stop_order': 1, 'time_from_start': 5}
        ]
      };

      final route = IntracityRoute.fromJson(json);

      expect(route.id, 'route-2');
      expect(route.routeNumber, '1');
      expect(route.routeName, 'Otogar');
      expect(route.firstDeparture, '06:00');
      expect(route.lastDeparture, '22:00');
      expect(route.frequencyMinutes, 30);
      expect(route.stops.length, 1);
      expect(route.stops.first.stopName, 'Hastane');
      expect(route.stops.first.stopOrder, 1);
      expect(route.stops.first.timeFromStart, 5);
    });
  });
}
