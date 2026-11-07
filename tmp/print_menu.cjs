const fs = require('fs');
const code = fs.readFileSync('/tmp/members.js', 'utf8');

const idx = code.indexOf('Dashboard`})]}),');
if (idx !== -1) {
  console.log(code.substring(idx - 200, idx + 2500));
}
