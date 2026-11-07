const fs = require('fs');
const models = JSON.parse(fs.readFileSync('src/data/allModels.json', 'utf8'));

const canecas = models.filter(m => {
  const q = 'caneca';
  return (
    (m.title && m.title.toLowerCase().includes(q)) ||
    (m.category && m.category.toLowerCase().includes(q)) ||
    (m.badge && m.badge.toLowerCase().includes(q)) ||
    (m.description && m.description.toLowerCase().includes(q)) ||
    (m.id && m.id.toLowerCase().includes(q))
  );
});

console.log('Total canecas found in allModels.json:', canecas.length);
console.log('Sample titles:', canecas.slice(0, 10).map(c => c.title));
