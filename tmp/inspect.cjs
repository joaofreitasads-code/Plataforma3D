const fs = require('fs');
const code = fs.readFileSync('/tmp/members.js', 'utf8');

// Find all items in j, N, P that have "caneca" in title or category or id
const arrays = ['A', 'j', 'M', 'N', 'P', 'F', 'I', 'R', 'z', 'B', 'ne', 'V', 'Q', '$'];

for (const arr of arrays) {
  const reg = new RegExp('(?:var\\s+)?' + arr.replace('$', '\\$') + '\\s*=\\s*(\\[\\{id:`.*?)(?:;\\s*(?:var|let|const|[a-zA-Z0-9_$]+=|\\[|function|return|import|export)|\\n\\s*\\n)', 's');
  // Or match from arr = [{id: up to next var/const
  const startIdx = code.indexOf(arr + '=[{id:`');
  if (startIdx !== -1) {
    const endIdx = code.indexOf(';', startIdx);
    const snippet = code.substring(startIdx, endIdx);
    const titles = [...snippet.matchAll(/title:`([^`]+)`/g)].map(m => m[1]);
    console.log(`${arr}: total ${titles.length} items`);
  }
}
