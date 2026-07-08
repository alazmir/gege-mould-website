const fs = require('fs');

const files = ['es', 'id', 'pt'];

for (const lang of files) {
  const path = `C:/Users/ASUS/gege-mould-website/assets/i18n/${lang}.json`;
  let content = fs.readFileSync(path, 'utf8');

  // Strip BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  // Fix: find cases.smc_outcome line that's missing trailing comma
  const lines = content.split('\n');
  let fixed = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('"cases.smc_outcome"') && !lines[i].trimEnd().endsWith(',')) {
      lines[i] = lines[i].trimEnd() + ',';
      console.log(`${lang}.json: fixed line ${i + 1} — added comma after cases.smc_outcome`);
      fixed = true;
      break;
    }
  }

  if (!fixed) {
    console.log(`${lang}.json: no fix needed or comma already present`);
  } else {
    content = lines.join('\n');
    fs.writeFileSync(path, content, 'utf8');
  }

  // Validate
  try {
    const j = JSON.parse(content);
    console.log(`  → valid JSON, ${Object.keys(j).length} keys`);
  } catch(e) {
    console.log(`  → STILL INVALID: ${e.message}`);
  }
}
