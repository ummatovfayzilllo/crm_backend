import { AuthInputEntity } from '../../../core/auth/auth.entity';
import { UserFullEntity } from '../../../modules/users/entities/user.entity';
import { StaffFullEntity } from '../../../modules/staffs/entities/staff.entity';
import { GroupFullEntity } from '../../../modules/groupes/entities/groupe.entity';
import { LessonFullEntity } from '../../../modules/lessons/entities/lesson.entity';
import { AttendentionalFullEntity } from '../../../modules/attendentionals/entities/attendentional.entity';
import { ConfigService } from '@nestjs/config';
import { urlGenerator } from '../generators';

export function flattenAuthUser(config: ConfigService, user: UserFullEntity | AuthInputEntity) {
  if (!user) return null;
  const staff = user.Staff?.[0];
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: staff?.role || 'STUDENT',
    image: user.image ? urlGenerator(config, user.image) : null,
  };
}

export function flattenUser(config: ConfigService, user: UserFullEntity | AuthInputEntity) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    father: user.father,
    email: user.email,
    phone: user.phone,
    image: user.image ? urlGenerator(config, user.image) : null,
    birthDay: user.birthDay,
    isDeleted: user.isDeleted,
    createdAt: user.createdAt,
    roles: user.Staff && user.Staff.length > 0
      ? user.Staff.map(staff => ({
          id: staff.id,
          role: staff.role
        }))
      : null,
  };
}

export function flattenStaff(config: ConfigService, staff: StaffFullEntity) {
  if (!staff) return null;
  return {
    id: staff.id,
    role: staff.role,
    user: flattenUser(config, <any>staff.user),
    isDeleted: staff.isDeleted,
  };
}

export function flattenTeacher(config: ConfigService, staff: StaffFullEntity) {
  const s = flattenStaff(config, staff);
  return s?.role === 'TEACHER' && !s.isDeleted && !s.user?.isDeleted ? s : null;
}

export function flattenStudent(config: ConfigService, staff: StaffFullEntity) {
  const s = flattenStaff(config, staff);
  return s?.role === 'STUDENT' && !s.isDeleted && !s.user?.isDeleted ? s : null;
}

export function flattenRecord(config: ConfigService, record: AttendentionalFullEntity) {
  if (!record) return null;
  const student = record.student ?? null;
  const user = student?.user ?? null;

  const studentFirstName = (<any>user).firstName ?? (<any>student).firstName ?? null;
  const studentLastName = (<any>user).lastName ?? (<any>student).lastName ?? null;
  const studentFullName =
    studentFirstName && studentLastName
      ? `${studentFirstName} ${studentLastName}`
      : studentFirstName ?? studentLastName ?? (<any>record).studentName ?? null;

  return {
    id: record.id,
    lessonId: record.lessonId,
    lessonName: (<any>record).lesson?.name ?? null,
    studentId: record.studentId,
    studentName: studentFullName,
    studentEmail: (<any>user).email ?? (<any>record).studentEmail ?? null,
    studentPhone: (<any>user).phone ?? (<any>record).studentPhone ?? null,
    kelganVaqti: record.kelganVaqti ?? null,
    isParticipated: (<any>record).isParticipated,
    score: (<any>record).score,
    feedback: (<any>record).feedback,
    createdAt: (<any>record).createdAt,
    updatedAt: (<any>record).updatedAt,
  };
}

export function flattenGroup(config: ConfigService, group: GroupFullEntity) {
  if (!group) return null;
  return {
    id: group.id,
    name: group.name,
    startDate: group.startDate,
    isStart: group.isStart,
    isEnd: group.isEnd,
    inActive: group.inActive,

    teacherId: group.teacherId,
    teacherFirstName: (<any>group.teacher?.user)?.firstName,
    teacherLastName: (<any>group.teacher?.user)?.lastName,
    teacherPhone: (<any>group.teacher?.user)?.phone,
    teacherImage: group.teacher?.user?.image ? urlGenerator(config, group.teacher.user.image) : null,

    courseId: group.courseId,
    courseName: group.course?.name,
    coursePrice: group.course?.price,

    romId: group.romId,
    romName: group.rom?.name,
    romNumber: group.rom?.romNumber,
    lessons: group.Lesson || null,

    studentCount: group._count?.students || 0,
    lessonCount: group._count?.Lesson || 0,
    paymentCount: group._count?.GroupPayment || 0,
  };
}

export function flattenLesson(config: ConfigService, lesson: LessonFullEntity) {
  if (!lesson) return null;
  return {
    id: lesson.id,
    lessonNumber: lesson.lessonNumber,
    startDate: lesson.startDate,
    endDate: lesson.endDate,
    isDeleted: lesson.isDeleted,

    groupId: lesson.groupId,
    groupName: lesson.group?.name,
    roomName: lesson.group?.rom?.name,
    roomNumber: lesson.group?.rom?.romNumber,

    teacherId: lesson.teacherId,
    teacherName:
      `${(<any>lesson.teacher?.user)?.firstName || ''} ${(<any>lesson.teacher?.user)?.lastName || ''}`.trim(),
    teacherImage: lesson.teacher?.user?.image ? urlGenerator(config, lesson.teacher.user.image) : null,

    studentsCount: lesson.group?.students?.length || 0,
    attendCount: lesson.Attendentionals?.length || 0,
  };
}
