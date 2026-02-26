import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGuard } from './permission.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminPermission } from '../../database/entities/admin-permission.entity';
import { UserRole } from '../../common/enums/user-role.enum';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let reflector: Reflector;
  let permissionRepo: any;

  beforeEach(async () => {
    const mockPermissionRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        {
          provide: Reflector,
          useValue: { get: jest.fn() },
        },
        {
          provide: getRepositoryToken(AdminPermission),
          useValue: mockPermissionRepo,
        },
      ],
    }).compile();

    guard = module.get<PermissionGuard>(PermissionGuard);
    reflector = module.get<Reflector>(Reflector);
    permissionRepo = module.get(getRepositoryToken(AdminPermission));
  });

  afterEach(() => jest.clearAllMocks());

  describe('canActivate - no permission required', () => {
    it('should allow access when no @Permission decorator present', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'user-1', role: UserRole.MODERATOR },
          }),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(permissionRepo.findOne).not.toHaveBeenCalled();
    });
  });

  describe('canActivate - SUPER_ADMIN role', () => {
    it('should allow SUPER_ADMIN access regardless of permission', async () => {
      const requirement = { module: 'users', action: 'delete' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'admin-1', role: UserRole.SUPER_ADMIN },
          }),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(permissionRepo.findOne).not.toHaveBeenCalled();
    });
  });

  describe('canActivate - ADMIN role', () => {
    it('should allow ADMIN access regardless of permission', async () => {
      const requirement = { module: 'ads', action: 'approve' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'admin-2', role: UserRole.ADMIN },
          }),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(permissionRepo.findOne).not.toHaveBeenCalled();
    });
  });

  describe('canActivate - MODERATOR role with permission', () => {
    it('should allow MODERATOR with required permission', async () => {
      const requirement = { module: 'users', action: 'create' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      const permission = {
        user_id: 'mod-1',
        module: 'users',
        can_create: true,
        can_read: true,
        can_update: false,
        can_delete: false,
      };

      permissionRepo.findOne.mockResolvedValue(permission);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'mod-1', role: UserRole.MODERATOR },
          }),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(permissionRepo.findOne).toHaveBeenCalledWith({
        where: {
          user_id: 'mod-1',
          module: 'users',
        },
      });
    });

    it('should throw ForbiddenException when MODERATOR lacks module permission', async () => {
      const requirement = { module: 'campaigns', action: 'delete' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      permissionRepo.findOne.mockResolvedValue(null);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'mod-2', role: UserRole.MODERATOR },
          }),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('No permission for this module'),
      );
    });

    it('should throw ForbiddenException when MODERATOR lacks specific action permission', async () => {
      const requirement = { module: 'ads', action: 'delete' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      const permission = {
        user_id: 'mod-3',
        module: 'ads',
        can_create: true,
        can_read: true,
        can_update: true,
        can_delete: false, // Cannot delete
      };

      permissionRepo.findOne.mockResolvedValue(permission);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'mod-3', role: UserRole.MODERATOR },
          }),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('No delete permission for this module'),
      );
    });

    it('should check multiple action permissions correctly', async () => {
      const requirement = { module: 'transport', action: 'read' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      const permission = {
        user_id: 'mod-4',
        module: 'transport',
        can_create: false,
        can_read: true, // Can read
        can_update: false,
        can_delete: false,
      };

      permissionRepo.findOne.mockResolvedValue(permission);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'mod-4', role: UserRole.MODERATOR },
          }),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('canActivate - error handling', () => {
    it('should throw ForbiddenException when user not in request', async () => {
      const requirement = { module: 'users', action: 'read' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}), // No user
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('User not found in request'),
      );
    });

    it('should throw ForbiddenException for unknown role', async () => {
      const requirement = { module: 'users', action: 'read' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'user-unknown', role: 'UNKNOWN_ROLE' },
          }),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('Insufficient permissions'),
      );
    });
  });

  describe('canActivate - integration scenarios', () => {
    it('should handle update permission for MODERATOR', async () => {
      const requirement = { module: 'pharmacy', action: 'update' };
      jest.spyOn(reflector, 'get').mockReturnValue(requirement);

      const permission = {
        user_id: 'mod-5',
        module: 'pharmacy',
        can_create: false,
        can_read: true,
        can_update: true,
        can_delete: false,
      };

      permissionRepo.findOne.mockResolvedValue(permission);

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { user_id: 'mod-5', role: UserRole.MODERATOR },
          }),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });
});
