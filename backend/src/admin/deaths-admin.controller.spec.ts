import { Test, TestingModule } from '@nestjs/testing';
import { DeathsAdminController } from './deaths-admin.controller';
import { DeathsAdminService } from './deaths-admin.service';

describe('DeathsAdminController', () => {
  let controller: DeathsAdminController;
  let deathsAdminService: jest.Mocked<DeathsAdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeathsAdminController],
      providers: [
        {
          provide: DeathsAdminService,
          useValue: {
            getAllDeaths: jest.fn(),
            getCemeteries: jest.fn(),
            createCemetery: jest.fn(),
            updateCemetery: jest.fn(),
            deleteCemetery: jest.fn(),
            getMosques: jest.fn(),
            createMosque: jest.fn(),
            updateMosque: jest.fn(),
            deleteMosque: jest.fn(),
            getDeathNeighborhoods: jest.fn(),
            createDeath: jest.fn(),
            updateDeath: jest.fn(),
            deleteDeath: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeathsAdminController>(DeathsAdminController);
    deathsAdminService = module.get(DeathsAdminService) as jest.Mocked<DeathsAdminService>;
  });

  describe('getAllDeaths', () => {
    it('should return list of deaths', async () => {
      deathsAdminService.getAllDeaths.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getAllDeaths({});
      expect(result.success).toBe(true);
      expect(deathsAdminService.getAllDeaths).toHaveBeenCalled();
    });
  });

  describe('getCemeteries', () => {
    it('should return cemeteries', async () => {
      deathsAdminService.getCemeteries.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getCemeteries();
      expect(result.success).toBe(true);
      expect(deathsAdminService.getCemeteries).toHaveBeenCalled();
    });
  });

  describe('createCemetery', () => {
    it('should create cemetery', async () => {
      const dto = { name: 'Test Cemetery' };
      deathsAdminService.createCemetery.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createCemetery(dto);
      expect(result.success).toBe(true);
      expect(deathsAdminService.createCemetery).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateCemetery', () => {
    it('should update cemetery', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      deathsAdminService.updateCemetery.mockResolvedValue({ success: true, data: {} });
      const result = await controller.updateCemetery(id, dto);
      expect(deathsAdminService.updateCemetery).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteCemetery', () => {
    it('should delete cemetery', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      deathsAdminService.deleteCemetery.mockResolvedValue({ success: true, data: {} });
      const result = await controller.deleteCemetery(id);
      expect(deathsAdminService.deleteCemetery).toHaveBeenCalledWith(id);
    });
  });

  describe('getMosques', () => {
    it('should return mosques', async () => {
      deathsAdminService.getMosques.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getMosques();
      expect(result.success).toBe(true);
      expect(deathsAdminService.getMosques).toHaveBeenCalled();
    });
  });

  describe('createMosque', () => {
    it('should create mosque', async () => {
      const dto = { name: 'Test Mosque' };
      deathsAdminService.createMosque.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createMosque(dto);
      expect(deathsAdminService.createMosque).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateMosque', () => {
    it('should update mosque', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      deathsAdminService.updateMosque.mockResolvedValue({ success: true, data: {} });
      await controller.updateMosque(id, dto);
      expect(deathsAdminService.updateMosque).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteMosque', () => {
    it('should delete mosque', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      deathsAdminService.deleteMosque.mockResolvedValue({ success: true, data: {} });
      await controller.deleteMosque(id);
      expect(deathsAdminService.deleteMosque).toHaveBeenCalledWith(id);
    });
  });

  describe('getNeighborhoods', () => {
    it('should return neighborhoods', async () => {
      deathsAdminService.getDeathNeighborhoods.mockResolvedValue({
        success: true,
        data: [],
      });
      const result = await controller.getNeighborhoods();
      expect(result.success).toBe(true);
      expect(deathsAdminService.getDeathNeighborhoods).toHaveBeenCalled();
    });
  });

  describe('createDeath', () => {
    it('should create death notice', async () => {
      const adminId = 'admin-123';
      const dto = { name: 'Deceased', death_date: '2026-02-27' };
      deathsAdminService.createDeath.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createDeath(adminId, dto);
      expect(deathsAdminService.createDeath).toHaveBeenCalledWith(adminId, dto);
    });
  });

  describe('updateDeath', () => {
    it('should update death notice', async () => {
      const adminId = 'admin-123';
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated Name' };
      deathsAdminService.updateDeath.mockResolvedValue({ success: true, data: {} });
      await controller.updateDeath(adminId, id, dto);
      expect(deathsAdminService.updateDeath).toHaveBeenCalledWith(adminId, id, dto);
    });
  });

  describe('deleteDeath', () => {
    it('should delete death notice', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      deathsAdminService.deleteDeath.mockResolvedValue({ success: true, data: {} });
      const result = await controller.deleteDeath(id);
      expect(deathsAdminService.deleteDeath).toHaveBeenCalledWith(id);
    });
  });
});
