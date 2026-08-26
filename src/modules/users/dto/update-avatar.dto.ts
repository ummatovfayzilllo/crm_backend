import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvatarDto {
  @ApiProperty({ description: 'Fayl xizmatidan olingan rasm ID si' })
  @IsString()
  @IsNotEmpty()
  image: string;
}
