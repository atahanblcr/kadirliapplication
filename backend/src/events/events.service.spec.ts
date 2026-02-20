import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventImage } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeListQb(data: any[] = [], total = 0) {
  const qb: any = {};
  const chain = [
    'leftJoinAndSelect', 'where', 'andWhere',
    'orderBy', 'addOrderBy', 'skip', 'take',
  ];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getManyAndCount = jest.fn().mockResolvedValue([data, total]);
  return qb;
}

function makeCountQb(rawData: any[] = []) {
  const qb: any = {};
  const chain = ['select', 'addSelect', 'where', 'andWhere', 'groupBy'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getRawMany = jest.fn().mockResolvedValue(rawData);
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeCategory = (overrides: Partial<EventCategory> = {}): EventCategory =>
  ({
    id: 'cat-uuid-1',
    name: 'Müzik / Konser',
    slug: 'muzik-konser',
    icon: 'music_note',
    display_order: 1,
    is_active: true,
    ...overrides,
  } as EventCategory);

const makeEvent = (overrides: Partial<Event> = {}): Event =>
  ({
    id: 'event-uuid-1',
    title: 'Kadirli Yazlık Sinema Gecesi',
    description: 'Açık havada sinema keyfi...',
    category_id: 'cat-uuid-1',
    category: makeCategory(),
    event_date: '2026-02-25',
    event_time: '20:00',
    duration_minutes: 120,
    venue_name: 'Öğretmenevi Bahçesi',
    city: 'Kadirli',
    is_free: true,
    status: 'published',
    created_at: new Date('2026-02-10'),
    ...overrides,
  } as Event);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('EventsService', () => {
  let service: EventsService;
  let eventRepo: any;
  let categoryRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getRepositoryToken(Event), useFactory: mockRepo },
        { provide: getRepositoryToken(EventCategory), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepo = module.get(getRepositoryToken(Event));
    categoryRepo = module.get(getRepositoryToken(EventCategory));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findCategories ────────────────────────────────────────────────────────

  describe('findCategories', () => {
    it('aktif kategorileri events_count ile döndürmeli', async () => {
      const categories = [makeCategory()];
      categoryRepo.find.mockResolvedValue(categories);
      const countQb = makeCountQb([{ category_id: 'cat-uuid-1', count: '5' }]);
      eventRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].events_count).toBe(5);
    });

    it('etkinliği olmayan kategori için events_count=0 dönmeli', async () => {
      const categories = [makeCategory()];
      categoryRepo.find.mockResolvedValue(categories);
      const countQb = makeCountQb([]); // eşleşen kayıt yok
      eventRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories[0].events_count).toBe(0);
    });

    it('kategoriler display_order ASC sıralı çekilmeli', async () => {
      categoryRepo.find.mockResolvedValue([]);
      const countQb = makeCountQb([]);
      eventRepo.createQueryBuilder.mockReturnValue(countQb);

      await service.findCategories();

      expect(categoryRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { display_order: 'ASC' },
      });
    });

    it('count sorgusunda sadece published etkinlikler sayılmalı', async () => {
      categoryRepo.find.mockResolvedValue([]);
      const countQb = makeCountQb([]);
      eventRepo.createQueryBuilder.mockReturnValue(countQb);

      await service.findCategories();

      expect(countQb.where).toHaveBeenCalledWith(
        'e.status = :status',
        { status: 'published' },
      );
      expect(countQb.andWhere).toHaveBeenCalledWith('e.deleted_at IS NULL');
    });

    it('kategorilerde id, name, slug, icon alanları bulunmalı', async () => {
      const categories = [makeCategory()];
      categoryRepo.find.mockResolvedValue(categories);
      const countQb = makeCountQb([]);
      eventRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories[0]).toMatchObject({
        id: 'cat-uuid-1',
        name: 'Müzik / Konser',
        slug: 'muzik-konser',
        icon: 'music_note',
      });
    });

    it('birden fazla kategori ve farklı sayıları doğru eşleştirmeli', async () => {
      const categories = [
        makeCategory({ id: 'cat-1' }),
        makeCategory({ id: 'cat-2', name: 'Spor' }),
      ];
      categoryRepo.find.mockResolvedValue(categories);
      const countQb = makeCountQb([
        { category_id: 'cat-1', count: '3' },
        { category_id: 'cat-2', count: '7' },
      ]);
      eventRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories[0].events_count).toBe(3);
      expect(result.categories[1].events_count).toBe(7);
    });
  });

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('yayınlanmış ve gelecekteki etkinlikleri döndürmeli', async () => {
      const events = [makeEvent()];
      const qb = makeListQb(events, 1);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.events).toEqual(events);
      expect(result.meta.total).toBe(1);
    });

    it('status=published filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.where).toHaveBeenCalledWith(
        'e.status = :status',
        { status: 'published' },
      );
    });

    it('event_date >= TODAY filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      const today = new Date().toISOString().slice(0, 10);
      expect(qb.andWhere).toHaveBeenCalledWith(
        'e.event_date >= :today',
        { today },
      );
    });

    it('deleted_at IS NULL filtresi uygulanmalı (soft delete)', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.andWhere).toHaveBeenCalledWith('e.deleted_at IS NULL');
    });

    it('category_id filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ category_id: 'cat-uuid-1' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'e.category_id = :category_id',
        { category_id: 'cat-uuid-1' },
      );
    });

    it('city filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ city: 'Kadirli' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'e.city = :city',
        { city: 'Kadirli' },
      );
    });

    it('start_date filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ start_date: '2026-02-01' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'e.event_date >= :start_date',
        { start_date: '2026-02-01' },
      );
    });

    it('end_date filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ end_date: '2026-02-28' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'e.event_date <= :end_date',
        { end_date: '2026-02-28' },
      );
    });

    it('is_free=true filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ is_free: true });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'e.is_free = :is_free',
        { is_free: true },
      );
    });

    it('is_free tanımlı değilse filtre uygulanmamalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      const calls = (qb.andWhere as jest.Mock).mock.calls.map((c: any) => c[0]);
      expect(calls).not.toContain(expect.stringContaining('is_free'));
    });

    it('opsiyonel filtreler verilmediğinde andWhere çağrı sayısı doğru olmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      // Sadece: event_date >= TODAY, deleted_at IS NULL (+ where ile status)
      const andWhereCalls = (qb.andWhere as jest.Mock).mock.calls;
      expect(andWhereCalls).toHaveLength(2);
    });

    it('event_date ve event_time ASC sıralanmalı', async () => {
      const qb = makeListQb([], 0);
      eventRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.orderBy).toHaveBeenCalledWith('e.event_date', 'ASC');
      expect(qb.addOrderBy).toHaveBeenCalledWith('e.event_time', 'ASC');
    });
  });

  // ── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('etkinlik detayını döndürmeli', async () => {
      const event = makeEvent();
      eventRepo.findOne.mockResolvedValue(event);

      const result = await service.findOne('event-uuid-1');

      expect(result.event).toBe(event);
      expect(eventRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'event-uuid-1', status: 'published' },
        relations: ['category', 'cover_image', 'images', 'images.file'],
      });
    });

    it('etkinlik bulunamazsa NotFoundException fırlatmalı', async () => {
      eventRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('draft/cancelled etkinlik bulunamazsa NotFoundException fırlatmalı', async () => {
      eventRepo.findOne.mockResolvedValue(null); // status koşulu karşılanmıyor

      await expect(service.findOne('draft-event-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('images ilişkisi yüklenmiş olmalı', async () => {
      const event = makeEvent({ images: [] as EventImage[] });
      eventRepo.findOne.mockResolvedValue(event);

      const result = await service.findOne('event-uuid-1');

      expect(result.event.images).toBeDefined();
    });
  });
});
