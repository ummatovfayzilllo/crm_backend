const fs = require('fs');
const filepath = 'src/global/guards/role.guard.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Agar roles aniqlanmagan bo'lsa, hamma kiroladimi yoki faqat adminmi?
// Hozirgi mantiqqa ko'ra, agar roles ko'rsatilmagan bo'lsa, erkin bo'lishi kerak yoki ruxsat so'ralishi kerak.
content = content.replace(
    /if \(roles\.includes\(user\.role\) \|\| user\.role === UserRoles\.ADMIN\) \{/,
    'if (!roles) return true;\n\n    if (roles.includes(user.role) || user.role === UserRoles.ADMIN) {'
);

fs.writeFileSync(filepath, content);
console.log("Guard fixed");
