import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComplaintsAdminService } from './complaints-admin.service';
import { Complaint } from '../database/entities/complaint.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ComplaintsAdminService', () => {
  let service: ComplaintsAdminService;
  let mockComplaintRepo: any;

  const mockComplaint = {
    id: 'complaint-1',
    type: 'harassment',
    related_module: 'users',
    related_id: 'target-id',
    subject: 'Test Complaint',
    message: 'Test message',
    reason: 'Test reason',
    priority: 'high',
    evidence_file_ids: ['file-1'],
    status: 'pending',
    admin_notes: null,
    user: { id: 'user-1', full_name: 'Test User', phone: '5551234567' },
    reviewer: null,
    resolver: null,
    reviewed_at: null,
    resolved_at: null,
    created_at: new Date('2026-02-01'),
  };

  beforeEach(async () => {
    mockComplaintRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintsAdminService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: mockComplaintRepo,
        },
      ],
    }).compile();

    service = module.get<ComplaintsAdminService>(ComplaintsAdminService);
  });

  describe('getComplaints', () => {
    it('should return complaints with pagination', async () => {
      mockComplaintRepo.getManyAndCount.mockResolvedValue([[mockComplaint], 1]);

      const result = await service.getComplaints({
        page: 1,
        limit: 20,
      });

      expect(result.complaints).toHaveLength(1);
      expect(result.meta).toBeDefined();
    });

    it('should filter by status', async () => {
      mockComplaintRepo.getManyAndCount.mockResolvedValue([[mockComplaint], 1]);

      await service.getComplaints({
        status: 'pending',
        page: 1,
        limit: 20,
      });

      expect(mockComplaintRepo.andWhere).toHaveBeenCalledWith('c.status = :status', {
        status: 'pending',
      });
    });
  });

  describe('getComplaintById', () => {
    it('should return complaint by id', async () => {
      mockComplaintRepo.findOne.mockResolvedValue(mockComplaint);

      const result = await service.getComplaintById('complaint-1');

      expect(result.complaint.id).toBe('complaint-1');
    });

    it('should throw NotFoundException when complaint not found', async () => {
      mockComplaintRepo.findOne.mockResolvedValue(null);

      await expect(service.getComplaintById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('reviewComplaint', () => {
    it('should update complaint status to reviewing', async () => {
      mockComplaintRepo.findOne
        .mockResolvedValueOnce(mockComplaint)
        .mockResolvedValueOnce({
          ...mockComplaint,
          status: 'reviewing',
          reviewed_by: 'admin-1',
          reviewed_at: expect.any(Date),
        });

      const result = await service.reviewComplaint('complaint-1', 'admin-1');

      expect(result.complaint.status).toBe('reviewing');
    });

    it('should throw BadRequestException for non-pending complaint', async () => {
      mockComplaintRepo.findOne.mockResolvedValue({
        ...mockComplaint,
        status: 'resolved',
      });

      await expect(
        service.reviewComplaint('complaint-1', 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resolveComplaint', () => {
    it('should resolve complaint', async () => {
      mockComplaintRepo.findOne
        .mockResolvedValueOnce(mockComplaint)
        .mockResolvedValueOnce({
          ...mockComplaint,
          status: 'resolved',
          admin_notes: 'Resolved',
          resolved_by: 'admin-1',
          resolved_at: expect.any(Date),
        });

      const result = await service.resolveComplaint(
        'complaint-1',
        { admin_response: 'Resolved' },
        'admin-1',
      );

      expect(result.complaint.status).toBe('resolved');
    });

    it('should throw BadRequestException when admin_response is missing', async () => {
      mockComplaintRepo.findOne.mockResolvedValue(mockComplaint);

      await expect(
        service.resolveComplaint('complaint-1', { admin_response: '' }, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('rejectComplaint', () => {
    it('should reject complaint', async () => {
      mockComplaintRepo.findOne
        .mockResolvedValueOnce(mockComplaint)
        .mockResolvedValueOnce({
          ...mockComplaint,
          status: 'rejected',
          admin_notes: 'Invalid complaint',
          resolved_by: 'admin-1',
          resolved_at: expect.any(Date),
        });

      const result = await service.rejectComplaint(
        'complaint-1',
        { admin_response: 'Invalid complaint' },
        'admin-1',
      );

      expect(result.complaint.status).toBe('rejected');
    });
  });

  describe('updateComplaintPriority', () => {
    it('should update complaint priority', async () => {
      mockComplaintRepo.findOne
        .mockResolvedValueOnce(mockComplaint)
        .mockResolvedValueOnce({
          ...mockComplaint,
          priority: 'urgent',
        });

      const result = await service.updateComplaintPriority('complaint-1', 'urgent');

      expect(result.complaint.priority).toBe('urgent');
    });

    it('should throw BadRequestException for invalid priority', async () => {
      await expect(
        service.updateComplaintPriority('complaint-1', 'invalid'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
