const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const { searchValue, replaceValue } of replacements) {
        content = content.replace(searchValue, replaceValue);
    }
    fs.writeFileSync(filePath, content);
}

// 1. attendentionals.service.ts
const attPath = 'src/modules/attendentionals/attendentionals.service.ts';
let attContent = fs.readFileSync(attPath, 'utf8');
// remove flattenRecord
attContent = attContent.replace(/\/\/ 🔹 Helper — normalize \/ flatten function[\s\S]*?async create\(/, 'async create(');
attContent = attContent.replace(/this\.flattenRecord\(/g, 'flattenRecord(this.config, ');
attContent = "import { flattenRecord } from '../../common/utils/flatter_functions';\nimport { ConfigService } from '@nestjs/config';\n" + attContent;
attContent = attContent.replace(/constructor\(private readonly prisma: PrismaService\) \{\}/, 'constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}');
fs.writeFileSync(attPath, attContent);

// 2. lessons.service.ts
const lessPath = 'src/modules/lessons/lessons.service.ts';
let lessContent = fs.readFileSync(lessPath, 'utf8');
lessContent = lessContent.replace(/private flattenLesson\(lesson: any\) \{[\s\S]*?async create\(/, 'async create(');
lessContent = lessContent.replace(/this\.flattenLesson\(/g, 'flattenLesson(this.config, ');
lessContent = "import { flattenLesson } from '../../common/utils/flatter_functions';\nimport { ConfigService } from '@nestjs/config';\n" + lessContent;
lessContent = lessContent.replace(/constructor\(private readonly prisma: PrismaService\) \{\}/, 'constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}');
fs.writeFileSync(lessPath, lessContent);

// 3. groupes.service.ts
const grpPath = 'src/modules/groupes/groupes.service.ts';
let grpContent = fs.readFileSync(grpPath, 'utf8');
grpContent = grpContent.replace(/\/\*\*[\s\S]*?\* FLATTEN GROUP[\s\S]*?\*\/[\s\S]*?function flattenGroup\(group: any\) \{[\s\S]*?\}\s*@Injectable/, '@Injectable');
grpContent = grpContent.replace(/flattenGroup\(newGroup\)/g, 'flattenGroup(this.config, newGroup)');
grpContent = grpContent.replace(/flattenGroup\(group\)/g, 'flattenGroup(this.config, group)');
grpContent = grpContent.replace(/flattenGroup\(updated\)/g, 'flattenGroup(this.config, updated)');
grpContent = grpContent.replace(/\.map\(flattenGroup\)/g, '.map(g => flattenGroup(this.config, g))');
grpContent = "import { flattenGroup } from '../../common/utils/flatter_functions';\nimport { ConfigService } from '@nestjs/config';\n" + grpContent;
grpContent = grpContent.replace(/constructor\(private readonly prisma: PrismaService\) \{\}/, 'constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}');
fs.writeFileSync(grpPath, grpContent);

// 4. auth.service.ts
const authPath = 'src/core/auth/auth.service.ts';
let authContent = fs.readFileSync(authPath, 'utf8');
authContent = authContent.replace(/public flattenAuthUser\(user: any\)[\s\S]*?as AuthUserEntity;\n  \}\n/, '');
authContent = authContent.replace(/this\.flattenAuthUser\(/g, 'flattenAuthUser(this.config, ');
authContent = "import { flattenAuthUser } from '../../common/utils/flatter_functions';\n" + authContent;
fs.writeFileSync(authPath, authContent);

// 5. stafss.service.ts
const staffPath = 'src/core/admin/stafss/stafss.service.ts';
let staffContent = fs.readFileSync(staffPath, 'utf8');
staffContent = staffContent.replace(/this\.st\.flattenStaff\(/g, 'flattenStaff(this.config, ');
staffContent = "import { flattenStaff } from '../../../common/utils/flatter_functions';\nimport { ConfigService } from '@nestjs/config';\n" + staffContent;
staffContent = staffContent.replace(/constructor\(private readonly st : StaffsService,private readonly prisma : PrismaService\) \{\}/, 'constructor(private readonly st : StaffsService, private readonly prisma : PrismaService, private readonly config: ConfigService) {}');
fs.writeFileSync(staffPath, staffContent);

console.log("Done fixing files");
