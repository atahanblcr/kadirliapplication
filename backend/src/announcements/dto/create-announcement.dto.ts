import {
  IsString,
  IsUUID,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsUrl,
  IsDateString,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
  ArrayMaxSize,
} from 'class-validator';

export class CreateAnnouncementDto {
  @IsUUID('4', { message: 'Geçerli bir duyuru tipi seçin' })
  @IsNotEmpty({ message: 'Duyuru tipi boş olamaz' })
  type_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Başlık boş olamaz' })
  @MinLength(5, { message: 'Başlık en az 5 karakter olmalıdır' })
  @MaxLength(200, { message: 'Başlık en fazla 200 karakter olabilir' })
  title: string;

  // Kritik: Plain text, HTML içermemeli (docs/10_CORRECTIONS_AND_UPDATES.md)
  @IsString()
  @IsNotEmpty({ message: 'İçerik boş olamaz' })
  @MinLength(10, { message: 'İçerik en az 10 karakter olmalıdır' })
  @MaxLength(2000, { message: 'İçerik en fazla 2000 karakter olabilir' })
  @Matches(/^[^<>]*$/, { message: 'İçerik HTML içeremez (düz metin kullanın)' })
  body: string;

  @IsEnum(['low', 'normal', 'high', 'emergency'], {
    message: 'Öncelik: low, normal, high veya emergency olmalıdır',
  })
  @IsOptional()
  priority?: 'low' | 'normal' | 'high' | 'emergency' = 'normal';

  @IsEnum(['all', 'neighborhoods', 'users'], {
    message: 'Hedef tipi: all, neighborhoods veya users olmalıdır',
  })
  @IsNotEmpty({ message: 'Hedef tipi boş olamaz' })
  target_type: 'all' | 'neighborhoods' | 'users';

  // Kritik: Mahalle hedefleme → Array (docs/10_CORRECTIONS_AND_UPDATES.md)
  @IsArray({ message: 'Mahalle listesi dizi olmalıdır' })
  @IsString({ each: true })
  @ArrayMaxSize(50)
  @ValidateIf((o) => o.target_type === 'neighborhoods')
  target_neighborhoods?: string[];

  @IsArray({ message: 'Kullanıcı listesi dizi olmalıdır' })
  @IsUUID('4', { each: true })
  @ArrayMaxSize(500)
  @ValidateIf((o) => o.target_type === 'users')
  target_user_ids?: string[];

  @IsDateString({}, { message: 'Geçerli bir tarih girin' })
  @IsOptional()
  scheduled_for?: string;

  @IsDateString({}, { message: 'Geçerli bir tarih girin' })
  @IsOptional()
  visible_until?: string;

  @IsBoolean()
  @IsOptional()
  send_push_notification?: boolean = true;

  @IsUUID('4', { message: 'Geçerli bir dosya UUID girin' })
  @IsOptional()
  pdf_file_id?: string;

  @IsUrl({}, { message: 'Geçerli bir URL girin' })
  @IsOptional()
  external_link?: string;

  @IsBoolean()
  @IsOptional()
  is_recurring?: boolean = false;

  @IsString()
  @MaxLength(100)
  @ValidateIf((o) => o.is_recurring === true)
  recurrence_pattern?: string;
}
