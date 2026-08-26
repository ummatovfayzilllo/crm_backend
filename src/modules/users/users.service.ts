import { BadRequestException } from "@nestjs/common";
import { flattenUser } from '../../common/utils/flatter_functions';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { User } from '@prisma/client';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { unlinkFile } from 'src/common/utils/file.utils';
import * as bcrypt from 'bcrypt';
import { urlGenerator } from 'src/common/utils/generators';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** 🔸 Create user */
  async create(data: CreateUserDto) {
    const { email, phone } = data;
    const existsInEmail = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
    const existsInPhone = await this.prisma.user.findFirst({
      where: { phone, isDeleted: false },
    });

    if (existsInPhone || existsInEmail)
      return {
        message: 'Already exists',
        user: flattenUser(this.config, <any>(existsInPhone || existsInEmail)),
      };

    const hashedPass = await bcrypt.hash(data.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        father: data.father || '',
        image: data.image || null,
        password: hashedPass,
        isDeleted: false,
      },
      include: { Staff: true },
    });

    const { Staff } = newUser;

    return { message: 'User created', user: flattenUser(this.config, newUser) };
  }

  /** 🔸 Get all users */
  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { isDeleted: false },
      include: { Staff: true },
    });
    return {
      message: 'All active users',
      count: users.length,
      users: users.map((u) => flattenUser(this.config, u)),
    };
  }

  /** 🔸 Get one user by ID */
  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: { Staff: true },
    });

    if (!user) throw new NotFoundException(`User not found [${id}]`);

    return { message: `User found`, user: flattenUser(this.config, user) };
  }

  /** 🔸 Update user */
  async updateAvatar(id: string, image: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.isDeleted) throw new BadRequestException("Foydalanuvchi topilmadi");
    await this.prisma.user.update({
      where: { id },
      data: { image }
    });
    return { message: "Avatar muvaffaqiyatli yangilandi" };
  }

  async update(id: string, data: UpdateUserDto) {
    const oldUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      id,
    );

    if (oldUser.isDeleted)
      throw new NotFoundException(`User not found [${id}]`);

    if (data.email) {
      const existsEmail = await this.prisma.user.findFirst({
        where: { email: data.email },
      });
      if (existsEmail && existsEmail.id !== id)
        throw new ConflictException('Email already exists');
    }

    if (data.phone) {
      const existsPhone = await this.prisma.user.findFirst({
        where: { phone: data.phone },
      });
      if (existsPhone && existsPhone.id !== id)
        throw new ConflictException('Phone already exists');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      include: { Staff: true },
    });

    return {
      message: 'User updated',
      user: flattenUser(this.config, updatedUser),
    };
  }

  /** 🔸 Soft delete user */
  async remove(id: string) {
    const oldUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      id,
    );

    if (oldUser.isDeleted)
      throw new NotFoundException(`User not found [${id}]`);

    if (oldUser.image && typeof oldUser.image === 'string') {
      const filename = oldUser.image.split('/').at(-1);
      if (filename) unlinkFile(filename);
    }

    const deleted = await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
      include: { Staff: true },
    });

    return {
      message: 'User soft-deleted',
      user: flattenUser(this.config, deleted),
    };
  }

  /** 🔸 Restore deleted user */
  async restore(id: string) {
    const deletedUser = await this.prisma.user.findFirst({
      where: { id, isDeleted: true },
      include: { Staff: true },
    });
    if (!deletedUser)
      throw new NotFoundException(`Deleted user not found [${id}]`);

    const restored = await this.prisma.user.update({
      where: { id },
      data: { isDeleted: false },
      include: { Staff: true },
    });

    return {
      message: 'User restored',
      user: flattenUser(this.config, restored),
    };
  }
}
