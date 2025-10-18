import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator"

export class CreateCourseDto {

    @ApiProperty({example : "Kurs nomi"})
    @IsString()
    name: string

    @ApiProperty({example : true})
    @IsBoolean()
    published: boolean

    @ApiProperty({example : 150000})
    @IsNumber()
    price: number

    @ApiProperty({example : 3})
    @IsNumber()
    durationMont: number

    @ApiProperty({example : [1,3,5]})
    @IsArray()
    weekDays: number[]   // @default([1, 3, 5])

    @ApiProperty({example : 60})
    @IsNumber()
    durationMinut: number
}
