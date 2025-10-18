import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDateString, IsEnum, IsObject, IsOptional, IsString } from "class-validator"

enum RoleStafs {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  ASISTANT = "ASISTANT",
  STUDENT = "STUDENT"
}
const RoleArr = ["ADMIN", "TEACHER", "ASISTANT", "STUDENT"]

export class CreateStaffDto {

  @ApiProperty({ example: "Example" })
  @IsString()
  email: string

  @ApiProperty({ example: "Example" })
  @IsString()
  password: string

  @ApiProperty({ example: "Example" })
  @IsString()
  firstName: string

  @ApiProperty({ example: "Example" })
  @IsString()
  lastName: string

  @ApiProperty({ example: "Example" })
  @IsOptional()
  @IsString()
  father?: string

  @ApiProperty({ example: "Example" })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({example : ""})
  @IsOptional()
  @IsObject()
  image : any

  @ApiProperty({ example: "2025-10-20T08:00:00Z" })
  @IsDateString()
  @Transform((e) => new Date(e.value).toISOString())
  birthDay: Date

  @ApiProperty({ example: "STUDENT" })
  @IsOptional()
  @IsEnum(RoleArr)
  role?: RoleStafs
}
