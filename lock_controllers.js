const fs = require('fs');
const glob = require('glob');

const controllers = [
  'src/core/admin/admin.controller.ts',
  'src/modules/rom/rom.controller.ts',
  'src/modules/courses/courses.controller.ts',
  'src/modules/groupes/groupes.controller.ts',
  'src/modules/lessons/lessons.controller.ts',
  'src/modules/staffs/staffs.controller.ts',
  'src/modules/users/*.controller.ts',
  'src/modules/attendentionals/attendentionals.controller.ts',
  'src/modules/student-groups/student-groups.controller.ts',
  'src/core/auth/auth.controller.ts'
];

function addImports(content, isAdmin = false) {
    let imports = `import { ApiBearerAuth } from '@nestjs/swagger';\nimport { UseGuards } from '@nestjs/common';\nimport { JwtAuthGuard } from 'src/global/guards/jwt.auth.guard';\n`;
    if (isAdmin) {
        imports += `import { RoleAuthGuard } from 'src/global/guards/role.guard';\nimport { UserRole } from 'src/global/decorators/auth.decorators';\nimport { UserRoles } from 'src/common/types/user.types';\n`;
    }
    
    // Remove if already exists to prevent duplicate
    content = content.replace(/import \{ ApiBearerAuth \} from '@nestjs\/swagger';\n/g, '');
    content = content.replace(/import \{ UseGuards \} from '@nestjs\/common';\n/g, '');
    content = content.replace(/import \{ JwtAuthGuard \} from 'src\/global\/guards\/jwt\.auth\.guard';\n/g, '');
    
    return imports + content;
}

function lockController(filepath, isAdmin = false) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    if (content.includes('@ApiBearerAuth()') && content.includes('@UseGuards(JwtAuthGuard')) {
        return; // Already locked
    }
    
    content = addImports(content, isAdmin);
    
    let decorators = `@ApiBearerAuth()\n@UseGuards(JwtAuthGuard`;
    if (isAdmin) {
        decorators += `, RoleAuthGuard)\n@UserRole(UserRoles.ADMIN)\n`;
    } else {
        decorators += `)\n`;
    }
    
    content = content.replace(/@Controller\(/, decorators + '@Controller(');
    fs.writeFileSync(filepath, content);
}

// Lock all standard controllers
controllers.forEach(pattern => {
    const files = glob.sync(pattern);
    files.forEach(file => {
        const isAdmin = file.includes('admin.controller.ts');
        lockController(file, isAdmin);
    });
});

// FileStreamController - Make completely Public
const fileStreamPath = 'src/core/services/file.stream.controller.ts';
if (fs.existsSync(fileStreamPath)) {
    let fsContent = fs.readFileSync(fileStreamPath, 'utf8');
    if (!fsContent.includes('@Public()')) {
        fsContent = `import { Public } from 'src/global/decorators/auth.decorators';\n` + fsContent;
        fsContent = fsContent.replace(/@Controller\(/, '@Public()\n@Controller(');
        fs.writeFileSync(fileStreamPath, fsContent);
    }
}

console.log("Qulflar muvaffaqiyatli o'rnatildi!");
