import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class RegisterFcmTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'FCM token boş olamaz' })
  fcm_token: string;

  @IsEnum(['android', 'ios'])
  @IsNotEmpty({ message: 'Cihaz tipi boş olamaz' })
  device_type: 'android' | 'ios';
}
