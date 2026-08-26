import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, jwtTokenTypeEnum } from 'src/common/config/jwt.secrets';
import { JwtSubService } from 'src/core/jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/types/auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtSubService: JwtSubService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = await this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) return true;

      const req = context.switchToHttp().getRequest();

      await this.getPayload(req, context);
      return true;
    } catch (error) {
      throw error;
    }
  }
  async getPayload(req: Request, ctx: ExecutionContext) {
    const authHeader = req.headers.authorization;
    let token = '';

    // 1. Path bo'yicha qaysi tokenni kutayotganimizni aniqlaymiz
    const isResetPath = req.url.includes('reset');
    const expectedTokenType = isResetPath
      ? jwtTokenTypeEnum.SESSION
      : jwtTokenTypeEnum.ACCESS;

    // 2. Tokenni olish
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Cookie'dan ham pathga mos tokenni olamiz
      token = isResetPath
        ? req.cookies?.sessionToken
        : req.cookies?.accessToken;
    }

    if (!token) throw new UnauthorizedException('Token topilmadi!');

    try {
      const user: JwtPayload = await this.jwtSubService.verifyToken<JwtPayload>(
        token,
        expectedTokenType,
      );
      user.token_type = expectedTokenType;
      req['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token yaroqsiz yoki eskirgan!');
    }
  }
}
