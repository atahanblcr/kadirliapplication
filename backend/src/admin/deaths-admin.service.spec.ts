import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeathsAdminService } from './deaths-admin.service';
import { DeathNotice, Cemetery, Mosque } from '../database/entities/death-notice.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';

describe('DeathsAdminService', () => {
  let service: DeathsAdminService;
  let deathRepo: any;
  let cemeteryRepo: any;
  let mosqueRepo: any;
  let neighborhoodRepo: any;

  const mockDeathNotice = {
    id: 'death-1',
    deceased_name: 'Ali Veli',
    age: 75,
    funeral_date: new Date('2026-02-28'),
    funeral_time: '14:00',
    cemetery_id: 'cemetery-1',
    mosque_id: 'mosque-1',
    condolence_address: 'Test Mahallesi, Merkez',
    photo_file_id: null,
    neighborhood_id: 'neighborhood-1',
    added_by: 'admin-1',
    status: 'approved',
    approved_by: 'admin-1',
    approved_at: new Date(),
    auto_archive_at: new Date('2026-03-07'),
    cemetery: { id: 'cemetery-1', name: 'Test Mezarlığı' },
    mosque: { id: 'mosque-1', name: 'Test Camii' },
    neighborhood: { id: 'neighborhood-1', name: 'Merkez' },
    photo_file: null,
  };

  const mockCemetery = {
    id: 'cemetery-1',
    name: 'Test Mezarlığı',
    location: 'Test Location',
  };

  const mockMosque = {
    id: 'mosque-1',
    name: 'Test Camii',
    location: 'Test Location',
  };

  const mockNeighborhood = {
    id: 'neighborhood-1',
    name: 'Merkez',
    is_active: true,
    display_order: 1,
  };

  beforeEach(async () => {
    // DeathNotice Repository Mock
    deathRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    };

    // Cemetery Repository Mock
    cemeteryRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    // Mosque Repository Mock
    mosqueRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    // Neighborhood Repository Mock
    neighborhoodRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeathsAdminService,
        { provide: getRepositoryToken(DeathNotice), useValue: deathRepo },
        { provide: getRepositoryToken(Cemetery), useValue: cemeteryRepo },
        { provide: getRepositoryToken(Mosque), useValue: mosqueRepo },
        { provide: getRepositoryToken(Neighborhood), useValue: neighborhoodRepo },
      ],
    }).compile();

    service = module.get<DeathsAdminService>(DeathsAdminService);
  });

  describe('getAllDeaths', () => {
    it('should return deaths with default pagination', async () => {
      deathRepo.getManyAndCount.mockResolvedValue([[mockDeathNotice], 1]);

      const result = await service.getAllDeaths({ page: '1', limit: '20' });

      expect(result.notices).toEqual([mockDeathNotice]);
      expect(result.meta).toBeDefined();
      expect(deathRepo.skip).toHaveBeenCalledWith(0);
      expect(deathRepo.take).toHaveBeenCalledWith(20);
    });

    it('should paginate deaths correctly', async () => {
      deathRepo.getManyAndCount.mockResolvedValue([[mockDeathNotice], 100]);

      const result = await service.getAllDeaths({ page: '2', limit: '25' });

      expect(deathRepo.skip).toHaveBeenCalledWith(25); // (2-1) * 25
      expect(deathRepo.take).toHaveBeenCalledWith(25);
    });

    it('should search deaths by deceased name', async () => {
      deathRepo.getManyAndCount.mockResolvedValue([[mockDeathNotice], 1]);

      await service.getAllDeaths({
        page: '1',
        limit: '20',
        search: 'Ali Veli',
      });

      expect(deathRepo.andWhere).toHaveBeenCalledWith(
        'LOWER(d.deceased_name) LIKE :search',
        {
          search: '%ali veli%',
        },
      );
    });

    it('should search with case insensitive', async () => {
      deathRepo.getManyAndCount.mockResolvedValue([[mockDeathNotice], 1]);

      await service.getAllDeaths({
        page: '1',
        limit: '20',
        search: 'ALI VELI',
      });

      expect(deathRepo.andWhere).toHaveBeenCalledWith(
        'LOWER(d.deceased_name) LIKE :search',
        {
          search: '%ali veli%',
        },
      );
    });

    it('should return empty list when no deaths found', async () => {
      deathRepo.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.getAllDeaths({ page: '1', limit: '20' });

      expect(result.notices).toEqual([]);
    });

    it('should handle default string values for pagination', async () => {
      deathRepo.getManyAndCount.mockResolvedValue([[mockDeathNotice], 1]);

      await service.getAllDeaths({});

      expect(deathRepo.skip).toHaveBeenCalledWith(0);
      expect(deathRepo.take).toHaveBeenCalledWith(20);
    });
  });

  describe('createDeath', () => {
    it('should create death notice with auto archive date', async () => {
      const createDto = {
        deceased_name: 'Ali Veli',
        age: 75,
        funeral_date: '2026-02-28',
        funeral_time: '14:00',
        cemetery_id: 'cemetery-1',
        mosque_id: 'mosque-1',
        condolence_address: 'Test Mahallesi',
        photo_file_id: null,
        neighborhood_id: 'neighborhood-1',
      };

      deathRepo.create.mockReturnValue(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValue(mockDeathNotice);

      const result = await service.createDeath('admin-1', createDto);

      expect(result.notice).toBeDefined();
      expect(deathRepo.create).toHaveBeenCalledWith({
        deceased_name: 'Ali Veli',
        age: 75,
        funeral_date: '2026-02-28',
        funeral_time: '14:00',
        cemetery_id: 'cemetery-1',
        mosque_id: 'mosque-1',
        condolence_address: 'Test Mahallesi',
        photo_file_id: null,
        neighborhood_id: 'neighborhood-1',
        added_by: 'admin-1',
        status: 'approved',
        approved_by: 'admin-1',
        approved_at: expect.any(Date),
        auto_archive_at: expect.any(Date),
      });
    });

    it('should set auto_archive_at automatically for deaths', async () => {
      const createDto = {
        deceased_name: 'Test',
        age: 70,
        funeral_date: '2026-02-28',
        funeral_time: '14:00',
        cemetery_id: 'cemetery-1',
        mosque_id: 'mosque-1',
        condolence_address: 'Test',
        photo_file_id: null,
        neighborhood_id: 'neighborhood-1',
      };

      deathRepo.create.mockReturnValue(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValue(mockDeathNotice);

      const result = await service.createDeath('admin-1', createDto);

      expect(result.notice).toBeDefined();
      // Service should calculate auto_archive_at internally
      expect(deathRepo.create).toHaveBeenCalled();
      expect(deathRepo.save).toHaveBeenCalled();
    });

    it('should set status to approved automatically', async () => {
      const createDto = {
        deceased_name: 'Ali Veli',
        age: 75,
        funeral_date: '2026-02-28',
        funeral_time: '14:00',
        cemetery_id: 'cemetery-1',
        mosque_id: 'mosque-1',
        condolence_address: 'Test Mahallesi',
        photo_file_id: null,
        neighborhood_id: 'neighborhood-1',
      };

      deathRepo.create.mockReturnValue(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValue(mockDeathNotice);

      await service.createDeath('admin-1', createDto);

      const callArgs = deathRepo.create.mock.calls[0][0];
      expect(callArgs.status).toBe('approved');
      expect(callArgs.approved_by).toBe('admin-1');
      expect(callArgs.approved_at).toBeDefined();
    });

    it('should load created notice with relations', async () => {
      const createDto = {
        deceased_name: 'Ali Veli',
        age: 75,
        funeral_date: '2026-02-28',
        funeral_time: '14:00',
        cemetery_id: 'cemetery-1',
        mosque_id: 'mosque-1',
        condolence_address: 'Test Mahallesi',
        photo_file_id: null,
        neighborhood_id: 'neighborhood-1',
      };

      deathRepo.create.mockReturnValue(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValue(mockDeathNotice);

      await service.createDeath('admin-1', createDto);

      expect(deathRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockDeathNotice.id },
        relations: ['cemetery', 'mosque', 'neighborhood', 'photo_file'],
      });
    });
  });

  describe('updateDeath', () => {
    it('should update death notice partially', async () => {
      deathRepo.findOne.mockResolvedValue(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);

      const updateDto = {
        deceased_name: 'Ahmed Veli',
        age: 80,
      };

      const result = await service.updateDeath('admin-1', 'death-1', updateDto);

      expect(result.notice).toBeDefined();
      expect(deathRepo.save).toHaveBeenCalled();
    });

    it('should update funeral_date and recalculate auto_archive_at', async () => {
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);

      const updateDto = {
        funeral_date: '2026-03-15',
      };

      await service.updateDeath('admin-1', 'death-1', updateDto);

      expect(deathRepo.save).toHaveBeenCalled();
      // The service should recalculate auto_archive_at
    });

    it('should update cemetery_id', async () => {
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);

      const updateDto = {
        cemetery_id: 'cemetery-2',
      };

      await service.updateDeath('admin-1', 'death-1', updateDto);

      expect(deathRepo.save).toHaveBeenCalled();
    });

    it('should update mosque_id', async () => {
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);

      const updateDto = {
        mosque_id: 'mosque-2',
      };

      await service.updateDeath('admin-1', 'death-1', updateDto);

      expect(deathRepo.save).toHaveBeenCalled();
    });

    it('should update condolence_address', async () => {
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);

      const updateDto = {
        condolence_address: 'New Address',
      };

      await service.updateDeath('admin-1', 'death-1', updateDto);

      expect(deathRepo.save).toHaveBeenCalled();
    });

    it('should update photo_file_id', async () => {
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);

      const updateDto = {
        photo_file_id: 'file-123',
      };

      await service.updateDeath('admin-1', 'death-1', updateDto);

      expect(deathRepo.save).toHaveBeenCalled();
    });

    it('should update neighborhood_id', async () => {
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);

      const updateDto = {
        neighborhood_id: 'neighborhood-2',
      };

      await service.updateDeath('admin-1', 'death-1', updateDto);

      expect(deathRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when death not found', async () => {
      deathRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateDeath('admin-1', 'nonexistent', {}),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateDeath('admin-1', 'nonexistent', {}),
      ).rejects.toThrow('Vefat ilanı bulunamadı');
    });

    it('should load updated notice with relations', async () => {
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);
      deathRepo.save.mockResolvedValue(mockDeathNotice);
      deathRepo.findOne.mockResolvedValueOnce(mockDeathNotice);

      const updateDto = { deceased_name: 'New Name' };

      await service.updateDeath('admin-1', 'death-1', updateDto);

      const lastCall = deathRepo.findOne.mock.calls.pop();
      expect(lastCall[0]).toEqual({
        where: { id: 'death-1' },
        relations: ['cemetery', 'mosque', 'neighborhood', 'photo_file'],
      });
    });
  });

  describe('deleteDeath', () => {
    it('should soft delete death notice', async () => {
      deathRepo.findOne.mockResolvedValue(mockDeathNotice);
      deathRepo.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteDeath('death-1');

      expect(result.success).toBe(true);
      expect(deathRepo.softDelete).toHaveBeenCalledWith('death-1');
    });

    it('should throw NotFoundException when death not found', async () => {
      deathRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteDeath('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteDeath('nonexistent')).rejects.toThrow(
        'Vefat ilanı bulunamadı',
      );
    });
  });

  describe('getCemeteries', () => {
    it('should return list of cemeteries', async () => {
      cemeteryRepo.find.mockResolvedValue([mockCemetery]);

      const result = await service.getCemeteries();

      expect(result.cemeteries).toEqual([mockCemetery]);
      expect(cemeteryRepo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
    });

    it('should return empty list when no cemeteries exist', async () => {
      cemeteryRepo.find.mockResolvedValue([]);

      const result = await service.getCemeteries();

      expect(result.cemeteries).toEqual([]);
    });

    it('should sort cemeteries by name', async () => {
      cemeteryRepo.find.mockResolvedValue([mockCemetery]);

      await service.getCemeteries();

      expect(cemeteryRepo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
    });
  });

  describe('createCemetery', () => {
    it('should create new cemetery', async () => {
      const createDto = { name: 'New Cemetery', location: 'Test Location' };

      cemeteryRepo.create.mockReturnValue(mockCemetery);
      cemeteryRepo.save.mockResolvedValue(mockCemetery);

      const result = await service.createCemetery(createDto);

      expect(result.cemetery).toBeDefined();
      expect(cemeteryRepo.create).toHaveBeenCalledWith(createDto);
      expect(cemeteryRepo.save).toHaveBeenCalledWith(mockCemetery);
    });
  });

  describe('updateCemetery', () => {
    it('should update cemetery', async () => {
      const updateDto = { name: 'Updated Cemetery' };

      cemeteryRepo.findOne.mockResolvedValue(mockCemetery);
      cemeteryRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateCemetery('cemetery-1', updateDto);

      expect(result.cemetery).toBeDefined();
      expect(cemeteryRepo.update).toHaveBeenCalledWith('cemetery-1', updateDto);
    });

    it('should throw NotFoundException when cemetery not found', async () => {
      cemeteryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateCemetery('nonexistent', { name: 'New' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateCemetery('nonexistent', { name: 'New' }),
      ).rejects.toThrow('Mezarlık bulunamadı');
    });
  });

  describe('deleteCemetery', () => {
    it('should delete cemetery', async () => {
      cemeteryRepo.findOne.mockResolvedValue(mockCemetery);
      cemeteryRepo.remove.mockResolvedValue(mockCemetery);

      const result = await service.deleteCemetery('cemetery-1');

      expect(result.message).toBe('Mezarlık silindi');
      expect(cemeteryRepo.remove).toHaveBeenCalledWith(mockCemetery);
    });

    it('should throw NotFoundException when cemetery not found', async () => {
      cemeteryRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteCemetery('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteCemetery('nonexistent')).rejects.toThrow(
        'Mezarlık bulunamadı',
      );
    });
  });

  describe('getMosques', () => {
    it('should return list of mosques', async () => {
      mosqueRepo.find.mockResolvedValue([mockMosque]);

      const result = await service.getMosques();

      expect(result.mosques).toEqual([mockMosque]);
      expect(mosqueRepo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
    });

    it('should return empty list when no mosques exist', async () => {
      mosqueRepo.find.mockResolvedValue([]);

      const result = await service.getMosques();

      expect(result.mosques).toEqual([]);
    });

    it('should sort mosques by name', async () => {
      mosqueRepo.find.mockResolvedValue([mockMosque]);

      await service.getMosques();

      expect(mosqueRepo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
    });
  });

  describe('createMosque', () => {
    it('should create new mosque', async () => {
      const createDto = { name: 'New Mosque', location: 'Test Location' };

      mosqueRepo.create.mockReturnValue(mockMosque);
      mosqueRepo.save.mockResolvedValue(mockMosque);

      const result = await service.createMosque(createDto);

      expect(result.mosque).toBeDefined();
      expect(mosqueRepo.create).toHaveBeenCalledWith(createDto);
      expect(mosqueRepo.save).toHaveBeenCalledWith(mockMosque);
    });
  });

  describe('updateMosque', () => {
    it('should update mosque', async () => {
      const updateDto = { name: 'Updated Mosque' };

      mosqueRepo.findOne.mockResolvedValue(mockMosque);
      mosqueRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateMosque('mosque-1', updateDto);

      expect(result.mosque).toBeDefined();
      expect(mosqueRepo.update).toHaveBeenCalledWith('mosque-1', updateDto);
    });

    it('should throw NotFoundException when mosque not found', async () => {
      mosqueRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateMosque('nonexistent', { name: 'New' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateMosque('nonexistent', { name: 'New' }),
      ).rejects.toThrow('Cami bulunamadı');
    });
  });

  describe('deleteMosque', () => {
    it('should delete mosque', async () => {
      mosqueRepo.findOne.mockResolvedValue(mockMosque);
      mosqueRepo.remove.mockResolvedValue(mockMosque);

      const result = await service.deleteMosque('mosque-1');

      expect(result.message).toBe('Cami silindi');
      expect(mosqueRepo.remove).toHaveBeenCalledWith(mockMosque);
    });

    it('should throw NotFoundException when mosque not found', async () => {
      mosqueRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteMosque('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteMosque('nonexistent')).rejects.toThrow(
        'Cami bulunamadı',
      );
    });
  });

  describe('getDeathNeighborhoods', () => {
    it('should return active neighborhoods sorted by display order and name', async () => {
      neighborhoodRepo.find.mockResolvedValue([mockNeighborhood]);

      const result = await service.getDeathNeighborhoods();

      expect(result.neighborhoods).toEqual([mockNeighborhood]);
      expect(neighborhoodRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { display_order: 'ASC', name: 'ASC' },
      });
    });

    it('should only return active neighborhoods', async () => {
      const inactiveNeighborhood = { ...mockNeighborhood, is_active: false };
      neighborhoodRepo.find.mockResolvedValue([mockNeighborhood]);

      await service.getDeathNeighborhoods();

      expect(neighborhoodRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { display_order: 'ASC', name: 'ASC' },
      });
    });

    it('should return empty list when no active neighborhoods exist', async () => {
      neighborhoodRepo.find.mockResolvedValue([]);

      const result = await service.getDeathNeighborhoods();

      expect(result.neighborhoods).toEqual([]);
    });
  });
});
