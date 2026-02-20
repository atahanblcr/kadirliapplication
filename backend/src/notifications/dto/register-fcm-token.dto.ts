import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class RegisterFcmTokenDto {
  @IsString()
  @IsNotEmpty()
  fcm_token: string;

  @IsEnum(['android', 'ios'])
  device_type: 'android' | 'ios';
}
