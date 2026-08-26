const fs = require('fs');
const path = require('path');

const fileUpdates = [
  {
    file: 'src/core/auth/auth.service.ts',
    replacements: [
      {
        find: /import { BadRequestException, Injectable, NotFoundException } from '@nestjs\/common';/g,
        replace: "import { flattenAuthUser } from '../../common/utils/flatter_functions';\nimport { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';"
      },
      {
        find: /this\.flattenAuthUser\(/g,
        replace: "flattenAuthUser(this.config, "
      }
    ]
  },
  {
    file: 'src/modules/attendentionals/attendentionals.service.ts',
    replacements: [
      {
        find: /import { Injectable, NotFoundException } from '@nestjs\/common';/g,
        replace: "import { flattenRecord } from '../../common/utils/flatter_functions';\nimport { Injectable, NotFoundException } from '@nestjs/common';"
      },
      {
        find: /this\.flattenRecord\(/g,
        replace: "flattenRecord(this.config, "
      },
      {
        find: /\/\/ 🔹 Helper — normalize \/ flatten function[\s\S]*?private flattenRecord\(record: any\) {[\s\S]*?attendentionals: records\.map\(\(r\) => this\.flattenRecord\(r\)\),\n    };\n  }/,
        replace: "    return {\n      message: 'All attendance records',\n      attendentionals: records.map((r) => flattenRecord(this.config, r)),\n    };\n  }" // Need to be careful here, just delete flattenRecord
      }
    ]
  }
];

// simpler approach: just read file and replace strings

function processFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (let r of replacements) {
        content = content.replace(r.find, r.replace);
    }
    fs.writeFileSync(filePath, content);
}
