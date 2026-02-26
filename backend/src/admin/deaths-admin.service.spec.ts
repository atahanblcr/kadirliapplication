import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeathsAdminService } from './deaths-admin.service';
import { DeathNotice, Cemetery, Mosque } from '../database/entities/death-notice.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';

describe('DeathsAdminService', () => {
  let service: DeathsAdminService;
  let deathRepo: any;
  let cemeteryRepo: any;
  let mosqueRepo: any;
  let neighborhoodRepo: any;

  beforeEach(async () => {
    deathRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    };

    cemeteryRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    mosqueRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    neighborhoodRepo = {
      find: jest.fn().mockResolvedValue([]),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all deaths', async () => {
    const result = await service.getAllDeaths({ page: '1', limit: '20' });
    expect(result.notices).toBeDefined();
  });

  it('should get cemeteries', async () => {
    const result = await service.getCemeteries();
    expect(result.cemeteries).toBeDefined();
  });

  it('should get mosques', async () => {
    const result = await service.getMosques();
    expect(result.mosques).toBeDefined();
  });

  it('should get death neighborhoods', async () => {
    const result = await service.getDeathNeighborhoods();
    expect(result.neighborhoods).toBeDefined();
  });
});
