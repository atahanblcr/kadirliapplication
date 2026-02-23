import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateAdminBusinessDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  business_name: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
