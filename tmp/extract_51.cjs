const fs = require('fs');
const code = fs.readFileSync('/tmp/members.js', 'utf8');

const match = code.substring(code.indexOf("var k=e(i(),1),A=[{id:`") + 17);
const arrayStr = match.substring(0, match.indexOf("}],j=[") + 2);
const items = eval('(' + arrayStr + ')');

const testList = require('./test_user_list.cjs');

console.log('items in A:', items.length);

const matched = items.map((it, idx) => {
  const userItem = testList ? testList[idx] : null;
  return {
    index: idx,
    id: it.id,
    title: it.title,
    userDriveUrl: it.driveUrl,
    imageUrl: it.imageUrl,
    images: it.images,
    stlFiles: it.stlFiles
  };
});

console.log(JSON.stringify(matched.slice(0, 10), null, 2));
fs.writeFileSync('/tmp/matched_51.json', JSON.stringify(matched, null, 2));
