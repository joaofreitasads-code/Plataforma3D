const fs = require('fs');
const path = require('path');

const catsPath = path.resolve(__dirname, '../src/data/officialCategories.json');
const modelsPath = path.resolve(__dirname, '../src/data/allModels.json');

const cats = JSON.parse(fs.readFileSync(catsPath, 'utf8'));
const models = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));

const enriched = cats.map(cat => {
  const terms = (cat.filterQuery || cat.title).toLowerCase().split(' ').filter(w => w.length > 2);
  
  const matched = models.filter(m => {
    if (cat.sectionId && m.sectionId === cat.sectionId) return true;
    const mText = `${m.title} ${m.category} ${m.badge || ''}`.toLowerCase();
    return terms.some(t => mText.includes(t));
  });

  let image = cat.image;
  if (!image || image.startsWith('/categories/')) {
    const validModel = matched.find(m => m.imageUrl && (m.imageUrl.startsWith('https://') || m.imageUrl.startsWith('http://')));
    if (validModel) {
      image = validModel.imageUrl;
    } else {
      for (const m of matched) {
        if (m.images && m.images.length > 0) {
          const img = m.images.find(x => x && (x.startsWith('https://') || x.startsWith('http://')));
          if (img) {
            image = img;
            break;
          }
        }
      }
    }
  }

  if (!image || image.startsWith('/')) {
    image = 'https://i.imgur.com/dxozWx0.png';
  }

  return {
    ...cat,
    count: matched.length > 0 ? matched.length : 12,
    image,
  };
});

console.log('Enriched categories count:', enriched.length);
console.log('Sample enriched:', enriched.slice(0, 5).map(c => ({ id: c.id, title: c.title, count: c.count, img: c.image })));

fs.writeFileSync(path.resolve(__dirname, '../src/data/categories.json'), JSON.stringify(enriched, null, 2));
console.log('Saved to src/data/categories.json');
