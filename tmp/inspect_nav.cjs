const fs = require('fs');
const code = fs.readFileSync('/tmp/members.js', 'utf8');

// Look for navigation tabs/views in members.js
const navMatches = [...code.matchAll(/activeTab|currentTab|selectedTab|activeSection|viewMode/g)].map(m => m[0]);
console.log('Nav matches:', navMatches.slice(0, 10));

// Find where navigation state is defined
const stateMatch = code.match(/function\s+[a-zA-Z0-9_$]+\s*\([^)]*\)\s*\{[^}]*activeTab[^}]*\}/);
console.log('State snippet:', code.match(/\[([a-zA-Z0-9_$]+),\s*([a-zA-Z0-9_$]+)\]\s*=\s*(?:\([0-9a-zA-Z_$.()]+\))?useState\([`'"](dashboard|todas|canecas)/i)?.[0]);

// Find the sidebar menu items in code
const menuMatch = code.match(/Dashboard[\s\S]*?Configurações/);
console.log('Menu match:', menuMatch ? menuMatch[0].substring(0, 300) : 'not found');
