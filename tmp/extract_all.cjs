const fs = require('fs');
const code = fs.readFileSync('/tmp/members.js', 'utf8');

function extractArrayBalanced(name) {
  const startStr = name + '=[{id:`';
  const startIdx = code.indexOf(startStr);
  if (startIdx === -1) return [];
  const arrayStart = startIdx + name.length + 1;
  let depth = 0;
  let inString = false;
  let stringChar = null;
  let escape = false;
  let arrayEnd = -1;

  for (let i = arrayStart; i < code.length; i++) {
    const c = code[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === '\\') {
      escape = true;
      continue;
    }
    if (inString) {
      if (c === stringChar) {
        inString = false;
      }
      continue;
    }
    if (c === '`' || c === '"' || c === "'") {
      inString = true;
      stringChar = c;
      continue;
    }
    if (c === '[' || c === '{') {
      depth++;
    } else if (c === ']' || c === '}') {
      depth--;
      if (c === ']' && depth === 0) {
        arrayEnd = i + 1;
        break;
      }
    }
  }

  if (arrayEnd === -1) return [];
  try {
    return eval('(' + code.substring(arrayStart, arrayEnd) + ')');
  } catch (err) {
    console.error('eval error for', name, err.message);
    return [];
  }
}

const arrays = ['A', 'j', 'M', 'N', 'P', 'F', 'I', 'R', 'z', 'B', 'ne', 'V'];
const allModels = [];

for (const name of arrays) {
  const items = extractArrayBalanced(name);
  console.log(`Extracted ${name}: ${items.length} items`);
  allModels.push(...items);
}

console.log(`Total extracted models: ${allModels.length}`);

// Fix image URLs for Imgur or local /canecas_times/ /front_models/ paths
const cleaned = allModels.map(m => {
  const copy = { ...m };
  // Helper to fix URLs
  const fixUrl = (url) => {
    if (!url) return '';
    if (url.includes('imgur.com')) return url;
    const imgurMatch = url.match(/thumb_([a-zA-Z0-9_-]+)\.webp/);
    if (imgurMatch) {
      return `https://i.imgur.com/${imgurMatch[1]}.webp`;
    }
    return url;
  };

  copy.imageUrl = fixUrl(copy.imageUrl);
  copy.thumbnailUrl = fixUrl(copy.thumbnailUrl);
  if (Array.isArray(copy.images)) {
    copy.images = copy.images.map(fixUrl);
  }
  return copy;
});

// Let's write to src/data/allModels.json
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/allModels.json', JSON.stringify(cleaned, null, 2));
console.log('Saved to src/data/allModels.json successfully!');
