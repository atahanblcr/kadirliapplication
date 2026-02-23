import { IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateAdminProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_ ]+$/, {
    message: 'Kullanıcı adı sadece harf, rakam, boşluk ve alt çizgi içerebilir',
  })
  username?: string;
}
