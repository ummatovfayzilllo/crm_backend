const fs = require('fs');

function addConfigService(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes("import { ConfigService }")) {
        content = "import { ConfigService } from '@nestjs/config';\n" + content;
    }
    content = content.replace(/constructor\(\s*private readonly prisma: PrismaService\s*\)/, 'constructor(private readonly prisma: PrismaService, private readonly config: ConfigService)');
    fs.writeFileSync(filePath, content);
}

addConfigService('src/modules/attendentionals/attendentionals.service.ts');
addConfigService('src/modules/lessons/lessons.service.ts');
addConfigService('src/modules/staffs/staffs.service.ts');

console.log("Constructors fixed");
