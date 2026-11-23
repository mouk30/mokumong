import { GAME_BY_ID, getVerifiedCoupons } from '../data/games';
import { INSIGHT_BY_SLUG, JOB_BY_SLUG } from '../data/insights';
import type { GameEntry } from '../types/coupon';

export const SITE_URL = 'https://coupongame.best';
export const SITE_NAME = '모쿠몽';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/aistudio/coupon-hero_58e0f329_665638d2.png`;

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: 'website' | 'article';
  ogImage: string;
  jsonLd: Record<string, unknown>[];
}

function resolveOgImage(imagePath: string | null | undefined): string {
  if (!imagePath) return DEFAULT_OG_IMAGE;
  if (imagePath.startsWith('http')) return imagePath;
  return `${SITE_URL}${imagePath}`;
}

export function getHomeMeta(): PageMeta {
  const title = '모쿠몽 | 모바일게임 쿠폰 검색 및 원터치 복사';
  const description =
    '원하는 모바일게임을 검색하고 확인된 쿠폰 코드를 한 번에 복사하세요. 게임별 쿠폰 정보와 확인 상태를 편리하게 조회할 수 있습니다.';
  const canonical = `${SITE_URL}/`;

  return {
    title,
    description,
    canonical,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: canonical,
        logo: `${SITE_URL}/assets/aistudio/mokumong-cat-mage-logo_52587fb5_28f50208.png`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: canonical,
        name: `${SITE_NAME} | 모바일게임 쿠폰`,
        alternateName: SITE_NAME,
        inLanguage: 'ko-KR',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'ko-KR',
      },
    ],
  };
}

export function getGameMeta(game: GameEntry): PageMeta {
  const verified = getVerifiedCoupons(game);
  const canonicalTarget = game.canonicalTargetId
    ? `${SITE_URL}/game/${game.canonicalTargetId}`
    : `${SITE_URL}/game/${game.id}`;
  const pageUrl = `${SITE_URL}/game/${game.id}`;

  const isLegacyNonCoupon = game.auditGroup === 'D' && !game.canonicalTargetId;

  const title = isLegacyNonCoupon
    ? `${game.name} 안내 | ${SITE_NAME}`
    : verified.length > 0
      ? `${game.name} 쿠폰 코드 ${verified.length}개 | ${SITE_NAME}`
      : `${game.name} 쿠폰 정보 및 확인 상태 | ${SITE_NAME}`;

  const description = isLegacyNonCoupon
    ? `${game.name} 기존 안내 페이지입니다. (${game.auditReason})`
    : verified.length > 0
      ? `${game.name} 확인된 쿠폰 코드 ${verified.length}개를 원터치로 복사하고 보상과 만료일을 확인하세요. (확인일 ${game.lastCheckedAt})`
      : `${game.name} 쿠폰 코드 확인 현황(${game.lastCheckedAt} 기준)과 등록 방법, 관련 모바일게임 쿠폰 정보를 확인하세요.`;

  const robots = game.indexable
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, follow';

  return {
    title,
    description,
    canonical: game.indexable ? pageUrl : canonicalTarget,
    robots,
    ogType: 'article',
    ogImage: resolveOgImage(game.image),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        dateModified: game.lastCheckedAt,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'ko-KR',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '홈',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${game.name} 쿠폰`,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function getMetaForPath(pathname: string): PageMeta {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  if (clean === '/') return getHomeMeta();

  const gameMatch = clean.match(/^\/game\/(\d+)$/);
  if (gameMatch) {
    const id = Number(gameMatch[1]);
    const game = GAME_BY_ID.get(id);
    if (game) return getGameMeta(game);
  }

  if (clean === '/insights') {
    const title = `장르별 쿠폰 사용 가이드 | ${SITE_NAME}`;
    const description =
      'RPG, MMORPG, 방치형, 액션 등 장르별 모바일게임 쿠폰 등록 방법과 주의사항을 정리했습니다.';
    return {
      title,
      description,
      canonical: `${SITE_URL}/insights`,
      robots: 'index, follow',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url: `${SITE_URL}/insights`,
          name: title,
          description,
          inLanguage: 'ko-KR',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: '쿠폰 가이드', item: `${SITE_URL}/insights` },
          ],
        },
      ],
    };
  }

  const insightMatch = clean.match(/^\/insights\/([^/]+)$/);
  if (insightMatch) {
    const article = INSIGHT_BY_SLUG.get(insightMatch[1]);
    if (article) {
      const url = `${SITE_URL}/insights/${article.slug}`;
      return {
        title: `${article.title} | ${SITE_NAME}`,
        description: article.description,
        canonical: url,
        robots: 'index, follow',
        ogType: 'article',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            url,
            name: article.title,
            description: article.description,
            dateModified: article.lastModified,
            inLanguage: 'ko-KR',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: '쿠폰 가이드', item: `${SITE_URL}/insights` },
              { '@type': 'ListItem', position: 3, name: article.shortTitle, item: url },
            ],
          },
        ],
      };
    }
  }

  const jobMatch = clean.match(/^\/job\/([^/]+)$/);
  if (jobMatch) {
    const job = JOB_BY_SLUG.get(jobMatch[1]);
    if (job) {
      const url = `${SITE_URL}/job/${job.slug}`;
      return {
        title: `${job.name} 직업 안내 | ${SITE_NAME}`,
        description: `${job.name}(${job.description}) 직업 특징 안내 페이지입니다.`,
        canonical: url,
        robots: 'noindex, follow',
        ogType: 'article',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            url,
            name: `${job.name} 직업 안내`,
            description: job.detail,
            inLanguage: 'ko-KR',
          },
        ],
      };
    }
  }

  return {
    title: `페이지를 찾을 수 없습니다 | ${SITE_NAME}`,
    description: '요청하신 게임 쿠폰 페이지를 찾을 수 없습니다. 모쿠몽 검색에서 원하는 게임을 찾아보세요.',
    canonical: `${SITE_URL}/`,
    robots: 'noindex, follow',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [],
  };
}
