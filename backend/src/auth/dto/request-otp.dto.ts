import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Telefon numarası boş olamaz' })
  @Matches(/^0[5][0-9]{9}$/, {
    message: 'Geçerli bir Türk telefon numarası girin (05XX XXX XXXX)',
  })
  phone: string;
}
