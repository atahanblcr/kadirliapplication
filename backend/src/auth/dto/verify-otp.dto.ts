import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Telefon numarası boş olamaz' })
  @Matches(/^0[5][0-9]{9}$/, {
    message: 'Geçerli bir telefon numarası girin',
  })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP kodu boş olamaz' })
  @Length(6, 6, { message: 'OTP 6 haneli olmalıdır' })
  @Matches(/^[0-9]{6}$/, { message: 'OTP sadece rakam içermelidir' })
  otp: string;
}
