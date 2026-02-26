import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintsAdminController } from './complaints-admin.controller';
import { AdminService } from './admin.service';

describe('ComplaintsAdminController', () => {
  let controller: ComplaintsAdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintsAdminController],
      providers: [
        {
          provide: AdminService,
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
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getComplaints', () => {
    it('should return list of complaints', async () => {
      const dto = { status: 'open' };
      adminService.getComplaints.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getComplaints(dto);
      expect(adminService.getComplaints).toHaveBeenCalledWith(dto);
    });
  });

  describe('getComplaint', () => {
    it('should return complaint details', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.getComplaintById.mockResolvedValue({ success: true, data: {} });
      const result = await controller.getComplaint(id);
      expect(adminService.getComplaintById).toHaveBeenCalledWith(id);
    });
  });

  describe('reviewComplaint', () => {
    it('should review a complaint', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const user = { id: 'admin-123' };
      adminService.reviewComplaint.mockResolvedValue({ success: true, data: {} });
      const result = await controller.reviewComplaint(id, user);
      expect(adminService.reviewComplaint).toHaveBeenCalledWith(id, user.id);
    });
  });

  describe('resolveComplaint', () => {
    it('should resolve a complaint', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { resolution: 'Issue resolved' };
      const user = { id: 'admin-123' };
      adminService.resolveComplaint.mockResolvedValue({ success: true, data: {} });
      const result = await controller.resolveComplaint(id, dto, user);
      expect(adminService.resolveComplaint).toHaveBeenCalledWith(id, dto, user.id);
    });
  });

  describe('rejectComplaint', () => {
    it('should reject a complaint', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { resolution: 'Invalid complaint' };
      const user = { id: 'admin-123' };
      adminService.rejectComplaint.mockResolvedValue({ success: true, data: {} });
      const result = await controller.rejectComplaint(id, dto, user);
      expect(adminService.rejectComplaint).toHaveBeenCalledWith(id, dto, user.id);
    });
  });

  describe('updateComplaintPriority', () => {
    it('should update complaint priority', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { priority: 'high' };
      adminService.updateComplaintPriority.mockResolvedValue({
        success: true,
        data: {},
      });
      const result = await controller.updateComplaintPriority(id, dto);
      expect(adminService.updateComplaintPriority).toHaveBeenCalledWith(
        id,
        dto.priority,
      );
    });
  });
});
