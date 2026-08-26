import { Prisma } from '@prisma/client';
export type LessonFullEntity = Prisma.LessonGetPayload<{
  include: {
    group: { include: { rom: true; students: true } };
    teacher: { include: { user: true } };
    Attendentionals: true;
  };
}>;
export class Lesson {}
