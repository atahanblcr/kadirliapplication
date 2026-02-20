import { IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @Matches(/^0[5][0-9]{9}$/, {
    message: 'Geçerli bir Türk telefon numarası girin (05XX XXX XXXX)',
  })
  phone: string;
}
