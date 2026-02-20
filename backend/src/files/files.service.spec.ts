import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileEntity } from '../database/entities/file.entity';

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

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

const makeFileEntity = (overrides: Partial<FileEntity> = {}): FileEntity =>
  ({
    id: 'file-uuid-1',
    original_name: 'photo.jpg',
    file_name: '1234567890_abc123.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 100_000,
    storage_path: './uploads/1234567890_abc123.jpg',
    cdn_url: '/uploads/1234567890_abc123.jpg',
    thumbnail_url: null,
    module_type: 'ad',
    uploaded_by: 'user-uuid-1',
    ...overrides,
  } as FileEntity);

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('FilesService', () => {
  let service: FilesService;
  let fileRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      softDelete: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: getRepositoryToken(FileEntity), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    fileRepo = module.get(getRepositoryToken(FileEntity));
  });

  afterEach(() => jest.clearAllMocks());

  // ── uploadFile ────────────────────────────────────────────────────────────

  describe('uploadFile', () => {
    it('dosya başarıyla kaydedilmeli', async () => {
      const file = makeMulterFile();
      const entity = makeFileEntity();
      fileRepo.create.mockReturnValue(entity);
      fileRepo.save.mockResolvedValue(entity);

      const result = await service.uploadFile('user-uuid-1', file, {
        module_type: 'ad',
      });

      expect(fileRepo.save).toHaveBeenCalled();
      expect(result.file).toBe(entity);
    });

    it('dosya yoksa BadRequestException fırlatmalı', async () => {
      await expect(
        service.uploadFile('user-uuid-1', null as any, { module_type: 'ad' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('desteklenmeyen mime type için BadRequestException fırlatmalı', async () => {
      const file = makeMulterFile({ mimetype: 'video/mp4' });

      await expect(
        service.uploadFile('user-uuid-1', file, { module_type: 'ad' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('10 MB üzeri dosya için BadRequestException fırlatmalı', async () => {
      const file = makeMulterFile({ size: 11 * 1024 * 1024 });

      await expect(
        service.uploadFile('user-uuid-1', file, { module_type: 'ad' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('cdn_url /uploads/ ile başlamalı', async () => {
      const file = makeMulterFile({ filename: 'test_file.jpg' });
      const entity = makeFileEntity({ cdn_url: '/uploads/test_file.jpg' });
      fileRepo.create.mockReturnValue(entity);
      fileRepo.save.mockResolvedValue(entity);

      const result = await service.uploadFile('user-uuid-1', file, {
        module_type: 'ad',
      });

      expect(result.file.cdn_url).toContain('/uploads/');
    });

    it('create çağrısında doğru alanlar gönderilmeli', async () => {
      const file = makeMulterFile();
      const entity = makeFileEntity();
      fileRepo.create.mockReturnValue(entity);
      fileRepo.save.mockResolvedValue(entity);

      await service.uploadFile('user-uuid-1', file, {
        module_type: 'announcement',
        module_id: 'module-uuid-1',
      });

      expect(fileRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          original_name: 'photo.jpg',
          mime_type: 'image/jpeg',
          size_bytes: 100_000,
          module_type: 'announcement',
          module_id: 'module-uuid-1',
          uploaded_by: 'user-uuid-1',
        }),
      );
    });

    it('module_id olmadan yükleme çalışmalı', async () => {
      const file = makeMulterFile();
      const entity = makeFileEntity({ module_id: null } as any);
      fileRepo.create.mockReturnValue(entity);
      fileRepo.save.mockResolvedValue(entity);

      const result = await service.uploadFile('user-uuid-1', file, {
        module_type: 'ad',
      });

      expect(result.file).toBeDefined();
    });

    it('pdf dosyası kabul edilmeli', async () => {
      const file = makeMulterFile({
        mimetype: 'application/pdf',
        originalname: 'document.pdf',
        filename: 'document_abc.pdf',
      });
      const entity = makeFileEntity({ mime_type: 'application/pdf' });
      fileRepo.create.mockReturnValue(entity);
      fileRepo.save.mockResolvedValue(entity);

      await expect(
        service.uploadFile('user-uuid-1', file, { module_type: 'announcement' }),
      ).resolves.toBeDefined();
    });

    it('image/webp kabul edilmeli', async () => {
      const file = makeMulterFile({ mimetype: 'image/webp' });
      const entity = makeFileEntity({ mime_type: 'image/webp' });
      fileRepo.create.mockReturnValue(entity);
      fileRepo.save.mockResolvedValue(entity);

      await expect(
        service.uploadFile('user-uuid-1', file, { module_type: 'ad' }),
      ).resolves.toBeDefined();
    });
  });

  // ── deleteFile ────────────────────────────────────────────────────────────

  describe('deleteFile', () => {
    it('dosya başarıyla silinmeli', async () => {
      fileRepo.findOne.mockResolvedValue(
        makeFileEntity({ uploaded_by: 'user-uuid-1' }),
      );
      fileRepo.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteFile('user-uuid-1', 'file-uuid-1');

      expect(fileRepo.softDelete).toHaveBeenCalledWith('file-uuid-1');
      expect(result).toEqual({ message: 'Dosya silindi' });
    });

    it('dosya bulunamazsa NotFoundException fırlatmalı', async () => {
      fileRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteFile('user-uuid-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('başkasının dosyası silinememeli (ForbiddenException)', async () => {
      fileRepo.findOne.mockResolvedValue(
        makeFileEntity({ uploaded_by: 'other-user-uuid' }),
      );

      await expect(
        service.deleteFile('user-uuid-1', 'file-uuid-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('softDelete çağrısı yapılmalı', async () => {
      fileRepo.findOne.mockResolvedValue(
        makeFileEntity({ uploaded_by: 'user-uuid-1' }),
      );
      fileRepo.softDelete.mockResolvedValue({ affected: 1 });

      await service.deleteFile('user-uuid-1', 'file-uuid-1');

      expect(fileRepo.softDelete).toHaveBeenCalledTimes(1);
    });
  });
});
