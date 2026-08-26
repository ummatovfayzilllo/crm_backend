const fs = require('fs');

// 1. users.entity.ts
let userEnt = fs.readFileSync('src/modules/users/entities/user.entity.ts', 'utf8');
if (!userEnt.includes('UserFullEntity')) {
    userEnt = `import { Prisma } from '@prisma/client';\nexport type UserFullEntity = Prisma.UserGetPayload<{ include: { Staff: true } }>;\n` + userEnt;
    fs.writeFileSync('src/modules/users/entities/user.entity.ts', userEnt);
}

// 2. staffs.entity.ts
let staffEnt = fs.readFileSync('src/modules/staffs/entities/staff.entity.ts', 'utf8');
if (!staffEnt.includes('StaffFullEntity')) {
    staffEnt = `import { Prisma } from '@prisma/client';\nexport type StaffFullEntity = Prisma.StaffGetPayload<{ include: { user: true } }>;\n` + staffEnt;
    fs.writeFileSync('src/modules/staffs/entities/staff.entity.ts', staffEnt);
}

// 3. groupes.entity.ts
let grpEnt = fs.readFileSync('src/modules/groupes/entities/groupe.entity.ts', 'utf8');
if (!grpEnt.includes('GroupFullEntity')) {
    grpEnt = `import { Prisma } from '@prisma/client';\nexport type GroupFullEntity = Prisma.GroupGetPayload<{ include: { teacher: { include: { user: true } }, course: true, rom: true, _count: true, Lesson: true } }>;\n` + grpEnt;
    fs.writeFileSync('src/modules/groupes/entities/groupe.entity.ts', grpEnt);
}

// 4. lessons.entity.ts
let lessEnt = fs.readFileSync('src/modules/lessons/entities/lesson.entity.ts', 'utf8');
if (!lessEnt.includes('LessonFullEntity')) {
    lessEnt = `import { Prisma } from '@prisma/client';\nexport type LessonFullEntity = Prisma.LessonGetPayload<{ include: { group: { include: { rom: true, students: true } }, teacher: { include: { user: true } }, Attendentionals: true } }>;\n` + lessEnt;
    fs.writeFileSync('src/modules/lessons/entities/lesson.entity.ts', lessEnt);
}

// 5. attendentionals.entity.ts
let attEnt = fs.readFileSync('src/modules/attendentionals/entities/attendentional.entity.ts', 'utf8');
if (!attEnt.includes('AttendentionalFullEntity')) {
    attEnt = `import { Prisma } from '@prisma/client';\nexport type AttendentionalFullEntity = Prisma.AttendentionalGetPayload<{ include: { lesson: true, student: { include: { user: true } } } }>;\n` + attEnt;
    fs.writeFileSync('src/modules/attendentionals/entities/attendentional.entity.ts', attEnt);
}

// 6. auth.entity.ts (for AuthUserEntity input)
let authEnt = fs.readFileSync('src/core/auth/auth.entity.ts', 'utf8');
if (!authEnt.includes('AuthInputEntity')) {
    authEnt = `import { Prisma } from '@prisma/client';\nexport type AuthInputEntity = Prisma.UserGetPayload<{ include: { Staff: true } }>;\n` + authEnt;
    fs.writeFileSync('src/core/auth/auth.entity.ts', authEnt);
}

console.log("Entities updated");
