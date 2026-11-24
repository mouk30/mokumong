import type { GameEntry, InsightArticle } from '../types/coupon.ts';

export interface SitemapImage {
  loc: string;
  title: string;
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
  images?: SitemapImage[];
}

const INSIGHT_SHOWCASE_IMAGES: Record<string, { path: string; title: string }> = {
  'subculture-rpg': {
    path: '/assets/aistudio/card-collection_b8cbc57b_ea053600.png',
    title: '서브컬처 수집형 RPG 쿠폰 가이드 대표 이미지',
  },
  'mmorpg-large-rpg': {
    path: '/assets/aistudio/card-mmorpg_51a24582_ff2ee593.png',
    title: 'MMORPG 모바일게임 쿠폰 가이드 대표 이미지',
  },
  'shooting-battle-royale': {
    path: '/assets/aistudio/card-action_08a8662b_9452fd1c.png',
    title: '액션 서바이벌 모바일게임 쿠폰 가이드 대표 이미지',
  },
  'casual-puzzle-sandbox': {
    path: '/assets/aistudio/card-rpg_e1783d1b_d335d0cc.png',
    title: '방치형 RPG 및 캐주얼 게임 쿠폰 가이드 대표 이미지',
  },
};

// Dedicated unique game thumbnails (never duplicate shared fallback art across 180+ entries)
const DEDICATED_GAME_IMAGES = new Set<string>([
  '/assets/aistudio/animo-coupon_6c2c57ff_e2176203.png',
  '/assets/aistudio/maple-story-idle-coupon_b2ea5344_e07c6ee1.png',
  '/assets/aistudio/hudeodeok-survival-coupon_33eb5518_ffe7c492.jpg',
]);

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function normalizeOrigin(rawOrigin: string): string {
  const trimmed = rawOrigin.trim().replace(/\/+$/, '');
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch {
    // Fallback handled below
  }
  return 'https://seoulkr.xyz';
}

export function buildSitemapEntries(
  originInput: string,
  games: GameEntry[],
  insights: InsightArticle[]
): SitemapEntry[] {
  const origin = normalizeOrigin(originInput);
  const seenUrls = new Set<string>();
  const seenImages = new Set<string>();

  const latestGameDate = games.reduce(
    (max, g) => (g.lastCheckedAt > max ? g.lastCheckedAt : max),
    '2026-09-08'
  );

  const registerImage = (pathOrUrl: string | null | undefined, title: string): SitemapImage[] => {
    if (!pathOrUrl) return [];
    const absUrl = pathOrUrl.startsWith('http') ? pathOrUrl : `${origin}${pathOrUrl}`;
    if (seenImages.has(absUrl)) return [];
    seenImages.add(absUrl);
    return [{ loc: absUrl, title }];
  };

  const entries: SitemapEntry[] = [];

  const pushEntry = (entry: SitemapEntry) => {
    if (seenUrls.has(entry.loc)) return;
    seenUrls.add(entry.loc);
    entries.push(entry);
  };

  // 1. Main Home Page
  pushEntry({
    loc: `${origin}/`,
    lastmod: latestGameDate,
    changefreq: 'daily',
    priority: '1.0',
    images: [
      ...registerImage('/assets/aistudio/coupon-hero_58e0f329_665638d2.png', '모쿠몽 모바일게임 쿠폰 검색 허브'),
      ...registerImage('/assets/aistudio/mokumong-cat-mage-logo_52587fb5_28f50208.png', '모쿠몽 브랜드 마스코트'),
    ],
  });

  // 2. Insights Index Page
  pushEntry({
    loc: `${origin}/insights`,
    lastmod: '2026-09-08',
    changefreq: 'weekly',
    priority: '0.8',
  });

  // 3. Insight Detail Pages
  for (const article of insights) {
    const showcase = INSIGHT_SHOWCASE_IMAGES[article.slug];
    pushEntry({
      loc: `${origin}/insights/${article.slug}`,
      lastmod: article.lastModified,
      changefreq: 'monthly',
      priority: '0.7',
      images: showcase ? registerImage(showcase.path, showcase.title) : [],
    });
  }

  // 4. Service Intro & Policy Pages
  pushEntry({
    loc: `${origin}/about`,
    lastmod: latestGameDate,
    changefreq: 'monthly',
    priority: '0.6',
    images: registerImage(
      '/assets/aistudio/card-strategy_9155dc80_d0110024.png',
      '모쿠몽 서비스 소개 및 쿠폰 검증 기준'
    ),
  });

  pushEntry({
    loc: `${origin}/privacy`,
    lastmod: latestGameDate,
    changefreq: 'yearly',
    priority: '0.4',
  });

  pushEntry({
    loc: `${origin}/terms`,
    lastmod: latestGameDate,
    changefreq: 'yearly',
    priority: '0.4',
  });

  // 5. Indexable Game Pages (Group A/B/C only; excludes Group D noindex/duplicates)
  const indexableGames = games
    .filter((g) => g.indexable)
    .slice()
    .sort((a, b) => a.id - b.id);

  for (const game of indexableGames) {
    const hasVerified = game.coupons.some((c) => c.status === 'VERIFIED');
    const images =
      game.image && DEDICATED_GAME_IMAGES.has(game.image)
        ? registerImage(game.image, `${game.name} 모바일게임 쿠폰 대표 이미지`)
        : [];

    pushEntry({
      loc: `${origin}/game/${game.id}`,
      lastmod: game.lastCheckedAt,
      changefreq: hasVerified ? 'daily' : 'weekly',
      priority: hasVerified ? '0.9' : '0.75',
      images,
    });
  }

  return entries;
}

export function buildSitemapXml(
  originInput: string,
  games: GameEntry[],
  insights: InsightArticle[]
): string {
  const entries = buildSitemapEntries(originInput, games, insights);

  const urlNodes = entries
    .map((entry) => {
      const imageXml = (entry.images || [])
        .map(
          (img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
    </image:image>`
        )
        .join('\n');

      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>${imageXml ? `\n${imageXml}` : ''}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlNodes}
</urlset>
`;
}

export function buildRobotsTxt(originInput: string): string {
  const origin = normalizeOrigin(originInput);
  return `User-agent: *
Allow: /
Disallow: /api/

User-agent: Googlebot
Allow: /
Disallow: /api/

User-agent: Yeti
Allow: /
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
}
