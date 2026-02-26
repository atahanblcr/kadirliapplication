import { Test, TestingModule } from '@nestjs/testing';
import { UsersAdminController } from './users-admin.controller';
import { UsersAdminService } from './users-admin.service';

describe('UsersAdminController', () => {
  let controller: UsersAdminController;
  let usersAdminService: jest.Mocked<UsersAdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAdminController],
      providers: [
        {
          provide: UsersAdminService,
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
    usersAdminService = module.get(UsersAdminService) as jest.Mocked<UsersAdminService>;
  });

  describe('getUsers', () => {
    it('should return list of users', async () => {
      const dto = { search: 'test' };
      usersAdminService.getUsers.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getUsers(dto);
      expect(usersAdminService.getUsers).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUser', () => {
    it('should return user details', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      usersAdminService.getUser.mockResolvedValue({ success: true, data: {} });
      const result = await controller.getUser(id);
      expect(usersAdminService.getUser).toHaveBeenCalledWith(id);
    });
  });

  describe('banUser', () => {
    it('should ban a user', async () => {
      const adminId = 'admin-123';
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { reason: 'Spam' };
      usersAdminService.banUser.mockResolvedValue({ success: true, data: {} });
      const result = await controller.banUser(adminId, userId, dto);
      expect(usersAdminService.banUser).toHaveBeenCalledWith(adminId, userId, dto);
    });
  });

  describe('unbanUser', () => {
    it('should unban a user', async () => {
      const adminId = 'admin-123';
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      usersAdminService.unbanUser.mockResolvedValue({ success: true, data: {} });
      const result = await controller.unbanUser(adminId, userId);
      expect(usersAdminService.unbanUser).toHaveBeenCalledWith(adminId, userId);
    });
  });

  describe('changeUserRole', () => {
    it('should change user role', async () => {
      const adminId = 'admin-123';
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { role: 'moderator' };
      usersAdminService.changeUserRole.mockResolvedValue({ success: true, data: {} });
      const result = await controller.changeUserRole(adminId, userId, dto);
      expect(usersAdminService.changeUserRole).toHaveBeenCalledWith(adminId, userId, dto);
    });
  });
});
