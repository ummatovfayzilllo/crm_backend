const fs = require('fs');
let grp = fs.readFileSync('src/modules/groupes/groupes.service.ts', 'utf8');
grp = grp.replace(/import \{\n  checAlreadykExistsResurs,\n  checkExistsResurs,\n\nimport \{ ModelsEnumInPrisma \}/, "import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/utils/check.functions';\nimport { ModelsEnumInPrisma }");
fs.writeFileSync('src/modules/groupes/groupes.service.ts', grp);
