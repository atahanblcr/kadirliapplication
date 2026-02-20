import {
  IsString,
  IsInt,
  IsUUID,
  IsBoolean,
  IsEnum,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Kullanıcı adı en az 3 karakter olmalıdır' })
  @MaxLength(50, { message: 'Kullanıcı adı en fazla 50 karakter olabilir' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir',
  })
  username: string;

  @IsInt()
  @Min(13, { message: 'Yaş en az 13 olmalıdır' })
  @Max(120, { message: 'Geçerli bir yaş girin' })
  age: number;

  @IsEnum(['neighborhood', 'village'], {
    message: 'Konum tipi "neighborhood" veya "village" olmalıdır',
  })
  location_type: 'neighborhood' | 'village';

  @IsUUID('4', { message: 'Geçerli bir mahalle seçin' })
  primary_neighborhood_id: string;

  @IsBoolean()
  accept_terms: boolean;
}
