const fs = require('fs');
const code = fs.readFileSync('/tmp/members.js', 'utf8');

const startStr = "$=[{id:`";
const startIdx = code.indexOf(startStr);
const arrayStart = startIdx + 2;
let depth = 0, inString = false, stringChar = null, escape = false, arrayEnd = -1;

for (let i = arrayStart; i < code.length; i++) {
  const c = code[i];
  if (escape) { escape = false; continue; }
  if (c === '\\') { escape = true; continue; }
  if (inString) {
    if (c === stringChar) inString = false;
    continue;
  }
  if (c === '`' || c === '"' || c === "'") {
    inString = true;
    stringChar = c;
    continue;
  }
  if (c === '[' || c === '{') depth++;
  else if (c === ']' || c === '}') {
    depth--;
    if (c === ']' && depth === 0) {
      arrayEnd = i + 1;
      break;
    }
  }
}

const cats = eval('(' + code.substring(arrayStart, arrayEnd) + ')');
console.log('Total official categories in $:', cats.length);
console.log('Sample:', cats.slice(0, 3));
fs.writeFileSync('src/data/officialCategories.json', JSON.stringify(cats, null, 2));
console.log('Saved to src/data/officialCategories.json');
