import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

// ─── Fabrika ─────────────────────────────────────────────────────────────────

const makeMulterFile = (
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File =>
  ({
    originalname: 'photo.jpg',
    filename: '1234567890_abc123.jpg',
    mimetype: 'image/jpeg',
    size: 100_000,
    path: './uploads/1234567890_abc123.jpg',
    ...overrides,
  } as Express.Multer.File);

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('FilesController', () => {
  let controller: FilesController;
  let service: jest.Mocked<FilesService>;

  beforeEach(async () => {
    const mockService = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [{ provide: FilesService, useValue: mockService }],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get(FilesService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── POST /files/upload ────────────────────────────────────────────────────

  describe('uploadFile', () => {
    it('dosyayı service\'e iletmeli', async () => {
      const file = makeMulterFile();
      const dto = { module_type: 'ad' as const };
      const expected = {
        file: {
          id: 'file-uuid-1',
          cdn_url: '/uploads/1234567890_abc123.jpg',
        },
      };
      service.uploadFile.mockResolvedValue(expected as any);

      const result = await controller.uploadFile('user-uuid-1', file, dto);

      expect(result).toEqual(expected);
      expect(service.uploadFile).toHaveBeenCalledWith('user-uuid-1', file, dto);
    });

    it('module_id ile birlikte service\'e iletmeli', async () => {
      const file = makeMulterFile();
      const dto = { module_type: 'announcement' as const, module_id: 'mod-uuid-1' };
      service.uploadFile.mockResolvedValue({ file: {} } as any);

      await controller.uploadFile('user-uuid-1', file, dto);

      expect(service.uploadFile).toHaveBeenCalledWith('user-uuid-1', file, dto);
    });

    it('service hatası yayılmalı', async () => {
      service.uploadFile.mockRejectedValue(new Error('Desteklenmeyen dosya tipi'));

      await expect(
        controller.uploadFile('user-uuid-1', makeMulterFile(), {
          module_type: 'ad',
        }),
      ).rejects.toThrow('Desteklenmeyen dosya tipi');
    });
  });

  // ── DELETE /files/:id ─────────────────────────────────────────────────────

  describe('deleteFile', () => {
    it('dosyayı service\'e iletmeli', async () => {
      service.deleteFile.mockResolvedValue({ message: 'Dosya silindi' });

      const result = await controller.deleteFile('user-uuid-1', 'file-uuid-1');

      expect(result).toEqual({ message: 'Dosya silindi' });
      expect(service.deleteFile).toHaveBeenCalledWith(
        'user-uuid-1',
        'file-uuid-1',
      );
    });

    it('service hatası yayılmalı', async () => {
      service.deleteFile.mockRejectedValue(new Error('Dosya bulunamadı'));

      await expect(
        controller.deleteFile('user-uuid-1', 'nonexistent'),
      ).rejects.toThrow('Dosya bulunamadı');
    });
  });
});
