class IntercitySchedule {
  final String departureTime;

  IntercitySchedule({required this.departureTime});

  factory IntercitySchedule.fromJson(Map<String, dynamic> json) {
    final timeStr = json['departure_time'] as String? ?? '';
    return IntercitySchedule(
      departureTime: timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr,
    );
  }
}

class IntercityRoute {
  final String id;
  final String destination;
  final num price;
  final int durationMinutes;
  final String company;
  final List<IntercitySchedule> schedules;

  IntercityRoute({
    required this.id,
    required this.destination,
    required this.price,
    required this.durationMinutes,
    required this.company,
    required this.schedules,
  });

  factory IntercityRoute.fromJson(Map<String, dynamic> json) {
    return IntercityRoute(
      id: json['id'] as String? ?? '',
      destination: json['destination'] as String? ?? '',
      price: json['price'] as num? ?? 0,
      durationMinutes: json['duration_minutes'] as int? ?? 0,
      company: json['company'] as String? ?? '',
      schedules: (json['schedules'] as List<dynamic>?)
              ?.map((e) => IntercitySchedule.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class IntracityStop {
  final String stopName;
  final int stopOrder;
  final int timeFromStart;

  IntracityStop({
    required this.stopName,
    required this.stopOrder,
    required this.timeFromStart,
  });

  factory IntracityStop.fromJson(Map<String, dynamic> json) {
    return IntracityStop(
      stopName: json['stop_name'] as String? ?? '',
      stopOrder: json['stop_order'] as int? ?? 0,
      timeFromStart: json['time_from_start'] as int? ?? 0,
    );
  }
}

class IntracityRoute {
  final String id;
  final String routeNumber;
  final String routeName;
  final String firstDeparture;
  final String lastDeparture;
  final int frequencyMinutes;
  final List<IntracityStop> stops;

  IntracityRoute({
    required this.id,
    required this.routeNumber,
    required this.routeName,
    required this.firstDeparture,
    required this.lastDeparture,
    required this.frequencyMinutes,
    required this.stops,
  });

  factory IntracityRoute.fromJson(Map<String, dynamic> json) {
    final firstTimeStr = json['first_departure'] as String? ?? '';
    final lastTimeStr = json['last_departure'] as String? ?? '';

    return IntracityRoute(
      id: json['id'] as String? ?? '',
      routeNumber: json['route_number'] as String? ?? '',
      routeName: json['route_name'] as String? ?? '',
      firstDeparture: firstTimeStr.length > 5 ? firstTimeStr.substring(0, 5) : firstTimeStr,
      lastDeparture: lastTimeStr.length > 5 ? lastTimeStr.substring(0, 5) : lastTimeStr,
      frequencyMinutes: json['frequency_minutes'] as int? ?? 0,
      stops: (json['stops'] as List<dynamic>?)
              ?.map((e) => IntracityStop.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
