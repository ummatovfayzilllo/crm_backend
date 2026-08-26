const fs = require('fs');

let content = fs.readFileSync('src/common/utils/flatter_functions/flatter.functions.ts', 'utf8');

// Add imports
const imports = `import { AuthInputEntity } from '../../../core/auth/auth.entity';
import { UserFullEntity } from '../../../modules/users/entities/user.entity';
import { StaffFullEntity } from '../../../modules/staffs/entities/staff.entity';
import { GroupFullEntity } from '../../../modules/groupes/entities/groupe.entity';
import { LessonFullEntity } from '../../../modules/lessons/entities/lesson.entity';
import { AttendentionalFullEntity } from '../../../modules/attendentionals/entities/attendentional.entity';
`;
content = imports + content;

// Replace 'any'
content = content.replace(/user: any/g, 'user: UserFullEntity | AuthInputEntity');
content = content.replace(/staff: any/g, 'staff: StaffFullEntity');
content = content.replace(/group: any/g, 'group: GroupFullEntity');
content = content.replace(/lesson: any/g, 'lesson: LessonFullEntity');
content = content.replace(/record: any/g, 'record: AttendentionalFullEntity');

fs.writeFileSync('src/common/utils/flatter_functions/flatter.functions.ts', content);
console.log("Flatter updated");
