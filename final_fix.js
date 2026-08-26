const fs = require('fs');

// 1. flatter.functions.ts
let flatFn = fs.readFileSync('src/common/utils/flatter_functions/flatter.functions.ts', 'utf8');
flatFn = flatFn.replace(/\(\<any\>user\)\?/g, '(<any>user)');
flatFn = flatFn.replace(/\(\<any\>student\)\?/g, '(<any>student)');
flatFn = flatFn.replace(/\<any\>lesson\./g, '(<any>lesson).');
flatFn = flatFn.replace(/\(\<any\>record\)\./g, '(<any>record).');
flatFn = flatFn.replace(/lesson\.teacher\?\.\(\<any\>user\)\?\.firstName/g, '(<any>lesson.teacher?.user)?.firstName');
flatFn = flatFn.replace(/lesson\.teacher\?\.\(\<any\>user\)\?\.lastName/g, '(<any>lesson.teacher?.user)?.lastName');
fs.writeFileSync('src/common/utils/flatter_functions/flatter.functions.ts', flatFn);

// 2. auth.service.ts
let authSvc = fs.readFileSync('src/core/auth/auth.service.ts', 'utf8');
authSvc = authSvc.replace(/this\.mail\.sendRegistrationOtp/g, 'this.mail.sendResedPasswordVerify');
authSvc = authSvc.replace(/const tokens = await this\.jwtService\.getTokens\(newUser\.id, newUser\.email\);/g, 'const tokens = { accessToken: await this.jwtService.getAccessToken(newUser.id), refreshToken: await this.jwtService.getRefreshToken(newUser.id) };');
authSvc = authSvc.replace(/const tokens = await this\.jwtService\.getTokens\(user\.id, user\.email\);/g, 'const tokens = { accessToken: await this.jwtService.getAccessToken(user.id), refreshToken: await this.jwtService.getRefreshToken(user.id) };');
authSvc = authSvc.replace(/findUnique/g, 'findFirst');
fs.writeFileSync('src/core/auth/auth.service.ts', authSvc);

// 3. stafss.service.ts
let staffSvc = fs.readFileSync('src/core/admin/stafss/stafss.service.ts', 'utf8');
if (!staffSvc.includes('private readonly config: ConfigService')) {
    staffSvc = staffSvc.replace(/private readonly prisma : PrismaService\) \{\}/, 'private readonly prisma : PrismaService, private readonly config: import("@nestjs/config").ConfigService) {}');
}
fs.writeFileSync('src/core/admin/stafss/stafss.service.ts', staffSvc);

// 4. groupes.service.ts
let grpSvc = fs.readFileSync('src/modules/groupes/groupes.service.ts', 'utf8');
grpSvc = grpSvc.replace(/import \{.*?\} from 'src\/common\/types\/check\.functions\.types';\n/g, '');
fs.writeFileSync('src/modules/groupes/groupes.service.ts', grpSvc);

// 5. lessons.service.ts
let lessSvc = fs.readFileSync('src/modules/lessons/lessons.service.ts', 'utf8');
if (!lessSvc.includes('private readonly config: import("@nestjs/config").ConfigService')) {
    lessSvc = lessSvc.replace(/constructor\(private readonly prisma: PrismaService\) \{\}/, 'constructor(private readonly prisma: PrismaService, private readonly config: import("@nestjs/config").ConfigService) {}');
}
fs.writeFileSync('src/modules/lessons/lessons.service.ts', lessSvc);

console.log("Final fix applied");
