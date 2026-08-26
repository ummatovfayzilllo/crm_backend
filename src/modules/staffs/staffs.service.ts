import { ConfigService } from '@nestjs/config';
import {
  flattenStaff,
  flattenStudent,
  flattenTeacher,
  flattenUser,
} from '../../common/utils/flatter_functions';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class StaffsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** 🔸 Get teacher by Group ID */
  async getAll_Teacher_ByGrouoId(groupId: string) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId },
      include: {
        teacher: { include: { user: true } },
      },
    });

    if (
      !group ||
      !group.teacher ||
      group.teacher.isDeleted ||
      group.teacher.user.isDeleted
    ) {
      throw new NotFoundException('Teacher not found or deleted!');
    }

    return flattenTeacher(this.config, group.teacher);
  }
  async getAll_Teachers() {
    const staffs = await this.prisma.staff.findMany({
      include: {
        user: true,
      },
    });
    const teachers = staffs.filter((teacher) => teacher.role === 'TEACHER');

    return {
      teachers: teachers.map((teacher) => flattenStaff(this.config, teacher)),
    };
  }

  async getAll_Students() {
    const staffs = await this.prisma.staff.findMany({
      include: {
        user: true,
      },
    });
    const teachers = staffs.filter((teacher) => teacher.role === 'STUDENT');
    return {
      students: teachers.map((teacher) => flattenStaff(this.config, teacher)),
    };
  }
  /** 🔸 Get all teachers by Course ID */
  async getAll_Teachers_ByCourseId(courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId },
      include: {
        groupes: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!course) throw new NotFoundException('Course not found!');

    const teachers = course.groupes
      .filter(
        (g) => g.teacher && !g.teacher.isDeleted && !g.teacher.user.isDeleted,
      )
      .map((g) => flattenTeacher(this.config, g.teacher))
      .filter(Boolean);

    return {
      count: teachers.length,
      teachers,
    };
  }

  /** 🔸 Get teacher by Teacher ID */
  async getOne_Teacher_ByTeacherId(teacherId: string) {
    const teacher = await this.prisma.staff.findFirst({
      where: { id: teacherId, role: 'TEACHER' },
      include: { user: true },
    });

    if (!teacher || teacher.isDeleted || teacher.user.isDeleted)
      throw new NotFoundException('Teacher not found or deleted!');

    return flattenTeacher(this.config, teacher);
  }

  /** 🔸 Get all students by Group ID */
  async getAll_Students_ByGroupId(groupId: string) {
    const studentGroups = await this.prisma.studentGroup.findMany({
      where: { groupId },
      include: {
        student: { include: { user: true } },
      },
    });

    const students = studentGroups
      .filter(
        (sg) =>
          sg.student && !sg.student.isDeleted && !sg.student.user.isDeleted,
      )
      .map((sg) => flattenStudent(this.config, sg.student))
      .filter(Boolean);
    return {
      count: students.length,
      students,
    };
  }

  /** 🔸 Get all students by Course ID */
  async gettAll_Students_ByCourseId(courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId },
      include: {
        groupes: {
          include: {
            students: {
              include: {
                student: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    if (!course) throw new NotFoundException('Course not found!');

    const students = course.groupes
      .flatMap((g) =>
        g.students
          .filter(
            (sg) =>
              sg.student && !sg.student.isDeleted && !sg.student.user.isDeleted,
          )
          .map((sg) => flattenStudent(this.config, sg.student)),
      )
      .filter(Boolean);

    return {
      count: students.length,
      students,
    };
  }

  /** 🔸 Get one student by ID */
  async getOne_StudentBy_StudentId(studentId: string) {
    const student = await this.prisma.staff.findFirst({
      where: { id: studentId, role: 'STUDENT' },
      include: { user: true },
    });

    if (!student || student.isDeleted || student.user.isDeleted)
      throw new NotFoundException('Student not found or deleted!');

    return flattenStudent(this.config, student);
  }

  /** 🔸 Get one staff by ID */
  async getOne_Staff_ByStaffId(staffId: string) {
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId },
      include: { user: true },
    });

    if (!staff || staff.isDeleted || staff.user.isDeleted)
      throw new NotFoundException('Staff not found or deleted!');

    return flattenStaff(this.config, staff);
  }

  /** 🔸 Get all staffs */
  async getAll_Staffs() {
    const staffs = await this.prisma.staff.findMany({
      include: { user: true },
      orderBy: { role: 'asc' },
    });
    const filtered = staffs
      .filter((s) => !s.isDeleted && !s.user.isDeleted)
      .map((s) => flattenStaff(this.config, s));

    return {
      count: filtered.length,
      staffs: filtered,
    };
  }
}
