const fs = require('fs');
const path = 'C:/Users/ASUS/gege-mould-website/assets/i18n/ar.json';
let content = fs.readFileSync(path, 'utf8');

// Fix: missing comma after cases.smc_outcome value
// The value ends with the Arabic text before a blank line and "news.heading"
const marker = 'بهذا الحجم.';
const markerPos = content.indexOf(marker);
if (markerPos !== -1) {
  // Find the closing quote after the marker
  const afterMarker = content.substring(markerPos + marker.length);
  const closeQuotePos = afterMarker.indexOf('"');
  if (closeQuotePos !== -1) {
    const insertPos = markerPos + marker.length + closeQuotePos + 1; // after the closing "
    if (content[insertPos] !== ',') {
      content = content.slice(0, insertPos) + ',' + content.slice(insertPos);
      console.log('Fixed: added comma after cases.smc_outcome at position', insertPos);
    } else {
      console.log('Comma already present');
    }
  }
} else {
  console.log('Marker not found, trying alternative...');
  // Try finding the end of cases.smc_outcome line more broadly
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('"cases.smc_outcome"') && !lines[i].endsWith(',')) {
      lines[i] = lines[i] + ',';
      console.log('Fixed line', i + 1, ': added comma');
      content = lines.join('\n');
      break;
    }
  }
}

fs.writeFileSync(path, content, 'utf8');

// Validate
try {
  const parsed = JSON.parse(content);
  console.log('ar.json is now valid JSON with', Object.keys(parsed).length, 'keys');
} catch(e) {
  console.log('Still invalid:', e.message);
}
