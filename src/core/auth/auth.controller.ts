import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/global/guards/jwt.auth.guard';
import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { VerifyResetDto } from './dto/reset-auth.dto';
import { CreateOtpDto } from './dto/create-email.dto';
import { Public, UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Universal OTP kod yuborish (Register yoki Reset uchun)" })
  async sendOtp(@Body() data: CreateOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.sendOtp(data);
    if ((<any>result).sessionToken) {
      this.setTokensToCookies(res, null, (<any>result).sessionToken, null);
    }
    return result;
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish (OTP orqali)" })
  async register(@Body() data: AuthRegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(data);
    this.setTokensToCookies(res, (<any>result).accessToken || (<any>result).tokens?.accessToken, null, (<any>result).refreshToken || (<any>result).tokens?.refreshToken);
    return { message: "Muvaffaqiyatli", user: (<any>result).user, accessToken: (<any>result).accessToken || (<any>result).tokens?.accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Tizimga kirish" })
  async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(data);
    this.setTokensToCookies(res, (<any>result).accessToken || (<any>result).tokens?.accessToken, null, (<any>result).refreshToken || (<any>result).tokens?.refreshToken);
    return { message: "Muvaffaqiyatli", user: (<any>result).user, accessToken: (<any>result).accessToken || (<any>result).tokens?.accessToken };
  }

  @ApiBearerAuth()
  @Post('reset-token/verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "OTP orqali yangi parolni tasdiqlash" })
  async verifyResetToken(
    @UserData() jwtUser: JwtPayload,
    @Body() data: VerifyResetDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyResetToken({ 
      email: jwtUser.email, 
      code: data.code, 
      newPassword: data.newPassword 
    });
    this.setTokensToCookies(res, (<any>result).accessToken || (<any>result).tokens?.accessToken, null, (<any>result).refreshToken || (<any>result).tokens?.refreshToken);
    res.clearCookie('sessionToken');
    return { message: "Parol muvaffaqiyatli tiklandi", user: (<any>result).user, accessToken: (<any>result).accessToken || (<any>result).tokens?.accessToken };
  }

  // 🍪 cookie yozuvchi metod
  private setTokensToCookies(
    res: Response,
    accessToken: string | null,
    sessionToken: string | null,
    refreshToken: string | null,
  ) {
    const secure = process.env.NODE_ENV === 'production';
    if (accessToken) res.cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 * 24 * 7, secure: false });
    if (sessionToken) res.cookie('sessionToken', sessionToken, { maxAge: 1000 * 60 * 15, secure: false });
    if (refreshToken) res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 21, secure: false });
  }
}
