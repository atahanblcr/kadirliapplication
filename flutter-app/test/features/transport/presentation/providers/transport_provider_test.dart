import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kadirliapp/features/transport/data/models/transport_model.dart';
import 'package:kadirliapp/features/transport/data/repositories/transport_repository.dart';
import 'package:kadirliapp/features/transport/presentation/providers/transport_provider.dart';

class MockTransportRepository extends TransportRepository {
  @override
  Future<List<IntercityRoute>> getIntercityRoutes() async {
    return [
      IntercityRoute(
        id: '1',
        destination: 'Adana',
        price: 150,
        durationMinutes: 90,
        company: 'Test',
        schedules: [],
      )
    ];
  }

  @override
  Future<List<IntracityRoute>> getIntracityRoutes() async {
    return [
      IntracityRoute(
        id: '2',
        routeNumber: '1',
        routeName: 'Test Route',
        firstDeparture: '08:00',
        lastDeparture: '17:00',
        frequencyMinutes: 30,
        stops: [],
      )
    ];
  }
}

void main() {
  test('intercityRoutesProvider fetches routes successfully', () async {
    final container = ProviderContainer(
      overrides: [
        transportRepositoryProvider.overrideWithValue(MockTransportRepository()),
      ],
    );
    addTearDown(container.dispose);

    final routesAsync = container.read(intercityRoutesProvider);
    expect(routesAsync, const AsyncValue<List<IntercityRoute>>.loading());

    final routes = await container.read(intercityRoutesProvider.future);
    expect(routes.length, 1);
    expect(routes.first.destination, 'Adana');
  });

  test('intracityRoutesProvider fetches routes successfully', () async {
    final container = ProviderContainer(
      overrides: [
        transportRepositoryProvider.overrideWithValue(MockTransportRepository()),
      ],
    );
    addTearDown(container.dispose);

    final routesAsync = container.read(intracityRoutesProvider);
    expect(routesAsync, const AsyncValue<List<IntracityRoute>>.loading());

    final routes = await container.read(intracityRoutesProvider.future);
    expect(routes.length, 1);
    expect(routes.first.routeName, 'Test Route');
  });
}
