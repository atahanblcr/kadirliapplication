import { Test, TestingModule } from '@nestjs/testing';
import { EventAdminController } from './event-admin.controller';
import { AdminService } from './admin.service';

describe('EventAdminController', () => {
  let controller: EventAdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventAdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getEventCategories: jest.fn(),
            createEventCategory: jest.fn(),
            getAdminEvents: jest.fn(),
            getAdminEvent: jest.fn(),
            createEvent: jest.fn(),
            updateEvent: jest.fn(),
            deleteEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventAdminController>(EventAdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getEventCategories', () => {
    it('should return event categories', () => {
      adminService.getEventCategories.mockReturnValue({ success: true, data: [] });
      const result = controller.getEventCategories();
      expect(result.success).toBe(true);
      expect(adminService.getEventCategories).toHaveBeenCalled();
    });
  });

  describe('createEventCategory', () => {
    it('should create event category', () => {
      const dto = { name: 'Test Category' };
      adminService.createEventCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.createEventCategory(dto);
      expect(adminService.createEventCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('getEvents', () => {
    it('should return events list', () => {
      const dto = {};
      adminService.getAdminEvents.mockReturnValue({ success: true, data: [] });
      const result = controller.getEvents(dto);
      expect(adminService.getAdminEvents).toHaveBeenCalled();
    });
  });

  describe('getEvent', () => {
    it('should return event details', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.getAdminEvent.mockReturnValue({ success: true, data: {} });
      const result = controller.getEvent(id);
      expect(adminService.getAdminEvent).toHaveBeenCalledWith(id);
    });
  });

  describe('createEvent', () => {
    it('should create event', () => {
      const dto = { title: 'Test Event', start_date: '2026-02-28' };
      const userId = 'user-123';
      adminService.createEvent.mockReturnValue({ success: true, data: {} });
      const result = controller.createEvent(dto, userId);
      expect(adminService.createEvent).toHaveBeenCalledWith(dto, userId);
    });
  });

  describe('updateEvent', () => {
    it('should update event', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { title: 'Updated Event' };
      adminService.updateEvent.mockReturnValue({ success: true, data: {} });
      const result = controller.updateEvent(id, dto);
      expect(adminService.updateEvent).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteEvent.mockResolvedValue(undefined);
      await controller.deleteEvent(id);
      expect(adminService.deleteEvent).toHaveBeenCalledWith(id);
    });
  });
});
