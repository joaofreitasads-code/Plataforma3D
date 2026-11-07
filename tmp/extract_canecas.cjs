const fs = require('fs');
const code = fs.readFileSync('/tmp/members.js', 'utf8');

// Function to extract an array variable safely
function extractArray(name) {
  const startStr = name + '=[{id:`';
  const startIdx = code.indexOf(startStr);
  if (startIdx === -1) return [];
  const endIdx = code.indexOf(';', startIdx);
  const arrStr = code.substring(startIdx + name.length + 1, endIdx);
  try {
    // Evaluate in safe sandboxed function or parse
    return eval('(' + arrStr + ')');
  } catch (err) {
    console.error('eval error for', name, err.message);
    return [];
  }
}

const j = extractArray('j');
const N = extractArray('N');
const P = extractArray('P');

console.log('j (Canecas de Time):', j.length);
console.log('N (Canecas Gamer):', N.length);
console.log('P (Porta Copos):', P.length);

if (j.length > 0) {
  console.log('Sample j[0]:', JSON.stringify(j[0], null, 2));
}
if (N.length > 0) {
  console.log('Sample N[0]:', JSON.stringify(N[0], null, 2));
}
if (P.length > 0) {
  console.log('Sample P[0]:', JSON.stringify(P[0], null, 2));
}
