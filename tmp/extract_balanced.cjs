const fs = require('fs');
const code = fs.readFileSync('/tmp/members.js', 'utf8');

function extractArrayBalanced(name) {
  const startStr = name + '=[{id:`';
  const startIdx = code.indexOf(startStr);
  if (startIdx === -1) {
    console.log('Not found:', startStr);
    return [];
  }
  const arrayStart = startIdx + name.length + 1; // position of '['
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

  if (arrayEnd === -1) {
    console.log('Could not find end of array for', name);
    return [];
  }

  const jsonLike = code.substring(arrayStart, arrayEnd);
  try {
    const result = eval('(' + jsonLike + ')');
    return result;
  } catch (err) {
    console.error('eval error for', name, err.message);
    return [];
  }
}

const j = extractArrayBalanced('j');
console.log('j length:', j.length);
if (j.length > 0) {
  console.log('j[0]:', j[0].id, j[0].title);
}

const N = extractArrayBalanced('N');
console.log('N length:', N.length);
if (N.length > 0) {
  console.log('N[0]:', N[0].id, N[0].title);
}

const P = extractArrayBalanced('P');
console.log('P length:', P.length);
if (P.length > 0) {
  console.log('P[0]:', P[0].id, P[0].title);
}

const A = extractArrayBalanced('A');
console.log('A length:', A.length);
if (A.length > 0) {
  console.log('A[0]:', A[0].id, A[0].title);
}
