import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum } from "class-validator";
import { EmailCodeEnum } from "src/common/types/enum.types";

export class CreateOtpDto {
    @ApiProperty({ example: "example@gmail.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: [EmailCodeEnum.REGISTER, EmailCodeEnum.RESET_PASSWORD] })
    @IsEnum(EmailCodeEnum)
    action: EmailCodeEnum;
}
