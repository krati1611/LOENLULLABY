const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const indexHtmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(indexHtmlPath, 'utf8');

const manifestRegex = /<script type="__bundler\/manifest">([\s\S]*?)<\/script>/;
const manifestMatch = html.match(manifestRegex);
if (!manifestMatch) {
    console.error("Could not find __bundler/manifest");
    process.exit(1);
}
let manifest = JSON.parse(manifestMatch[1]);

const templateRegex = /<script type="__bundler\/template">([\s\S]*?)<\/script>/;
const templateMatch = html.match(templateRegex);
if (!templateMatch) {
    console.error("Could not find __bundler/template");
    process.exit(1);
}
let template = JSON.parse(templateMatch[1]);

const extRegex = /<script type="__bundler\/ext_resources">([\s\S]*?)<\/script>/;
const extMatch = html.match(extRegex);
let extResources = [];
if (extMatch) {
    extResources = JSON.parse(extMatch[1]);
}

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

// Ensure mime types match original
updateManifestEntry(appUuid, 'src/app.jsx', 'application/javascript');
updateManifestEntry(sectionsUuid, 'src/sections.jsx', 'application/javascript');
console.log("Updated app.jsx and sections.jsx in manifest.");

// Clean out old walkthrough assets to prevent duplicates blooming the file size
const newExtResources = [];
for (const entry of extResources) {
    if (entry.id.startsWith('walkthrough-assets/')) {
        // remove from manifest
        delete manifest[entry.uuid];
    } else {
        newExtResources.push(entry);
    }
}
extResources = newExtResources;

// Add walkthrough assets to manifest and extResources
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

// Write back
const newManifestHtml = `<script type="__bundler/manifest">${JSON.stringify(manifest)}</script>`;
const newExtHtml = `<script type="__bundler/ext_resources">${JSON.stringify(extResources)}</script>`;

let newHtml = html.replace(manifestRegex, newManifestHtml);

if (extMatch) {
    newHtml = newHtml.replace(extRegex, newExtHtml);
} else {
    // Inject extResources script just before manifest
    newHtml = newHtml.replace(newManifestHtml, newExtHtml + "\n  " + newManifestHtml);
}

fs.writeFileSync(indexHtmlPath, newHtml);
console.log("Successfully updated index.html");
