import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBusinessCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
