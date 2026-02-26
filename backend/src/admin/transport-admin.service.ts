import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../database/entities/transport.entity';
import { QueryIntercityRoutesDto } from './dto/query-intercity-routes.dto';
import { CreateIntercityRouteDto } from './dto/create-intercity-route.dto';
import { UpdateIntercityRouteDto } from './dto/update-intercity-route.dto';
import { CreateIntercityScheduleDto } from './dto/create-intercity-schedule.dto';
import { UpdateIntercityScheduleDto } from './dto/update-intercity-schedule.dto';
import { QueryIntracityRoutesDto } from './dto/query-intracity-routes.dto';
import { CreateIntracityRouteDto } from './dto/create-intracity-route.dto';
import { UpdateIntracityRouteDto } from './dto/update-intracity-route.dto';
import { CreateIntracityStopDto } from './dto/create-intracity-stop.dto';
import { UpdateIntracityStopDto } from './dto/update-intracity-stop.dto';
import { ReorderStopDto } from './dto/reorder-stop.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class TransportAdminService {
  constructor(
    @InjectRepository(IntercityRoute)
    private readonly intercityRouteRepository: Repository<IntercityRoute>,
    @InjectRepository(IntercitySchedule)
    private readonly intercityScheduleRepository: Repository<IntercitySchedule>,
    @InjectRepository(IntracityRoute)
    private readonly intracityRouteRepository: Repository<IntracityRoute>,
    @InjectRepository(IntracityStop)
    private readonly intracityStopRepository: Repository<IntracityStop>,
  ) {}

  // ── ŞEHIRLERARASI HATLAR ─────────────────────────────────────────────────

  private mapIntercityRoute(r: IntercityRoute) {
    return {
      id: r.id,
      company_name: r.company_name ?? r.company ?? '',
      from_city: r.from_city ?? 'Kadirli',
      to_city: r.destination,
      duration_minutes: r.duration_minutes,
      price: Number(r.price),
      contact_phone: r.contact_phone ?? null,
      contact_website: r.contact_website ?? null,
      amenities: r.amenities ?? [],
      is_active: r.is_active,
      created_at: r.created_at,
      updated_at: r.updated_at,
      schedules: r.schedules?.map((s) => this.mapIntercitySchedule(s)) ?? [],
    };
  }

  private mapIntercitySchedule(s: IntercitySchedule) {
    const daysRaw = s.days_of_week;
    const days = Array.isArray(daysRaw)
      ? daysRaw.map(Number)
      : typeof daysRaw === 'string' && (daysRaw as string).length > 0
        ? (daysRaw as string).split(',').map(Number)
        : [];
    return {
      id: s.id,
      route_id: s.route_id,
      departure_time: s.departure_time,
      days_of_week: days,
      is_active: s.is_active,
      created_at: s.created_at,
    };
  }

  async getAdminIntercityRoutes(dto: QueryIntercityRoutesDto) {
    const { search, company_name, from_city, to_city, is_active, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.intercityRouteRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.schedules', 'schedules')
      .orderBy('r.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(r.company_name ILIKE :search OR r.company ILIKE :search OR r.destination ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (company_name) {
      qb.andWhere(
        '(r.company_name ILIKE :cn OR r.company ILIKE :cn)',
        { cn: `%${company_name}%` },
      );
    }
    if (from_city) {
      qb.andWhere('r.from_city ILIKE :from_city', { from_city: `%${from_city}%` });
    }
    if (to_city) {
      qb.andWhere('r.destination ILIKE :to_city', { to_city: `%${to_city}%` });
    }
    if (is_active !== undefined) {
      qb.andWhere('r.is_active = :is_active', { is_active });
    }

    const [routes, total] = await qb.getManyAndCount();
    const meta = getPaginationMeta(total, page, limit);

    return { routes: routes.map((r) => this.mapIntercityRoute(r)), meta };
  }

  async getAdminIntercityRoute(id: string) {
    const route = await this.intercityRouteRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.schedules', 'schedules')
      .where('r.id = :id', { id })
      .orderBy('schedules.departure_time', 'ASC')
      .getOne();

    if (!route) {
      throw new NotFoundException('Şehirlerarası hat bulunamadı');
    }

    return { route: this.mapIntercityRoute(route) };
  }

  async createIntercityRoute(dto: CreateIntercityRouteDto) {
    const route = this.intercityRouteRepository.create({
      company_name: dto.company_name,
      company: dto.company_name,
      from_city: dto.from_city,
      destination: dto.to_city,
      duration_minutes: dto.duration_minutes,
      price: dto.price,
      contact_phone: dto.contact_phone,
      contact_website: dto.contact_website,
      amenities: dto.amenities ?? [],
      is_active: dto.is_active ?? true,
    });

    const saved = await this.intercityRouteRepository.save(route);
    return this.getAdminIntercityRoute(saved.id);
  }

  async updateIntercityRoute(id: string, dto: UpdateIntercityRouteDto) {
    const route = await this.intercityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehirlerarası hat bulunamadı');

    if (dto.company_name !== undefined) {
      route.company_name = dto.company_name;
      route.company = dto.company_name;
    }
    if (dto.from_city !== undefined) route.from_city = dto.from_city;
    if (dto.to_city !== undefined) route.destination = dto.to_city;
    if (dto.duration_minutes !== undefined) route.duration_minutes = dto.duration_minutes;
    if (dto.price !== undefined) route.price = dto.price;
    if (dto.contact_phone !== undefined) route.contact_phone = dto.contact_phone;
    if (dto.contact_website !== undefined) route.contact_website = dto.contact_website;
    if (dto.amenities !== undefined) route.amenities = dto.amenities;
    if (dto.is_active !== undefined) route.is_active = dto.is_active;

    await this.intercityRouteRepository.save(route);
    return this.getAdminIntercityRoute(id);
  }

  async deleteIntercityRoute(id: string) {
    const route = await this.intercityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehirlerarası hat bulunamadı');
    await this.intercityRouteRepository.remove(route);
  }

  async addIntercitySchedule(routeId: string, dto: CreateIntercityScheduleDto) {
    const route = await this.intercityRouteRepository.findOne({ where: { id: routeId } });
    if (!route) throw new NotFoundException('Şehirlerarası hat bulunamadı');

    const schedule = this.intercityScheduleRepository.create({
      route_id: routeId,
      departure_time: dto.departure_time,
      days_of_week: dto.days_of_week,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.intercityScheduleRepository.save(schedule);
    return { schedule: this.mapIntercitySchedule(saved) };
  }

  async updateIntercitySchedule(scheduleId: string, dto: UpdateIntercityScheduleDto) {
    const schedule = await this.intercityScheduleRepository.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) throw new NotFoundException('Sefer bulunamadı');

    if (dto.departure_time !== undefined) schedule.departure_time = dto.departure_time;
    if (dto.days_of_week !== undefined) schedule.days_of_week = dto.days_of_week;
    if (dto.is_active !== undefined) schedule.is_active = dto.is_active;

    const saved = await this.intercityScheduleRepository.save(schedule);
    return { schedule: this.mapIntercitySchedule(saved) };
  }

  async deleteIntercitySchedule(scheduleId: string) {
    const schedule = await this.intercityScheduleRepository.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) throw new NotFoundException('Sefer bulunamadı');
    await this.intercityScheduleRepository.remove(schedule);
  }

  // ── ŞEHİR İÇİ HATLAR ─────────────────────────────────────────────────────

  private mapIntracityRoute(r: IntracityRoute, stops?: any[]) {
    return {
      id: r.id,
      line_number: r.route_number,
      name: r.route_name,
      color: r.color ?? null,
      first_departure: r.first_departure,
      last_departure: r.last_departure,
      frequency_minutes: r.frequency_minutes,
      fare: r.fare ? Number(r.fare) : 0,
      is_active: r.is_active,
      created_at: r.created_at,
      stops: stops ?? [],
    };
  }

  private mapIntracityStop(s: any) {
    return {
      id: s.id,
      route_id: s.route_id,
      stop_order: s.stop_order,
      name: s.stop_name,
      neighborhood_id: s.neighborhood_id ?? null,
      neighborhood_name: s.neighborhood_name ?? '',
      time_from_start: s.time_from_start ?? 0,
      latitude: s.latitude ? Number(s.latitude) : undefined,
      longitude: s.longitude ? Number(s.longitude) : undefined,
      created_at: s.created_at,
    };
  }

  private async getStopsWithNeighborhood(routeId: string) {
    const raw = await this.intracityStopRepository
      .createQueryBuilder('s')
      .leftJoin('neighborhoods', 'n', 'n.id::text = s.neighborhood_id::text')
      .select([
        's.id as id',
        's.route_id as route_id',
        's.stop_name as stop_name',
        's.stop_order as stop_order',
        's.neighborhood_id as neighborhood_id',
        's.time_from_start as time_from_start',
        's.latitude as latitude',
        's.longitude as longitude',
        's.created_at as created_at',
        'n.name as neighborhood_name',
      ])
      .where('s.route_id = :routeId', { routeId })
      .orderBy('s.stop_order', 'ASC')
      .getRawMany();

    return raw.map((s) => this.mapIntracityStop(s));
  }

  async getAdminIntracityRoutes(dto: QueryIntracityRoutesDto) {
    const { search, line_number, is_active, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.intracityRouteRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.stops', 'stops')
      .orderBy('r.route_number', 'ASC')
      .addOrderBy('stops.stop_order', 'ASC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(r.route_number ILIKE :search OR r.route_name ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (line_number) {
      qb.andWhere('r.route_number ILIKE :ln', { ln: `%${line_number}%` });
    }
    if (is_active !== undefined) {
      qb.andWhere('r.is_active = :is_active', { is_active });
    }

    const [routes, total] = await qb.getManyAndCount();
    const meta = getPaginationMeta(total, page, limit);

    const mapped = routes.map((r) => ({
      ...this.mapIntracityRoute(r),
      stops: (r.stops ?? []).map((s) => ({
        id: s.id,
        route_id: s.route_id,
        stop_order: s.stop_order,
        name: s.stop_name,
        neighborhood_id: s.neighborhood_id ?? null,
        neighborhood_name: '',
        time_from_start: s.time_from_start ?? 0,
        latitude: s.latitude ? Number(s.latitude) : undefined,
        longitude: s.longitude ? Number(s.longitude) : undefined,
        created_at: s.created_at,
      })),
    }));

    return { routes: mapped, meta };
  }

  async getAdminIntracityRoute(id: string) {
    const route = await this.intracityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehir içi hat bulunamadı');

    const stops = await this.getStopsWithNeighborhood(id);
    return { route: this.mapIntracityRoute(route, stops) };
  }

  async createIntracityRoute(dto: CreateIntracityRouteDto) {
    const route = this.intracityRouteRepository.create({
      route_number: dto.line_number,
      route_name: dto.name,
      color: dto.color,
      first_departure: dto.first_departure,
      last_departure: dto.last_departure,
      frequency_minutes: dto.frequency_minutes,
      fare: dto.fare,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.intracityRouteRepository.save(route);
    return this.getAdminIntracityRoute(saved.id);
  }

  async updateIntracityRoute(id: string, dto: UpdateIntracityRouteDto) {
    const route = await this.intracityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehir içi hat bulunamadı');

    if (dto.line_number !== undefined) route.route_number = dto.line_number;
    if (dto.name !== undefined) route.route_name = dto.name;
    if (dto.color !== undefined) route.color = dto.color;
    if (dto.first_departure !== undefined) route.first_departure = dto.first_departure;
    if (dto.last_departure !== undefined) route.last_departure = dto.last_departure;
    if (dto.frequency_minutes !== undefined) route.frequency_minutes = dto.frequency_minutes;
    if (dto.fare !== undefined) route.fare = dto.fare;
    if (dto.is_active !== undefined) route.is_active = dto.is_active;

    await this.intracityRouteRepository.save(route);
    return this.getAdminIntracityRoute(id);
  }

  async deleteIntracityRoute(id: string) {
    const route = await this.intracityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehir içi hat bulunamadı');
    await this.intracityRouteRepository.remove(route);
  }

  async addIntracityStop(routeId: string, dto: CreateIntracityStopDto) {
    const route = await this.intracityRouteRepository.findOne({ where: { id: routeId } });
    if (!route) throw new NotFoundException('Şehir içi hat bulunamadı');

    const maxOrderResult = await this.intracityStopRepository
      .createQueryBuilder('s')
      .select('MAX(s.stop_order)', 'max')
      .where('s.route_id = :routeId', { routeId })
      .getRawOne();

    const nextOrder = (maxOrderResult?.max ?? 0) + 1;

    const stop = this.intracityStopRepository.create({
      route_id: routeId,
      stop_name: dto.name,
      stop_order: nextOrder,
      neighborhood_id: dto.neighborhood_id,
      time_from_start: dto.time_from_start,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });

    const saved = await this.intracityStopRepository.save(stop);

    const stops = await this.getStopsWithNeighborhood(routeId);
    const mappedStop = stops.find((s) => s.id === saved.id);
    return { stop: mappedStop };
  }

  async updateIntracityStop(stopId: string, dto: UpdateIntracityStopDto) {
    const stop = await this.intracityStopRepository.findOne({ where: { id: stopId } });
    if (!stop) throw new NotFoundException('Durak bulunamadı');

    if (dto.name !== undefined) stop.stop_name = dto.name;
    if (dto.neighborhood_id !== undefined) stop.neighborhood_id = dto.neighborhood_id;
    if (dto.time_from_start !== undefined) stop.time_from_start = dto.time_from_start;
    if (dto.latitude !== undefined) stop.latitude = dto.latitude;
    if (dto.longitude !== undefined) stop.longitude = dto.longitude;

    await this.intracityStopRepository.save(stop);

    const stops = await this.getStopsWithNeighborhood(stop.route_id);
    const mappedStop = stops.find((s) => s.id === stopId);
    return { stop: mappedStop };
  }

  async deleteIntracityStop(stopId: string) {
    const stop = await this.intracityStopRepository.findOne({ where: { id: stopId } });
    if (!stop) throw new NotFoundException('Durak bulunamadı');

    const routeId = stop.route_id;
    const deletedOrder = stop.stop_order;

    await this.intracityStopRepository.remove(stop);

    await this.intracityStopRepository
      .createQueryBuilder()
      .update(IntracityStop)
      .set({ stop_order: () => 'stop_order - 1' })
      .where('route_id = :routeId AND stop_order > :deletedOrder', {
        routeId,
        deletedOrder,
      })
      .execute();
  }

  async reorderIntracityStop(stopId: string, dto: ReorderStopDto) {
    const stop = await this.intracityStopRepository.findOne({ where: { id: stopId } });
    if (!stop) throw new NotFoundException('Durak bulunamadı');

    const { new_order } = dto;
    const old_order = stop.stop_order;
    const routeId = stop.route_id;

    if (old_order === new_order) {
      return { stop: this.mapIntracityStop(stop) };
    }

    if (new_order > old_order) {
      await this.intracityStopRepository
        .createQueryBuilder()
        .update(IntracityStop)
        .set({ stop_order: () => 'stop_order - 1' })
        .where('route_id = :routeId AND stop_order > :old AND stop_order <= :new', {
          routeId,
          old: old_order,
          new: new_order,
        })
        .execute();
    } else {
      await this.intracityStopRepository
        .createQueryBuilder()
        .update(IntracityStop)
        .set({ stop_order: () => 'stop_order + 1' })
        .where('route_id = :routeId AND stop_order >= :new AND stop_order < :old', {
          routeId,
          new: new_order,
          old: old_order,
        })
        .execute();
    }

    stop.stop_order = new_order;
    await this.intracityStopRepository.save(stop);

    const stops = await this.getStopsWithNeighborhood(routeId);
    const mappedStop = stops.find((s) => s.id === stopId);
    return { stop: mappedStop };
  }
}
