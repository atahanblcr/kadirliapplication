import { Test, TestingModule } from '@nestjs/testing';
import { DeathsController } from './deaths.controller';
import { DeathsService } from './deaths.service';
import { User } from '../database/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

const mockUser = { id: 'user-uuid-1', role: UserRole.USER } as User;

describe('DeathsController', () => {
  let controller: DeathsController;
  let service: jest.Mocked<DeathsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeathsController],
      providers: [
        {
          provide: DeathsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findCemeteries: jest.fn(),
            findMosques: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeathsController>(DeathsController);
    service = module.get(DeathsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('GET /deaths/cemeteries', () => {
    it('mezarlıkları döndürmeli', async () => {
      service.findCemeteries.mockResolvedValue([]);
      const result = await controller.getCemeteries();
      expect(result).toEqual({ cemeteries: [] });
    });
  });

  describe('GET /deaths/mosques', () => {
    it('camileri döndürmeli', async () => {
      service.findMosques.mockResolvedValue([]);
      const result = await controller.getMosques();
      expect(result).toEqual({ mosques: [] });
    });
  });

  describe('GET /deaths', () => {
    it('vefat ilanlarını döndürmeli', async () => {
      service.findAll.mockResolvedValue({ notices: [], meta: {} as any });
      const dto = { page: 1, limit: 20 };
      const result = await controller.findAll(dto);
      expect(service.findAll).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ notices: [], meta: {} });
    });
  });

  describe('GET /deaths/:id', () => {
    it('ilan detayını döndürmeli', async () => {
      const notice = { id: 'n-1', deceased_name: 'Test' };
      service.findOne.mockResolvedValue(notice as any);
      const result = await controller.findOne('n-1');
      expect(result).toEqual({ notice });
    });
  });

  describe('POST /deaths', () => {
    it('ilan oluşturmalı', async () => {
      const response = { notice: { id: 'new', status: 'pending' } };
      service.create.mockResolvedValue(response as any);

      const dto = {
        deceased_name: 'Ahmet YILMAZ',
        funeral_date: '2026-02-20',
        funeral_time: '14:00',
        cemetery_id: 'cem-1',
      };
      const result = await controller.create(mockUser, dto);

      expect(service.create).toHaveBeenCalledWith(mockUser.id, dto);
      expect(result).toBe(response);
    });

    it('service hatasını yukarı iletmeli', async () => {
      service.create.mockRejectedValue(new Error('Limit'));
      const dto = {
        deceased_name: 'Test',
        funeral_date: '2026-02-20',
        funeral_time: '14:00',
        cemetery_id: 'cem-1',
      };
      await expect(controller.create(mockUser, dto)).rejects.toThrow('Limit');
    });
  });
});
