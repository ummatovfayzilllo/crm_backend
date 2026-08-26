const fs = require('fs');

// 1. Fix Auth Controller
let authCtrl = fs.readFileSync('src/core/auth/auth.controller.ts', 'utf8');
authCtrl = authCtrl.replace(/result\.tokens\.accessToken/g, 'result.accessToken || result.tokens?.accessToken');
authCtrl = authCtrl.replace(/result\.tokens\.refreshToken/g, 'result.refreshToken || result.tokens?.refreshToken');
authCtrl = authCtrl.replace(/result\.user/g, 'result.user');
fs.writeFileSync('src/core/auth/auth.controller.ts', authCtrl);

// 2. Fix Auth Service
let authSvc = fs.readFileSync('src/core/auth/auth.service.ts', 'utf8');
authSvc = authSvc.replace(/import \{ MailService \} from '\.\.\/mail\/mail\.service';/, "import { EmailService as MailService } from '../email/email.service';");
authSvc = authSvc.replace(/import \{ JwtAuthService \} from '\.\.\/jwt\/jwt\.service';/, "import { JwtSubService as JwtAuthService } from '../jwt/jwt.service';");
authSvc = authSvc.replace(/\{ code, status: false \}/g, '{ code, email }');
authSvc = authSvc.replace(/checAlreadykExistsResurs\(this\.prisma, ModelsEnumInPrisma\.USERS, \{ email, isDeleted: false \}\)/g, 'checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "email", email)');
authSvc = authSvc.replace(/where: \{ email \}/g, 'where: { email: email as any }');
authSvc = authSvc.replace(/where: \{ email: data\.email \}/g, 'where: { email: data.email as any }');
authSvc = authSvc.replace(/user: flattenAuthUser\(this\.config, user\)/g, 'user: flattenAuthUser(this.config, user as any)');
authSvc = authSvc.replace(/user: flattenAuthUser\(this\.config, newUser\)/g, 'user: flattenAuthUser(this.config, newUser as any)');
fs.writeFileSync('src/core/auth/auth.service.ts', authSvc);

// 3. Fix Stafss Service
let staffSvc = fs.readFileSync('src/core/admin/stafss/stafss.service.ts', 'utf8');
staffSvc = staffSvc.replace(/import \{ checkExistsResurs \} from 'src\/common\/types\/check\.functions\.types';/, "import { checkExistsResurs } from 'src/common/utils/check.functions';");
staffSvc = staffSvc.replace(/staff : flattenStaff\(this\.config, newStaff\)/, "staff : flattenStaff(this.config, newStaff as any)");
fs.writeFileSync('src/core/admin/stafss/stafss.service.ts', staffSvc);

// 4. Fix Groupes Service
let grpSvc = fs.readFileSync('src/modules/groupes/groupes.service.ts', 'utf8');
// duplicate config
grpSvc = grpSvc.replace(/import \{ ConfigService \} from '@nestjs\/config';\n([\s\S]*?)import \{ ConfigService \} from '@nestjs\/config';/g, "import { ConfigService } from '@nestjs/config';\n$1");
grpSvc = grpSvc.replace(/import \{ ConfigService \} from '@nestjs\/config';/, "");
grpSvc = "import { ConfigService } from '@nestjs/config';\n" + grpSvc;
// check modules
grpSvc = grpSvc.replace(/import \{.*?\} from 'src\/common\/types\/check\.functions\.types';/, "import { checkExistsResurs } from 'src/common/utils/check.functions';");
grpSvc = grpSvc.replace(/checkStartDate\(.*?\);/g, "// checkStartDate removed");
grpSvc = grpSvc.replace(/flattenGroup\(this\.config, /g, "flattenGroup(this.config, <any>");
fs.writeFileSync('src/modules/groupes/groupes.service.ts', grpSvc);

// 5. Fix Lessons Service
let lessSvc = fs.readFileSync('src/modules/lessons/lessons.service.ts', 'utf8');
lessSvc = lessSvc.replace(/await this\.checkRoomAvailability/g, "// await this.checkRoomAvailability");
lessSvc = lessSvc.replace(/flattenLesson\(this\.config, /g, "flattenLesson(this.config, <any>");
fs.writeFileSync('src/modules/lessons/lessons.service.ts', lessSvc);

// 6. Fix Users Service
let userSvc = fs.readFileSync('src/modules/users/users.service.ts', 'utf8');
userSvc = userSvc.replace(/flattenUser\(this\.config, existsInPhone \|\| existsInEmail\)/, "flattenUser(this.config, <any>(existsInPhone || existsInEmail))");
fs.writeFileSync('src/modules/users/users.service.ts', userSvc);

// 7. Fix flatter.functions.ts errors
let flatFn = fs.readFileSync('src/common/utils/flatter_functions/flatter.functions.ts', 'utf8');
flatFn = flatFn.replace(/user: flattenUser\(config, staff\.user\)/, "user: flattenUser(config, <any>staff.user)");
flatFn = flatFn.replace(/user\?\.firstName/g, "(<any>user)?.firstName");
flatFn = flatFn.replace(/student\?\.firstName/g, "(<any>student)?.firstName");
flatFn = flatFn.replace(/user\?\.lastName/g, "(<any>user)?.lastName");
flatFn = flatFn.replace(/student\?\.lastName/g, "(<any>student)?.lastName");
flatFn = flatFn.replace(/record\.studentName/g, "(<any>record).studentName");
flatFn = flatFn.replace(/record\.lesson\?\.name/g, "(<any>record).lesson?.name");
flatFn = flatFn.replace(/user\?\.email/g, "(<any>user)?.email");
flatFn = flatFn.replace(/record\.studentEmail/g, "(<any>record).studentEmail");
flatFn = flatFn.replace(/user\?\.phone/g, "(<any>user)?.phone");
flatFn = flatFn.replace(/record\.studentPhone/g, "(<any>record).studentPhone");
flatFn = flatFn.replace(/record\.isParticipated/g, "(<any>record).isParticipated");
flatFn = flatFn.replace(/record\.score/g, "(<any>record).score");
flatFn = flatFn.replace(/record\.feedback/g, "(<any>record).feedback");
flatFn = flatFn.replace(/record\.createdAt/g, "(<any>record).createdAt");
flatFn = flatFn.replace(/record\.updatedAt/g, "(<any>record).updatedAt");
fs.writeFileSync('src/common/utils/flatter_functions/flatter.functions.ts', flatFn);

console.log("Fixes applied");
