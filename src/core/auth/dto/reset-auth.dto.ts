import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNumber } from 'class-validator';

export class VerifyResetDto {
  @ApiProperty({ example: 123456 })
  @IsNumber()
  code: number;

  @ApiProperty({ example: 'NewStrongP@ssw0rd' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
