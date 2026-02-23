import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { UploadFileDto } from './dto/upload-file.dto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  // ── DOSYA YÜKLE ───────────────────────────────────────────────────────────

  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    dto: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenmedi');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Desteklenmeyen dosya tipi. İzin verilenler: jpeg, png, webp, pdf',
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('Dosya boyutu 20 MB sınırını aşıyor');
    }

    const fileData: DeepPartial<FileEntity> = {
      original_name: file.originalname,
      file_name: file.filename,
      mime_type: file.mimetype,
      size_bytes: file.size,
      storage_path: file.path,
      cdn_url: `/uploads/${file.filename}`,
      thumbnail_url: undefined,
      module_type: dto.module_type,
      module_id: dto.module_id ?? undefined,
      uploaded_by: userId,
      metadata: undefined,
    };
    const fileEntity = this.fileRepository.create(fileData);

    const saved = await this.fileRepository.save(fileEntity);
    return { file: saved };
  }

  // ── DOSYA SİL ─────────────────────────────────────────────────────────────

  async deleteFile(userId: string, id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException('Dosya bulunamadı');
    }

    if (file.uploaded_by !== userId) {
      throw new ForbiddenException('Bu dosyayı silme yetkiniz yok');
    }

    await this.fileRepository.softDelete(id);
    return { message: 'Dosya silindi' };
  }
}
