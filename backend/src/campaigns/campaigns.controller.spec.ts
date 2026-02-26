import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { User } from '../database/entities/user.entity';
import { Campaign } from '../database/entities/campaign.entity';

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeUser = (): User =>
  ({ id: 'user-uuid-1', role: 'user' } as User);

const makeCampaign = (overrides: Partial<Campaign> = {}): Campaign =>
  ({
    id: 'camp-uuid-1',
    title: 'Kahvelerde %50 İndirim',
    status: 'approved',
    ...overrides,
  } as Campaign);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('CampaignsController', () => {
  let controller: CampaignsController;
  let service: jest.Mocked<CampaignsService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      viewCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [{ provide: CampaignsService, useValue: mockService }],
    }).compile();

    controller = module.get<CampaignsController>(CampaignsController);
    service = module.get(CampaignsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /campaigns ────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('kampanya listesini döndürmeli', async () => {
      const campaigns = [makeCampaign()];
      const expected = { campaigns, meta: { total: 1 } as any };
      service.findAll.mockResolvedValue(expected);

      const result = await controller.findAll({ page: 1, limit: 20 });

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });

    it('filtreleri service\'e iletmeli', async () => {
      service.findAll.mockResolvedValue({ campaigns: [], meta: {} as any });
      const dto = { category_id: 'cat-1', active_only: true };

      await controller.findAll(dto);

      expect(service.findAll).toHaveBeenCalledWith(dto);
    });
  });

  // ── GET /campaigns/:id ────────────────────────────────────────────────────

  describe('findOne', () => {
    it('kampanya detayını döndürmeli', async () => {
      const campaign = makeCampaign();
      const expected = { campaign };
      service.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('camp-uuid-1');

      expect(result).toEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith('camp-uuid-1');
    });

    it('service hatası yayılmalı', async () => {
      service.findOne.mockRejectedValue(new Error('Bulunamadı'));

      await expect(controller.findOne('nonexistent')).rejects.toThrow('Bulunamadı');
    });
  });

  // ── POST /campaigns/:id/view-code ─────────────────────────────────────────

  describe('viewCode', () => {
    it('indirim kodunu döndürmeli', async () => {
      const expected = { discount_code: 'KAHVE50', terms: 'Sadece Pazartesi' };
      service.viewCode.mockResolvedValue(expected);

      const result = await controller.viewCode(makeUser(), 'camp-uuid-1');

      expect(result).toEqual(expected);
      expect(service.viewCode).toHaveBeenCalledWith('user-uuid-1', 'camp-uuid-1');
    });

    it('service hatası yayılmalı', async () => {
      service.viewCode.mockRejectedValue(new Error('Kampanya bulunamadı'));

      await expect(
        controller.viewCode(makeUser(), 'nonexistent'),
      ).rejects.toThrow('Kampanya bulunamadı');
    });
  });

});
