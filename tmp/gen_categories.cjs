const fs = require('fs');
const models = JSON.parse(fs.readFileSync('src/data/allModels.json', 'utf8'));

const catMap = new Map();

models.forEach(m => {
  const cat = m.category || 'Outros Modelos';
  catMap.set(cat, (catMap.get(cat) || 0) + 1);
});

const sortedCats = [...catMap.entries()].map(([name, count]) => ({
  name,
  count
})).sort((a, b) => b.count - a.count);

console.log('Categories count:', sortedCats.length);

const catContent = `export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

export const CATEGORIES: CategoryItem[] = ${JSON.stringify(sortedCats.map((c, i) => ({
  id: 'cat-' + i,
  name: c.name,
  count: c.count
})), null, 2)};
`;

fs.writeFileSync('src/data/categories.ts', catContent);
console.log('Saved src/data/categories.ts');
