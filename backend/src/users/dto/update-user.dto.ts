import {
  IsString,
  IsInt,
  IsUUID,
  IsEnum,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir',
  })
  username?: string;

  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsUUID('4')
  primary_neighborhood_id?: string;

  @IsOptional()
  @IsEnum(['neighborhood', 'village'])
  location_type?: 'neighborhood' | 'village';
}
