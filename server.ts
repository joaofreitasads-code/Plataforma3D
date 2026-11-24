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
    const compressedCache = new Map<string, Buffer>();
    const compressBuffer = (raw: Buffer, encoding: 'br' | 'gzip'): Promise<Buffer> =>
      new Promise((resolve, reject) => {
        if (encoding === 'br') {
          zlib.brotliCompress(
            raw,
            { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } },
            (err, out) => (err ? reject(err) : resolve(out))
          );
        } else {
          zlib.gzip(raw, { level: 6 }, (err, out) => (err ? reject(err) : resolve(out)));
        }
      });

    const serveCompressedFile = async (
      fullPath: string,
      contentType: string,
      cacheControl: string,
      req: express.Request,
      res: express.Response
    ): Promise<boolean> => {
      const acceptEncoding = String(req.headers['accept-encoding'] || '');
      const encoding: 'br' | 'gzip' | null = acceptEncoding.includes('br')
        ? 'br'
        : acceptEncoding.includes('gzip')
        ? 'gzip'
        : null;
      if (!encoding) return false;
      const cacheKey = `${encoding}:${fullPath}`;
      let payload = compressedCache.get(cacheKey);
      if (!payload) {
        const raw = await fs.promises.readFile(fullPath);
        payload = await compressBuffer(raw, encoding);
        if (compressedCache.size < 128) {
          compressedCache.set(cacheKey, payload);
        }
      }
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Encoding', encoding);
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('Cache-Control', cacheControl);
      res.setHeader('Content-Length', String(payload.length));
      res.status(200).send(payload);
      return true;
    };

    app.get('/assets/*', async (req, res, next) => {
      if (!/\.(js|css)$/.test(req.path)) return next();
      const safeRel = path.normalize(req.path).replace(/^(\.\.(\/|\\|$))+/, '');
      const fullPath = path.join(DIST_DIR, safeRel);
      if (!fullPath.startsWith(path.join(DIST_DIR, 'assets')) || !fs.existsSync(fullPath)) {
        return next();
      }
      try {
        const contentType = fullPath.endsWith('.css')
          ? 'text/css; charset=utf-8'
          : 'application/javascript; charset=utf-8';
        const served = await serveCompressedFile(
          fullPath,
          contentType,
          'public, max-age=31536000, immutable',
          req,
          res
        );
        if (!served) next();
      } catch {
        next();
      }
    });

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
        index: false,
        setHeaders(res, filePath) {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          } else if (filePath.endsWith('.webp') || filePath.endsWith('.svg')) {
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
          }
        },
      })
    );

    app.get('*', async (req, res) => {
      const indexPath = path.join(DIST_DIR, 'index.html');
      try {
        const served = await serveCompressedFile(
          indexPath,
          'text/html; charset=utf-8',
          'no-cache',
          req,
          res
        );
        if (served) return;
      } catch {
        // fall through to sendFile
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(indexPath);
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
