import { IsInt, Min, Max } from 'class-validator';

export class ExtendAdDto {
  @IsInt({ message: 'İzlenen reklam sayısı tam sayı olmalıdır' })
  @Min(1, { message: 'En az 1 reklam izlenmeli' })
  @Max(3, { message: 'En fazla 3 reklam izlenebilir' })
  ads_watched: number;
}
