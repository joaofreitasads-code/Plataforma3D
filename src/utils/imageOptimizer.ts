// High-performance image URL resolver and Google Edge WebP CDN optimizer

export function markImageCached(_url: string): void {
  // Rely on native browser HTTP/decoded image cache without synchronous sessionStorage churn
}

/**
 * Extracts a Google Drive file ID from various URL patterns or bare IDs
 */
export function extractDriveId(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (!trimmed) return '';

  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return '';
}

/**
 * Returns an ultra-fast, CDN-optimized thumbnail URL for catalog cards.
 * Uses Google's edge WebP compression (=s220-rw) which serves ~7KB-12KB WebP images
 * with 24-hour browser caching (max-age=86400) and zero redirects.
 */
export function getOptimizedCardImageUrl(
  rawUrlOrId: string | undefined | null,
  attempt: number = 0,
  targetWidth: number = 240
): string {
  if (!rawUrlOrId) return '';
  if (rawUrlOrId.startsWith('/')) {
    return attempt > 0 ? `${rawUrlOrId}${rawUrlOrId.includes('?') ? '&' : '?'}r=${attempt}` : rawUrlOrId;
  }

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

  const size = Math.min(280, Math.max(160, targetWidth));

  switch (attempt) {
    case 0:
      return `/api/img?id=${encodeURIComponent(id)}&sz=${size}`;
    case 1:
      return `https://lh3.googleusercontent.com/d/${id}=s${size}-rw`;
    case 2:
      return `https://lh3.googleusercontent.com/d/${id}=s${size}`;
    case 3:
      return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
    default:
      return `https://lh3.googleusercontent.com/d/${id}`;
  }
}

/**
 * Returns an optimized high-resolution URL for modals and detail zooms.
 */
export function getOptimizedModalImageUrl(
  rawUrlOrId: string | undefined | null,
  attempt: number = 0
): string {
  if (!rawUrlOrId) return '';
  if (rawUrlOrId.startsWith('/')) {
    return attempt > 0 ? `${rawUrlOrId}${rawUrlOrId.includes('?') ? '&' : '?'}r=${attempt}` : rawUrlOrId;
  }

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
      return `/api/img?id=${encodeURIComponent(id)}&sz=640`;
    case 1:
      return `https://lh3.googleusercontent.com/d/${id}=s640-rw`;
    case 2:
      return `https://lh3.googleusercontent.com/d/${id}=s640`;
    case 3:
      return `https://drive.google.com/thumbnail?id=${id}&sz=w700`;
    default:
      return `https://lh3.googleusercontent.com/d/${id}`;
  }
}

// --- Resilient same-origin blob fetch rescue ---
// When third-party cookies are blocked in an iframe, native <img> requests to same-origin paths
// can hit auth redirects, while window.fetch() is authenticated via the host iframe bridge.
const MAX_BLOB_CACHE = 600;
const blobUrlCache = new Map<string, string>();
const failedBlobUrls = new Set<string>();
const inFlightBlobFetches = new Map<string, Promise<string | null>>();
let preferSameOriginBlob = false;

export function shouldPreferBlobFetch(): boolean {
  return preferSameOriginBlob;
}

export function markPreferBlobFetch(): void {
  preferSameOriginBlob = true;
}

export function getCachedBlobUrl(url: string | undefined | null): string | null {
  if (!url || !url.startsWith('/')) return null;
  const hit = blobUrlCache.get(url);
  if (hit) {
    blobUrlCache.delete(url);
    blobUrlCache.set(url, hit);
    return hit;
  }
  return null;
}

async function isValidImageBlob(blob: Blob, contentTypeHeader: string, url: string): Promise<boolean> {
  if (!blob || blob.size < 64) return false;
  const ct = (blob.type || contentTypeHeader || '').toLowerCase();
  if (ct.includes('text/html') || ct.includes('application/json')) return false;
  if (ct.startsWith('image/')) return true;

  // Fallback magic-byte inspection when Content-Type is generic
  try {
    const headerBuf = await blob.slice(0, 32).arrayBuffer();
    const bytes = new Uint8Array(headerBuf);
    const isWebp =
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8;
    const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
    if (isWebp || isPng || isJpg || isGif) return true;
    if (url.toLowerCase().includes('.svg')) {
      const text = new TextDecoder().decode(bytes).toLowerCase();
      return text.includes('<svg') || text.includes('<?xml');
    }
  } catch {
    return false;
  }
  return false;
}

export function fetchSameOriginImageAsBlobUrl(url: string): Promise<string | null> {
  if (!url || !url.startsWith('/')) return Promise.resolve(null);

  const cached = getCachedBlobUrl(url);
  if (cached) return Promise.resolve(cached);
  if (failedBlobUrls.has(url)) return Promise.resolve(null);

  const inFlight = inFlightBlobFetches.get(url);
  if (inFlight) return inFlight;

  const promise = (async () => {
    try {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        if (response.status === 404 || response.status === 400) {
          failedBlobUrls.add(url);
        }
        return null;
      }
      const contentType = response.headers.get('content-type') || '';
      const blob = await response.blob();
      const valid = await isValidImageBlob(blob, contentType, url);
      if (!valid) {
        return null;
      }

      const objectUrl = URL.createObjectURL(blob);
      if (blobUrlCache.size >= MAX_BLOB_CACHE) {
        const oldestKey = blobUrlCache.keys().next().value;
        if (oldestKey !== undefined) {
          const oldBlob = blobUrlCache.get(oldestKey);
          blobUrlCache.delete(oldestKey);
          if (oldBlob) URL.revokeObjectURL(oldBlob);
        }
      }
      blobUrlCache.set(url, objectUrl);
      return objectUrl;
    } catch {
      return null;
    } finally {
      inFlightBlobFetches.delete(url);
    }
  })();

  inFlightBlobFetches.set(url, promise);
  return promise;
}

export function isImageCached(_url: string): boolean {
  return false;
}

export function preloadPriorityImages(_urls: string[]): void {}

export function preloadImageBatch(_urls: string[], _limit: number = 150): void {}
