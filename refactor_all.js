const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    for (let r of replacements) {
        content = content.replace(r.find, r.replace);
    }
    fs.writeFileSync(filePath, content);
}

// 1. auth.service.ts (mostly done in previous step, but let's remove flatten method)
let authContent = fs.readFileSync('src/core/auth/auth.service.ts', 'utf8');
authContent = authContent.replace(/  public flattenAuthUser[\s\S]*?as AuthUserEntity;\n  }\n/g, '');
fs.writeFileSync('src/core/auth/auth.service.ts', authContent);

// 2. attendentionals.service.ts
let attContent = fs.readFileSync('src/modules/attendentionals/attendentionals.service.ts', 'utf8');
attContent = "import { flattenRecord } from '../../common/utils/flatter_functions';\n" + attContent;
attContent = attContent.replace(/this\.flattenRecord\(/g, "flattenRecord(this.config, ");
attContent = attContent.replace(/  \/\/ 🔹 Helper — normalize \/ flatten function[\s\S]*?private flattenRecord\(record: any\) {[\s\S]*?updatedAt: record\.updatedAt ?? null,\n    };\n  }\n/g, '');
// Wait, we can just remove from "private flattenRecord(record: any) {" to "};\n  }"
let attParts = attContent.split('  private flattenRecord(record: any) {');
if(attParts.length > 1) {
    let rightPart = attParts[1];
    let endIdx = rightPart.indexOf('  // 🔵 FIND ONE');
    attContent = attParts[0] + '  ' + rightPart.substring(endIdx);
}
fs.writeFileSync('src/modules/attendentionals/attendentionals.service.ts', attContent);

// 3. groupes.service.ts
let groupContent = fs.readFileSync('src/modules/groupes/groupes.service.ts', 'utf8');
groupContent = "import { flattenGroup } from '../../common/utils/flatter_functions';\n" + groupContent;
groupContent = groupContent.replace(/flattenGroup\(/g, "flattenGroup(this.config, ");
let gParts = groupContent.split('function flattenGroup(group: any) {');
if(gParts.length > 1) {
    let rightPart = gParts[1];
    let endIdx = rightPart.indexOf('  /**\n   * CREATE NEW GROUP');
    if (endIdx === -1) endIdx = rightPart.indexOf('  async create(');
    // Find the class definition
    let classIdx = groupContent.indexOf('export class GroupesService');
    // Group functions are outside the class? Wait. `function flattenGroup(group: any) {` was outside!
    let beforeFunc = groupContent.substring(0, groupContent.indexOf('function flattenGroup(group: any) {'));
    let afterFunc = groupContent.substring(groupContent.indexOf('export class GroupesService {'));
    groupContent = beforeFunc + '\n' + afterFunc;
}
fs.writeFileSync('src/modules/groupes/groupes.service.ts', groupContent);

// 4. lessons.service.ts
let lessonContent = fs.readFileSync('src/modules/lessons/lessons.service.ts', 'utf8');
lessonContent = "import { flattenLesson } from '../../common/utils/flatter_functions';\n" + lessonContent;
lessonContent = lessonContent.replace(/this\.flattenLesson\(/g, "flattenLesson(this.config, ");
let lParts = lessonContent.split('  private flattenLesson(lesson: any) {');
if(lParts.length > 1) {
    let rightPart = lParts[1];
    let endIdx = rightPart.indexOf('  /**\n   * CREATE LESSON');
    lessonContent = lParts[0] + '  ' + rightPart.substring(endIdx);
}
fs.writeFileSync('src/modules/lessons/lessons.service.ts', lessonContent);

// 5. staffs.service.ts
let staffContent = fs.readFileSync('src/modules/staffs/staffs.service.ts', 'utf8');
staffContent = "import { flattenStaff, flattenStudent, flattenTeacher, flattenUser } from '../../common/utils/flatter_functions';\n" + staffContent;
staffContent = staffContent.replace(/this\.flatten(Staff|Student|Teacher|User)\(/g, "flatten$1(this.config, ");
let sParts = staffContent.split('  /** 🔹 Helper flatten functions */');
if(sParts.length > 1) {
    let rightPart = sParts[1];
    let endIdx = rightPart.indexOf('  /** 🔸 Get teacher by Group ID */');
    staffContent = sParts[0] + '  ' + rightPart.substring(endIdx);
}
fs.writeFileSync('src/modules/staffs/staffs.service.ts', staffContent);

// 6. users.service.ts
let userContent = fs.readFileSync('src/modules/users/users.service.ts', 'utf8');
userContent = "import { flattenUser } from '../../common/utils/flatter_functions';\n" + userContent;
userContent = userContent.replace(/this\.flattenUser\(/g, "flattenUser(this.config, ");
let uParts = userContent.split('  /** 🔹 Helper: flatten user structure */');
if(uParts.length > 1) {
    let rightPart = uParts[1];
    let endIdx = rightPart.indexOf('  /** 🔸 Create user */');
    userContent = uParts[0] + '  ' + rightPart.substring(endIdx);
}
fs.writeFileSync('src/modules/users/users.service.ts', userContent);

console.log("Refactoring complete");
