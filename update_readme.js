const fs = require('fs');
let content = fs.existsSync('README.md') ? fs.readFileSync('README.md', 'utf8') : '';
const header = `> **🤖 AI Sessiyani Davom Ettirish:** 
> Ushbu loyiha bo'yicha orkestratsiya va sun'iy intellekt xotirasini aynan to'xtagan joyidan davom ettirish uchun terminalda quyidagi buyruqni kiriting:
> \`\`\`bash
> agy -c d34969a9-910e-4045-bfba-0195a2a70786
> \`\`\`

---

`;
fs.writeFileSync('README.md', header + content);
console.log("README yangilandi");
