import { Prisma } from '@prisma/client';
export type AttendentionalFullEntity = Prisma.AttendentionalGetPayload<{ include: { lesson: true, student: { include: { user: true } } } }>;
export class Attendentional {}
