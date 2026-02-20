import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  const makeContext = (userRole: UserRole | null): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: userRole ? { role: userRole } : null,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Rol gerekmiyorsa (ROLES_KEY yok) → true dönmeli', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const ctx = makeContext(UserRole.USER);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('Kullanıcı doğru role sahipse → true dönmeli', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
    const ctx = makeContext(UserRole.ADMIN);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('Kullanıcı yetersiz role sahipse → false dönmeli', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
    const ctx = makeContext(UserRole.USER);

    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('Birden fazla izinli rolden biri eşleşirse → true dönmeli', () => {
    reflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.MODERATOR,
    ]);
    const ctx = makeContext(UserRole.MODERATOR);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('Kullanıcı null ise → false dönmeli', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
    const ctx = makeContext(null);

    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('Reflector ROLES_KEY ile çağrılmalı', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const ctx = makeContext(UserRole.USER);

    guard.canActivate(ctx);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
  });

  it('SUPER_ADMIN sadece super_admin gerektiğinde geçmeli', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);
    const ctx = makeContext(UserRole.ADMIN);

    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('SUPER_ADMIN → super_admin rolü gerektiğinde true dönmeli', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);
    const ctx = makeContext(UserRole.SUPER_ADMIN);

    expect(guard.canActivate(ctx)).toBe(true);
  });
});
