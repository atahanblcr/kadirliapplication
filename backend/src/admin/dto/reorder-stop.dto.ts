import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderStopDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  new_order: number;
}
