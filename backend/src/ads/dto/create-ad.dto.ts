import {
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Min,
  ArrayMaxSize,
  ArrayMinSize,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdPropertyDto {
  @IsUUID('4')
  @IsNotEmpty()
  property_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  value: string;
}

export class CreateAdDto {
  @IsUUID('4', { message: 'Geçerli bir kategori seçin' })
  @IsNotEmpty({ message: 'Kategori boş olamaz' })
  category_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Başlık boş olamaz' })
  @MinLength(5, { message: 'Başlık en az 5 karakter olmalıdır' })
  @MaxLength(200, { message: 'Başlık en fazla 200 karakter olabilir' })
  title: string;

  // Plain text — HTML yok (docs/10_CORRECTIONS_AND_UPDATES.md)
  @IsString()
  @IsNotEmpty({ message: 'Açıklama boş olamaz' })
  @MinLength(10, { message: 'Açıklama en az 10 karakter olmalıdır' })
  @MaxLength(2000, { message: 'Açıklama en fazla 2000 karakter olabilir' })
  @Matches(/^[^<>]*$/, { message: 'Açıklama HTML içeremez (düz metin kullanın)' })
  description: string;

  @IsNumber({}, { message: 'Fiyat sayısal olmalıdır' })
  @IsNotEmpty({ message: 'Fiyat boş olamaz' })
  @Min(0, { message: 'Fiyat 0 veya daha büyük olmalıdır' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'İletişim telefonu boş olamaz' })
  @Matches(/^05\d{9}$/, { message: 'Geçerli bir telefon numarası girin (05XXXXXXXXX)' })
  contact_phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  seller_name?: string;

  @IsArray()
  @IsNotEmpty({ message: 'Fotoğraf listesi boş olamaz' })
  @ArrayMinSize(1, { message: 'En az 1 fotoğraf gereklidir' })
  @ArrayMaxSize(5, { message: 'En fazla 5 fotoğraf yüklenebilir' })
  @IsUUID('4', { each: true })
  image_ids: string[];

  @IsUUID('4', { message: 'Kapak fotoğrafı seçin' })
  @IsNotEmpty({ message: 'Kapak fotoğrafı boş olamaz' })
  cover_image_id: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdPropertyDto)
  properties?: AdPropertyDto[];
}
