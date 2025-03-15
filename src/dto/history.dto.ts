import { IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsDate()
  time: Date;
}
