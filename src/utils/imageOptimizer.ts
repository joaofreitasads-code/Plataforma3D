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
  if (rawUrlOrId.startsWith('/')) return rawUrlOrId;

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
  if (rawUrlOrId.startsWith('/')) return rawUrlOrId;

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

export function isImageCached(_url: string): boolean {
  return false;
}

export function preloadPriorityImages(_urls: string[]): void {}

export function preloadImageBatch(_urls: string[], _limit: number = 150): void {}
