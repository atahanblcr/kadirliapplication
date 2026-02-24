import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('AdminController', () => {
  let controller: AdminController;
  let service: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const mockService = {
      getDashboard: jest.fn(),
      getApprovals: jest.fn(),
      approveAd: jest.fn(),
      rejectAd: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get(AdminService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /admin/dashboard ──────────────────────────────────────────────────

  describe('getDashboard', () => {
    it('dashboard istatistiklerini döndürmeli', async () => {
      const expected = {
        stats: { total_users: 1000, pending_approvals: { total: 10 } },
        charts: { user_growth: [] },
      };
      service.getDashboard.mockResolvedValue(expected as any);

      const result = await controller.getDashboard();

      expect(result).toEqual(expected);
      expect(service.getDashboard).toHaveBeenCalledTimes(1);
    });
  });

  // ── GET /admin/approvals ──────────────────────────────────────────────────

  describe('getApprovals', () => {
    it('onay bekleyenleri döndürmeli', async () => {
      const expected = { approvals: [], total: 0, page: 1, limit: 50 };
      service.getApprovals.mockResolvedValue(expected);
      const dto = { type: 'ad' as const, page: 1, limit: 50 };

      const result = await controller.getApprovals(dto);

      expect(result).toEqual(expected);
      expect(service.getApprovals).toHaveBeenCalledWith(dto);
    });
  });

  // ── POST /admin/ads/:id/approve ───────────────────────────────────────────

  describe('approveAd', () => {
    it('ilan onaylanmalı', async () => {
      service.approveAd.mockResolvedValue({ message: 'İlan onaylandı' });

      const result = await controller.approveAd('admin-uuid', 'ad-uuid-1');

      expect(result).toEqual({ message: 'İlan onaylandı' });
      expect(service.approveAd).toHaveBeenCalledWith('admin-uuid', 'ad-uuid-1');
    });

    it('service hatası yayılmalı', async () => {
      service.approveAd.mockRejectedValue(new Error('İlan bulunamadı'));

      await expect(
        controller.approveAd('admin-uuid', 'nonexistent'),
      ).rejects.toThrow('İlan bulunamadı');
    });
  });

  // ── POST /admin/ads/:id/reject ────────────────────────────────────────────

  describe('rejectAd', () => {
    it('ilan reddedilmeli', async () => {
      service.rejectAd.mockResolvedValue({ message: 'İlan reddedildi' });
      const dto = { rejected_reason: 'Spam içerik' };

      const result = await controller.rejectAd('admin-uuid', 'ad-uuid-1', dto);

      expect(result).toEqual({ message: 'İlan reddedildi' });
      expect(service.rejectAd).toHaveBeenCalledWith(
        'admin-uuid',
        'ad-uuid-1',
        dto,
      );
    });
  });
});
