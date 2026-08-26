import { Prisma } from '@prisma/client';
export type StaffFullEntity = Prisma.StaffGetPayload<{ include: { user: true } }>;
export class Staff {}
