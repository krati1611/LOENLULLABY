const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(indexHtmlPath, 'utf8');

// The template in index.html is broken (truncated).
// We'll reconstruct the full template from index.standalone.html

const standaloneHtml = fs.readFileSync(path.join(__dirname, 'index.standalone.html'), 'utf8');

// JSON.stringify the template — this escapes all special chars including </script> → <\/script>
const newTemplateJson = JSON.stringify(standaloneHtml);

// Verify it round-trips
try {
  const parsed = JSON.parse(newTemplateJson);
  console.log('✅ New template JSON is valid');
  console.log('Has pannellum:', parsed.includes('pannellum'));
  console.log('Has /head:', parsed.includes('</head>'));
  console.log('Has /html:', parsed.includes('</html>'));
} catch(e) {
  console.error('❌ Template JSON error:', e.message);
  process.exit(1);
}

// The old template block is broken because it contains unescaped </script> tags
// We can't use a simple regex. Instead, find the start marker and then manually
// find the CORRECT end by looking for </script> that ISN'T part of the JSON content.

const marker = '<script type="__bundler/template">';
const templateStart = html.indexOf(marker);
if (templateStart === -1) {
  console.error('No template block found');
  process.exit(1);
}

const jsonStart = templateStart + marker.length;

// The old template JSON starts with a quote. Find the matching end quote.
// The JSON is a single string value: "...escaped content..."
// We need to find the closing " that isn't preceded by a backslash.
let i = jsonStart;
while (i < html.length && (html[i] === ' ' || html[i] === '\n' || html[i] === '\r')) {
  i++;
}
if (html[i] !== '"') {
  console.error('Template JSON does not start with a quote, starts with:', JSON.stringify(html.substring(i, i+10)));
  process.exit(1);
}
i++; // skip opening quote

while (i < html.length) {
  if (html[i] === '\\') {
    i += 2; // skip escaped char
  } else if (html[i] === '"') {
    break; // found closing quote
  } else {
    i++;
  }
}

// i is now at the closing quote of the JSON string
const jsonEnd = i + 1; // include the closing quote

// After the JSON, there should be </script>
const afterJson = html.substring(jsonEnd, jsonEnd + 20);
console.log('After old JSON:', JSON.stringify(afterJson));

// Find the </script> that closes the template block
const closeScriptIdx = html.indexOf('</script>', jsonEnd);
const templateBlockEnd = closeScriptIdx + '</script>'.length;

console.log('Old template JSON length:', jsonEnd - jsonStart);
console.log('New template JSON length:', newTemplateJson.length);

// Build new HTML
const newTemplateBlock = marker + newTemplateJson + '</script>';
const newHtml = html.substring(0, templateStart) + newTemplateBlock + html.substring(templateBlockEnd);

fs.writeFileSync(indexHtmlPath, newHtml);
const stats = fs.statSync(indexHtmlPath);
console.log('✅ index.html updated');
console.log('File size:', (stats.size / 1024 / 1024).toFixed(1), 'MB');

// Verification: manually parse the new template
const verifyHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const vStart = verifyHtml.indexOf(marker);
const vJsonStart = vStart + marker.length;
let vi = vJsonStart + 1; // skip opening quote
while (vi < verifyHtml.length) {
  if (verifyHtml[vi] === '\\') { vi += 2; }
  else if (verifyHtml[vi] === '"') { break; }
  else { vi++; }
}
const vJsonStr = verifyHtml.substring(vJsonStart, vi + 1);
try {
  const parsed = JSON.parse(vJsonStr);
  console.log('✅ Verification PASSED - template JSON is valid');
  console.log('   Has pannellum:', parsed.includes('pannellum'));
  console.log('   Has complete HTML structure:', parsed.includes('</html>'));
} catch(e) {
  console.error('❌ Verification failed:', e.message);
}
