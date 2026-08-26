import { Prisma } from '@prisma/client';
export type AuthInputEntity = Prisma.UserGetPayload<{
  include: { Staff: true };
}>;
import { ApiProperty } from '@nestjs/swagger';
import { RoleStafs } from '@prisma/client';

export class AuthUserEntity {
  @ApiProperty({ description: 'Foydalanuvchi ID raqami' })
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: RoleStafs })
  role: RoleStafs;
}
