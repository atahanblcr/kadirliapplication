import { IsString, MinLength, MaxLength } from 'class-validator';

export class ResetStaffPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  new_password: string;
}
