const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const indexHtmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(indexHtmlPath, 'utf8');

// ── Helper: extract a JSON string from index.html by walking the string boundaries ──
function extractJsonBlock(html, marker) {
    const start = html.indexOf(marker);
    if (start === -1) return null;
    const jsonStart = start + marker.length;
    
    // If it starts with ", it's a JSON string — walk to find matching close "
    if (html[jsonStart] === '"') {
        let i = jsonStart + 1;
        while (i < html.length) {
            if (html[i] === '\\') { i += 2; continue; }
            if (html[i] === '"') break;
            i++;
        }
        const jsonEnd = i + 1;
        // Find the </script> after the JSON
        const closeTag = html.indexOf('</script>', jsonEnd);
        return {
            json: html.substring(jsonStart, jsonEnd),
            blockStart: start,
            blockEnd: closeTag + '</script>'.length,
        };
    }
    
    // If it starts with { or [, it's an object/array — walk braces
    if (html[jsonStart] === '{' || html[jsonStart] === '[') {
        const openChar = html[jsonStart];
        const closeChar = openChar === '{' ? '}' : ']';
        let depth = 0;
        let inStr = false;
        let i = jsonStart;
        while (i < html.length) {
            const c = html[i];
            if (inStr) {
                if (c === '\\') { i += 2; continue; }
                if (c === '"') inStr = false;
            } else {
                if (c === '"') inStr = true;
                if (c === openChar) depth++;
                if (c === closeChar) { depth--; if (depth === 0) break; }
            }
            i++;
        }
        const jsonEnd = i + 1;
        const closeTag = html.indexOf('</script>', jsonEnd);
        return {
            json: html.substring(jsonStart, jsonEnd),
            blockStart: start,
            blockEnd: closeTag + '</script>'.length,
        };
    }
    
    return null;
}

// ── Extract the three embedded JSON blocks ──
const manifestBlock = extractJsonBlock(html, '<script type="__bundler/manifest">');
if (!manifestBlock) { console.error("Could not find __bundler/manifest"); process.exit(1); }
let manifest = JSON.parse(manifestBlock.json);
console.log("Manifest: " + Object.keys(manifest).length + " entries");

const templateBlock = extractJsonBlock(html, '<script type="__bundler/template">');
if (!templateBlock) { console.error("Could not find __bundler/template"); process.exit(1); }
let template = JSON.parse(templateBlock.json);
console.log("Template: " + template.length + " chars");

const extBlock = extractJsonBlock(html, '<script type="__bundler/ext_resources">');
let extResources = extBlock ? JSON.parse(extBlock.json) : [];
console.log("Ext resources: " + extResources.length + " entries");

// ── UUIDs for app.jsx and sections.jsx in the manifest ──
const appUuid = "2ecce471-d2bd-4464-a054-3c79427d837a";
const sectionsUuid = "4ebf2209-6b16-47ff-bd3c-29d8c3f89f29";

function updateManifestEntry(uuid, filePath, mimeType) {
    const content = fs.readFileSync(path.join(__dirname, filePath));
    const compressed = zlib.gzipSync(content);
    manifest[uuid] = {
        mime: mimeType,
        data: compressed.toString('base64'),
        compressed: true
    };
}

updateManifestEntry(appUuid, 'src/app.jsx', 'application/javascript');
updateManifestEntry(sectionsUuid, 'src/sections.jsx', 'application/javascript');
console.log("Updated app.jsx and sections.jsx in manifest.");

// ── Add walkthrough assets ──
const assetsDir = path.join(__dirname, 'walkthrough-assets');
const files = fs.readdirSync(assetsDir);
for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.mp4')) {
        const filePath = path.join(assetsDir, file);
        const data = fs.readFileSync(filePath);
        const compressed = zlib.gzipSync(data);
        const mime = file.endsWith('.jpg') ? 'image/jpeg' : 'video/mp4';
        
        const uuid = crypto.randomUUID();
        manifest[uuid] = {
            mime: mime,
            data: compressed.toString('base64'),
            compressed: true
        };
        
        extResources.push({
            id: `walkthrough-assets/${file}`,
            uuid: uuid
        });
        console.log(`Added walkthrough-assets/${file} as ${uuid}`);
    }
}

// ── Removed Pannellum injection ──

// ── Rebuild index.html ──
// Build new script blocks
const newTemplateHtml = '<script type="__bundler/template">' + JSON.stringify(template).replace(/<\/script>/g, '<\\/script>') + '</script>';
const newManifestHtml = '<script type="__bundler/manifest">' + JSON.stringify(manifest) + '</script>';
const newExtHtml = '<script type="__bundler/ext_resources">' + JSON.stringify(extResources) + '</script>';

// Replace blocks in order (template comes first in the file, then ext, then manifest)
// We need to rebuild from the identified positions
// Sort blocks by position
const blocks = [
    { name: 'template', old: templateBlock, newHtml: newTemplateHtml },
    { name: 'manifest', old: manifestBlock, newHtml: newManifestHtml },
];
if (extBlock) {
    blocks.push({ name: 'ext', old: extBlock, newHtml: newExtHtml });
}
blocks.sort((a, b) => b.old.blockStart - a.old.blockStart); // reverse order so offsets don't shift

let newHtml = html;
for (const block of blocks) {
    newHtml = newHtml.substring(0, block.old.blockStart) + block.newHtml + newHtml.substring(block.old.blockEnd);
}

// If ext_resources didn't exist, inject it before manifest
if (!extBlock) {
    const manifestPos = newHtml.indexOf(newManifestHtml);
    newHtml = newHtml.substring(0, manifestPos) + newExtHtml + "\n  " + newHtml.substring(manifestPos);
}

fs.writeFileSync(indexHtmlPath, newHtml);
const stats = fs.statSync(indexHtmlPath);
console.log("\n✅ Successfully updated index.html");
console.log("File size: " + (stats.size / 1024 / 1024).toFixed(1) + " MB");

// ── Verify ──
const verifyHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const verifyTemplate = extractJsonBlock(verifyHtml, '<script type="__bundler/template">');
const verifyManifest = extractJsonBlock(verifyHtml, '<script type="__bundler/manifest">');
const verifyExt = extractJsonBlock(verifyHtml, '<script type="__bundler/ext_resources">');

try {
    const t = JSON.parse(verifyTemplate.json);
    console.log("✅ Template valid, pannellum:", t.includes('pannellum'));
} catch(e) { console.error("❌ Template broken:", e.message); }

try {
    const m = JSON.parse(verifyManifest.json);
    console.log("✅ Manifest valid:", Object.keys(m).length, "entries");
} catch(e) { console.error("❌ Manifest broken:", e.message); }

try {
    const e = JSON.parse(verifyExt.json);
    console.log("✅ Ext resources valid:", e.length, "entries");
} catch(e) { console.error("❌ Ext resources broken:", e.message); }
