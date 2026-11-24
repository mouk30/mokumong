import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import type { GameEntry, InsightArticle } from './src/types/coupon.ts';
import { buildRobotsTxt, buildSitemapXml, normalizeOrigin } from './src/utils/sitemap.ts';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const distIndexHtml = path.join(distDir, 'index.html');
const isDevMode = process.env.NODE_ENV === 'development' || !fs.existsSync(distIndexHtml);

const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_SITE_URL = 'https://seoulkr.xyz';

const HOSTNAME_PORT_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*(?::\d{1,5})?$/i;

function parseAllowedHosts(): Set<string> {
  const hosts = new Set<string>([
    'seoulkr.xyz',
    'www.seoulkr.xyz',
    'coupongame.best',
    'www.coupongame.best',
    'localhost',
    '127.0.0.1',
  ]);

  for (const envVal of [process.env.SITE_URL, process.env.PUBLIC_SITE_URL, process.env.APP_URL]) {
    if (!envVal) continue;
    try {
      const u = new URL(envVal);
      if (u.hostname) hosts.add(u.hostname.toLowerCase());
    } catch {
      // Ignore malformed env URL
    }
  }

  if (process.env.ALLOWED_HOSTS) {
    for (const item of process.env.ALLOWED_HOSTS.split(',')) {
      const h = item.trim().toLowerCase().split(':')[0];
      if (h) hosts.add(h);
    }
  }

  return hosts;
}

const ALLOWED_HOSTS = parseAllowedHosts();

function isTrustedHost(hostWithPort: string): boolean {
  if (!HOSTNAME_PORT_RE.test(hostWithPort)) return false;
  const hostname = hostWithPort.split(':')[0].toLowerCase();
  if (ALLOWED_HOSTS.has(hostname)) return true;
  if (hostname.endsWith('.run.app')) return true;
  return false;
}

function resolveRequestOrigin(req: express.Request): string {
  // Explicit representative domain configured via environment takes highest priority
  const configured = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
  if (configured) {
    return normalizeOrigin(configured);
  }

  // Behind a trusted proxy, evaluate X-Forwarded-Host / Host strictly against allowlist
  const rawForwardedHost = req.headers['x-forwarded-host'];
  const candidateHost = (
    Array.isArray(rawForwardedHost)
      ? rawForwardedHost[0]
      : rawForwardedHost?.split(',')[0] || req.headers.host || ''
  ).trim();

  if (candidateHost && isTrustedHost(candidateHost)) {
    const rawProto = req.headers['x-forwarded-proto'];
    const protoCandidate = (
      Array.isArray(rawProto) ? rawProto[0] : rawProto?.split(',')[0] || req.protocol || 'https'
    )
      .trim()
      .toLowerCase();

    const hostname = candidateHost.split(':')[0].toLowerCase();
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    const proto = protoCandidate === 'http' && isLocal ? 'http' : 'https';
    return normalizeOrigin(`${proto}://${candidateHost}`);
  }

  if (process.env.APP_URL) {
    return normalizeOrigin(process.env.APP_URL);
  }

  return DEFAULT_SITE_URL;
}

function loadGamesData(): GameEntry[] {
  const raw = fs.readFileSync(path.join(root, 'src/data/games.json'), 'utf8');
  return JSON.parse(raw) as GameEntry[];
}

function loadInsightList(): InsightArticle[] {
  // Keep lightweight metadata synchronized with src/data/insights.ts without bundler dependencies
  return [
    {
      slug: 'subculture-rpg',
      number: '01',
      shortTitle: '서브컬처·수집형 RPG',
      title: '서브컬처·수집형 RPG 쿠폰 확인 가이드',
      description: '',
      keywords: [],
      audience: '',
      examples: '',
      lastModified: '2026-09-08',
      sections: [],
    },
    {
      slug: 'mmorpg-large-rpg',
      number: '02',
      shortTitle: 'MMORPG·대형 RPG',
      title: 'MMORPG 모바일게임 쿠폰 등록 및 서버 확인 안내',
      description: '',
      keywords: [],
      audience: '',
      examples: '',
      lastModified: '2026-09-08',
      sections: [],
    },
    {
      slug: 'shooting-battle-royale',
      number: '03',
      shortTitle: '액션·서바이벌',
      title: '액션·서바이벌 모바일게임 쿠폰 및 시즌 코드 안내',
      description: '',
      keywords: [],
      audience: '',
      examples: '',
      lastModified: '2026-09-08',
      sections: [],
    },
    {
      slug: 'casual-puzzle-sandbox',
      number: '04',
      shortTitle: '방치형·퍼즐·캐주얼',
      title: '방치형 키우기·퍼즐 모바일게임 쿠폰 활용 가이드',
      description: '',
      keywords: [],
      audience: '',
      examples: '',
      lastModified: '2026-09-08',
      sections: [],
    },
  ];
}

function parseTrustProxySetting(raw: string | undefined): boolean | number | string {
  if (!raw || raw.trim() === '') return 1;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  const num = Number(trimmed);
  if (Number.isInteger(num) && num >= 0) return num;
  return raw.trim();
}

async function createServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', parseTrustProxySetting(process.env.TRUST_PROXY));

  const games = loadGamesData();
  const insights = loadInsightList();

  // Serve /sitemap.xml and /sitemap.xml/ dynamically with strict SEO & security headers
  app.get(['/sitemap.xml', '/sitemap.xml/'], (req, res) => {
    const origin = resolveRequestOrigin(req);
    const xml = buildSitemapXml(origin, games, insights);
    res.status(200);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(xml);
  });

  // Serve /robots.txt matching the exact canonical origin
  app.get('/robots.txt', (req, res) => {
    const origin = resolveRequestOrigin(req);
    const txt = buildRobotsTxt(origin);
    res.status(200);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(txt);
  });

  if (isDevMode) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static assets from dist/ (never shadowing dynamic /sitemap.xml or /robots.txt)
    app.use(
      express.static(distDir, {
        index: false,
        redirect: false,
      })
    );

    const resolvePrerenderedFile = (reqPath: string): string | null => {
      const normalized = reqPath === '/' ? '' : reqPath.replace(/^\/+|\/+$/g, '');
      const candidate = normalized
        ? path.resolve(distDir, normalized, 'index.html')
        : path.resolve(distDir, 'index.html');

      if (!candidate.startsWith(distDir + path.sep)) {
        return null;
      }
      return fs.existsSync(candidate) ? candidate : null;
    };

    app.get('*', (req, res) => {
      const targetHtml = resolvePrerenderedFile(req.path);
      if (targetHtml) {
        res.status(200).sendFile(targetHtml);
        return;
      }

      const notFoundHtml = path.resolve(distDir, '404.html');
      if (notFoundHtml.startsWith(distDir + path.sep) && fs.existsSync(notFoundHtml)) {
        res.status(404).sendFile(notFoundHtml);
        return;
      }
      res.status(404).send('Not Found');
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `모쿠몽 server listening on http://0.0.0.0:${PORT} (${isDevMode ? 'dev' : 'production'})`
    );
  });
}

createServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
