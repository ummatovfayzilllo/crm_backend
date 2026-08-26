const fs = require('fs');

// 1. Groupes Service
let grp = fs.readFileSync('src/modules/groupes/groupes.service.ts', 'utf8');
grp = grp.replace(/if \(dto\.startDate\) \/\/ checkStartDate removed/g, 'if (dto.startDate) {}');
grp = grp.replace(/import \{.*?\} from 'src\/common\/types\/check\.functions\.types';/g, '');
fs.writeFileSync('src/modules/groupes/groupes.service.ts', grp);

// 2. Lessons Service
let less = fs.readFileSync('src/modules/lessons/lessons.service.ts', 'utf8');
less = less.replace(/constructor\(private readonly prisma: PrismaService\) \{\}/, 'constructor(private readonly prisma: PrismaService, private readonly config: import("@nestjs/config").ConfigService) {}');
fs.writeFileSync('src/modules/lessons/lessons.service.ts', less);

// 3. Auth Service
let authSvc = fs.readFileSync('src/core/auth/auth.service.ts', 'utf8');
authSvc = authSvc.replace(/createSessionToken/g, 'getSessionToken');
authSvc = authSvc.replace(/generateTokens/g, 'getTokens');
authSvc = authSvc.replace(/this\.mail\.sendOtp/g, 'this.mail.sendRegistrationOtp'); 
authSvc = authSvc.replace(/where: \{ email: email as any \}/g, 'where: { email: String(email) }');
authSvc = authSvc.replace(/where: \{ email: data\.email as any \}/g, 'where: { email: String(data.email) }');
fs.writeFileSync('src/core/auth/auth.service.ts', authSvc);

// 4. Auth Controller
let authCtrl = fs.readFileSync('src/core/auth/auth.controller.ts', 'utf8');
authCtrl = authCtrl.replace(/result\.accessToken \|\| result\.tokens\?\.accessToken/g, '(<any>result).accessToken || (<any>result).tokens?.accessToken');
authCtrl = authCtrl.replace(/result\.refreshToken \|\| result\.tokens\?\.refreshToken/g, '(<any>result).refreshToken || (<any>result).tokens?.refreshToken');
authCtrl = authCtrl.replace(/result\.user/g, '(<any>result).user');
authCtrl = authCtrl.replace(/result\.sessionToken/g, '(<any>result).sessionToken');
fs.writeFileSync('src/core/auth/auth.controller.ts', authCtrl);

// 5. flatter.functions.ts
let flatFn = fs.readFileSync('src/common/utils/flatter_functions/flatter.functions.ts', 'utf8');
flatFn = flatFn.replace(/flattenUser\(config, staff\.user\)/g, 'flattenUser(config, <any>staff.user)');
fs.writeFileSync('src/common/utils/flatter_functions/flatter.functions.ts', flatFn);

console.log("Remaining fixes applied");
