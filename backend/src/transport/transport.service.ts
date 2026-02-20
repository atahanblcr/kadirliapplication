import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IntercityRoute,
  IntracityRoute,
} from '../database/entities/transport.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(IntercityRoute)
    private readonly intercityRepository: Repository<IntercityRoute>,
    @InjectRepository(IntracityRoute)
    private readonly intracityRepository: Repository<IntracityRoute>,
  ) {}

  // ── ŞEHİR DIŞI HATLAR ─────────────────────────────────────────────────────

  async findIntercity() {
    const routes = await this.intercityRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect(
        'r.schedules',
        'schedules',
        'schedules.is_active = :active',
        { active: true },
      )
      .where('r.is_active = :active', { active: true })
      .orderBy('r.destination', 'ASC')
      .addOrderBy('schedules.departure_time', 'ASC')
      .getMany();

    const result = routes.map((route) => ({
      id: route.id,
      destination: route.destination,
      price: Number(route.price),
      duration_minutes: route.duration_minutes,
      company: route.company,
      schedules: (route.schedules ?? []).map((s) => ({
        departure_time: s.departure_time,
      })),
    }));

    return { routes: result };
  }

  // ── ŞEHİR İÇİ ROTALAR ─────────────────────────────────────────────────────

  async findIntracity() {
    const routes = await this.intracityRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.stops', 'stops')
      .where('r.is_active = :active', { active: true })
      .orderBy('r.route_number', 'ASC')
      .addOrderBy('stops.stop_order', 'ASC')
      .getMany();

    const result = routes.map((route) => ({
      id: route.id,
      route_number: route.route_number,
      route_name: route.route_name,
      first_departure: route.first_departure,
      last_departure: route.last_departure,
      frequency_minutes: route.frequency_minutes,
      stops: (route.stops ?? []).map((s) => ({
        stop_name: s.stop_name,
        stop_order: s.stop_order,
        time_from_start: s.time_from_start,
      })),
    }));

    return { routes: result };
  }
}
