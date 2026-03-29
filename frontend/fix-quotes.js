const fs = require('fs');
const path = require('path');

function fix(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fix(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const fixed = content.replace(/\\\\\"/g, '\"');
            fs.writeFileSync(fullPath, fixed);
        }
    }
}
fix('./src');
console.log('Fixed quotes');
