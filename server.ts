import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import express from 'express';

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = import.meta.dirname;
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const IS_DEV =
  process.argv.includes('--dev') ||
  process.env.npm_lifecycle_event === 'dev' ||
  process.execArgv.some((arg) => arg.includes('tsx'));

interface CachedImage {
  buf: Buffer;
  contentType: string;
}

const MAX_CACHE_ENTRIES = 1200;
const MAX_SINGLE_IMAGE_BYTES = 1536 * 1024; // 1.5 MB
const imageCache = new Map<string, CachedImage>();
const inFlightRequests = new Map<string, Promise<CachedImage | null>>();

// Limit concurrent upstream fetches so rapid scrolling doesn't trigger Google 429 rate limits
const MAX_CONCURRENT_UPSTREAM = 24;
let activeUpstream = 0;
const upstreamQueue: Array<() => void> = [];

function acquireUpstreamSlot(): Promise<void> {
  if (activeUpstream < MAX_CONCURRENT_UPSTREAM) {
    activeUpstream += 1;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    upstreamQueue.push(() => {
      activeUpstream += 1;
      resolve();
    });
  });
}

function releaseUpstreamSlot(): void {
  activeUpstream = Math.max(0, activeUpstream - 1);
  const next = upstreamQueue.shift();
  if (next) next();
}

function setLruCache(key: string, value: CachedImage): void {
  if (value.buf.length > MAX_SINGLE_IMAGE_BYTES) return;
  if (imageCache.has(key)) {
    imageCache.delete(key);
  } else if (imageCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = imageCache.keys().next().value;
    if (oldestKey !== undefined) {
      imageCache.delete(oldestKey);
    }
  }
  imageCache.set(key, value);
}

async function fetchCandidateImage(url: string): Promise<CachedImage | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });
    if (!response.ok) return null;
    const contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!contentType.startsWith('image/')) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    if (buf.length < 100) return null;
    return { buf, contentType };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveDriveImage(id: string, sz: number): Promise<CachedImage | null> {
  const cacheKey = `${id}:${sz}`;
  const cached = imageCache.get(cacheKey);
  if (cached) {
    imageCache.delete(cacheKey);
    imageCache.set(cacheKey, cached);
    return cached;
  }

  const existingFlight = inFlightRequests.get(cacheKey);
  if (existingFlight) {
    return existingFlight;
  }

  const promise = (async () => {
    await acquireUpstreamSlot();
    try {
      const candidates = [
        `https://lh3.googleusercontent.com/d/${id}=s${sz}-rw`,
        `https://lh3.googleusercontent.com/d/${id}=s${sz}`,
        `https://drive.google.com/thumbnail?id=${id}&sz=w${sz}`,
        `https://lh3.googleusercontent.com/d/${id}`,
      ];
      for (const candidateUrl of candidates) {
        const result = await fetchCandidateImage(candidateUrl);
        if (result) {
          setLruCache(cacheKey, result);
          return result;
        }
      }
      return null;
    } finally {
      releaseUpstreamSlot();
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');

  // Same-origin cached proxy for Google Drive / LH3 images (prevents browser/iframe 403/429 failures)
  app.get('/api/img', async (req, res) => {
    const rawId = typeof req.query.id === 'string' ? req.query.id.trim() : '';
    if (!/^[a-zA-Z0-9_-]{10,80}$/.test(rawId)) {
      res.status(400).end();
      return;
    }

    const parsedSz = Number(req.query.sz);
    const sz = Number.isFinite(parsedSz) ? Math.min(900, Math.max(160, Math.round(parsedSz))) : 240;

    const result = await resolveDriveImage(rawId, sz);
    if (!result) {
      res.setHeader('Cache-Control', 'public, max-age=60');
      res.status(404).end();
      return;
    }

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, immutable');
    res.setHeader('Content-Length', String(result.buf.length));
    res.status(200).send(result.buf);
  });

  const catalogExtraPath = path.join(
    IS_DEV || !fs.existsSync(path.join(DIST_DIR, 'catalog-extra.json'))
      ? path.join(ROOT_DIR, 'public', 'catalog-extra.json')
      : path.join(DIST_DIR, 'catalog-extra.json')
  );
  let catalogExtraGzipped: Buffer | null = null;
  let catalogExtraRaw: Buffer | null = null;
  try {
    if (fs.existsSync(catalogExtraPath)) {
      catalogExtraRaw = fs.readFileSync(catalogExtraPath);
      catalogExtraGzipped = zlib.gzipSync(catalogExtraRaw, { level: 6 });
    }
  } catch {
    catalogExtraGzipped = null;
    catalogExtraRaw = null;
  }

  // Fast gzipped delivery for catalog-extra.json (~195KB over the wire vs 1.5MB uncompressed)
  app.get('/catalog-extra.json', (req, res, next) => {
    if (!catalogExtraRaw) return next();
    const acceptEncoding = String(req.headers['accept-encoding'] || '');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Vary', 'Accept-Encoding');
    if (catalogExtraGzipped && acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Length', String(catalogExtraGzipped.length));
      res.status(200).send(catalogExtraGzipped);
      return;
    }
    res.setHeader('Content-Length', String(catalogExtraRaw.length));
    res.status(200).send(catalogExtraRaw);
  });

  const hasBuiltDist = fs.existsSync(path.join(DIST_DIR, 'index.html'));

  if (IS_DEV || !hasBuiltDist) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: ROOT_DIR,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      '/assets',
      express.static(path.join(DIST_DIR, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );

    app.use(
      express.static(DIST_DIR, {
        maxAge: '7d',
        setHeaders(res, filePath) {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          } else if (filePath.endsWith('.webp') || filePath.endsWith('.svg')) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
          } else if (filePath.endsWith('catalog-extra.json')) {
            res.setHeader('Cache-Control', 'public, max-age=3600');
          }
        },
      })
    );

    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Central 3D server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
