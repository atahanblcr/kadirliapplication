import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventAdminService } from './event-admin.service';
import { Event } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EventAdminService', () => {
  let service: EventAdminService;
  let eventRepository: any;
  let categoryRepository: any;

  beforeEach(async () => {
    eventRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
    };

    categoryRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventAdminService,
        { provide: getRepositoryToken(Event), useValue: eventRepository },
        { provide: getRepositoryToken(EventCategory), useValue: categoryRepository },
      ],
    }).compile();

    service = module.get<EventAdminService>(EventAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================================================
  // getEventCategories Tests
  // ============================================================================
  describe('getEventCategories', () => {
    it('should return event categories sorted', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Concert', slug: 'concert', icon: '🎵', display_order: 1, is_active: true },
        { id: 'cat-2', name: 'Theater', slug: 'theater', icon: '🎭', display_order: 2, is_active: true },
      ];

      categoryRepository.find.mockResolvedValueOnce(mockCategories);

      const result = await service.getEventCategories();

      expect(result.categories).toHaveLength(2);
      expect(categoryRepository.find).toHaveBeenCalledWith({
        order: { display_order: 'ASC', name: 'ASC' },
      });
    });

    it('should return empty array when no categories exist', async () => {
      categoryRepository.find.mockResolvedValueOnce([]);

      const result = await service.getEventCategories();

      expect(result.categories).toEqual([]);
    });
  });

  // ============================================================================
  // createEventCategory Tests
  // ============================================================================
  describe('createEventCategory', () => {
    it('should create event category with unique slug', async () => {
      const dto = { name: 'Concert Night', icon: '🎵', display_order: 1, is_active: true };

      categoryRepository.findOne.mockResolvedValueOnce(null); // No duplicate
      categoryRepository.create.mockReturnValueOnce(dto);
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-1', ...dto, slug: 'concert-night' });

      const result = await service.createEventCategory(dto as any);

      expect(result.category.id).toBe('cat-1');
      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should handle Turkish characters in slug', async () => {
      const dto = { name: 'Müzik Festivali Şarkısı', icon: '🎶', display_order: 0, is_active: true };

      categoryRepository.findOne.mockResolvedValueOnce(null);
      categoryRepository.create.mockReturnValueOnce(dto);
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-1', ...dto, slug: 'muzik-festivali-sarkisi' });

      const result = await service.createEventCategory(dto as any);

      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should append counter when slug already exists', async () => {
      const dto = { name: 'Sports', icon: '⚽', display_order: 1, is_active: true };

      categoryRepository.findOne
        .mockResolvedValueOnce({ id: 'cat-1', slug: 'sports' }) // sports exists
        .mockResolvedValueOnce(null); // sports-1 is unique

      categoryRepository.create.mockReturnValueOnce(dto);
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-2', ...dto, slug: 'sports-1' });

      const result = await service.createEventCategory(dto as any);

      expect(result.category.slug).toBe('sports-1');
    });

    it('should set default display_order to 0 when not provided', async () => {
      const dto = { name: 'Test' };

      categoryRepository.findOne.mockResolvedValueOnce(null);
      categoryRepository.create.mockReturnValueOnce({ ...dto, display_order: 0 });
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-1', ...dto, display_order: 0, slug: 'test' });

      await service.createEventCategory(dto as any);

      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should set default is_active to true when not provided', async () => {
      const dto = { name: 'Test' };

      categoryRepository.findOne.mockResolvedValueOnce(null);
      categoryRepository.create.mockReturnValueOnce({ ...dto, is_active: true });
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-1', ...dto, is_active: true, slug: 'test' });

      await service.createEventCategory(dto as any);

      expect(categoryRepository.save).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // getAdminEvents Tests
  // ============================================================================
  describe('getAdminEvents', () => {
    it('should return events with pagination', async () => {
      const mockEvents = [
        {
          id: 'event-1',
          title: 'Concert',
          category: { id: 'cat-1', name: 'Music', icon: '🎵' },
          cover_image: null,
          event_date: new Date('2026-03-01'),
          event_time: '19:00',
          is_local: true,
          is_free: false,
          status: 'published',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      eventRepository.getManyAndCount.mockResolvedValueOnce([mockEvents, 10]);

      const result = await service.getAdminEvents({ page: 1, limit: 20 });

      expect(result.events).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.total).toBe(10);
      expect(eventRepository.orderBy).toHaveBeenCalledWith('e.event_date', 'ASC');
      expect(eventRepository.addOrderBy).toHaveBeenCalledWith('e.event_time', 'ASC');
    });

    it('should apply search filter', async () => {
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({ search: 'Türk Sanat', page: 1, limit: 20 });

      expect(eventRepository.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.objectContaining({ search: '%Türk Sanat%' }),
      );
    });

    it('should apply category_id filter', async () => {
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({ category_id: 'cat-1', page: 1, limit: 20 });

      expect(eventRepository.andWhere).toHaveBeenCalledWith('e.category_id = :category_id', { category_id: 'cat-1' });
    });

    it('should apply start_date filter', async () => {
      const date = new Date('2026-03-01');
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({ start_date: date, page: 1, limit: 20 });

      expect(eventRepository.andWhere).toHaveBeenCalledWith('e.event_date >= :start_date', { start_date: date });
    });

    it('should apply end_date filter', async () => {
      const date = new Date('2026-03-31');
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({ end_date: date, page: 1, limit: 20 });

      expect(eventRepository.andWhere).toHaveBeenCalledWith('e.event_date <= :end_date', { end_date: date });
    });

    it('should apply status filter', async () => {
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({ status: 'draft', page: 1, limit: 20 });

      expect(eventRepository.andWhere).toHaveBeenCalledWith('e.status = :status', { status: 'draft' });
    });

    it('should apply is_local=true filter', async () => {
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({ is_local: true, page: 1, limit: 20 });

      expect(eventRepository.andWhere).toHaveBeenCalledWith('e.is_local = TRUE');
    });

    it('should apply is_local=false filter', async () => {
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({ is_local: false, page: 1, limit: 20 });

      expect(eventRepository.andWhere).toHaveBeenCalledWith('e.is_local = FALSE');
    });

    it('should skip is_local filter when undefined', async () => {
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({ page: 1, limit: 20 });

      const calls = eventRepository.andWhere.mock.calls;
      const hasIsLocalFilter = calls.some((call) => call[0]?.includes('is_local'));
      expect(hasIsLocalFilter).toBe(false);
    });

    it('should apply multiple filters together', async () => {
      eventRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminEvents({
        search: 'Music',
        category_id: 'cat-1',
        status: 'published',
        is_local: true,
        page: 2,
        limit: 50,
      });

      expect(eventRepository.andWhere).toHaveBeenCalledTimes(4);
      expect(eventRepository.skip).toHaveBeenCalledWith(50); // (2-1)*50
      expect(eventRepository.take).toHaveBeenCalledWith(50);
    });
  });

  // ============================================================================
  // getAdminEvent Tests
  // ============================================================================
  describe('getAdminEvent', () => {
    it('should return event detail with all relations', async () => {
      const mockEvent = {
        id: 'event-1',
        title: 'Istanbul Music Festival',
        description: 'Annual music festival',
        category_id: 'cat-1',
        category: { id: 'cat-1', name: 'Music', icon: '🎵' },
        event_date: new Date('2026-03-15'),
        event_time: '19:00',
        duration_minutes: 180,
        venue_name: 'Harbiye Open Air',
        venue_address: 'Istanbul',
        is_local: true,
        city: 'Istanbul',
        latitude: 41.05,
        longitude: 29.01,
        organizer: 'Istanbul Municipality',
        ticket_price: 150,
        is_free: false,
        age_restriction: '18+',
        capacity: 5000,
        website_url: 'https://example.com',
        ticket_url: 'https://tickets.example.com',
        cover_image_id: 'file-1',
        cover_image: { url: 'https://cdn.example.com/cover.jpg' },
        images: [{ id: 'img-1', file_id: 'file-1', file: { url: 'https://cdn.example.com/img1.jpg' }, display_order: 1 }],
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      };

      eventRepository.findOne.mockResolvedValueOnce(mockEvent);

      const result = await service.getAdminEvent('event-1');

      expect(result.event.id).toBe('event-1');
      expect(result.event.title).toBe('Istanbul Music Festival');
      expect(result.event.category).not.toBeNull();
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'event-1' },
        relations: ['category', 'cover_image', 'images', 'images.file'],
      });
    });

    it('should throw NotFoundException when event not found', async () => {
      eventRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.getAdminEvent('invalid')).rejects.toThrow(
        new NotFoundException('Etkinlik bulunamadı'),
      );
    });
  });

  // ============================================================================
  // createEvent Tests
  // ============================================================================
  describe('createEvent', () => {
    it('should create event with all optional fields', async () => {
      const dto = {
        title: 'Concert',
        description: 'Music concert',
        category_id: 'cat-1',
        event_date: new Date('2026-03-20'),
        event_time: '20:00',
        duration_minutes: 120,
        venue_name: 'Arena',
        venue_address: 'Center',
        is_local: true,
        city: 'Istanbul',
        latitude: 41.0,
        longitude: 29.0,
        organizer: 'Company',
        ticket_price: 100,
        is_free: false,
        age_restriction: '16+',
        capacity: 10000,
        website_url: 'https://example.com',
        ticket_url: 'https://tickets.example.com',
        cover_image_id: 'file-1',
        status: 'draft',
      };

      categoryRepository.findOne.mockResolvedValueOnce({ id: 'cat-1', name: 'Music' });
      eventRepository.create.mockReturnValueOnce(dto);
      eventRepository.save.mockResolvedValueOnce({ id: 'event-1', ...dto });
      eventRepository.findOne.mockResolvedValueOnce({
        id: 'event-1',
        ...dto,
        category: { id: 'cat-1', name: 'Music', icon: null },
        cover_image: null,
        images: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.createEvent(dto as any, 'user-1');

      expect(result.event.id).toBe('event-1');
      expect(result.event.title).toBe('Concert');
    });

    it('should throw BadRequestException when category not found', async () => {
      const dto = { category_id: 'invalid', title: 'Test', event_date: new Date(), event_time: '19:00' };

      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.createEvent(dto as any, 'user-1')).rejects.toThrow(
        new BadRequestException('Geçersiz kategori'),
      );
    });

    it('should set default is_local=true when not provided', async () => {
      const dto = { title: 'Local Event', event_date: new Date(), event_time: '19:00' };

      eventRepository.create.mockReturnValueOnce({ ...dto, is_local: true });
      eventRepository.save.mockResolvedValueOnce({ id: 'event-1', ...dto });
      eventRepository.findOne.mockResolvedValueOnce({
        id: 'event-1',
        ...dto,
        is_local: true,
        is_free: true,
        category: null,
        cover_image: null,
        images: [],
        category_id: null,
        status: 'published',
        description: null,
        duration_minutes: null,
        venue_name: null,
        venue_address: null,
        city: null,
        latitude: null,
        longitude: null,
        organizer: null,
        ticket_price: null,
        age_restriction: null,
        capacity: null,
        website_url: null,
        ticket_url: null,
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.createEvent(dto as any, 'user-1');

      expect(eventRepository.save).toHaveBeenCalled();
    });

    it('should set default is_free=true when not provided', async () => {
      const dto = { title: 'Free Event', event_date: new Date(), event_time: '19:00' };

      eventRepository.create.mockReturnValueOnce({ ...dto, is_free: true });
      eventRepository.save.mockResolvedValueOnce({ id: 'event-1', ...dto });
      eventRepository.findOne.mockResolvedValueOnce({
        id: 'event-1',
        ...dto,
        is_free: true,
        is_local: true,
        category: null,
        cover_image: null,
        images: [],
        category_id: null,
        status: 'published',
        description: null,
        duration_minutes: null,
        venue_name: null,
        venue_address: null,
        city: null,
        latitude: null,
        longitude: null,
        organizer: null,
        ticket_price: null,
        age_restriction: null,
        capacity: null,
        website_url: null,
        ticket_url: null,
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.createEvent(dto as any, 'user-1');

      expect(eventRepository.save).toHaveBeenCalled();
    });

    it('should set default status=published when not provided', async () => {
      const dto = { title: 'Published Event', event_date: new Date(), event_time: '19:00' };

      eventRepository.create.mockReturnValueOnce({ ...dto, status: 'published' });
      eventRepository.save.mockResolvedValueOnce({ id: 'event-1', ...dto });
      eventRepository.findOne.mockResolvedValueOnce({
        id: 'event-1',
        ...dto,
        status: 'published',
        is_local: true,
        is_free: true,
        category: null,
        cover_image: null,
        images: [],
        category_id: null,
        description: null,
        duration_minutes: null,
        venue_name: null,
        venue_address: null,
        city: null,
        latitude: null,
        longitude: null,
        organizer: null,
        ticket_price: null,
        age_restriction: null,
        capacity: null,
        website_url: null,
        ticket_url: null,
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.createEvent(dto as any, 'user-1');

      expect(eventRepository.save).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // updateEvent Tests
  // ============================================================================
  describe('updateEvent', () => {
    it('should update event with partial fields', async () => {
      const event = { id: 'event-1', title: 'Old Title', status: 'draft' };
      const dto = { title: 'New Title', status: 'published' };

      eventRepository.findOne.mockResolvedValueOnce(event).mockResolvedValueOnce({
        id: 'event-1',
        title: 'New Title',
        status: 'published',
        category: null,
        cover_image: null,
        images: [],
        category_id: null,
        description: null,
        event_date: new Date(),
        event_time: '19:00',
        duration_minutes: null,
        venue_name: null,
        venue_address: null,
        is_local: true,
        city: null,
        latitude: null,
        longitude: null,
        organizer: null,
        ticket_price: null,
        is_free: true,
        age_restriction: null,
        capacity: null,
        website_url: null,
        ticket_url: null,
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.updateEvent('event-1', dto);

      expect(eventRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when event not found', async () => {
      eventRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.updateEvent('invalid', {})).rejects.toThrow(
        new NotFoundException('Etkinlik bulunamadı'),
      );
    });

    it('should validate category_id when provided', async () => {
      const event = { id: 'event-1', category_id: 'cat-1' };

      eventRepository.findOne.mockResolvedValueOnce(event);
      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.updateEvent('event-1', { category_id: 'invalid' })).rejects.toThrow(
        new BadRequestException('Geçersiz kategori'),
      );
    });

    it('should allow unsetting category_id with null', async () => {
      const event = { id: 'event-1', category_id: 'cat-1' };

      eventRepository.findOne.mockResolvedValueOnce(event).mockResolvedValueOnce({
        id: 'event-1',
        category_id: null,
        category: null,
        title: 'Event',
        cover_image: null,
        images: [],
        description: null,
        event_date: new Date(),
        event_time: '19:00',
        duration_minutes: null,
        venue_name: null,
        venue_address: null,
        is_local: true,
        city: null,
        latitude: null,
        longitude: null,
        organizer: null,
        ticket_price: null,
        is_free: true,
        age_restriction: null,
        capacity: null,
        website_url: null,
        ticket_url: null,
        cover_image_id: null,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.updateEvent('event-1', { category_id: null });

      expect(eventRepository.save).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // deleteEvent Tests
  // ============================================================================
  describe('deleteEvent', () => {
    it('should soft delete event', async () => {
      const event = { id: 'event-1', title: 'Event' };

      eventRepository.findOne.mockResolvedValueOnce(event);

      await service.deleteEvent('event-1');

      expect(eventRepository.softDelete).toHaveBeenCalledWith('event-1');
    });

    it('should throw NotFoundException when event not found', async () => {
      eventRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.deleteEvent('invalid')).rejects.toThrow(
        new NotFoundException('Etkinlik bulunamadı'),
      );
    });
  });

  // ============================================================================
  // Private Helper Methods Tests
  // ============================================================================
  describe('Private Helpers', () => {
    it('should map event with all fields and relations', () => {
      const event = {
        id: 'event-1',
        title: 'Ankara Music Festival',
        description: 'Annual music festival',
        category_id: 'cat-1',
        category: { id: 'cat-1', name: 'Music', icon: '🎵' },
        event_date: new Date('2026-04-01'),
        event_time: '19:00',
        duration_minutes: 240,
        venue_name: 'Ankara Amphitheater',
        venue_address: 'Ankara Center',
        is_local: true,
        city: 'Ankara',
        latitude: 39.92,
        longitude: 32.86,
        organizer: 'Ankara Municipality',
        ticket_price: 200,
        is_free: false,
        age_restriction: '12+',
        capacity: 3000,
        website_url: 'https://ankara-music.com',
        ticket_url: 'https://tickets.ankara-music.com',
        cover_image_id: 'file-1',
        cover_image: { url: 'https://cdn.example.com/cover.jpg' },
        images: [{ id: 'img-1', file_id: 'file-1', file: { url: 'https://cdn.example.com/img1.jpg' }, display_order: 1 }],
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mapped = service['mapEvent'](event);

      expect(mapped.id).toBe('event-1');
      expect(mapped.title).toBe('Ankara Music Festival');
      expect(mapped.category).not.toBeNull();
      expect(mapped.images).toHaveLength(1);
      expect(mapped.status).toBe('published');
    });

    it('should map event with null fields', () => {
      const event = {
        id: 'event-1',
        title: 'Simple Event',
        description: null,
        category_id: null,
        category: null,
        event_date: new Date(),
        event_time: '19:00',
        duration_minutes: null,
        venue_name: null,
        venue_address: null,
        is_local: false,
        city: null,
        latitude: null,
        longitude: null,
        organizer: null,
        ticket_price: null,
        is_free: true,
        age_restriction: null,
        capacity: null,
        website_url: null,
        ticket_url: null,
        cover_image_id: null,
        cover_image: null,
        images: null,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mapped = service['mapEvent'](event);

      expect(mapped.category).toBeNull();
      expect(mapped.venue_name).toBeNull();
      expect(mapped.cover_image_url).toBeNull();
      expect(mapped.images).toEqual([]);
    });

    it('should generate slug with Turkish character conversion', () => {
      const slug = service['generateEventSlug']('Müzik Şenliği Kültürü');

      expect(slug).toContain('muzik');
      expect(slug).toContain('senligi');
      expect(slug).toContain('kulturu');
    });

    it('should clean special characters and multiple hyphens', () => {
      const slug = service['generateEventSlug']('Test!@#$Event---Name');

      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).not.toContain('--');
    });
  });
});
