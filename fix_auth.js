const fs = require('fs');
const content = `import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from './cache.service';
import { MailService } from '../mail/mail.service';
import { JwtAuthService } from '../jwt/jwt.service';
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
    let sessionToken = undefined;

    if (action === EmailCodeEnum.REGISTER) {
      await this.cache.setRegisterUser({ email, code, status: false });
    } else if (action === EmailCodeEnum.RESET_PASSWORD) {
      const user = await this.prisma.user.findUnique({ where: { email, isDeleted: false } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
      await this.cache.setResetPassword({ email, code, status: false });
      sessionToken = await this.jwtService.createSessionToken(user.id, user.email);
    }
    await this.mail.sendOtp(email, code, action);
    return { message: 'OTP code sent to email', sessionToken };
  }

  async register(data: AuthRegisterDto) {
    const { email, code, password, firstName, lastName, phone } = data;
    const cacheData = await this.cache.getRegisterUser(email);
    if (!cacheData || cacheData.code !== code) {
      throw new BadRequestException('Noto\\'g\\'ri yoki eskirgan OTP kod');
    }

    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.USER, { email, isDeleted: false });
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        firstName,
        lastName,
        phone,
        Staff: {
          create: { role: 'STUDENT' }
        }
      },
      include: { Staff: true }
    });
    
    await this.cache.delCache(email, EmailCodeEnum.REGISTER);
    const tokens = await this.jwtService.generateTokens(newUser.id, newUser.email);
    
    return { user: flattenAuthUser(this.config, newUser), tokens };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email, isDeleted: false },
      include: { Staff: true }
    });
    if (!user) throw new BadRequestException('Email yoki parol xato');
    
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new BadRequestException('Email yoki parol xato');
    
    const tokens = await this.jwtService.generateTokens(user.id, user.email);
    return { user: flattenAuthUser(this.config, user), tokens };
  }

  async verifyResetToken(data: { email: string, code: number, newPassword: string }) {
    const { email, code, newPassword } = data;
    const cacheData = await this.cache.getResetPassword(email);
    if (!cacheData || cacheData.code !== code) {
      throw new BadRequestException('Noto\\'g\\'ri yoki eskirgan OTP kod');
    }
    
    const user = await this.prisma.user.findUnique({ where: { email, isDeleted: false } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash }
    });
    
    await this.cache.delCache(email, EmailCodeEnum.RESET_PASSWORD);
    return { message: 'Parol muvaffaqiyatli yangilandi' };
  }
}
`;
fs.writeFileSync('src/core/auth/auth.service.ts', content);
