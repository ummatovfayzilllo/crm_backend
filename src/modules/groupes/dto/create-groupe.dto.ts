import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsString } from "class-validator";

export class CreateGroupeDto {

  @ApiProperty({ example: "Group name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "cs90j-98jvcre0-cdscs99-cdsokcdos" })
  @IsString()
  teacherId: string;

  @ApiProperty({ example: "cs90j-98jvcre0-cdscs99-cdsokcdos" })
  @IsString()
  courseId: string;

  @ApiProperty({ example: "cs90j-98jvcre0-cdscs99-cdsokcdos" })
  @IsString()
  romId: string;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  isEnd: boolean = false;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  isStart: boolean = false;

  @ApiProperty({ example: "2025-10-20T08:00:00Z" })
  @IsDateString()
  startDate: Date;
}
