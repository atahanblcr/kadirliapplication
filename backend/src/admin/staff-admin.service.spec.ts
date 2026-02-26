import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { StaffAdminService } from './staff-admin.service';
import { User } from '../database/entities/user.entity';
import { AdminPermission } from '../database/entities/admin-permission.entity';
import { UserRole } from '../common/enums/user-role.enum';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeQb(data: any[] = [], total = 0) {
  const qb: any = {};
  const chain = [
    'where',
    'andWhere',
    'orderBy',
    'skip',
    'take',
  ];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getManyAndCount = jest.fn().mockResolvedValue([data, total]);
  return qb;
}

// ─── Factories ──────────────────────────────────────────────────────────────

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-uuid-1',
    email: 'test@example.com',
    username: 'testuser',
    phone: '05331234567',
    password: 'hashed-password',
    role: UserRole.MODERATOR,
    is_active: true,
    created_at: new Date('2026-02-20'),
    ...overrides,
  } as User);

const makePermission = (overrides: Partial<AdminPermission> = {}): AdminPermission =>
  ({
    id: 'perm-uuid-1',
    user_id: 'user-uuid-1',
    module: 'ads',
    can_read: true,
    can_create: true,
    can_update: true,
    can_delete: false,
    can_approve: false,
    ...overrides,
  } as AdminPermission);

// ─── Test Suite ─────────────────────────────────────────────────────────────

describe('StaffAdminService', () => {
  let service: StaffAdminService;
  let userRepo: any;
  let permRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto: any) => dto),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffAdminService,
        { provide: getRepositoryToken(User), useFactory: mockRepo },
        { provide: getRepositoryToken(AdminPermission), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<StaffAdminService>(StaffAdminService);
    userRepo = module.get(getRepositoryToken(User));
    permRepo = module.get(getRepositoryToken(AdminPermission));
  });

  afterEach(() => jest.clearAllMocks());

  // ── getStaffList ────────────────────────────────────────────────────────

  describe('getStaffList', () => {
    it('personel listesini döndürmeli', async () => {
      const requestingUser = makeUser({ role: UserRole.SUPER_ADMIN });
      const staffList = [
        makeUser({ id: 'staff-1', role: UserRole.MODERATOR }),
        makeUser({ id: 'staff-2', role: UserRole.ADMIN }),
      ];
      const qb = makeQb(staffList, 2);

      userRepo.findOne.mockResolvedValue(requestingUser);
      userRepo.createQueryBuilder.mockReturnValue(qb);
      permRepo.find
        .mockResolvedValueOnce([]) // for staff-1
        .mockResolvedValueOnce([]); // for staff-2

      const result = await service.getStaffList('user-uuid-1', { page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('staff-1');
      expect(result.data[1].id).toBe('staff-2');
      expect(qb.where).toHaveBeenCalled();
    });

    it('Moderator da personel listeleyebilmeli', async () => {
      const requestingUser = makeUser({ role: UserRole.MODERATOR });
      const qb = makeQb([], 0);

      userRepo.findOne.mockResolvedValue(requestingUser);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getStaffList('user-uuid-1', { page: 1, limit: 20 });

      expect(result.data).toEqual([]);
      expect(qb.where).toHaveBeenCalled();
    });

    it('Admin da personel listeleyebilmeli', async () => {
      const requestingUser = makeUser({ role: UserRole.ADMIN });
      const qb = makeQb([], 0);

      userRepo.findOne.mockResolvedValue(requestingUser);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getStaffList('user-uuid-1', { page: 1, limit: 20 });

      expect(result.data).toEqual([]);
    });

    it('Normal kullanıcı personel listeleyememelidir', async () => {
      const requestingUser = makeUser({ role: UserRole.USER });

      userRepo.findOne.mockResolvedValue(requestingUser);

      await expect(
        service.getStaffList('user-uuid-1', { page: 1, limit: 20 }),
      ).rejects.toThrow(new ForbiddenException('Only admin staff can list staff members'));
    });

    it('search filtresi uygulanmalı', async () => {
      const requestingUser = makeUser({ role: UserRole.SUPER_ADMIN });
      const qb = makeQb([], 0);

      userRepo.findOne.mockResolvedValue(requestingUser);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getStaffList('user-uuid-1', { search: 'test' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(u.email ILIKE :search OR u.username ILIKE :search OR u.phone LIKE :search)',
        { search: '%test%' },
      );
    });

    it('role filtresi uygulanmalı', async () => {
      const requestingUser = makeUser({ role: UserRole.SUPER_ADMIN });
      const qb = makeQb([], 0);

      userRepo.findOne.mockResolvedValue(requestingUser);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getStaffList('user-uuid-1', { role: UserRole.MODERATOR });

      expect(qb.andWhere).toHaveBeenCalledWith('u.role = :role', { role: UserRole.MODERATOR });
    });

    it('is_active filtresi uygulanmalı', async () => {
      const requestingUser = makeUser({ role: UserRole.SUPER_ADMIN });
      const qb = makeQb([], 0);

      userRepo.findOne.mockResolvedValue(requestingUser);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getStaffList('user-uuid-1', { is_active: false });

      expect(qb.andWhere).toHaveBeenCalledWith('u.is_active = :is_active', { is_active: false });
    });

    it('requestingUser bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getStaffList('nonexistent', { page: 1, limit: 20 }),
      ).rejects.toThrow(new NotFoundException('Requesting user not found'));
    });

    it('personel bilgilerine permissions eklemelidir', async () => {
      const requestingUser = makeUser({ role: UserRole.SUPER_ADMIN });
      const staff = makeUser({ id: 'staff-1', role: UserRole.MODERATOR });
      const permissions = [makePermission({ user_id: 'staff-1' })];
      const qb = makeQb([staff], 1);

      userRepo.findOne.mockResolvedValue(requestingUser);
      userRepo.createQueryBuilder.mockReturnValue(qb);
      permRepo.find.mockResolvedValue(permissions);

      const result = await service.getStaffList('user-uuid-1', { page: 1, limit: 20 });

      expect(result.data[0].permissions).toEqual(permissions);
      expect(result.data[0].permission_count).toBe(1);
    });
  });

  // ── getStaffDetail ──────────────────────────────────────────────────────

  describe('getStaffDetail', () => {
    it('personel detayını döndürmeli', async () => {
      const staff = makeUser({ id: 'staff-1', role: UserRole.MODERATOR });
      const permissions = [makePermission({ user_id: 'staff-1' })];

      userRepo.findOne.mockResolvedValue(staff);
      permRepo.find.mockResolvedValue(permissions);

      const result = await service.getStaffDetail('staff-1');

      expect(result.id).toBe('staff-1');
      expect(result.permissions).toEqual(permissions);
    });

    it('Admin rolündeki personel detayını gösterebilmeli', async () => {
      const staff = makeUser({ id: 'staff-2', role: UserRole.ADMIN });

      userRepo.findOne.mockResolvedValue(staff);
      permRepo.find.mockResolvedValue([]);

      const result = await service.getStaffDetail('staff-2');

      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('Super Admin rolündeki personel detayını gösterebilmeli', async () => {
      const staff = makeUser({ id: 'staff-3', role: UserRole.SUPER_ADMIN });

      userRepo.findOne.mockResolvedValue(staff);
      permRepo.find.mockResolvedValue([]);

      const result = await service.getStaffDetail('staff-3');

      expect(result.role).toBe(UserRole.SUPER_ADMIN);
    });

    it('personel bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getStaffDetail('nonexistent'),
      ).rejects.toThrow(new NotFoundException('Staff member not found'));
    });
  });

  // ── createStaff ─────────────────────────────────────────────────────────

  describe('createStaff', () => {
    it('SUPER_ADMIN tarafından personel oluşturulabilmeli', async () => {
      const superAdmin = makeUser({ id: 'super-admin-1', role: UserRole.SUPER_ADMIN });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin) // requesting user check
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null) // phone check
        .mockResolvedValueOnce(null); // username check

      const newStaff = makeUser({ id: 'new-staff-1', role: UserRole.MODERATOR });
      userRepo.save.mockResolvedValue(newStaff);

      const result = await service.createStaff('super-admin-1', {
        email: 'newstaff@example.com',
        phone: '05331111111',
        username: 'newstaff',
        password: 'securepassword',
        role: UserRole.MODERATOR,
      });

      expect(result.id).toBe('new-staff-1');
      expect(result.role).toBe(UserRole.MODERATOR);
    });

    it('MODERATOR tarafından personel oluşturulamaz', async () => {
      const moderator = makeUser({ role: UserRole.MODERATOR });

      userRepo.findOne.mockResolvedValueOnce(moderator);

      await expect(
        service.createStaff('mod-1', {
          email: 'newstaff@example.com',
          phone: '05331111111',
          username: 'newstaff',
          password: 'password',
          role: UserRole.MODERATOR,
        }),
      ).rejects.toThrow(new ForbiddenException('Only SUPER_ADMIN can create staff members'));
    });

    it('ADMIN rolü oluşturulamaz', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });

      userRepo.findOne.mockResolvedValueOnce(superAdmin);

      await expect(
        service.createStaff('super-admin-1', {
          email: 'newstaff@example.com',
          phone: '05331111111',
          username: 'newstaff',
          password: 'password',
          role: UserRole.USER, // Invalid role
        } as any),
      ).rejects.toThrow(new BadRequestException('Only MODERATOR or ADMIN roles can be created'));
    });

    it('email duplikasyonunu kontrol etmelidir', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const existingUser = makeUser({ email: 'existing@example.com' });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin) // requesting user
        .mockResolvedValueOnce(existingUser); // email check

      await expect(
        service.createStaff('super-admin-1', {
          email: 'existing@example.com',
          phone: '05331111111',
          username: 'newstaff',
          password: 'password',
          role: UserRole.MODERATOR,
        }),
      ).rejects.toThrow(new BadRequestException('Email already in use'));
    });

    it('phone duplikasyonunu kontrol etmelidir', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const existingUser = makeUser({ phone: '05331234567' });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin) // requesting user
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(existingUser); // phone check

      await expect(
        service.createStaff('super-admin-1', {
          email: 'new@example.com',
          phone: '05331234567',
          username: 'newstaff',
          password: 'password',
          role: UserRole.MODERATOR,
        }),
      ).rejects.toThrow(new BadRequestException('Phone already in use'));
    });

    it('username duplikasyonunu kontrol etmelidir', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const existingUser = makeUser({ username: 'existinguser' });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin) // requesting user
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null) // phone check
        .mockResolvedValueOnce(existingUser); // username check

      await expect(
        service.createStaff('super-admin-1', {
          email: 'new@example.com',
          phone: '05331111111',
          username: 'existinguser',
          password: 'password',
          role: UserRole.MODERATOR,
        }),
      ).rejects.toThrow(new BadRequestException('Username already in use'));
    });

    it('şifre hashlenmelidir', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const newStaff = makeUser();
      userRepo.save.mockResolvedValue(newStaff);
      permRepo.save.mockResolvedValue([]);

      await service.createStaff('super-admin-1', {
        email: 'new@example.com',
        phone: '05331111111',
        username: 'newstaff',
        password: 'plainpassword',
        role: UserRole.MODERATOR,
      });

      const createCall = userRepo.create.mock.calls[0][0];
      expect(createCall.password).not.toBe('plainpassword');
      expect(createCall.is_active).toBe(true);
    });
  });

  // ── updateStaff ─────────────────────────────────────────────────────────

  describe('updateStaff', () => {
    it('SUPER_ADMIN personel güncelleyebilmeli', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'staff-1', role: UserRole.MODERATOR });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin) // requesting user
        .mockResolvedValueOnce(targetStaff); // target user

      const updatedStaff = { ...targetStaff, username: 'updated' };
      userRepo.save.mockResolvedValue(updatedStaff);
      permRepo.find.mockResolvedValue([]);

      const result = await service.updateStaff('super-admin-1', 'staff-1', {
        username: 'updated',
      });

      expect(result.username).toBe('updated');
    });

    it('SUPER_ADMIN rolü indirilemez', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'super-admin-2', role: UserRole.SUPER_ADMIN });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(targetStaff);

      await expect(
        service.updateStaff('super-admin-1', 'super-admin-2', {
          role: UserRole.ADMIN,
        }),
      ).rejects.toThrow(new ForbiddenException('Cannot downgrade SUPER_ADMIN role'));
    });

    it('SUPER_ADMIN rolüne yükseltilemez', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'staff-1', role: UserRole.MODERATOR });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(targetStaff);

      await expect(
        service.updateStaff('super-admin-1', 'staff-1', {
          role: UserRole.SUPER_ADMIN,
        }),
      ).rejects.toThrow(new ForbiddenException('Cannot promote to SUPER_ADMIN'));
    });

    it('username duplikasyonunu kontrol etmelidir', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'staff-1' });
      const existingUser = makeUser({ id: 'staff-2', username: 'taken' });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(targetStaff)
        .mockResolvedValueOnce(existingUser);

      await expect(
        service.updateStaff('super-admin-1', 'staff-1', {
          username: 'taken',
        }),
      ).rejects.toThrow(new BadRequestException('Username already in use'));
    });
  });

  // ── updateStaffPermissions ──────────────────────────────────────────────

  describe('updateStaffPermissions', () => {
    it('SUPER_ADMIN personel izinlerini güncelleyebilmeli', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'staff-1', role: UserRole.MODERATOR });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(targetStaff);

      const newPermissions = [makePermission({ user_id: 'staff-1' })];
      permRepo.delete.mockResolvedValue({ affected: 1 });
      permRepo.save.mockResolvedValue(newPermissions);

      const result = await service.updateStaffPermissions('super-admin-1', 'staff-1', {
        permissions: [
          {
            module: 'ads',
            can_read: true,
            can_create: true,
            can_update: false,
            can_delete: false,
            can_approve: false,
          },
        ],
      });

      expect(result).toHaveLength(1);
      expect(result[0].module).toBe('ads');
    });

    it('sadece MODERATOR izinleri güncellenebilmeli', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'staff-1', role: UserRole.ADMIN });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(targetStaff);

      await expect(
        service.updateStaffPermissions('super-admin-1', 'staff-1', {
          permissions: [],
        }),
      ).rejects.toThrow(new BadRequestException('Permissions can only be set for MODERATOR role'));
    });
  });

  // ── deactivateStaff ─────────────────────────────────────────────────────

  describe('deactivateStaff', () => {
    it('personeli pasifleştirebilmeli', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'staff-1', role: UserRole.MODERATOR, is_active: true });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(targetStaff);

      const deactivatedStaff = { ...targetStaff, is_active: false };
      userRepo.save.mockResolvedValue(deactivatedStaff);
      permRepo.find.mockResolvedValue([]);

      const result = await service.deactivateStaff('super-admin-1', 'staff-1');

      expect(result.is_active).toBe(false);
    });

    it('SUPER_ADMIN pasifleştirilemez', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'super-admin-2', role: UserRole.SUPER_ADMIN });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(targetStaff);

      await expect(
        service.deactivateStaff('super-admin-1', 'super-admin-2'),
      ).rejects.toThrow(new ForbiddenException('Cannot deactivate SUPER_ADMIN users'));
    });

    it('sadece SUPER_ADMIN pasifleştirebilir', async () => {
      const moderator = makeUser({ role: UserRole.MODERATOR });

      userRepo.findOne.mockResolvedValueOnce(moderator);

      await expect(
        service.deactivateStaff('mod-1', 'staff-1'),
      ).rejects.toThrow(new ForbiddenException('Only SUPER_ADMIN can deactivate staff members'));
    });
  });

  // ── resetStaffPassword ──────────────────────────────────────────────────

  describe('resetStaffPassword', () => {
    it('şifreyi sıfırlayabilmeli', async () => {
      const superAdmin = makeUser({ role: UserRole.SUPER_ADMIN });
      const targetStaff = makeUser({ id: 'staff-1' });

      userRepo.findOne
        .mockResolvedValueOnce(superAdmin)
        .mockResolvedValueOnce(targetStaff);

      const updatedStaff = { ...targetStaff };
      userRepo.update.mockResolvedValue({ affected: 1 });
      userRepo.findOne.mockResolvedValueOnce(updatedStaff);
      permRepo.find.mockResolvedValue([]);

      const result = await service.resetStaffPassword('super-admin-1', 'staff-1', {
        new_password: 'newsecurepassword',
      });

      expect(result.id).toBe('staff-1');
      expect(userRepo.update).toHaveBeenCalled();
    });

    it('sadece SUPER_ADMIN şifre sıfırlayabilir', async () => {
      const moderator = makeUser({ role: UserRole.MODERATOR });

      userRepo.findOne.mockResolvedValueOnce(moderator);

      await expect(
        service.resetStaffPassword('mod-1', 'staff-1', {
          new_password: 'newpassword',
        }),
      ).rejects.toThrow(new ForbiddenException('Only SUPER_ADMIN can reset staff passwords'));
    });
  });
});
