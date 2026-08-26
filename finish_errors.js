const fs = require('fs');

// 1. flatter.functions.ts
let flatFn = fs.readFileSync('src/common/utils/flatter_functions/flatter.functions.ts', 'utf8');
flatFn = flatFn.replace(/group\.teacher\?\.\(\<any\>user\)\.firstName/g, '(<any>group.teacher?.user)?.firstName');
flatFn = flatFn.replace(/group\.teacher\?\.\(\<any\>user\)\.lastName/g, '(<any>group.teacher?.user)?.lastName');
flatFn = flatFn.replace(/group\.teacher\?\.\(\<any\>user\)\.phone/g, '(<any>group.teacher?.user)?.phone');
flatFn = flatFn.replace(/lesson\.teacher\?\.\(\<any\>user\)\.firstName/g, '(<any>lesson.teacher?.user)?.firstName');
flatFn = flatFn.replace(/lesson\.teacher\?\.\(\<any\>user\)\.lastName/g, '(<any>lesson.teacher?.user)?.lastName');
fs.writeFileSync('src/common/utils/flatter_functions/flatter.functions.ts', flatFn);

// 2. auth.service.ts
let auth = fs.readFileSync('src/core/auth/auth.service.ts', 'utf8');
auth = auth.replace(/let sessionToken = undefined;/g, 'let sessionToken: any = undefined;');
fs.writeFileSync('src/core/auth/auth.service.ts', auth);

// 3. groupes.service.ts
let grp = fs.readFileSync('src/modules/groupes/groupes.service.ts', 'utf8');
grp = grp.replace(/.*check\.functions\.types.*/g, '');
fs.writeFileSync('src/modules/groupes/groupes.service.ts', grp);

// 4. lessons.service.ts
let less = fs.readFileSync('src/modules/lessons/lessons.service.ts', 'utf8');
less = less.replace(/constructor\(private readonly prisma: PrismaService\)/g, 'constructor(private readonly prisma: PrismaService, private readonly config: import("@nestjs/config").ConfigService)');
fs.writeFileSync('src/modules/lessons/lessons.service.ts', less);

// 5. stafss.service.ts
let stf = fs.readFileSync('src/core/admin/stafss/stafss.service.ts', 'utf8');
stf = stf.replace(/constructor\(private readonly st : StaffsService,\s*private readonly prisma : PrismaService\)/g, 'constructor(private readonly st : StaffsService, private readonly prisma : PrismaService, private readonly config: import("@nestjs/config").ConfigService)');
fs.writeFileSync('src/core/admin/stafss/stafss.service.ts', stf);

console.log("Done");
