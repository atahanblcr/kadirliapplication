import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeCategory = () => ({
  id: 'cat-uuid-1',
  name: 'Müzik / Konser',
  slug: 'muzik-konser',
  icon: 'music_note',
  events_count: 5,
});

const makeEvent = (overrides: Partial<Event> = {}): Event =>
  ({
    id: 'event-uuid-1',
    title: 'Kadirli Yazlık Sinema Gecesi',
    event_date: '2026-02-25',
    event_time: '20:00',
    status: 'published',
    ...overrides,
  } as Event);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('EventsController', () => {
  let controller: EventsController;
  let service: jest.Mocked<EventsService>;

  beforeEach(async () => {
    const mockService = {
      findCategories: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockService }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get(EventsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /events/categories ────────────────────────────────────────────────

  describe('getCategories', () => {
    it('kategori listesini döndürmeli', async () => {
      const expected = { categories: [makeCategory()] };
      service.findCategories.mockResolvedValue(expected);

      const result = await controller.getCategories();

      expect(result).toEqual(expected);
      expect(service.findCategories).toHaveBeenCalledTimes(1);
    });

    it('boş kategori listesi döndürmeli', async () => {
      service.findCategories.mockResolvedValue({ categories: [] });

      const result = await controller.getCategories();

      expect(result.categories).toEqual([]);
    });
  });

  // ── GET /events ───────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('etkinlik listesini döndürmeli', async () => {
      const events = [makeEvent()];
      const expected = {
        events,
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };
      service.findAll.mockResolvedValue(expected);

      const result = await controller.findAll({ page: 1, limit: 20 });

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });

    it('filtreleri service\'e iletmeli', async () => {
      service.findAll.mockResolvedValue({ events: [], meta: {} as any });
      const dto = {
        category_id: 'cat-uuid-1',
        city: 'Kadirli',
        is_free: true,
        start_date: '2026-02-01',
        end_date: '2026-02-28',
      };

      await controller.findAll(dto);

      expect(service.findAll).toHaveBeenCalledWith(dto);
    });

    it('boş liste döndürmeli', async () => {
      service.findAll.mockResolvedValue({
        events: [],
        meta: { total: 0 } as any,
      });

      const result = await controller.findAll({});

      expect(result.events).toEqual([]);
    });
  });

  // ── GET /events/:id ───────────────────────────────────────────────────────

  describe('findOne', () => {
    it('etkinlik detayını döndürmeli', async () => {
      const event = makeEvent();
      const expected = { event };
      service.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('event-uuid-1');

      expect(result).toEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith('event-uuid-1');
    });

    it('service hatası controller üzerinden yayılmalı', async () => {
      service.findOne.mockRejectedValue(new Error('Etkinlik bulunamadı'));

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        'Etkinlik bulunamadı',
      );
    });
  });
});
