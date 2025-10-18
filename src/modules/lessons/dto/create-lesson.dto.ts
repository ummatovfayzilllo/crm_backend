import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsString, Min } from "class-validator";

export class CreateLessonDto {
  @ApiProperty({ example: "group-uuid" })
  @IsString()
  groupId: string;

  @ApiProperty({ example: "teacher-uuid" })
  @IsString()
  teacherId: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  lessonNumber: number;

  @ApiProperty({ example: "2025-10-20T08:00:00.000Z" })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: "2025-10-20T09:30:00.000Z" })
  @IsDateString()
  endDate: Date;
}
