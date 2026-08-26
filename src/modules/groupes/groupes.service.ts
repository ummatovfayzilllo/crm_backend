import { ConfigService } from '@nestjs/config';
import { flattenGroup } from '../../common/utils/flatter_functions';

import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Course, Rom } from '@prisma/client';
import { UserFindEntitiy } from '../users/entities/user.entity';

@Injectable()
export class GroupesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) { }

  /**
   * CREATE GROUP
   */
  async create(data: CreateGroupeDto) {
    const { courseId, romId, teacherId } = data;

    // === CHECK TEACHER ===
    const teacher = await this.prisma.staff.findFirst({
      where: { id: teacherId, isDeleted: false },
      include: { user: { select: UserFindEntitiy } },
    });
    if (!teacher)
      throw new BadRequestException(`Staff [${teacherId}] not found or deleted`);
    if (teacher.user.isDeleted)
      throw new BadRequestException(`User [${teacher.user.id}] is deleted`);
    if (teacher.role !== 'TEACHER')
      throw new BadGatewayException(
        `Staff role must be TEACHER, got ${teacher.role}`,
      );

    // === CHECK COURSE ===
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, isDeleted: false },
    });
    if (!course)
      throw new NotFoundException(`Course [${courseId}] not found or deleted`);
    if (!course.published)
      throw new BadGatewayException(`Course [${course.name}] not published`);

    // === CHECK ROOM ===
    const rom = await this.prisma.rom.findFirst({
      where: { id: romId, isDeleted: false },
    });
    if (!rom)
      throw new NotFoundException(`Room [${romId}] not found or deleted`);
    if (!rom.isOpen)
      throw new BadRequestException(`Room [${rom.name}] is closed`);

    // === DATE VALIDATION ===
    // checkStartDate removed

    // === DUPLICATE NAME CHECK ===
    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.GROUP,
      'name',
      data.name,
    );

    // === CREATE NEW GROUP ===
    const newGroup = await this.prisma.group.create({
      data: { ...data, isDeleted: false, inActive: true },
      include: {
        teacher: { include: { user: true } },
        course: true,
        rom: true,
        _count: { select: { students: true, Lesson: true, GroupPayment: true } },
      },
    });

    return {
      message: 'New group created successfully',
      group: flattenGroup(this.config, <any>newGroup),
    };
  }

  /**
   * FIND ALL GROUPS
   */
  async findAll() {
    const groupes = await this.prisma.group.findMany({
      where: { isDeleted: false },
      orderBy: { startDate: 'desc' },
      include: {
        teacher: { include: { user: true } },
        course: true,
        rom: true,
        _count: { select: { students: true, Lesson: true, GroupPayment: true } },
      },
    });

    return {
      count: groupes.length,
      groupes: groupes.map(g => flattenGroup(this.config, <any>g)),
    };
  }

  async getAllByRoomId(roomId: string) {
    const res = await this.prisma.group.findMany({
      where: { romId: roomId },
      orderBy: { startDate: 'desc' },
      include: {
        teacher: { include: { user: true } },
        course: true,
        rom: true,
        _count: { select: { students: true, Lesson: true, GroupPayment: true } },
        Lesson : true
      },
    });
    return {
      count: res.length,
      groupes: res.map(g => flattenGroup(this.config, <any>g)),
    };
  }

  /**
   * FIND ONE GROUP
   */
  async findOne(id: string) {
    const group = await this.prisma.group.findFirst({
      where: { id, isDeleted: false },
      include: {
        teacher: { include: { user: true } },
        course: true,
        rom: true,
        _count: { select: { students: true, Lesson: true, GroupPayment: true } },
      },
    });

    if (!group) throw new NotFoundException(`Group [${id}] not found or deleted`);

    return {
      group: flattenGroup(this.config, <any>group),
    };
  }
  async findOneByCourseId(id: string) {
    const group = await this.prisma.group.findFirst({
      where: { courseId: id, isDeleted: false },
      include: {
        teacher: { include: { user: true } },
        course: true,
        rom: true,
        _count: { select: { students: true, Lesson: true, GroupPayment: true } },
      },
    });

    if (!group) throw new NotFoundException(`Group [${id}] not found or deleted`);

    return {
      group: flattenGroup(this.config, <any>group),
    };
  }
  /**
   * UPDATE GROUP
   */
  async update(id: string, dto: UpdateGroupeDto) {
    const group = await this.prisma.group.findFirst({
      where: { id, isDeleted: false },
    });
    if (!group)
      throw new NotFoundException(`Group [${id}] not found or deleted`);

    if (dto.startDate) {}

    const updated = await this.prisma.group.update({
      where: { id },
      data: dto,
      include: {
        teacher: { include: { user: true } },
        course: true,
        rom: true,
        _count: { select: { students: true, Lesson: true, GroupPayment: true } },
      },
    });

    return {
      message: 'Group updated successfully',
      group: flattenGroup(this.config, <any>updated),
    };
  }

  /**
   * SOFT DELETE GROUP
   */
  async remove(id: string) {
    const group = await this.prisma.group.findFirst({
      where: { id, isDeleted: false },
      include: {
        _count: { select: { students: true, Lesson: true, GroupPayment: true } },
      },
    });

    if (!group) throw new NotFoundException(`Group [${id}] not found or deleted`);

    const hasRelations =
      group._count.students > 0 ||
      group._count.Lesson > 0 ||
      group._count.GroupPayment > 0;

    if (hasRelations)
      throw new ConflictException(
        `Cannot delete group [${group.name}] because it has related students, lessons, or payments.`,
      );

    await this.prisma.group.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      message: `Group [${group.name}] deleted (soft) successfully`,
    };
  }
}
