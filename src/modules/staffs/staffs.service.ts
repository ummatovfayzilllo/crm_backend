import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { Staff } from '@prisma/client';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';
import * as bcrypt from "bcrypt"
import { urlGenerator } from 'src/common/types/generator.types';
@Injectable()
export class StaffsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(data: CreateStaffDto,image? : Express.Multer.File) {
    const { birthDay, email, father, firstName, lastName, phone } = data
    const existsInEmail = await this.prisma.staff.findFirst({ where: { email: email } })
    const existsImPhone = await this.prisma.staff.findFirst({ where: { phone: phone } })
    if (existsImPhone || existsInEmail) return {
      message: "OldExists",
      staff: existsImPhone || existsInEmail
    }
    const hashedPass = await bcrypt.hashSync(data.password,10)
    console.log(hashedPass)
    const newStaff = await this.prisma.staff.create({
      data: {
        birthDay: birthDay,
        email: email,
        firstName: firstName,
        lastName: lastName,
        father: father || "",
        phone: phone,
        image : image ? urlGenerator(this.config,image.filename) : null,
        role: data?.role || "STUDENT",
        password : hashedPass
      }
    })
    return {
      message: 'This action adds a new staff',
      staff: newStaff
    };
  }

  async findAll() {
    const staffs = await this.prisma.staff.findMany({ where: { isDeleted: false } })
    return {
      message: `This action returns all staffs`,
      staffs
    };
  }

  async findOne(id: string) {
    const staff = await this.prisma.staff.findFirst({ where: { id: id } })
    if (!staff || staff.isDeleted) throw new NotFoundException(`Staff not found by id [#${id}]`)
    return {
      message: `This action returns a #${id} staff`,
      staff: staff
    };
  }

  async update(id: string, data: UpdateStaffDto) {
    const oldStaff = await checkExistsResurs<Staff>(this.prisma, ModelsEnumInPrisma.STAFF, "id", id)
    if (oldStaff.isDeleted) throw new NotFoundException(`Staff not found by id [#${id}]`)
    if (data.email) {
      const existsInEmail = await this.prisma.staff.findFirst({ where: { email: data.email } })
      if (existsInEmail && existsInEmail.id !== id) throw new ConflictException("Email already exists")
    }
    if (data.phone) {
      const existsImPhone = await this.prisma.staff.findFirst({ where: { phone: data.phone } })
      if (existsImPhone && existsImPhone.id !== id) throw new ConflictException("Email already exists")
    }
    return {
      message: `This action updates a #${id} staff`,
      staff: await this.prisma.staff.update({ where: { id: id }, data: data })
    };
  }

  async remove(id: string) {
    const oldStaff = await checkExistsResurs<Staff>(this.prisma, ModelsEnumInPrisma.STAFF, "id", id)
    if (oldStaff.isDeleted) throw new NotFoundException(`Staff not found by id [#${id}]`)

    if (oldStaff.image) {
      unlinkFile(oldStaff.image.split("/").at(-1) || "")
    }
    await this.prisma.staff.delete({
      where: { id: id },
      // data: { isDeleted: true }
    })
    return {
      message: `This action removes a #${id} staff`,
      staff: oldStaff
    };
  }
}
