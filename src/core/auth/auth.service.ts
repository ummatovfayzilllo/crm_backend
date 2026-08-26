import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from './cache.service';
import { EmailService as MailService } from '../email/email.service';
import { JwtSubService as JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { flattenAuthUser } from '../../common/utils/flatter_functions';
import * as bcrypt from 'bcrypt';
import { EmailCodeEnum } from 'src/common/types/enum.types';
import { CreateOtpDto } from './dto/create-email.dto';
import { AuthRegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { checAlreadykExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly mail: MailService,
    private readonly jwtService: JwtAuthService,
    private readonly config: ConfigService,
  ) {}

  async sendOtp(data: CreateOtpDto) {
    const { email, action } = data;
    const code = Math.floor(1000 + Math.random() * 9000);
    let sessionToken: any = undefined;

    if (action === EmailCodeEnum.REGISTER) {
      this.cache.set(email, { code, email }, 180000);
    } else if (action === EmailCodeEnum.RESET_PASSWORD) {
      const user = await this.prisma.user.findFirst({ where: { email: String(email) } });
      if (!user || user.isDeleted) throw new NotFoundException("Foydalanuvchi topilmadi");
      this.cache.set(email, { code, email }, 180000);
      sessionToken = await this.jwtService.getSessionToken(user.id, user.email);
    }
    
    await this.mail.sendResedPasswordVerify(email, code, action);
    return { message: "OTP code sent to email", sessionToken };
  }

  async register(data: AuthRegisterDto) {
    const { email, code, password, firstName, lastName, phone } = data;
    const cacheData = this.cache.get(email);
    if (!cacheData || cacheData.code !== code) {
      throw new BadRequestException("Noto'g'ri yoki eskirgan OTP kod");
    }

    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "email", email);
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        firstName,
        lastName,
        phone,
        birthDay: new Date(),
        Staff: {
          create: { role: 'STUDENT' }
        }
      },
      include: { Staff: true }
    });
    
    this.cache.delete(email);
    const tokens = { accessToken: await this.jwtService.getAccessToken(newUser.id), refreshToken: await this.jwtService.getRefreshToken(newUser.id) };
    
    return { user: flattenAuthUser(this.config, newUser as any), tokens };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: String(data.email) },
      include: { Staff: true }
    });
    if (!user || user.isDeleted) throw new BadRequestException("Email yoki parol xato");
    
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new BadRequestException("Email yoki parol xato");
    
    const tokens = { accessToken: await this.jwtService.getAccessToken(user.id), refreshToken: await this.jwtService.getRefreshToken(user.id) };
    return { user: flattenAuthUser(this.config, user as any), tokens };
  }

  async verifyResetToken(data: { email: string, code: number, newPassword: string }) {
    const { email, code, newPassword } = data;
    const cacheData = this.cache.get(email);
    if (!cacheData || cacheData.code !== code) {
      throw new BadRequestException("Noto'g'ri yoki eskirgan OTP kod");
    }
    
    const user = await this.prisma.user.findFirst({ where: { email: String(email) } });
    if (!user || user.isDeleted) throw new NotFoundException("Foydalanuvchi topilmadi");
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash }
    });
    
    this.cache.delete(email);
    return { message: "Parol muvaffaqiyatli yangilandi" };
  }
}
