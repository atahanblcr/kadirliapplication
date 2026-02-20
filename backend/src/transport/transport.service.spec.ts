import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransportService } from './transport.service';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../database/entities/transport.entity';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeQb(data: any[] = []) {
  const qb: any = {};
  const chain = [
    'leftJoinAndSelect',
    'where',
    'andWhere',
    'orderBy',
    'addOrderBy',
  ];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getMany = jest.fn().mockResolvedValue(data);
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeSchedule = (overrides: Partial<IntercitySchedule> = {}): IntercitySchedule =>
  ({
    id: 'schedule-uuid-1',
    departure_time: '06:00',
    is_active: true,
    ...overrides,
  } as IntercitySchedule);

const makeIntercityRoute = (overrides: Partial<IntercityRoute> = {}): IntercityRoute =>
  ({
    id: 'intercity-uuid-1',
    destination: 'Adana',
    price: 150,
    duration_minutes: 90,
    company: 'Metro Turizm',
    is_active: true,
    schedules: [makeSchedule()],
    ...overrides,
  } as IntercityRoute);

const makeStop = (overrides: Partial<IntracityStop> = {}): IntracityStop =>
  ({
    id: 'stop-uuid-1',
    stop_name: 'Otogar',
    stop_order: 1,
    time_from_start: 0,
    ...overrides,
  } as IntracityStop);

const makeIntracityRoute = (overrides: Partial<IntracityRoute> = {}): IntracityRoute =>
  ({
    id: 'intracity-uuid-1',
    route_number: '1',
    route_name: 'Otogar - Hastane - Fakülte',
    first_departure: '06:00',
    last_departure: '22:00',
    frequency_minutes: 30,
    is_active: true,
    stops: [makeStop()],
    ...overrides,
  } as IntracityRoute);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('TransportService', () => {
  let service: TransportService;
  let intercityRepo: any;
  let intracityRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportService,
        { provide: getRepositoryToken(IntercityRoute), useFactory: mockRepo },
        { provide: getRepositoryToken(IntracityRoute), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<TransportService>(TransportService);
    intercityRepo = module.get(getRepositoryToken(IntercityRoute));
    intracityRepo = module.get(getRepositoryToken(IntracityRoute));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findIntercity ──────────────────────────────────────────────────────────

  describe('findIntercity', () => {
    it('aktif şehir dışı hatları döndürmeli', async () => {
      const routes = [makeIntercityRoute()];
      const qb = makeQb(routes);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntercity();

      expect(result.routes).toHaveLength(1);
    });

    it('is_active filtresi uygulanmalı', async () => {
      const qb = makeQb([]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findIntercity();

      expect(qb.where).toHaveBeenCalledWith(
        'r.is_active = :active',
        { active: true },
      );
    });

    it('schedules ilişkisi aktif filtreli yüklenmeli', async () => {
      const qb = makeQb([]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findIntercity();

      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'r.schedules',
        'schedules',
        'schedules.is_active = :active',
        { active: true },
      );
    });

    it('destination ASC sıralanmalı', async () => {
      const qb = makeQb([]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findIntercity();

      expect(qb.orderBy).toHaveBeenCalledWith('r.destination', 'ASC');
    });

    it('schedules departure_time ASC sıralanmalı', async () => {
      const qb = makeQb([]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findIntercity();

      expect(qb.addOrderBy).toHaveBeenCalledWith(
        'schedules.departure_time',
        'ASC',
      );
    });

    it('schedule sadece departure_time alanı dönmeli', async () => {
      const route = makeIntercityRoute({
        schedules: [makeSchedule({ departure_time: '08:30' })],
      });
      const qb = makeQb([route]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntercity();

      expect(result.routes[0].schedules[0]).toEqual({
        departure_time: '08:30',
      });
    });

    it('price Number\'a dönüştürülmeli', async () => {
      const route = makeIntercityRoute({ price: '150.00' as unknown as number });
      const qb = makeQb([route]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntercity();

      expect(typeof result.routes[0].price).toBe('number');
      expect(result.routes[0].price).toBe(150);
    });

    it('schedules null olduğunda boş dizi dönmeli', async () => {
      const route = makeIntercityRoute({ schedules: undefined as any });
      const qb = makeQb([route]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntercity();

      expect(result.routes[0].schedules).toEqual([]);
    });

    it('boş rota listesi döndürmeli', async () => {
      const qb = makeQb([]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntercity();

      expect(result.routes).toEqual([]);
    });

    it('sonuçlarda gerekli alanlar bulunmalı', async () => {
      const route = makeIntercityRoute();
      const qb = makeQb([route]);
      intercityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntercity();

      const r = result.routes[0];
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('destination');
      expect(r).toHaveProperty('price');
      expect(r).toHaveProperty('duration_minutes');
      expect(r).toHaveProperty('company');
      expect(r).toHaveProperty('schedules');
    });
  });

  // ── findIntracity ──────────────────────────────────────────────────────────

  describe('findIntracity', () => {
    it('aktif şehir içi rotaları döndürmeli', async () => {
      const routes = [makeIntracityRoute()];
      const qb = makeQb(routes);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntracity();

      expect(result.routes).toHaveLength(1);
    });

    it('is_active filtresi uygulanmalı', async () => {
      const qb = makeQb([]);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findIntracity();

      expect(qb.where).toHaveBeenCalledWith(
        'r.is_active = :active',
        { active: true },
      );
    });

    it('stops ilişkisi yüklenmeli', async () => {
      const qb = makeQb([]);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findIntracity();

      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('r.stops', 'stops');
    });

    it('route_number ASC sıralanmalı', async () => {
      const qb = makeQb([]);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findIntracity();

      expect(qb.orderBy).toHaveBeenCalledWith('r.route_number', 'ASC');
    });

    it('stops stop_order ASC sıralanmalı', async () => {
      const qb = makeQb([]);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findIntracity();

      expect(qb.addOrderBy).toHaveBeenCalledWith('stops.stop_order', 'ASC');
    });

    it('stop alanları doğru dönmeli', async () => {
      const route = makeIntracityRoute({
        stops: [
          makeStop({ stop_name: 'Otogar', stop_order: 1, time_from_start: 0 }),
          makeStop({ stop_name: 'Çarşı', stop_order: 2, time_from_start: 10 }),
        ],
      });
      const qb = makeQb([route]);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntracity();

      expect(result.routes[0].stops).toEqual([
        { stop_name: 'Otogar', stop_order: 1, time_from_start: 0 },
        { stop_name: 'Çarşı', stop_order: 2, time_from_start: 10 },
      ]);
    });

    it('stops null olduğunda boş dizi dönmeli', async () => {
      const route = makeIntracityRoute({ stops: undefined as any });
      const qb = makeQb([route]);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntracity();

      expect(result.routes[0].stops).toEqual([]);
    });

    it('boş rota listesi döndürmeli', async () => {
      const qb = makeQb([]);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntracity();

      expect(result.routes).toEqual([]);
    });

    it('sonuçlarda gerekli alanlar bulunmalı', async () => {
      const route = makeIntracityRoute();
      const qb = makeQb([route]);
      intracityRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findIntracity();

      const r = result.routes[0];
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('route_number');
      expect(r).toHaveProperty('route_name');
      expect(r).toHaveProperty('first_departure');
      expect(r).toHaveProperty('last_departure');
      expect(r).toHaveProperty('frequency_minutes');
      expect(r).toHaveProperty('stops');
    });
  });
});
