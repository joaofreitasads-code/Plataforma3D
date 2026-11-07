import { Model3D } from '../types/model';
import rawModels from './allModels.json';

export const MODELS: Model3D[] = rawModels as unknown as Model3D[];

// Quick access to canecas
export const CANECAS = MODELS.filter(m => {
  const q = 'caneca';
  return (
    (m.title && m.title.toLowerCase().includes(q)) ||
    (m.category && m.category.toLowerCase().includes(q)) ||
    (m.badge && m.badge.toLowerCase().includes(q)) ||
    (m.sectionId && m.sectionId.includes('caneca'))
  );
});

// Card background image provided by user
export const CARD_BG_URL = 'https://i.imgur.com/6wgowqT.png';

export const VIP_MODELS = MODELS.slice(0, 51);

// Resolves image URLs with fallbacks
export function resolveImageUrl(url?: string, model?: Model3D): string {
  if (!url) {
    if (model?.images && model.images.length > 0) {
      return resolveImageUrl(model.images[0]);
    }
    return CARD_BG_URL;
  }

  // If already imgur or lh3 or drive
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If it's a front-model placeholder or drive folder link instead of direct file, fallback
    if (url.includes('front-model-') || url.includes('drive.google.com/drive/folders/')) {
      return CARD_BG_URL;
    }
    return url;
  }

  // If starts with /canecas_times/thumb_XXXXX.webp or contains imgur thumb
  if (url.includes('/canecas_times/')) {
    const imgurMatch = url.match(/thumb_([a-zA-Z0-9_-]+)\.webp/);
    if (imgurMatch) {
      return `https://i.imgur.com/${imgurMatch[1]}.webp`;
    }
  }

  // front_models use the user background
  if (url.includes('front-model-') || url.includes('/front_models/')) {
    return CARD_BG_URL;
  }

  // If it's a gamer caneca, look up its known imgur image
  if (url.includes('playstation')) return 'https://i.imgur.com/Vsil7jH.png';
  if (url.includes('mortal_kombat')) return 'https://i.imgur.com/HszSA6I.png';
  if (url.includes('call_of_duty')) return 'https://i.imgur.com/J03Oiw8.png';
  if (url.includes('gta')) return 'https://i.imgur.com/PEpTF17.png';
  if (url.includes('minecraft')) return 'https://i.imgur.com/kW6l3MM.png';

  // Stadiums mapping
  if (url.includes('/estadios/flamengo')) return 'https://i.imgur.com/iE16b7f.webp';
  if (url.includes('/estadios/corinthians')) return 'https://i.imgur.com/guXbpbS.webp';
  if (url.includes('/estadios/palmeiras')) return 'https://lh3.googleusercontent.com/d/1yxf3UT08of5OcJjyJiKD1jf_onazeX1u';
  if (url.includes('/estadios/gremio')) return 'https://i.imgur.com/3XhD2yv.webp';
  if (url.includes('/estadios/cruzeiro')) return 'https://i.imgur.com/LuL2yvH.webp';
  if (url.includes('/estadios/santos')) return 'https://i.imgur.com/Sjzw2rh.webp';
  if (url.includes('/estadios/vasco')) return 'https://i.imgur.com/DIPrK4i.webp';

  // If model has secondary image in images array
  if (model?.images) {
    const validImg = model.images.find(img => (img.startsWith('https://') || img.startsWith('http://')) && !img.includes('front-model-') && !img.includes('drive.google.com/drive/folders/'));
    if (validImg) return validImg;
  }

  return CARD_BG_URL;
}

export function searchModels(query: string, categoryFilter?: string): Model3D[] {
  const q = query.trim().toLowerCase();
  
  return MODELS.filter(model => {
    // Category filter
    if (categoryFilter && categoryFilter !== 'all' && model.category !== categoryFilter) {
      return false;
    }

    if (!q) return true;

    const title = (model.title || '').toLowerCase();
    const category = (model.category || '').toLowerCase();
    const badge = (model.badge || '').toLowerCase();
    const desc = (model.description || '').toLowerCase();
    const id = (model.id || '').toLowerCase();

    return title.includes(q) || category.includes(q) || badge.includes(q) || desc.includes(q) || id.includes(q);
  });
}
