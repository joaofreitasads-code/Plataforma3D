const fs = require('fs');
const html = fs.readFileSync('public/assets/aistudio/Central_3D_-_A_rea_de_Membros_VIP___Arquivos_STL___3MF_51f28eaa.html', 'utf8');

const articles = [...html.matchAll(/<article[\s\S]*?<\/article>/g)].map(m => m[0]);
console.log('Total articles in attachment:', articles.length);

const parsed = articles.map((art, i) => {
  const titleM = art.match(/<h3[^>]*>([^<]+)<\/h3>/);
  const imgBgM = art.match(/<img[^>]*class="[^"]*object-cover[^"]*"[^>]*src="([^"]+)"/);
  const imgModelM = art.match(/<img[^>]*class="[^"]*drop-shadow[^"]*"[^>]*src="([^"]+)"/) || art.match(/<img[^>]*alt="([^"]+)"[^>]*src="([^"]+)"/);
  const badgeM = art.match(/<div class="[^"]*bottom-2.5[^"]*">([^<]+)<\/div>/);
  const catM = art.match(/<div class="flex items-center gap-1.5[^"]*">([\s\S]*?)<\/div>/);
  const specM = art.match(/<span class="inline-block bg-\[#0f2438\][^"]*">([^<]+)<\/span>/);
  
  return {
    index: i,
    title: titleM ? titleM[1].trim() : '',
    badge: badgeM ? badgeM[1].trim() : '',
    spec: specM ? specM[1].trim() : '',
    imgSrc: imgModelM ? imgModelM[imgModelM.length - 1] : ''
  };
});

console.log(JSON.stringify(parsed.slice(0, 10), null, 2));
console.log('Last 5:');
console.log(JSON.stringify(parsed.slice(-5), null, 2));
