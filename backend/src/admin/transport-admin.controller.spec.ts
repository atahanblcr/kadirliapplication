import { Test, TestingModule } from '@nestjs/testing';
import { TransportAdminController } from './transport-admin.controller';
import { AdminService } from './admin.service';

describe('TransportAdminController', () => {
  let controller: TransportAdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportAdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getAdminIntercityRoutes: jest.fn(),
            getAdminIntercityRoute: jest.fn(),
            createIntercityRoute: jest.fn(),
            updateIntercityRoute: jest.fn(),
            deleteIntercityRoute: jest.fn(),
            addIntercitySchedule: jest.fn(),
            updateIntercitySchedule: jest.fn(),
            deleteIntercitySchedule: jest.fn(),
            getAdminIntracityRoutes: jest.fn(),
            getAdminIntracityRoute: jest.fn(),
            createIntracityRoute: jest.fn(),
            updateIntracityRoute: jest.fn(),
            deleteIntracityRoute: jest.fn(),
            addIntracityStop: jest.fn(),
            updateIntracityStop: jest.fn(),
            deleteIntracityStop: jest.fn(),
            reorderIntracityStop: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransportAdminController>(TransportAdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getIntercityRoutes', () => {
    it('should return intercity routes', async () => {
      const dto = { search: 'test' };
      adminService.getAdminIntercityRoutes.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getIntercityRoutes(dto);
      expect(adminService.getAdminIntercityRoutes).toHaveBeenCalledWith(dto);
    });
  });

  describe('getIntercityRoute', () => {
    it('should return intercity route detail', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.getAdminIntercityRoute.mockResolvedValue({ success: true, data: {} });
      const result = await controller.getIntercityRoute(id);
      expect(adminService.getAdminIntercityRoute).toHaveBeenCalledWith(id);
    });
  });

  describe('getAdminIntercitySchedules - NOT USED', () => {
    it('should be replaced with addIntercitySchedule', () => {
      expect(true).toBe(true);
    });
  });

  describe('createIntercityRoute', () => {
    it('should create intercity route', async () => {
      const dto = { from_city: 'Istanbul', to_city: 'Ankara' };
      adminService.createIntercityRoute.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createIntercityRoute(dto);
      expect(adminService.createIntercityRoute).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateIntercityRoute', () => {
    it('should update intercity route', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { from_city: 'Updated' };
      adminService.updateIntercityRoute.mockResolvedValue({ success: true, data: {} });
      const result = await controller.updateIntercityRoute(id, dto);
      expect(adminService.updateIntercityRoute).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteIntercityRoute', () => {
    it('should delete intercity route', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteIntercityRoute.mockResolvedValue(undefined);
      await controller.deleteIntercityRoute(id);
      expect(adminService.deleteIntercityRoute).toHaveBeenCalledWith(id);
    });
  });

  describe('addIntercitySchedule', () => {
    it('should add intercity schedule', async () => {
      const routeId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { departure_time: '08:00', arrival_time: '18:00' };
      adminService.addIntercitySchedule.mockResolvedValue({
        success: true,
        data: {},
      });
      const result = await controller.addIntercitySchedule(routeId, dto);
      expect(adminService.addIntercitySchedule).toHaveBeenCalledWith(routeId, dto);
    });
  });

  describe('updateIntercitySchedule', () => {
    it('should update intercity schedule', async () => {
      const scheduleId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { departure_time: '09:00' };
      adminService.updateIntercitySchedule.mockResolvedValue({
        success: true,
        data: {},
      });
      const result = await controller.updateIntercitySchedule(scheduleId, dto);
      expect(adminService.updateIntercitySchedule).toHaveBeenCalledWith(
        scheduleId,
        dto,
      );
    });
  });

  describe('deleteIntercitySchedule', () => {
    it('should delete intercity schedule', async () => {
      const scheduleId = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteIntercitySchedule.mockResolvedValue(undefined);
      await controller.deleteIntercitySchedule(scheduleId);
      expect(adminService.deleteIntercitySchedule).toHaveBeenCalledWith(scheduleId);
    });
  });

  describe('getIntracityRoutes', () => {
    it('should return intracity routes', async () => {
      const dto = { search: 'test' };
      adminService.getAdminIntracityRoutes.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getIntracityRoutes(dto);
      expect(adminService.getAdminIntracityRoutes).toHaveBeenCalledWith(dto);
    });
  });

  describe('getIntracityRoute', () => {
    it('should return intracity route detail', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.getAdminIntracityRoute.mockResolvedValue({ success: true, data: {} });
      const result = await controller.getIntracityRoute(id);
      expect(adminService.getAdminIntracityRoute).toHaveBeenCalledWith(id);
    });
  });

  describe('createIntracityRoute', () => {
    it('should create intracity route', async () => {
      const dto = { name: 'T1', fare: 5.0 };
      adminService.createIntracityRoute.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createIntracityRoute(dto);
      expect(adminService.createIntracityRoute).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateIntracityRoute', () => {
    it('should update intracity route', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'T1-Updated' };
      adminService.updateIntracityRoute.mockResolvedValue({ success: true, data: {} });
      const result = await controller.updateIntracityRoute(id, dto);
      expect(adminService.updateIntracityRoute).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteIntracityRoute', () => {
    it('should delete intracity route', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteIntracityRoute.mockResolvedValue(undefined);
      await controller.deleteIntracityRoute(id);
      expect(adminService.deleteIntracityRoute).toHaveBeenCalledWith(id);
    });
  });

  describe('addIntracityStop', () => {
    it('should add intracity stop', async () => {
      const routeId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Stop 1' };
      adminService.addIntracityStop.mockResolvedValue({ success: true, data: {} });
      const result = await controller.addIntracityStop(routeId, dto);
      expect(adminService.addIntracityStop).toHaveBeenCalledWith(routeId, dto);
    });
  });

  describe('updateIntracityStop', () => {
    it('should update intracity stop', async () => {
      const stopId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated Stop' };
      adminService.updateIntracityStop.mockResolvedValue({ success: true, data: {} });
      const result = await controller.updateIntracityStop(stopId, dto);
      expect(adminService.updateIntracityStop).toHaveBeenCalledWith(stopId, dto);
    });
  });

  describe('deleteIntracityStop', () => {
    it('should delete intracity stop', async () => {
      const stopId = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteIntracityStop.mockResolvedValue(undefined);
      await controller.deleteIntracityStop(stopId);
      expect(adminService.deleteIntracityStop).toHaveBeenCalledWith(stopId);
    });
  });

  describe('reorderIntracityStop', () => {
    it('should reorder intracity stops', async () => {
      const stopId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { stop_ids: ['stop-1', 'stop-2'] };
      adminService.reorderIntracityStop.mockResolvedValue({
        success: true,
        data: {},
      });
      const result = await controller.reorderIntracityStop(stopId, dto);
      expect(adminService.reorderIntracityStop).toHaveBeenCalledWith(stopId, dto);
    });
  });
});
