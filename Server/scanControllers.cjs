const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');

fs.readdir(controllersDir, (err, files) => {
    if (err) {
        console.error('Error reading controllers directory:', err);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(controllersDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile() && file.endsWith('.js')) {
            console.log(`Controller: ${file}`);
            const content = fs.readFileSync(filePath, 'utf-8');
            console.log(`File Size: ${stats.size} bytes`);
            console.log(`Preview: ${content.slice(0, 200)}...`); // Show first 200 characters
            console.log('-----------------------------------');
        }
    });
});