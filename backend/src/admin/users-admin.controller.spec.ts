import { Test, TestingModule } from '@nestjs/testing';
import { UsersAdminController } from './users-admin.controller';
import { AdminService } from './admin.service';

describe('UsersAdminController', () => {
  let controller: UsersAdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getUsers: jest.fn(),
            getUser: jest.fn(),
            banUser: jest.fn(),
            unbanUser: jest.fn(),
            changeUserRole: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersAdminController>(UsersAdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getUsers', () => {
    it('should return list of users', async () => {
      const dto = { search: 'test' };
      adminService.getUsers.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getUsers(dto);
      expect(adminService.getUsers).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUser', () => {
    it('should return user details', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.getUser.mockResolvedValue({ success: true, data: {} });
      const result = await controller.getUser(id);
      expect(adminService.getUser).toHaveBeenCalledWith(id);
    });
  });

  describe('banUser', () => {
    it('should ban a user', async () => {
      const adminId = 'admin-123';
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { reason: 'Spam' };
      adminService.banUser.mockResolvedValue({ success: true, data: {} });
      const result = await controller.banUser(adminId, userId, dto);
      expect(adminService.banUser).toHaveBeenCalledWith(adminId, userId, dto);
    });
  });

  describe('unbanUser', () => {
    it('should unban a user', async () => {
      const adminId = 'admin-123';
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      adminService.unbanUser.mockResolvedValue({ success: true, data: {} });
      const result = await controller.unbanUser(adminId, userId);
      expect(adminService.unbanUser).toHaveBeenCalledWith(adminId, userId);
    });
  });

  describe('changeUserRole', () => {
    it('should change user role', async () => {
      const adminId = 'admin-123';
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { role: 'moderator' };
      adminService.changeUserRole.mockResolvedValue({ success: true, data: {} });
      const result = await controller.changeUserRole(adminId, userId, dto);
      expect(adminService.changeUserRole).toHaveBeenCalledWith(adminId, userId, dto);
    });
  });
});
