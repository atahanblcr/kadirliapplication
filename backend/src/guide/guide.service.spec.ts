import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuideService } from './guide.service';
import { GuideCategory, GuideItem } from '../database/entities/guide.entity';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeItemQb(data: any[] = []) {
  const qb: any = {};
  const chain = ['leftJoinAndSelect', 'where', 'andWhere', 'orderBy'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getMany = jest.fn().mockResolvedValue(data);
  return qb;
}

function makeCountQb(rawData: any[] = []) {
  const qb: any = {};
  const chain = ['select', 'addSelect', 'where', 'groupBy'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getRawMany = jest.fn().mockResolvedValue(rawData);
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeCategory = (overrides: Partial<GuideCategory> = {}): GuideCategory =>
  ({
    id: 'cat-uuid-1',
    name: 'Muhtarlıklar',
    slug: 'muhtarliklar',
    icon: 'account_balance',
    color: '#2196F3',
    display_order: 1,
    is_active: true,
    parent_id: null,
    parent: null,
    ...overrides,
  } as GuideCategory);

const makeItem = (overrides: Partial<GuideItem> = {}): GuideItem =>
  ({
    id: 'item-uuid-1',
    name: 'Ali Elektrik',
    category_id: 'cat-uuid-1',
    category: makeCategory({ name: 'Elektrikçi' }),
    phone: '05331234567',
    address: 'Merkez Mah.',
    working_hours: '08:00-18:00',
    is_active: true,
    ...overrides,
  } as GuideItem);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('GuideService', () => {
  let service: GuideService;
  let categoryRepo: any;
  let itemRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuideService,
        { provide: getRepositoryToken(GuideCategory), useFactory: mockRepo },
        { provide: getRepositoryToken(GuideItem), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<GuideService>(GuideService);
    categoryRepo = module.get(getRepositoryToken(GuideCategory));
    itemRepo = module.get(getRepositoryToken(GuideItem));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findCategories ────────────────────────────────────────────────────────

  describe('findCategories', () => {
    it('aktif kategorileri items_count ile döndürmeli', async () => {
      const categories = [makeCategory()];
      categoryRepo.find.mockResolvedValue(categories);
      const countQb = makeCountQb([{ category_id: 'cat-uuid-1', count: '15' }]);
      itemRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].items_count).toBe(15);
    });

    it('kayıt olmayan kategori için items_count=0 dönmeli', async () => {
      const categories = [makeCategory()];
      categoryRepo.find.mockResolvedValue(categories);
      const countQb = makeCountQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories[0].items_count).toBe(0);
    });

    it('kategoriler display_order ASC çekilmeli', async () => {
      categoryRepo.find.mockResolvedValue([]);
      const countQb = makeCountQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(countQb);

      await service.findCategories();

      expect(categoryRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { display_order: 'ASC' },
      });
    });

    it('count sorgusunda sadece aktif kayıtlar sayılmalı', async () => {
      categoryRepo.find.mockResolvedValue([]);
      const countQb = makeCountQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(countQb);

      await service.findCategories();

      expect(countQb.where).toHaveBeenCalledWith(
        'gi.is_active = :active',
        { active: true },
      );
    });

    it('kategorilerde id, name, slug, icon, color alanları bulunmalı', async () => {
      categoryRepo.find.mockResolvedValue([makeCategory()]);
      const countQb = makeCountQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories[0]).toMatchObject({
        id: 'cat-uuid-1',
        name: 'Muhtarlıklar',
        slug: 'muhtarliklar',
        icon: 'account_balance',
        color: '#2196F3',
      });
    });

    it('birden fazla kategori farklı sayılarla doğru eşleşmeli', async () => {
      const categories = [
        makeCategory({ id: 'cat-1' }),
        makeCategory({ id: 'cat-2', name: 'Eczaneler' }),
      ];
      categoryRepo.find.mockResolvedValue(categories);
      const countQb = makeCountQb([
        { category_id: 'cat-1', count: '8' },
        { category_id: 'cat-2', count: '12' },
      ]);
      itemRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories[0].items_count).toBe(8);
      expect(result.categories[1].items_count).toBe(12);
    });

    it('boş kategori listesi döndürmeli', async () => {
      categoryRepo.find.mockResolvedValue([]);
      const countQb = makeCountQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(countQb);

      const result = await service.findCategories();

      expect(result.categories).toEqual([]);
    });
  });

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('aktif kayıtları döndürmeli', async () => {
      const items = [makeItem()];
      const qb = makeItemQb(items);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({});

      expect(result.items).toEqual(items);
    });

    it('sadece aktif kayıtlar filtrelenmeli', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.where).toHaveBeenCalledWith(
        'gi.is_active = :active',
        { active: true },
      );
    });

    it('kategori ve parent ilişkisi yüklenmeli', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('gi.category', 'category');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('category.parent', 'parent');
    });

    it('isim sırasıyla sıralanmalı (ASC)', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.orderBy).toHaveBeenCalledWith('gi.name', 'ASC');
    });

    it('category_id filtresi uygulanmalı', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ category_id: 'cat-uuid-1' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'gi.category_id = :category_id',
        { category_id: 'cat-uuid-1' },
      );
    });

    it('search filtresi name ve address üzerinde ILIKE uygulanmalı', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ search: 'elektrik' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(gi.name ILIKE :search OR gi.address ILIKE :search)',
        { search: '%elektrik%' },
      );
    });

    it('filtre verilmediğinde andWhere çağrılmamalı', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('hem category_id hem search aynı anda kullanılabilmeli', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ category_id: 'cat-uuid-1', search: 'ali' });

      expect(qb.andWhere).toHaveBeenCalledTimes(2);
    });

    it('kayıt yoksa boş array döndürmeli', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ search: 'bulunamaz' });

      expect(result.items).toEqual([]);
    });

    it('search büyük/küçük harf duyarsız (% ile sarmalanmış) olmalı', async () => {
      const qb = makeItemQb([]);
      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ search: 'ELEKTRİK' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        { search: '%ELEKTRİK%' },
      );
    });
  });
});
