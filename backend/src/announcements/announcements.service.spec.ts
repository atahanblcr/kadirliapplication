import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsService } from './announcements.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Announcement } from '../database/entities/announcement.entity';
import { AnnouncementType } from '../database/entities/announcement-type.entity';
import { User } from '../database/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

// ── Mock factory ──────────────────────────────────────────────────────────────

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  update: jest.fn(),
  increment: jest.fn(),
  softDelete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

// ── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser: Partial<User> = {
  id: 'user-uuid-1234',
  phone: '05331234567',
  role: UserRole.USER,
  primary_neighborhood: { id: 'nb-uuid', slug: 'merkez', name: 'Merkez' } as never,
  primary_neighborhood_id: 'nb-uuid',
};

const mockAdminUser: Partial<User> = {
  id: 'admin-uuid',
  role: UserRole.ADMIN,
};

const mockType: Partial<AnnouncementType> = {
  id: 'type-uuid',
  name: 'Elektrik Kesintisi',
  slug: 'power-outage',
  is_active: true,
};

const mockAnnouncement: Partial<Announcement> = {
  id: 'ann-uuid',
  type_id: 'type-uuid',
  title: 'Merkez Elektrik Kesintisi',
  body: 'Test duyuru içeriği',
  priority: 'high',
  status: 'published',
  target_type: 'all',
  view_count: 5,
  has_pdf: false,
  has_link: false,
  send_push_notification: true,
  created_by: 'admin-uuid',
  sent_at: new Date(),
};

// ── QueryBuilder mock ─────────────────────────────────────────────────────────

const makeQb = (results: [Announcement[], number]) => {
  const qb = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue(results),
  };
  return qb;
};

// ─────────────────────────────────────────────────────────────────────────────

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let announcementRepo: ReturnType<typeof mockRepository>;
  let typeRepo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(Announcement),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(AnnouncementType),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
    announcementRepo = module.get(getRepositoryToken(Announcement));
    typeRepo = module.get(getRepositoryToken(AnnouncementType));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // findAll
  // ─────────────────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('Yayınlanmış duyuruları sayfalı döndürmeli', async () => {
      const qb = makeQb([[mockAnnouncement as Announcement], 1]);
      announcementRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll(mockUser as User, { page: 1, limit: 20 });

      expect(result.announcements).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('QueryBuilder status=published filtresi uygulanmalı', async () => {
      const qb = makeQb([[], 0]);
      announcementRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll(mockUser as User, {});

      expect(qb.where).toHaveBeenCalledWith('a.status = :status', {
        status: 'published',
      });
    });

    it('type_id filtresi uygulanmalı', async () => {
      const qb = makeQb([[], 0]);
      announcementRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll(mockUser as User, { type_id: 'type-uuid' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'a.type_id = :typeId',
        { typeId: 'type-uuid' },
      );
    });

    it('priority filtresi uygulanmalı', async () => {
      const qb = makeQb([[], 0]);
      announcementRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll(mockUser as User, { priority: 'high' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'a.priority = :priority',
        { priority: 'high' },
      );
    });

    it('Sayfalama meta bilgisi doğru hesaplanmalı', async () => {
      const qb = makeQb([new Array(10).fill(mockAnnouncement) as Announcement[], 35]);
      announcementRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll(mockUser as User, { page: 2, limit: 10 });

      expect(result.meta.total).toBe(35);
      expect(result.meta.total_pages).toBe(4);
      expect(result.meta.has_prev).toBe(true);
      expect(result.meta.has_next).toBe(true);
    });

    it('Filtre yoksa type_id andWhere çağrılmamalı', async () => {
      const qb = makeQb([[], 0]);
      announcementRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll(mockUser as User, {});

      const typeIdCalls = (qb.andWhere as jest.Mock).mock.calls.filter(
        (call) => call[0] === 'a.type_id = :typeId',
      );
      expect(typeIdCalls).toHaveLength(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // findTypes
  // ─────────────────────────────────────────────────────────────────────────────

  describe('findTypes', () => {
    it('Aktif duyuru tiplerini döndürmeli', async () => {
      typeRepo.find.mockResolvedValue([mockType]);

      const result = await service.findTypes();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Elektrik Kesintisi');
    });

    it('Sadece is_active=true olanlar sorgulanmalı', async () => {
      typeRepo.find.mockResolvedValue([]);

      await service.findTypes();

      expect(typeRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { display_order: 'ASC' },
      });
    });

    it('Boş liste dönebilmeli', async () => {
      typeRepo.find.mockResolvedValue([]);

      const result = await service.findTypes();

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // findOne
  // ─────────────────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('Duyuru bulunursa detayı döndürmeli', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);
      announcementRepo.increment.mockResolvedValue(undefined);

      const result = await service.findOne('ann-uuid', mockUser as User);

      expect(result.id).toBe('ann-uuid');
    });

    it('Görüntülenince view_count artırılmalı', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);
      announcementRepo.increment.mockResolvedValue(undefined);

      await service.findOne('ann-uuid', mockUser as User);

      expect(announcementRepo.increment).toHaveBeenCalledWith(
        { id: 'ann-uuid' },
        'view_count',
        1,
      );
    });

    it('Duyuru yoksa NotFoundException fırlatmalı', async () => {
      announcementRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent', mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('relations ile sorgu yapılmalı', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);
      announcementRepo.increment.mockResolvedValue(undefined);

      await service.findOne('ann-uuid', mockUser as User);

      expect(announcementRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: ['type', 'pdf_file', 'creator'],
        }),
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // create
  // ─────────────────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto: CreateAnnouncementDto = {
      type_id: 'type-uuid',
      title: 'Test Duyurusu',
      body: 'Test duyuru içeriği minimum on karakter',
      priority: 'normal',
      target_type: 'all',
      send_push_notification: true,
      is_recurring: false,
    };

    it('Manuel duyuru → status=published olarak oluşturulmalı', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);
      announcementRepo.create.mockReturnValue({ ...mockAnnouncement, status: 'published' });
      announcementRepo.save.mockResolvedValue({ ...mockAnnouncement, status: 'published' });

      const result = await service.create('admin-uuid', dto);

      const createCall = announcementRepo.create.mock.calls[0][0];
      expect(createCall.status).toBe('published');
    });

    it('Geçersiz tip → BadRequestException fırlatmalı', async () => {
      typeRepo.findOne.mockResolvedValue(null);

      await expect(service.create('admin-uuid', dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create('admin-uuid', dto)).rejects.toThrow(
        'Geçersiz veya aktif olmayan duyuru tipi',
      );
    });

    it('neighborhoods hedeflemesi ile boş array → BadRequestException', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);

      await expect(
        service.create('admin-uuid', {
          ...dto,
          target_type: 'neighborhoods',
          target_neighborhoods: [],
        }),
      ).rejects.toThrow('Mahalle hedeflemesi için en az bir mahalle seçilmeli');
    });

    it('users hedeflemesi ile boş array → BadRequestException', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);

      await expect(
        service.create('admin-uuid', {
          ...dto,
          target_type: 'users',
          target_user_ids: [],
        }),
      ).rejects.toThrow('Kullanıcı hedeflemesi için en az bir kullanıcı seçilmeli');
    });

    it('has_pdf pdf_file_id varlığına göre ayarlanmalı', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);
      announcementRepo.create.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      await service.create('admin-uuid', { ...dto, pdf_file_id: 'file-uuid' });

      const createCall = announcementRepo.create.mock.calls[0][0];
      expect(createCall.has_pdf).toBe(true);
    });

    it('has_link external_link varlığına göre ayarlanmalı', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);
      announcementRepo.create.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      await service.create('admin-uuid', {
        ...dto,
        external_link: 'https://example.com',
      });

      const createCall = announcementRepo.create.mock.calls[0][0];
      expect(createCall.has_link).toBe(true);
    });

    it('created_by kullanıcı id olarak set edilmeli', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);
      announcementRepo.create.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      await service.create('admin-uuid', dto);

      const createCall = announcementRepo.create.mock.calls[0][0];
      expect(createCall.created_by).toBe('admin-uuid');
    });

    it('estimated_recipients döndürülmeli', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);
      announcementRepo.create.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      const result = await service.create('admin-uuid', dto);

      expect(result.estimated_recipients).toBeDefined();
      expect(typeof result.estimated_recipients).toBe('number');
    });

    it('neighborhoods hedeflemesinde estimated_recipients mahalle * 200 olmalı', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);
      announcementRepo.create.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      const result = await service.create('admin-uuid', {
        ...dto,
        target_type: 'neighborhoods',
        target_neighborhoods: ['merkez', 'akdam'],
      });

      expect(result.estimated_recipients).toBe(400); // 2 * 200
    });

    it('users hedeflemesinde estimated_recipients kullanıcı sayısına eşit olmalı', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);
      announcementRepo.create.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      const result = await service.create('admin-uuid', {
        ...dto,
        target_type: 'users',
        target_user_ids: ['u1', 'u2', 'u3'],
      });

      expect(result.estimated_recipients).toBe(3);
    });

    it('all hedeflemesinde estimated_recipients 1000 olmalı', async () => {
      typeRepo.findOne.mockResolvedValue(mockType);
      announcementRepo.create.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      const result = await service.create('admin-uuid', { ...dto, target_type: 'all' });

      expect(result.estimated_recipients).toBe(1000);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // update
  // ─────────────────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('Duyuru bulunamazsa NotFoundException fırlatmalı', async () => {
      announcementRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { title: 'Yeni Başlık' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('Başarılı güncelleme → duyuruyu döndürmeli', async () => {
      const updatedAnn = { ...mockAnnouncement, title: 'Yeni Başlık' };
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);
      announcementRepo.merge.mockReturnValue(updatedAnn);
      announcementRepo.save.mockResolvedValue(updatedAnn);

      const result = await service.update('ann-uuid', { title: 'Yeni Başlık' });

      expect(result.title).toBe('Yeni Başlık');
    });

    it('type_id değişiyorsa tip kontrolü yapılmalı', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);
      typeRepo.findOne.mockResolvedValue(null); // tip bulunamadı

      await expect(
        service.update('ann-uuid', { type_id: 'new-type-uuid' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('type_id değişmiyorsa tip sorgusu yapılmamalı', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);
      announcementRepo.merge.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      await service.update('ann-uuid', { title: 'Başlık' });

      expect(typeRepo.findOne).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // remove
  // ─────────────────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('Duyuruyu soft delete etmeli', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);
      announcementRepo.softDelete.mockResolvedValue(undefined);

      const result = await service.remove('ann-uuid');

      expect(announcementRepo.softDelete).toHaveBeenCalledWith('ann-uuid');
      expect(result.message).toBe('Duyuru silindi');
    });

    it('Duyuru yoksa NotFoundException fırlatmalı', async () => {
      announcementRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // send
  // ─────────────────────────────────────────────────────────────────────────────

  describe('send', () => {
    it('Duyuruyu published yapmalı ve sent_at kaydetmeli', async () => {
      const unsent = { ...mockAnnouncement, sent_at: null, status: 'draft' };
      announcementRepo.findOne.mockResolvedValue(unsent);
      announcementRepo.update.mockResolvedValue(undefined);

      await service.send('ann-uuid');

      expect(announcementRepo.update).toHaveBeenCalledWith(
        'ann-uuid',
        expect.objectContaining({ status: 'published' }),
      );
    });

    it('Zaten gönderilen duyuru → BadRequestException fırlatmalı', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement); // sent_at dolu

      await expect(service.send('ann-uuid')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.send('ann-uuid')).rejects.toThrow(
        'Duyuru zaten gönderildi',
      );
    });

    it('Duyuru bulunamazsa NotFoundException fırlatmalı', async () => {
      announcementRepo.findOne.mockResolvedValue(null);

      await expect(service.send('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('estimated_recipients döndürmeli', async () => {
      const unsent = { ...mockAnnouncement, sent_at: null };
      announcementRepo.findOne.mockResolvedValue(unsent);
      announcementRepo.update.mockResolvedValue(undefined);

      const result = await service.send('ann-uuid');

      expect(result.message).toBe('Duyuru gönderiliyor');
      expect(result.estimated_recipients).toBeDefined();
    });

    it('users hedefli duyuru göndermede kullanıcı sayısı döndürmeli', async () => {
      const unsent = {
        ...mockAnnouncement,
        sent_at: null,
        target_type: 'users',
        target_user_ids: ['u1', 'u2'],
      };
      announcementRepo.findOne.mockResolvedValue(unsent);
      announcementRepo.update.mockResolvedValue(undefined);

      const result = await service.send('ann-uuid');

      expect(result.estimated_recipients).toBe(2);
    });
  });
});
