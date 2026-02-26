import { Test, TestingModule } from '@nestjs/testing';
import { EventAdminController } from './event-admin.controller';
import { EventAdminService } from './event-admin.service';

describe('EventAdminController', () => {
  let controller: EventAdminController;
  let eventAdminService: jest.Mocked<EventAdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventAdminController],
      providers: [
        {
          provide: EventAdminService,
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
    eventAdminService = module.get(EventAdminService) as jest.Mocked<EventAdminService>;
  });

  describe('getEventCategories', () => {
    it('should return event categories', () => {
      eventAdminService.getEventCategories.mockReturnValue({ success: true, data: [] });
      const result = controller.getEventCategories();
      expect(result.success).toBe(true);
      expect(eventAdminService.getEventCategories).toHaveBeenCalled();
    });
  });

  describe('createEventCategory', () => {
    it('should create event category', () => {
      const dto = { name: 'Test Category' };
      eventAdminService.createEventCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.createEventCategory(dto);
      expect(eventAdminService.createEventCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('getEvents', () => {
    it('should return events list', () => {
      const dto = {};
      eventAdminService.getAdminEvents.mockReturnValue({ success: true, data: [] });
      const result = controller.getEvents(dto);
      expect(eventAdminService.getAdminEvents).toHaveBeenCalled();
    });
  });

  describe('getEvent', () => {
    it('should return event details', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      eventAdminService.getAdminEvent.mockReturnValue({ success: true, data: {} });
      const result = controller.getEvent(id);
      expect(eventAdminService.getAdminEvent).toHaveBeenCalledWith(id);
    });
  });

  describe('createEvent', () => {
    it('should create event', () => {
      const dto = { title: 'Test Event', start_date: '2026-02-28' };
      const userId = 'user-123';
      eventAdminService.createEvent.mockReturnValue({ success: true, data: {} });
      const result = controller.createEvent(dto, userId);
      expect(eventAdminService.createEvent).toHaveBeenCalledWith(dto, userId);
    });
  });

  describe('updateEvent', () => {
    it('should update event', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { title: 'Updated Event' };
      eventAdminService.updateEvent.mockReturnValue({ success: true, data: {} });
      const result = controller.updateEvent(id, dto);
      expect(eventAdminService.updateEvent).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      eventAdminService.deleteEvent.mockResolvedValue(undefined);
      await controller.deleteEvent(id);
      expect(eventAdminService.deleteEvent).toHaveBeenCalledWith(id);
    });
  });
});
