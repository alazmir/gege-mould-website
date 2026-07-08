const fs = require('fs');

const files = ['es', 'id', 'pt'];

for (const lang of files) {
  const path = `C:/Users/ASUS/gege-mould-website/assets/i18n/${lang}.json`;
  let content = fs.readFileSync(path, 'utf8');

  // Strip BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  // Fix duplicate closing braces: replace }\n} with }\n
  content = content.replace(/\}\r?\n\}/g, '}');

  fs.writeFileSync(path, content, 'utf8');

  // Validate
  try {
    const j = JSON.parse(content);
    console.log(`${lang}.json: valid JSON, ${Object.keys(j).length} keys`);
  } catch(e) {
    console.log(`${lang}.json: STILL INVALID — ${e.message}`);
  }
}
