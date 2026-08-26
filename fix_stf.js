const fs = require('fs');
let s = fs.readFileSync('src/core/admin/stafss/stafss.service.ts', 'utf8');
s = s.replace(/constructor\(private readonly st : StaffsService,\s*private readonly prisma : PrismaService\) \{/g, 'constructor(private readonly st : StaffsService, private readonly prisma : PrismaService, private readonly config: import("@nestjs/config").ConfigService) {');
fs.writeFileSync('src/core/admin/stafss/stafss.service.ts', s);
