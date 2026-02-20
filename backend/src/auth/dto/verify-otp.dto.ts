import { IsString, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^0[5][0-9]{9}$/, {
    message: 'Geçerli bir telefon numarası girin',
  })
  phone: string;

  @IsString()
  @Length(6, 6, { message: 'OTP 6 haneli olmalıdır' })
  @Matches(/^[0-9]{6}$/, { message: 'OTP sadece rakam içermelidir' })
  otp: string;
}
