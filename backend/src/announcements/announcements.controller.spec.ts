import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { User } from '../database/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { Announcement } from '../database/entities/announcement.entity';
import { AnnouncementType } from '../database/entities/announcement-type.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { NotFoundException } from '@nestjs/common';

const mockService = {
  findAll: jest.fn(),
  findTypes: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  send: jest.fn(),
};

describe('AnnouncementsController', () => {
  let controller: AnnouncementsController;

  const mockUser: Partial<User> = {
    id: 'user-uuid',
    role: UserRole.USER,
    primary_neighborhood: { slug: 'merkez' } as never,
  };

  const mockAdminUser: Partial<User> = {
    id: 'admin-uuid',
    role: UserRole.ADMIN,
  };

  const mockAnnouncement: Partial<Announcement> = {
    id: 'ann-uuid',
    title: 'Test Duyurusu',
    status: 'published',
  };

  const mockType: Partial<AnnouncementType> = {
    id: 'type-uuid',
    name: 'Elektrik Kesintisi',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [
        { provide: AnnouncementsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<AnnouncementsController>(AnnouncementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GET /announcements/types
  // ─────────────────────────────────────────────────────────────────────────────

  describe('getTypes', () => {
    it('Tip listesini döndürmeli', async () => {
      mockService.findTypes.mockResolvedValue([mockType]);

      const result = await controller.getTypes();

      expect(mockService.findTypes).toHaveBeenCalled();
      expect(result.types).toHaveLength(1);
    });

    it('Boş tip listesi dönebilmeli', async () => {
      mockService.findTypes.mockResolvedValue([]);

      const result = await controller.getTypes();

      expect(result.types).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GET /announcements
  // ─────────────────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('Kullanıcı ve query ile service çağrılmalı', async () => {
      const query = { page: 1, limit: 20 };
      mockService.findAll.mockResolvedValue({
        announcements: [mockAnnouncement],
        meta: { page: 1, limit: 20, total: 1, total_pages: 1, has_next: false, has_prev: false },
      });

      const result = await controller.findAll(mockUser as User, query);

      expect(mockService.findAll).toHaveBeenCalledWith(mockUser, query);
      expect(result.announcements).toHaveLength(1);
    });

    it('Sayfalama meta bilgisi dönmeli', async () => {
      mockService.findAll.mockResolvedValue({
        announcements: [],
        meta: { page: 2, limit: 10, total: 25, total_pages: 3, has_next: true, has_prev: true },
      });

      const result = await controller.findAll(mockUser as User, { page: 2, limit: 10 });

      expect(result.meta.total_pages).toBe(3);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GET /announcements/:id
  // ─────────────────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('Duyuru detayını döndürmeli', async () => {
      mockService.findOne.mockResolvedValue(mockAnnouncement);

      const result = await controller.findOne('ann-uuid', mockUser as User);

      expect(mockService.findOne).toHaveBeenCalledWith('ann-uuid', mockUser);
      expect(result.announcement.id).toBe('ann-uuid');
    });

    it('Service hata fırlatırsa controller iletmeli', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('Duyuru bulunamadı'));

      await expect(
        controller.findOne('non-existent', mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /announcements
  // ─────────────────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto: CreateAnnouncementDto = {
      type_id: 'type-uuid',
      title: 'Yeni Duyuru',
      body: 'Duyuru içeriği en az on karakter',
      target_type: 'all',
      is_recurring: false,
    };

    it('Service.create admin id ile çağrılmalı', async () => {
      mockService.create.mockResolvedValue({
        announcement: mockAnnouncement,
        estimated_recipients: 1000,
      });

      await controller.create(mockAdminUser as User, dto);

      expect(mockService.create).toHaveBeenCalledWith('admin-uuid', dto);
    });

    it('Duyuru ve estimated_recipients dönmeli', async () => {
      mockService.create.mockResolvedValue({
        announcement: mockAnnouncement,
        estimated_recipients: 500,
      });

      const result = await controller.create(mockAdminUser as User, dto);

      expect(result.announcement).toBeDefined();
      expect(result.estimated_recipients).toBe(500);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PATCH /announcements/:id
  // ─────────────────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('Service.update çağrılmalı ve duyuruyu döndürmeli', async () => {
      const updated = { ...mockAnnouncement, title: 'Güncellendi' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('ann-uuid', { title: 'Güncellendi' });

      expect(mockService.update).toHaveBeenCalledWith('ann-uuid', {
        title: 'Güncellendi',
      });
      expect(result.announcement.title).toBe('Güncellendi');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // DELETE /announcements/:id
  // ─────────────────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('Service.remove çağrılmalı ve mesaj dönmeli', async () => {
      mockService.remove.mockResolvedValue({ message: 'Duyuru silindi' });

      const result = await controller.remove('ann-uuid');

      expect(mockService.remove).toHaveBeenCalledWith('ann-uuid');
      expect(result.message).toBe('Duyuru silindi');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /announcements/:id/send
  // ─────────────────────────────────────────────────────────────────────────────

  describe('send', () => {
    it('Service.send çağrılmalı ve sonuç dönmeli', async () => {
      mockService.send.mockResolvedValue({
        message: 'Duyuru gönderiliyor',
        estimated_recipients: 800,
      });

      const result = await controller.send('ann-uuid');

      expect(mockService.send).toHaveBeenCalledWith('ann-uuid');
      expect(result.message).toBe('Duyuru gönderiliyor');
      expect(result.estimated_recipients).toBe(800);
    });
  });
});
