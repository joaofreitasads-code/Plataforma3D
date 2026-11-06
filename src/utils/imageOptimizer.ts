// High-performance image URL resolver, Google Edge WebP CDN optimizer and memory cache

// Session memory cache to track already-loaded image URLs
const loadedImageUrls = new Set<string>();

// Restore loaded URLs from sessionStorage for instant zero-flash renders
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const raw = sessionStorage.getItem('universo3d_cached_images_v3');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach(url => { if (typeof url === 'string') loadedImageUrls.add(url); });
      }
    }
  }
} catch {
  // Ignore storage access errors
}

let saveTimer: number | null = null;
export function markImageCached(url: string): void {
  if (!url || loadedImageUrls.has(url)) return;
  loadedImageUrls.add(url);
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      if (!saveTimer) {
        saveTimer = window.setTimeout(() => {
          saveTimer = null;
          const sample = Array.from(loadedImageUrls).slice(-250);
          sessionStorage.setItem('universo3d_cached_images_v3', JSON.stringify(sample));
        }, 1200);
      }
    }
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Extracts a Google Drive file ID from various URL patterns or bare IDs
 */
export function extractDriveId(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (!trimmed) return '';

  // Match /d/ID
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  // Match id=ID
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  // If it's already a bare ID (alphanumeric with - and _, usually 25-45 chars)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return '';
}

/**
 * Returns an ultra-fast, CDN-optimized thumbnail URL for catalog cards.
 * Uses Google's edge WebP compression (=s220-rw) which serves ~7KB-12KB WebP images
 * with 24-hour browser caching (max-age=86400) and zero redirects.
 * Also optimizes external hosts like Imgur to medium thumbnails (46KB instead of 2.2MB).
 */
export function getOptimizedCardImageUrl(
  rawUrlOrId: string | undefined | null,
  attempt: number = 0,
  targetWidth: number = 220
): string {
  if (!rawUrlOrId) return '';
  if (rawUrlOrId.startsWith('/')) return rawUrlOrId; // Local asset

  // Optimize Imgur links: NEVER append thumbnail letters to .png files because Imgur strips alpha channel and fills with solid black!
  if (rawUrlOrId.includes('imgur.com')) {
    if (rawUrlOrId.toLowerCase().includes('.png')) {
      return rawUrlOrId;
    }
    if (attempt === 0 && !/[a-zA-Z0-9]+[mstb]\.[a-zA-Z]+$/.test(rawUrlOrId)) {
      return rawUrlOrId.replace(/([a-zA-Z0-9_-]+)\.(jpg|jpeg|webp)/i, '$1m.$2');
    }
    return rawUrlOrId;
  }

  const id = extractDriveId(rawUrlOrId);
  if (!id) return rawUrlOrId;

  // Ultra-light 220px boundary: delivers crisp high-DPI quality at just ~8-12KB
  const size = Math.min(260, Math.max(200, targetWidth));

  // High-Speed Multi-CDN Fallback Sequence:
  switch (attempt) {
    case 0:
      // Fastest: Google Edge WebP resizer (~7KB-12KB WebP, 0 redirects, direct CDN)
      return `https://lh3.googleusercontent.com/d/${id}=s${size}-rw`;
    case 1:
      // Fallback 1: Standard compressed JPEG on Google Edge (~14KB-18KB)
      return `https://lh3.googleusercontent.com/d/${id}=s${size}`;
    case 2:
      // Fallback 2: Google Drive native thumbnail endpoint
      return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
    case 3:
      // Fallback 3: Direct LH3 stream
      return `https://lh3.googleusercontent.com/d/${id}`;
    case 4:
      // Fallback 4: Untrusted content direct stream
      return `https://drive.usercontent.google.com/download?id=${id}&export=view`;
    default:
      return `https://lh3.googleusercontent.com/d/${id}`;
  }
}

/**
 * Returns an optimized high-resolution URL for modals and detail zooms.
 * Uses Google edge WebP (=s640-rw) serving crisp ~40-50KB WebP instead of 5-10MB raw.
 */
export function getOptimizedModalImageUrl(
  rawUrlOrId: string | undefined | null,
  attempt: number = 0
): string {
  if (!rawUrlOrId) return '';
  if (rawUrlOrId.startsWith('/')) return rawUrlOrId;

  // Optimize Imgur links for modal: keep PNG transparent
  if (rawUrlOrId.includes('imgur.com')) {
    if (rawUrlOrId.toLowerCase().includes('.png')) {
      return rawUrlOrId;
    }
    if (attempt === 0 && !/[a-zA-Z0-9]+[mstb]\.[a-zA-Z]+$/.test(rawUrlOrId)) {
      return rawUrlOrId.replace(/([a-zA-Z0-9_-]+)\.(jpg|jpeg|webp)/i, '$1l.$2');
    }
    return rawUrlOrId;
  }

  const id = extractDriveId(rawUrlOrId);
  if (!id) return rawUrlOrId;

  switch (attempt) {
    case 0:
      // Crisp 640p WebP modal preview (~40KB-55KB)
      return `https://lh3.googleusercontent.com/d/${id}=s640-rw`;
    case 1:
      // High-res JPEG fallback
      return `https://lh3.googleusercontent.com/d/${id}=s640`;
    case 2:
      // Drive thumbnail endpoint
      return `https://drive.google.com/thumbnail?id=${id}&sz=w700`;
    case 3:
      // Direct raw
      return `https://lh3.googleusercontent.com/d/${id}`;
    default:
      return `https://lh3.googleusercontent.com/d/${id}`;
  }
}

// In-memory decoded image object cache
const imageBitmaps = new Map<string, HTMLImageElement>();

/**
 * Check if an image URL was already loaded in this session
 */
export function isImageCached(url: string): boolean {
  return loadedImageUrls.has(url) || imageBitmaps.has(url);
}

/**
 * Safe, non-flooding preloader: lets native HTML <img> handle viewport priority
 */
export function preloadPriorityImages(_urls: string[]): void {
  // Rely on native browser img loading="lazy" / loading="eager" to prevent rate-limiting
}

/**
 * Safe idle preloader: prevents flooding the client network or triggering CDN limits
 */
export function preloadImageBatch(_urls: string[], _limit: number = 150): void {
  // Rely on native browser img loading="lazy" / loading="eager" to prevent rate-limiting
}

