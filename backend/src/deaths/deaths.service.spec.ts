import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DeathsService } from './deaths.service';
import {
  DeathNotice,
  Cemetery,
  Mosque,
} from '../database/entities/death-notice.entity';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeQb(data: any[] = [], total = 0) {
  const qb: any = {};
  const chain = [
    'leftJoinAndSelect', 'where', 'andWhere', 'orderBy',
    'addOrderBy', 'skip', 'take', 'softDelete',
  ];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getManyAndCount = jest.fn().mockResolvedValue([data, total]);
  qb.getCount = jest.fn().mockResolvedValue(total);
  qb.execute = jest.fn().mockResolvedValue({ affected: 0 });
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeNotice = (overrides: Partial<DeathNotice> = {}): DeathNotice =>
  ({
    id: 'notice-uuid-1',
    deceased_name: 'Ahmet YILMAZ',
    age: 75,
    funeral_date: '2026-02-15',
    funeral_time: '14:00',
    cemetery_id: 'cem-uuid-1',
    mosque_id: 'mos-uuid-1',
    condolence_address: 'Merkez Mah.',
    added_by: 'user-uuid-1',
    status: 'approved',
    auto_archive_at: new Date('2026-02-22'),
    created_at: new Date('2026-02-14'),
    ...overrides,
  } as DeathNotice);

const makeCemetery = (): Cemetery =>
  ({
    id: 'cem-uuid-1',
    name: 'Kadirli Merkez Mezarlığı',
    is_active: true,
  } as Cemetery);

const makeMosque = (): Mosque =>
  ({
    id: 'mos-uuid-1',
    name: 'Merkez Camii',
    is_active: true,
  } as Mosque);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('DeathsService', () => {
  let service: DeathsService;
  let noticeRepo: any;
  let cemeteryRepo: any;
  let mosqueRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn((dto: any) => dto),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeathsService,
        { provide: getRepositoryToken(DeathNotice), useFactory: mockRepo },
        { provide: getRepositoryToken(Cemetery), useFactory: mockRepo },
        { provide: getRepositoryToken(Mosque), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<DeathsService>(DeathsService);
    noticeRepo = module.get(getRepositoryToken(DeathNotice));
    cemeteryRepo = module.get(getRepositoryToken(Cemetery));
    mosqueRepo = module.get(getRepositoryToken(Mosque));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('onaylı ilanları sayfalı döndürmeli', async () => {
      const notices = [makeNotice()];
      const qb = makeQb(notices, 1);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.notices).toEqual(notices);
      expect(result.meta.total).toBe(1);
      expect(qb.where).toHaveBeenCalledWith('d.status = :status', { status: 'approved' });
      expect(qb.orderBy).toHaveBeenCalledWith('d.funeral_date', 'DESC');
    });

    it('cenaze tarihine göre filtreleyebilmeli', async () => {
      const qb = makeQb([], 0);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ funeral_date: '2026-02-15' });

      expect(qb.andWhere).toHaveBeenCalledWith('d.funeral_date = :funeralDate', {
        funeralDate: '2026-02-15',
      });
    });

    it('tarih filtresi yoksa andWhere çağrılmamalı', async () => {
      const qb = makeQb([], 0);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.andWhere).not.toHaveBeenCalled();
    });
  });

  // ── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('ilan detayını döndürmeli', async () => {
      const notice = makeNotice();
      noticeRepo.findOne.mockResolvedValue(notice);

      const result = await service.findOne('notice-uuid-1');

      expect(result).toBe(notice);
      expect(noticeRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'notice-uuid-1', status: 'approved' },
        relations: ['cemetery', 'mosque', 'photo_file'],
      });
    });

    it('ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      noticeRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto = {
      deceased_name: 'Ahmet YILMAZ',
      age: 75,
      funeral_date: '2026-02-20',
      funeral_time: '14:00',
      cemetery_id: 'cem-uuid-1',
      mosque_id: 'mos-uuid-1',
      condolence_address: 'Merkez Mah.',
    };

    it('başarıyla vefat ilanı oluşturmalı (status=pending)', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);
      cemeteryRepo.findOne.mockResolvedValue(makeCemetery());
      mosqueRepo.findOne.mockResolvedValue(makeMosque());
      noticeRepo.save.mockResolvedValue({
        id: 'new-notice',
        status: 'pending',
        auto_archive_at: new Date('2026-02-27'),
      });

      const result = await service.create('user-uuid-1', dto);

      expect(result.notice.status).toBe('pending');
      expect(result.notice.id).toBe('new-notice');
    });

    it('auto_archive_at = funeral_date + 7 gün olmalı', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);
      cemeteryRepo.findOne.mockResolvedValue(makeCemetery());
      mosqueRepo.findOne.mockResolvedValue(makeMosque());
      noticeRepo.save.mockImplementation((entity: any) => Promise.resolve(entity));

      await service.create('user-uuid-1', dto);

      const createdArg = noticeRepo.create.mock.calls[0][0];
      const archiveDate = new Date(createdArg.auto_archive_at);
      const expectedDate = new Date('2026-02-27');
      expect(archiveDate.toISOString().slice(0, 10)).toBe(expectedDate.toISOString().slice(0, 10));
    });

    it('mezarlık ve cami bilgisi yoksa BadRequestException fırlatmalı', async () => {
      const noLocationDto = { ...dto, cemetery_id: undefined, mosque_id: undefined };

      await expect(service.create('user-uuid-1', noLocationDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('günlük 2 ilan limitini aşınca BadRequestException fırlatmalı', async () => {
      const qb = makeQb([], 2);
      qb.getCount = jest.fn().mockResolvedValue(2);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(service.create('user-uuid-1', dto)).rejects.toThrow(BadRequestException);
    });

    it('geçersiz mezarlık seçilirse BadRequestException fırlatmalı', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);
      cemeteryRepo.findOne.mockResolvedValue(null);

      await expect(service.create('user-uuid-1', dto)).rejects.toThrow(BadRequestException);
    });

    it('geçersiz cami seçilirse BadRequestException fırlatmalı', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);
      cemeteryRepo.findOne.mockResolvedValue(makeCemetery());
      mosqueRepo.findOne.mockResolvedValue(null);

      await expect(service.create('user-uuid-1', dto)).rejects.toThrow(BadRequestException);
    });

    it('sadece cemetery_id ile oluşturabilmeli (mosque_id opsiyonel)', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      noticeRepo.createQueryBuilder.mockReturnValue(qb);
      cemeteryRepo.findOne.mockResolvedValue(makeCemetery());
      noticeRepo.save.mockImplementation((e: any) => Promise.resolve({ ...e, id: 'n-1', status: 'pending', auto_archive_at: new Date() }));

      const onlyCemeteryDto = { ...dto, mosque_id: undefined };
      const result = await service.create('user-uuid-1', onlyCemeteryDto);

      expect(result.notice.status).toBe('pending');
      expect(mosqueRepo.findOne).not.toHaveBeenCalled();
    });
  });

  // ── findCemeteries ────────────────────────────────────────────────────────

  describe('findCemeteries', () => {
    it('aktif mezarlıkları döndürmeli', async () => {
      const cemeteries = [makeCemetery()];
      cemeteryRepo.find.mockResolvedValue(cemeteries);

      const result = await service.findCemeteries();

      expect(result).toEqual(cemeteries);
      expect(cemeteryRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { name: 'ASC' },
      });
    });
  });

  // ── findMosques ───────────────────────────────────────────────────────────

  describe('findMosques', () => {
    it('aktif camileri döndürmeli', async () => {
      const mosques = [makeMosque()];
      mosqueRepo.find.mockResolvedValue(mosques);

      const result = await service.findMosques();

      expect(result).toEqual(mosques);
      expect(mosqueRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { name: 'ASC' },
      });
    });
  });

  // ── handleAutoArchive (Cron Job) ──────────────────────────────────────────

  describe('handleAutoArchive', () => {
    it('süresi dolan ilanları soft delete yapmalı', async () => {
      const qb = makeQb();
      qb.execute.mockResolvedValue({ affected: 3 });
      noticeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.handleAutoArchive();

      expect(qb.softDelete).toHaveBeenCalled();
      expect(qb.where).toHaveBeenCalledWith('auto_archive_at <= :now', expect.any(Object));
      expect(qb.andWhere).toHaveBeenCalledWith('deleted_at IS NULL');
      expect(qb.execute).toHaveBeenCalled();
    });

    it('arşivlenecek ilan yoksa sorunsuz tamamlanmalı', async () => {
      const qb = makeQb();
      qb.execute.mockResolvedValue({ affected: 0 });
      noticeRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(service.handleAutoArchive()).resolves.not.toThrow();
    });
  });
});
