import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintsAdminController } from './complaints-admin.controller';
import { ComplaintsAdminService } from './complaints-admin.service';

describe('ComplaintsAdminController', () => {
  let controller: ComplaintsAdminController;
  let complaintsAdminService: jest.Mocked<ComplaintsAdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintsAdminController],
      providers: [
        {
          provide: ComplaintsAdminService,
          useValue: {
            getComplaints: jest.fn(),
            getComplaintById: jest.fn(),
            reviewComplaint: jest.fn(),
            resolveComplaint: jest.fn(),
            rejectComplaint: jest.fn(),
            updateComplaintPriority: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ComplaintsAdminController>(ComplaintsAdminController);
    complaintsAdminService = module.get(ComplaintsAdminService) as jest.Mocked<ComplaintsAdminService>;
  });

  describe('getComplaints', () => {
    it('should return list of complaints', async () => {
      const dto = { status: 'open' };
      complaintsAdminService.getComplaints.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getComplaints(dto);
      expect(complaintsAdminService.getComplaints).toHaveBeenCalledWith(dto);
    });
  });

  describe('getComplaint', () => {
    it('should return complaint details', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      complaintsAdminService.getComplaintById.mockResolvedValue({ success: true, data: {} });
      const result = await controller.getComplaint(id);
      expect(complaintsAdminService.getComplaintById).toHaveBeenCalledWith(id);
    });
  });

  describe('reviewComplaint', () => {
    it('should review a complaint', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const user = { id: 'admin-123' };
      complaintsAdminService.reviewComplaint.mockResolvedValue({ success: true, data: {} });
      const result = await controller.reviewComplaint(id, user);
      expect(complaintsAdminService.reviewComplaint).toHaveBeenCalledWith(id, user.id);
    });
  });

  describe('resolveComplaint', () => {
    it('should resolve a complaint', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { resolution: 'Issue resolved' };
      const user = { id: 'admin-123' };
      complaintsAdminService.resolveComplaint.mockResolvedValue({ success: true, data: {} });
      const result = await controller.resolveComplaint(id, dto, user);
      expect(complaintsAdminService.resolveComplaint).toHaveBeenCalledWith(id, dto, user.id);
    });
  });

  describe('rejectComplaint', () => {
    it('should reject a complaint', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { resolution: 'Invalid complaint' };
      const user = { id: 'admin-123' };
      complaintsAdminService.rejectComplaint.mockResolvedValue({ success: true, data: {} });
      const result = await controller.rejectComplaint(id, dto, user);
      expect(complaintsAdminService.rejectComplaint).toHaveBeenCalledWith(id, dto, user.id);
    });
  });

  describe('updateComplaintPriority', () => {
    it('should update complaint priority', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { priority: 'high' };
      complaintsAdminService.updateComplaintPriority.mockResolvedValue({
        success: true,
        data: {},
      });
      const result = await controller.updateComplaintPriority(id, dto);
      expect(complaintsAdminService.updateComplaintPriority).toHaveBeenCalledWith(
        id,
        dto.priority,
      );
    });
  });
});
