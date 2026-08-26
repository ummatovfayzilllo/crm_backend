const fs = require('fs');

function fixDI(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Add import if missing
    if (!content.includes("import { ConfigService } from '@nestjs/config'")) {
        content = "import { ConfigService } from '@nestjs/config';\n" + content;
    }
    
    // Fix constructor
    content = content.replace(/import\("@nestjs\/config"\)\.ConfigService/g, 'ConfigService');
    
    fs.writeFileSync(filepath, content);
}

fixDI('src/core/admin/stafss/stafss.service.ts');
fixDI('src/modules/lessons/lessons.service.ts');
console.log("DI fixed");
