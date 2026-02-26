import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TransportAdminService } from './transport-admin.service';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../database/entities/transport.entity';

describe('TransportAdminService', () => {
  let service: TransportAdminService;
  let intercityRouteRepository: any;
  let intercityScheduleRepository: any;
  let intracityRouteRepository: any;
  let intracityStopRepository: any;

  beforeEach(async () => {
    // Mock repositories with chainable methods
    intercityRouteRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    intercityScheduleRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    intracityRouteRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    intracityStopRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      getRawOne: jest.fn(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportAdminService,
        { provide: getRepositoryToken(IntercityRoute), useValue: intercityRouteRepository },
        { provide: getRepositoryToken(IntercitySchedule), useValue: intercityScheduleRepository },
        { provide: getRepositoryToken(IntracityRoute), useValue: intracityRouteRepository },
        { provide: getRepositoryToken(IntracityStop), useValue: intracityStopRepository },
      ],
    }).compile();

    service = module.get<TransportAdminService>(TransportAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── INTERCITY ROUTES TESTS ──────────────────────────────────────────────

  describe('getAdminIntercityRoutes', () => {
    it('should return intercity routes with pagination', async () => {
      const mockRoutes = [
        {
          id: '1',
          company_name: 'Test Company',
          company: 'Test Company',
          from_city: 'Kadirli',
          destination: 'Istanbul',
          price: 100,
          duration_minutes: 120,
          contact_phone: null,
          contact_website: null,
          amenities: [],
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          schedules: [],
        },
      ];

      intercityRouteRepository.getManyAndCount.mockResolvedValue([mockRoutes, 1]);

      const result = await service.getAdminIntercityRoutes({
        page: 1,
        limit: 20,
      });

      expect(result.routes).toHaveLength(1);
      expect(result.routes[0].company_name).toBe('Test Company');
      expect(result.meta).toBeDefined();
      expect(intercityRouteRepository.createQueryBuilder).toHaveBeenCalledWith('r');
      expect(intercityRouteRepository.skip).toHaveBeenCalledWith(0);
      expect(intercityRouteRepository.take).toHaveBeenCalledWith(20);
    });

    it('should apply search filter when provided', async () => {
      intercityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntercityRoutes({
        search: 'Kadirli',
        page: 1,
        limit: 20,
      });

      expect(intercityRouteRepository.andWhere).toHaveBeenCalledWith(
        '(r.company_name ILIKE :search OR r.company ILIKE :search OR r.destination ILIKE :search)',
        { search: '%Kadirli%' },
      );
    });

    it('should skip search filter when not provided', async () => {
      intercityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntercityRoutes({
        page: 1,
        limit: 20,
      });

      // Verify andWhere was not called with search pattern
      const calls = (intercityRouteRepository.andWhere as jest.Mock).mock.calls;
      const hasSearchCall = calls.some((call) =>
        call[0]?.includes('company_name ILIKE :search'),
      );
      expect(hasSearchCall).toBe(false);
    });

    it('should apply company_name filter when provided', async () => {
      intercityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntercityRoutes({
        company_name: 'Test Company',
        page: 1,
        limit: 20,
      });

      expect(intercityRouteRepository.andWhere).toHaveBeenCalledWith(
        '(r.company_name ILIKE :cn OR r.company ILIKE :cn)',
        { cn: '%Test Company%' },
      );
    });

    it('should apply from_city filter when provided', async () => {
      intercityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntercityRoutes({
        from_city: 'Kadirli',
        page: 1,
        limit: 20,
      });

      expect(intercityRouteRepository.andWhere).toHaveBeenCalledWith(
        'r.from_city ILIKE :from_city',
        { from_city: '%Kadirli%' },
      );
    });

    it('should apply to_city filter when provided', async () => {
      intercityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntercityRoutes({
        to_city: 'Istanbul',
        page: 1,
        limit: 20,
      });

      expect(intercityRouteRepository.andWhere).toHaveBeenCalledWith(
        'r.destination ILIKE :to_city',
        { to_city: '%Istanbul%' },
      );
    });

    it('should apply is_active filter when provided', async () => {
      intercityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntercityRoutes({
        is_active: true,
        page: 1,
        limit: 20,
      });

      expect(intercityRouteRepository.andWhere).toHaveBeenCalledWith(
        'r.is_active = :is_active',
        { is_active: true },
      );
    });

    it('should skip is_active filter when undefined', async () => {
      intercityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntercityRoutes({
        page: 1,
        limit: 20,
      });

      // Verify andWhere not called with is_active
      const calls = (intercityRouteRepository.andWhere as jest.Mock).mock.calls;
      const hasIsActiveCall = calls.some((call) => call[0]?.includes('is_active'));
      expect(hasIsActiveCall).toBe(false);
    });

    it('should apply multiple filters together', async () => {
      intercityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntercityRoutes({
        search: 'test',
        company_name: 'company',
        from_city: 'from',
        to_city: 'to',
        is_active: true,
        page: 1,
        limit: 20,
      });

      expect(intercityRouteRepository.andWhere).toHaveBeenCalledTimes(5);
    });
  });

  describe('getAdminIntercityRoute', () => {
    it('should return single intercity route with success', async () => {
      const mockRoute = {
        id: '1',
        company_name: 'Test Company',
        company: 'Test Company',
        from_city: 'Kadirli',
        destination: 'Istanbul',
        price: 100,
        duration_minutes: 120,
        contact_phone: '05331234567',
        contact_website: 'www.test.com',
        amenities: ['WiFi', 'AC'],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        schedules: [],
      };

      intercityRouteRepository.getOne.mockResolvedValue(mockRoute);

      const result = await service.getAdminIntercityRoute('1');

      expect(result.route).toBeDefined();
      expect(result.route.id).toBe('1');
      expect(intercityRouteRepository.where).toHaveBeenCalledWith('r.id = :id', { id: '1' });
    });

    it('should throw NotFoundException when route not found', async () => {
      intercityRouteRepository.getOne.mockResolvedValue(null);

      await expect(service.getAdminIntercityRoute('invalid-id')).rejects.toThrow(
        new NotFoundException('Şehirlerarası hat bulunamadı'),
      );
    });
  });

  describe('createIntercityRoute', () => {
    it('should create intercity route successfully', async () => {
      const createDto = {
        company_name: 'New Company',
        from_city: 'Kadirli',
        to_city: 'Istanbul',
        duration_minutes: 120,
        price: 100,
        contact_phone: '05331234567',
        contact_website: 'www.test.com',
        amenities: ['WiFi'],
        is_active: true,
      };

      const savedRoute = {
        id: '1',
        ...createDto,
        company: 'New Company',
        destination: 'Istanbul',
        created_at: new Date(),
        updated_at: new Date(),
        schedules: [],
      };

      intercityRouteRepository.create.mockReturnValue(savedRoute);
      intercityRouteRepository.save.mockResolvedValue(savedRoute);
      intercityRouteRepository.getOne.mockResolvedValue(savedRoute);

      const result = await service.createIntercityRoute(createDto);

      expect(result.route).toBeDefined();
      expect(intercityRouteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          company_name: 'New Company',
          company: 'New Company',
          destination: 'Istanbul',
          is_active: true,
        }),
      );
    });

    it('should set default is_active to true when not provided', async () => {
      const createDto = {
        company_name: 'New Company',
        from_city: 'Kadirli',
        to_city: 'Istanbul',
        duration_minutes: 120,
        price: 100,
        amenities: [],
      };

      const savedRoute = {
        id: '1',
        ...createDto,
        company: 'New Company',
        destination: 'Istanbul',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        schedules: [],
      };

      intercityRouteRepository.create.mockReturnValue(savedRoute);
      intercityRouteRepository.save.mockResolvedValue(savedRoute);
      intercityRouteRepository.getOne.mockResolvedValue(savedRoute);

      await service.createIntercityRoute(createDto);

      expect(intercityRouteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: true,
        }),
      );
    });

    it('should set default amenities to empty array when not provided', async () => {
      const createDto = {
        company_name: 'New Company',
        from_city: 'Kadirli',
        to_city: 'Istanbul',
        duration_minutes: 120,
        price: 100,
      };

      const savedRoute = {
        id: '1',
        ...createDto,
        company: 'New Company',
        destination: 'Istanbul',
        amenities: [],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        schedules: [],
      };

      intercityRouteRepository.create.mockReturnValue(savedRoute);
      intercityRouteRepository.save.mockResolvedValue(savedRoute);
      intercityRouteRepository.getOne.mockResolvedValue(savedRoute);

      await service.createIntercityRoute(createDto);

      expect(intercityRouteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amenities: [],
        }),
      );
    });
  });

  describe('updateIntercityRoute', () => {
    it('should update intercity route with partial fields', async () => {
      const existingRoute = {
        id: '1',
        company_name: 'Old Company',
        company: 'Old Company',
        from_city: 'Kadirli',
        destination: 'Istanbul',
        price: 100,
        duration_minutes: 120,
        contact_phone: null,
        contact_website: null,
        amenities: [],
        is_active: true,
      };

      const updateDto = {
        company_name: 'New Company',
        price: 150,
      };

      intercityRouteRepository.findOne.mockResolvedValue(existingRoute);
      intercityRouteRepository.getOne.mockResolvedValue({
        ...existingRoute,
        ...updateDto,
      });

      await service.updateIntercityRoute('1', updateDto);

      expect(intercityRouteRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when route not found during update', async () => {
      intercityRouteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateIntercityRoute('invalid-id', { company_name: 'New' }),
      ).rejects.toThrow(new NotFoundException('Şehirlerarası hat bulunamadı'));
    });

    it('should only update fields that are provided', async () => {
      const existingRoute = {
        id: '1',
        company_name: 'Company',
        company: 'Company',
        from_city: 'Kadirli',
        destination: 'Istanbul',
        price: 100,
        duration_minutes: 120,
        contact_phone: '05331234567',
        contact_website: 'www.test.com',
        amenities: ['WiFi'],
        is_active: true,
      };

      const updateDto = {
        price: 200,
      };

      intercityRouteRepository.findOne.mockResolvedValue(existingRoute);
      intercityRouteRepository.getOne.mockResolvedValue(existingRoute);

      await service.updateIntercityRoute('1', updateDto);

      // Verify only price was set to 200
      expect(intercityRouteRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 200,
        }),
      );
    });
  });

  describe('deleteIntercityRoute', () => {
    it('should delete intercity route successfully', async () => {
      const mockRoute = { id: '1' };
      intercityRouteRepository.findOne.mockResolvedValue(mockRoute);

      await service.deleteIntercityRoute('1');

      expect(intercityRouteRepository.remove).toHaveBeenCalledWith(mockRoute);
    });

    it('should throw NotFoundException when trying to delete non-existent route', async () => {
      intercityRouteRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteIntercityRoute('invalid-id')).rejects.toThrow(
        new NotFoundException('Şehirlerarası hat bulunamadı'),
      );
    });
  });

  // ─── INTERCITY SCHEDULES TESTS ───────────────────────────────────────────

  describe('addIntercitySchedule', () => {
    it('should add schedule to intercity route', async () => {
      const mockRoute = { id: 'route-1' };
      const scheduleDto = {
        departure_time: '08:00',
        days_of_week: [1, 2, 3],
        is_active: true,
      };

      const savedSchedule = {
        id: 'sched-1',
        route_id: 'route-1',
        ...scheduleDto,
        created_at: new Date(),
      };

      intercityRouteRepository.findOne.mockResolvedValue(mockRoute);
      intercityScheduleRepository.create.mockReturnValue(savedSchedule);
      intercityScheduleRepository.save.mockResolvedValue(savedSchedule);

      const result = await service.addIntercitySchedule('route-1', scheduleDto);

      expect(result.schedule).toBeDefined();
      expect(intercityScheduleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          route_id: 'route-1',
          departure_time: '08:00',
        }),
      );
    });

    it('should throw NotFoundException when route not found', async () => {
      intercityRouteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addIntercitySchedule('invalid-route', {
          departure_time: '08:00',
          days_of_week: [1],
        }),
      ).rejects.toThrow(new NotFoundException('Şehirlerarası hat bulunamadı'));
    });

    it('should set default is_active to true', async () => {
      const mockRoute = { id: 'route-1' };
      const scheduleDto = {
        departure_time: '08:00',
        days_of_week: [1, 2, 3],
      };

      const savedSchedule = {
        id: 'sched-1',
        route_id: 'route-1',
        ...scheduleDto,
        is_active: true,
        created_at: new Date(),
      };

      intercityRouteRepository.findOne.mockResolvedValue(mockRoute);
      intercityScheduleRepository.create.mockReturnValue(savedSchedule);
      intercityScheduleRepository.save.mockResolvedValue(savedSchedule);

      await service.addIntercitySchedule('route-1', scheduleDto);

      expect(intercityScheduleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: true,
        }),
      );
    });
  });

  describe('updateIntercitySchedule', () => {
    it('should update schedule with partial fields', async () => {
      const existingSchedule = {
        id: 'sched-1',
        route_id: 'route-1',
        departure_time: '08:00',
        days_of_week: [1, 2, 3],
        is_active: true,
        created_at: new Date(),
      };

      const updateDto = {
        departure_time: '09:00',
      };

      intercityScheduleRepository.findOne.mockResolvedValue(existingSchedule);
      intercityScheduleRepository.save.mockResolvedValue({
        ...existingSchedule,
        ...updateDto,
      });

      await service.updateIntercitySchedule('sched-1', updateDto);

      expect(intercityScheduleRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when schedule not found', async () => {
      intercityScheduleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateIntercitySchedule('invalid-sched', { departure_time: '09:00' }),
      ).rejects.toThrow(new NotFoundException('Sefer bulunamadı'));
    });
  });

  describe('deleteIntercitySchedule', () => {
    it('should delete schedule successfully', async () => {
      const mockSchedule = { id: 'sched-1' };
      intercityScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      await service.deleteIntercitySchedule('sched-1');

      expect(intercityScheduleRepository.remove).toHaveBeenCalledWith(mockSchedule);
    });

    it('should throw NotFoundException when schedule not found', async () => {
      intercityScheduleRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteIntercitySchedule('invalid-sched')).rejects.toThrow(
        new NotFoundException('Sefer bulunamadı'),
      );
    });
  });

  // ─── INTRACITY ROUTES TESTS ──────────────────────────────────────────────

  describe('getAdminIntracityRoutes', () => {
    it('should return intracity routes with pagination', async () => {
      const mockRoutes = [
        {
          id: '1',
          route_number: '1',
          route_name: 'Test Route',
          color: '#FF0000',
          first_departure: '06:00',
          last_departure: '23:00',
          frequency_minutes: 15,
          fare: 3,
          is_active: true,
          created_at: new Date(),
          stops: [],
        },
      ];

      intracityRouteRepository.getManyAndCount.mockResolvedValue([mockRoutes, 1]);

      const result = await service.getAdminIntracityRoutes({
        page: 1,
        limit: 20,
      });

      expect(result.routes).toHaveLength(1);
      expect(result.meta).toBeDefined();
    });

    it('should apply search filter to intracity routes', async () => {
      intracityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntracityRoutes({
        search: 'route',
        page: 1,
        limit: 20,
      });

      expect(intracityRouteRepository.andWhere).toHaveBeenCalledWith(
        '(r.route_number ILIKE :search OR r.route_name ILIKE :search)',
        { search: '%route%' },
      );
    });

    it('should apply line_number filter when provided', async () => {
      intracityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntracityRoutes({
        line_number: '1',
        page: 1,
        limit: 20,
      });

      expect(intracityRouteRepository.andWhere).toHaveBeenCalledWith(
        'r.route_number ILIKE :ln',
        { ln: '%1%' },
      );
    });

    it('should apply is_active filter for intracity routes', async () => {
      intracityRouteRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminIntracityRoutes({
        is_active: false,
        page: 1,
        limit: 20,
      });

      expect(intracityRouteRepository.andWhere).toHaveBeenCalledWith(
        'r.is_active = :is_active',
        { is_active: false },
      );
    });
  });

  describe('getAdminIntracityRoute', () => {
    it('should return intracity route with stops', async () => {
      const mockRoute = {
        id: '1',
        route_number: '1',
        route_name: 'Test Route',
        color: '#FF0000',
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: 3,
        is_active: true,
        created_at: new Date(),
      };

      const mockStops = [
        {
          id: 'stop-1',
          route_id: '1',
          stop_name: 'Station 1',
          stop_order: 1,
          neighborhood_id: 'neigh-1',
          neighborhood_name: 'Test Neighborhood',
          time_from_start: 0,
          latitude: 36.5,
          longitude: 32.5,
          created_at: new Date(),
        },
      ];

      intracityRouteRepository.findOne.mockResolvedValue(mockRoute);
      intracityStopRepository.getRawMany.mockResolvedValue(mockStops);

      const result = await service.getAdminIntracityRoute('1');

      expect(result.route).toBeDefined();
      expect(result.route.stops).toHaveLength(1);
    });

    it('should throw NotFoundException for non-existent intracity route', async () => {
      intracityRouteRepository.findOne.mockResolvedValue(null);

      await expect(service.getAdminIntracityRoute('invalid-id')).rejects.toThrow(
        new NotFoundException('Şehir içi hat bulunamadı'),
      );
    });
  });

  describe('createIntracityRoute', () => {
    it('should create intracity route successfully', async () => {
      const createDto = {
        line_number: '1',
        name: 'Test Route',
        color: '#FF0000',
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: 3,
        is_active: true,
      };

      const savedRoute = {
        id: '1',
        route_number: '1',
        route_name: 'Test Route',
        ...createDto,
        created_at: new Date(),
      };

      intracityRouteRepository.create.mockReturnValue(savedRoute);
      intracityRouteRepository.save.mockResolvedValue(savedRoute);
      intracityRouteRepository.findOne.mockResolvedValue(savedRoute);
      intracityStopRepository.getRawMany.mockResolvedValue([]);

      const result = await service.createIntracityRoute(createDto);

      expect(result.route).toBeDefined();
      expect(intracityRouteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          route_number: '1',
          route_name: 'Test Route',
          is_active: true,
        }),
      );
    });

    it('should set default is_active to true when not provided', async () => {
      const createDto = {
        line_number: '1',
        name: 'Test Route',
        color: '#FF0000',
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: 3,
      };

      const savedRoute = {
        id: '1',
        route_number: '1',
        route_name: 'Test Route',
        ...createDto,
        is_active: true,
        created_at: new Date(),
      };

      intracityRouteRepository.create.mockReturnValue(savedRoute);
      intracityRouteRepository.save.mockResolvedValue(savedRoute);
      intracityRouteRepository.findOne.mockResolvedValue(savedRoute);
      intracityStopRepository.getRawMany.mockResolvedValue([]);

      await service.createIntracityRoute(createDto);

      expect(intracityRouteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: true,
        }),
      );
    });
  });

  describe('updateIntracityRoute', () => {
    it('should update intracity route with partial fields', async () => {
      const existingRoute = {
        id: '1',
        route_number: '1',
        route_name: 'Old Name',
        color: '#FF0000',
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: 3,
        is_active: true,
      };

      const updateDto = {
        name: 'New Name',
        fare: 5,
      };

      intracityRouteRepository.findOne.mockResolvedValue(existingRoute);
      intracityStopRepository.getRawMany.mockResolvedValue([]);

      await service.updateIntracityRoute('1', updateDto);

      expect(intracityRouteRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent route during update', async () => {
      intracityRouteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateIntracityRoute('invalid-id', { name: 'New' }),
      ).rejects.toThrow(new NotFoundException('Şehir içi hat bulunamadı'));
    });
  });

  describe('deleteIntracityRoute', () => {
    it('should delete intracity route successfully', async () => {
      const mockRoute = { id: '1' };
      intracityRouteRepository.findOne.mockResolvedValue(mockRoute);

      await service.deleteIntracityRoute('1');

      expect(intracityRouteRepository.remove).toHaveBeenCalledWith(mockRoute);
    });

    it('should throw NotFoundException when route not found', async () => {
      intracityRouteRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteIntracityRoute('invalid-id')).rejects.toThrow(
        new NotFoundException('Şehir içi hat bulunamadı'),
      );
    });
  });

  // ─── INTRACITY STOPS TESTS ───────────────────────────────────────────────

  describe('addIntracityStop', () => {
    it('should add stop to intracity route', async () => {
      const mockRoute = { id: 'route-1' };
      const stopDto = {
        name: 'New Stop',
        neighborhood_id: 'neigh-1',
        time_from_start: 10,
        latitude: 36.5,
        longitude: 32.5,
      };

      const maxOrderResult = { max: 2 };
      const savedStop = {
        id: 'stop-3',
        route_id: 'route-1',
        stop_name: 'New Stop',
        stop_order: 3,
        neighborhood_id: 'neigh-1',
        time_from_start: 10,
        latitude: 36.5,
        longitude: 32.5,
        created_at: new Date(),
      };

      intracityRouteRepository.findOne.mockResolvedValue(mockRoute);
      intracityStopRepository.getRawOne.mockResolvedValue(maxOrderResult);
      intracityStopRepository.create.mockReturnValue(savedStop);
      intracityStopRepository.save.mockResolvedValue(savedStop);
      intracityStopRepository.getRawMany.mockResolvedValue([savedStop]);

      const result = await service.addIntracityStop('route-1', stopDto);

      expect(result.stop).toBeDefined();
      expect(intracityStopRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          route_id: 'route-1',
          stop_order: 3,
        }),
      );
    });

    it('should throw NotFoundException when route not found', async () => {
      intracityRouteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addIntracityStop('invalid-route', {
          name: 'Stop',
        }),
      ).rejects.toThrow(new NotFoundException('Şehir içi hat bulunamadı'));
    });

    it('should handle case when no stops exist yet (max_order is null)', async () => {
      const mockRoute = { id: 'route-1' };
      const stopDto = { name: 'First Stop' };

      const maxOrderResult = { max: null };
      const savedStop = {
        id: 'stop-1',
        route_id: 'route-1',
        stop_order: 1,
        created_at: new Date(),
      };

      intracityRouteRepository.findOne.mockResolvedValue(mockRoute);
      intracityStopRepository.getRawOne.mockResolvedValue(maxOrderResult);
      intracityStopRepository.create.mockReturnValue(savedStop);
      intracityStopRepository.save.mockResolvedValue(savedStop);
      intracityStopRepository.getRawMany.mockResolvedValue([savedStop]);

      await service.addIntracityStop('route-1', stopDto);

      expect(intracityStopRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          stop_order: 1,
        }),
      );
    });
  });

  describe('updateIntracityStop', () => {
    it('should update stop with partial fields', async () => {
      const existingStop = {
        id: 'stop-1',
        route_id: 'route-1',
        stop_name: 'Old Name',
        stop_order: 1,
        neighborhood_id: 'neigh-1',
        time_from_start: 10,
        latitude: 36.5,
        longitude: 32.5,
        created_at: new Date(),
      };

      const updateDto = {
        name: 'New Name',
        time_from_start: 15,
      };

      intracityStopRepository.findOne.mockResolvedValue(existingStop);
      intracityStopRepository.getRawMany.mockResolvedValue([
        { ...existingStop, stop_name: 'New Name' },
      ]);

      await service.updateIntracityStop('stop-1', updateDto);

      expect(intracityStopRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when stop not found', async () => {
      intracityStopRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateIntracityStop('invalid-stop', { name: 'New Name' }),
      ).rejects.toThrow(new NotFoundException('Durak bulunamadı'));
    });
  });

  describe('deleteIntracityStop', () => {
    it('should delete stop and reorder subsequent stops', async () => {
      const mockStop = {
        id: 'stop-2',
        route_id: 'route-1',
        stop_order: 2,
      };

      intracityStopRepository.findOne.mockResolvedValue(mockStop);

      await service.deleteIntracityStop('stop-2');

      expect(intracityStopRepository.remove).toHaveBeenCalledWith(mockStop);
      expect(intracityStopRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when stop not found', async () => {
      intracityStopRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteIntracityStop('invalid-stop')).rejects.toThrow(
        new NotFoundException('Durak bulunamadı'),
      );
    });
  });

  describe('reorderIntracityStop', () => {
    it('should not reorder when new_order equals old_order', async () => {
      const mockStop = {
        id: 'stop-1',
        route_id: 'route-1',
        stop_order: 2,
      };

      intracityStopRepository.findOne.mockResolvedValue(mockStop);

      const result = await service.reorderIntracityStop('stop-1', { new_order: 2 });

      expect(result.stop).toBeDefined();
      expect(intracityStopRepository.update).not.toHaveBeenCalled();
    });

    it('should reorder stops when moving down (new_order > old_order)', async () => {
      const mockStop = {
        id: 'stop-1',
        route_id: 'route-1',
        stop_order: 1,
      };

      intracityStopRepository.findOne.mockResolvedValue(mockStop);
      intracityStopRepository.getRawMany.mockResolvedValue([mockStop]);

      await service.reorderIntracityStop('stop-1', { new_order: 3 });

      expect(intracityStopRepository.update).toHaveBeenCalled();
      expect(intracityStopRepository.save).toHaveBeenCalled();
    });

    it('should reorder stops when moving up (new_order < old_order)', async () => {
      const mockStop = {
        id: 'stop-3',
        route_id: 'route-1',
        stop_order: 3,
      };

      intracityStopRepository.findOne.mockResolvedValue(mockStop);
      intracityStopRepository.getRawMany.mockResolvedValue([mockStop]);

      await service.reorderIntracityStop('stop-3', { new_order: 1 });

      expect(intracityStopRepository.update).toHaveBeenCalled();
      expect(intracityStopRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when stop not found during reorder', async () => {
      intracityStopRepository.findOne.mockResolvedValue(null);

      await expect(
        service.reorderIntracityStop('invalid-stop', { new_order: 2 }),
      ).rejects.toThrow(new NotFoundException('Durak bulunamadı'));
    });
  });

  // ─── PRIVATE HELPER TESTS ────────────────────────────────────────────────

  describe('mapIntercityRoute', () => {
    it('should map intercity route with all fields', () => {
      const route = {
        id: '1',
        company_name: 'Company',
        company: 'Company',
        from_city: 'Kadirli',
        destination: 'Istanbul',
        duration_minutes: 120,
        price: 100,
        contact_phone: '05331234567',
        contact_website: 'www.test.com',
        amenities: ['WiFi', 'AC'],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        schedules: [],
      };

      const result = service['mapIntercityRoute'](route);

      expect(result.id).toBe('1');
      expect(result.company_name).toBe('Company');
      expect(result.contact_phone).toBe('05331234567');
      expect(result.amenities).toEqual(['WiFi', 'AC']);
    });

    it('should use fallback values when fields are null', () => {
      const route = {
        id: '1',
        company_name: null,
        company: null,
        from_city: null,
        destination: 'Istanbul',
        duration_minutes: 120,
        price: 100,
        contact_phone: null,
        contact_website: null,
        amenities: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        schedules: null,
      };

      const result = service['mapIntercityRoute'](route);

      expect(result.company_name).toBe('');
      expect(result.from_city).toBe('Kadirli');
      expect(result.contact_phone).toBeNull();
      expect(result.amenities).toEqual([]);
      expect(result.schedules).toEqual([]);
    });

    it('should convert price to number', () => {
      const route = {
        id: '1',
        company_name: 'Company',
        company: 'Company',
        from_city: 'Kadirli',
        destination: 'Istanbul',
        duration_minutes: 120,
        price: '100.50',
        contact_phone: null,
        contact_website: null,
        amenities: [],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        schedules: [],
      };

      const result = service['mapIntercityRoute'](route);

      expect(result.price).toBe(100.5);
      expect(typeof result.price).toBe('number');
    });
  });

  describe('mapIntercitySchedule', () => {
    it('should parse days_of_week when it is an array', () => {
      const schedule = {
        id: '1',
        route_id: 'route-1',
        departure_time: '08:00',
        days_of_week: [1, 2, 3],
        is_active: true,
        created_at: new Date(),
      };

      const result = service['mapIntercitySchedule'](schedule);

      expect(result.days_of_week).toEqual([1, 2, 3]);
    });

    it('should parse days_of_week when it is a comma-separated string', () => {
      const schedule = {
        id: '1',
        route_id: 'route-1',
        departure_time: '08:00',
        days_of_week: '1,2,3',
        is_active: true,
        created_at: new Date(),
      };

      const result = service['mapIntercitySchedule'](schedule);

      expect(result.days_of_week).toEqual([1, 2, 3]);
    });

    it('should return empty array when days_of_week is null', () => {
      const schedule = {
        id: '1',
        route_id: 'route-1',
        departure_time: '08:00',
        days_of_week: null,
        is_active: true,
        created_at: new Date(),
      };

      const result = service['mapIntercitySchedule'](schedule);

      expect(result.days_of_week).toEqual([]);
    });

    it('should return empty array when days_of_week is empty string', () => {
      const schedule = {
        id: '1',
        route_id: 'route-1',
        departure_time: '08:00',
        days_of_week: '',
        is_active: true,
        created_at: new Date(),
      };

      const result = service['mapIntercitySchedule'](schedule);

      expect(result.days_of_week).toEqual([]);
    });

    it('should convert string array elements to numbers', () => {
      const schedule = {
        id: '1',
        route_id: 'route-1',
        departure_time: '08:00',
        days_of_week: ['1', '2', '3'],
        is_active: true,
        created_at: new Date(),
      };

      const result = service['mapIntercitySchedule'](schedule);

      expect(result.days_of_week).toEqual([1, 2, 3]);
      expect(result.days_of_week.every((d) => typeof d === 'number')).toBe(true);
    });
  });

  describe('mapIntracityRoute', () => {
    it('should map intracity route with stops', () => {
      const route = {
        id: '1',
        route_number: '1',
        route_name: 'Test Route',
        color: '#FF0000',
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: 3,
        is_active: true,
        created_at: new Date(),
      };

      const stops = [
        { id: 'stop-1', name: 'Station 1' },
        { id: 'stop-2', name: 'Station 2' },
      ];

      const result = service['mapIntracityRoute'](route, stops);

      expect(result.line_number).toBe('1');
      expect(result.name).toBe('Test Route');
      expect(result.fare).toBe(3);
      expect(result.stops).toEqual(stops);
    });

    it('should use empty array when stops not provided', () => {
      const route = {
        id: '1',
        route_number: '1',
        route_name: 'Test Route',
        color: '#FF0000',
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: 3,
        is_active: true,
        created_at: new Date(),
      };

      const result = service['mapIntracityRoute'](route);

      expect(result.stops).toEqual([]);
    });

    it('should handle null color', () => {
      const route = {
        id: '1',
        route_number: '1',
        route_name: 'Test Route',
        color: null,
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: 3,
        is_active: true,
        created_at: new Date(),
      };

      const result = service['mapIntracityRoute'](route);

      expect(result.color).toBeNull();
    });

    it('should convert fare to number and handle 0 for null', () => {
      const routeWithFare = {
        id: '1',
        route_number: '1',
        route_name: 'Test Route',
        color: '#FF0000',
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: '5.5',
        is_active: true,
        created_at: new Date(),
      };

      const routeWithoutFare = {
        id: '2',
        route_number: '2',
        route_name: 'Test Route 2',
        color: '#FF0000',
        first_departure: '06:00',
        last_departure: '23:00',
        frequency_minutes: 15,
        fare: null,
        is_active: true,
        created_at: new Date(),
      };

      const result1 = service['mapIntracityRoute'](routeWithFare);
      const result2 = service['mapIntracityRoute'](routeWithoutFare);

      expect(result1.fare).toBe(5.5);
      expect(result2.fare).toBe(0);
    });
  });

  describe('mapIntracityStop', () => {
    it('should map intracity stop with all fields', () => {
      const stop = {
        id: 'stop-1',
        route_id: 'route-1',
        stop_name: 'Station 1',
        stop_order: 1,
        neighborhood_id: 'neigh-1',
        neighborhood_name: 'Test Neighborhood',
        time_from_start: 10,
        latitude: '36.5',
        longitude: '32.5',
        created_at: new Date(),
      };

      const result = service['mapIntracityStop'](stop);

      expect(result.name).toBe('Station 1');
      expect(result.latitude).toBe(36.5);
      expect(result.longitude).toBe(32.5);
      expect(result.time_from_start).toBe(10);
      expect(result.neighborhood_name).toBe('Test Neighborhood');
    });

    it('should handle null coordinates', () => {
      const stop = {
        id: 'stop-1',
        route_id: 'route-1',
        stop_name: 'Station 1',
        stop_order: 1,
        neighborhood_id: null,
        neighborhood_name: null,
        time_from_start: null,
        latitude: null,
        longitude: null,
        created_at: new Date(),
      };

      const result = service['mapIntracityStop'](stop);

      expect(result.neighborhood_id).toBeNull();
      expect(result.neighborhood_name).toBe('');
      expect(result.time_from_start).toBe(0);
      expect(result.latitude).toBeUndefined();
      expect(result.longitude).toBeUndefined();
    });

    it('should convert string coordinates to numbers', () => {
      const stop = {
        id: 'stop-1',
        route_id: 'route-1',
        stop_name: 'Station 1',
        stop_order: 1,
        neighborhood_id: 'neigh-1',
        neighborhood_name: 'Neighborhood',
        time_from_start: 10,
        latitude: '36.123456',
        longitude: '32.654321',
        created_at: new Date(),
      };

      const result = service['mapIntracityStop'](stop);

      expect(result.latitude).toBe(36.123456);
      expect(result.longitude).toBe(32.654321);
      expect(typeof result.latitude).toBe('number');
      expect(typeof result.longitude).toBe('number');
    });
  });

  describe('getStopsWithNeighborhood', () => {
    it('should load stops with neighborhood information', async () => {
      const mockStops = [
        {
          id: 'stop-1',
          route_id: 'route-1',
          stop_name: 'Station 1',
          stop_order: 1,
          neighborhood_id: 'neigh-1',
          neighborhood_name: 'Merkez',
          time_from_start: 0,
          latitude: 36.5,
          longitude: 32.5,
          created_at: new Date(),
        },
        {
          id: 'stop-2',
          route_id: 'route-1',
          stop_name: 'Station 2',
          stop_order: 2,
          neighborhood_id: 'neigh-2',
          neighborhood_name: 'Akdam',
          time_from_start: 10,
          latitude: 36.6,
          longitude: 32.6,
          created_at: new Date(),
        },
      ];

      intracityStopRepository.getRawMany.mockResolvedValue(mockStops);

      const result = await service['getStopsWithNeighborhood']('route-1');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Station 1');
      expect(result[1].neighborhood_name).toBe('Akdam');
      expect(intracityStopRepository.where).toHaveBeenCalledWith(
        's.route_id = :routeId',
        { routeId: 'route-1' },
      );
    });

    it('should order stops by stop_order', async () => {
      intracityStopRepository.getRawMany.mockResolvedValue([]);

      await service['getStopsWithNeighborhood']('route-1');

      expect(intracityStopRepository.orderBy).toHaveBeenCalledWith('s.stop_order', 'ASC');
    });
  });
});
