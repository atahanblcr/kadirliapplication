import { Test, TestingModule } from '@nestjs/testing';
import { DeathsAdminController } from './deaths-admin.controller';
import { AdminService } from './admin.service';

describe('DeathsAdminController', () => {
  let controller: DeathsAdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeathsAdminController],
      providers: [
        {
          provide: AdminService,
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
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getAllDeaths', () => {
    it('should return list of deaths', async () => {
      adminService.getAllDeaths.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getAllDeaths({});
      expect(result.success).toBe(true);
      expect(adminService.getAllDeaths).toHaveBeenCalled();
    });
  });

  describe('getCemeteries', () => {
    it('should return cemeteries', async () => {
      adminService.getCemeteries.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getCemeteries();
      expect(result.success).toBe(true);
      expect(adminService.getCemeteries).toHaveBeenCalled();
    });
  });

  describe('createCemetery', () => {
    it('should create cemetery', async () => {
      const dto = { name: 'Test Cemetery' };
      adminService.createCemetery.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createCemetery(dto);
      expect(result.success).toBe(true);
      expect(adminService.createCemetery).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateCemetery', () => {
    it('should update cemetery', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      adminService.updateCemetery.mockResolvedValue({ success: true, data: {} });
      const result = await controller.updateCemetery(id, dto);
      expect(adminService.updateCemetery).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteCemetery', () => {
    it('should delete cemetery', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteCemetery.mockResolvedValue({ success: true, data: {} });
      const result = await controller.deleteCemetery(id);
      expect(adminService.deleteCemetery).toHaveBeenCalledWith(id);
    });
  });

  describe('getMosques', () => {
    it('should return mosques', async () => {
      adminService.getMosques.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getMosques();
      expect(result.success).toBe(true);
      expect(adminService.getMosques).toHaveBeenCalled();
    });
  });

  describe('createMosque', () => {
    it('should create mosque', async () => {
      const dto = { name: 'Test Mosque' };
      adminService.createMosque.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createMosque(dto);
      expect(adminService.createMosque).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateMosque', () => {
    it('should update mosque', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      adminService.updateMosque.mockResolvedValue({ success: true, data: {} });
      await controller.updateMosque(id, dto);
      expect(adminService.updateMosque).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteMosque', () => {
    it('should delete mosque', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteMosque.mockResolvedValue({ success: true, data: {} });
      await controller.deleteMosque(id);
      expect(adminService.deleteMosque).toHaveBeenCalledWith(id);
    });
  });

  describe('getNeighborhoods', () => {
    it('should return neighborhoods', async () => {
      adminService.getDeathNeighborhoods.mockResolvedValue({
        success: true,
        data: [],
      });
      const result = await controller.getNeighborhoods();
      expect(result.success).toBe(true);
      expect(adminService.getDeathNeighborhoods).toHaveBeenCalled();
    });
  });

  describe('createDeath', () => {
    it('should create death notice', async () => {
      const adminId = 'admin-123';
      const dto = { name: 'Deceased', death_date: '2026-02-27' };
      adminService.createDeath.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createDeath(adminId, dto);
      expect(adminService.createDeath).toHaveBeenCalledWith(adminId, dto);
    });
  });

  describe('updateDeath', () => {
    it('should update death notice', async () => {
      const adminId = 'admin-123';
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated Name' };
      adminService.updateDeath.mockResolvedValue({ success: true, data: {} });
      await controller.updateDeath(adminId, id, dto);
      expect(adminService.updateDeath).toHaveBeenCalledWith(adminId, id, dto);
    });
  });

  describe('deleteDeath', () => {
    it('should delete death notice', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteDeath.mockResolvedValue({ success: true, data: {} });
      const result = await controller.deleteDeath(id);
      expect(adminService.deleteDeath).toHaveBeenCalledWith(id);
    });
  });
});
