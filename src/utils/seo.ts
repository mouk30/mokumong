import { GAME_BY_ID, getVerifiedCoupons } from '../data/games';
import { INSIGHT_BY_SLUG, JOB_BY_SLUG } from '../data/insights';
import type { GameEntry } from '../types/coupon';

export const DEFAULT_SITE_URL = 'https://seoulkr.xyz';
export const SITE_URL =
  (typeof process !== 'undefined' && process.env?.SITE_URL) || DEFAULT_SITE_URL;
export const SITE_NAME = '모쿠몽';
export const DEFAULT_OG_IMAGE_PATH = '/assets/aistudio/coupon-hero_58e0f329_665638d2.png';

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: 'website' | 'article';
  ogImage: string;
  jsonLd: Record<string, unknown>[];
}

function getBaseOrigin(originOverride?: string): string {
  if (originOverride) return originOverride.replace(/\/+$/, '');
  return SITE_URL.replace(/\/+$/, '');
}

function resolveOgImage(origin: string, imagePath: string | null | undefined): string {
  if (!imagePath) return `${origin}${DEFAULT_OG_IMAGE_PATH}`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${origin}${imagePath}`;
}

export function getHomeMeta(originOverride?: string): PageMeta {
  const origin = getBaseOrigin(originOverride);
  // 공백 포함 정확히 22자
  const title = '모바일게임 쿠폰 검색 및 복사 | 모쿠몽';
  // 공백 포함 122자 (최대 150자 이내)
  const description =
    '원하는 모바일게임을 검색하고 확인된 쿠폰 코드를 한 번에 복사하세요. RPG, MMORPG, 방치형, 전략 등 인기 모바일게임의 최신 쿠폰 상태, 보상 내용, 입력 방법을 모쿠몽에서 빠르고 투명하게 확인할 수 있습니다.';
  const canonical = `${origin}/`;

  return {
    title,
    description,
    canonical,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    ogImage: resolveOgImage(origin, DEFAULT_OG_IMAGE_PATH),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: SITE_NAME,
        url: canonical,
        logo: `${origin}/assets/aistudio/mokumong-cat-mage-logo_52587fb5_28f50208.png`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: canonical,
        name: `${SITE_NAME} | 모바일게임 쿠폰`,
        alternateName: SITE_NAME,
        inLanguage: 'ko-KR',
        publisher: { '@id': `${origin}/#organization` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${origin}/#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@id': `${origin}/#website` },
        inLanguage: 'ko-KR',
      },
    ],
  };
}

export function getGameMeta(game: GameEntry, originOverride?: string): PageMeta {
  const origin = getBaseOrigin(originOverride);
  const verified = getVerifiedCoupons(game);
  const canonicalTarget = game.canonicalTargetId
    ? `${origin}/game/${game.canonicalTargetId}`
    : `${origin}/game/${game.id}`;
  const pageUrl = `${origin}/game/${game.id}`;

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
      : `${game.name} 쿠폰 코드 확인 현황(${game.lastCheckedAt} 기준)과 등록 방법, 관련 모바일게임 쿠폰 정보를 모쿠몽에서 확인하세요.`;

  const robots = game.indexable
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, follow';

  return {
    title,
    description,
    canonical: game.indexable ? pageUrl : canonicalTarget,
    robots,
    ogType: 'article',
    ogImage: resolveOgImage(origin, game.image),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        dateModified: game.lastCheckedAt,
        isPartOf: { '@id': `${origin}/#website` },
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
            item: `${origin}/`,
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

export function getMetaForPath(pathname: string, originOverride?: string): PageMeta {
  const origin = getBaseOrigin(originOverride);
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  if (clean === '/') return getHomeMeta(origin);

  const gameMatch = clean.match(/^\/game\/(\d+)$/);
  if (gameMatch) {
    const id = Number(gameMatch[1]);
    const game = GAME_BY_ID.get(id);
    if (game) return getGameMeta(game, origin);
  }

  if (clean === '/insights') {
    const title = `장르별 쿠폰 사용 가이드 | ${SITE_NAME}`;
    const description =
      'RPG, MMORPG, 방치형, 액션·서바이벌, 퍼즐 등 장르별 모바일게임 쿠폰 등록 위치와 서버 확인 주의사항을 정리했습니다.';
    return {
      title,
      description,
      canonical: `${origin}/insights`,
      robots: 'index, follow',
      ogType: 'website',
      ogImage: resolveOgImage(origin, DEFAULT_OG_IMAGE_PATH),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          url: `${origin}/insights`,
          name: title,
          description,
          inLanguage: 'ko-KR',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '홈', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: '쿠폰 가이드', item: `${origin}/insights` },
          ],
        },
      ],
    };
  }

  const insightMatch = clean.match(/^\/insights\/([^/]+)$/);
  if (insightMatch) {
    const article = INSIGHT_BY_SLUG.get(insightMatch[1]);
    if (article) {
      const url = `${origin}/insights/${article.slug}`;
      return {
        title: `${article.title} | ${SITE_NAME}`,
        description: article.description,
        canonical: url,
        robots: 'index, follow',
        ogType: 'article',
        ogImage: resolveOgImage(origin, DEFAULT_OG_IMAGE_PATH),
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
              { '@type': 'ListItem', position: 1, name: '홈', item: `${origin}/` },
              { '@type': 'ListItem', position: 2, name: '쿠폰 가이드', item: `${origin}/insights` },
              { '@type': 'ListItem', position: 3, name: article.shortTitle, item: url },
            ],
          },
        ],
      };
    }
  }

  if (clean === '/about') {
    const title = `서비스 소개 및 쿠폰 검증 기준 | ${SITE_NAME}`;
    const description =
      '모쿠몽 모바일게임 쿠폰 허브의 서비스 소개와 사용 가능·확인 필요·만료 상태 검증 기준을 안내합니다.';
    const url = `${origin}/about`;
    return {
      title,
      description,
      canonical: url,
      robots: 'index, follow',
      ogType: 'website',
      ogImage: resolveOgImage(origin, '/assets/aistudio/card-strategy_9155dc80_d0110024.png'),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          url,
          name: title,
          description,
          inLanguage: 'ko-KR',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '홈', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: '서비스 소개', item: url },
          ],
        },
      ],
    };
  }

  if (clean === '/privacy') {
    const title = `개인정보처리방침 | ${SITE_NAME}`;
    const description =
      '모쿠몽(seoulkr.xyz)의 개인정보 최소 처리 원칙과 검색·클립보드 동작 안내 페이지입니다.';
    const url = `${origin}/privacy`;
    return {
      title,
      description,
      canonical: url,
      robots: 'index, follow',
      ogType: 'website',
      ogImage: resolveOgImage(origin, DEFAULT_OG_IMAGE_PATH),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url,
          name: title,
          description,
          inLanguage: 'ko-KR',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '홈', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: '개인정보처리방침', item: url },
          ],
        },
      ],
    };
  }

  if (clean === '/terms') {
    const title = `이용약관 | ${SITE_NAME}`;
    const description =
      '모쿠몽(seoulkr.xyz) 모바일게임 쿠폰 검색 및 복사 서비스의 이용약관과 쿠폰 정보 고지 사항입니다.';
    const url = `${origin}/terms`;
    return {
      title,
      description,
      canonical: url,
      robots: 'index, follow',
      ogType: 'website',
      ogImage: resolveOgImage(origin, DEFAULT_OG_IMAGE_PATH),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url,
          name: title,
          description,
          inLanguage: 'ko-KR',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '홈', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: '이용약관', item: url },
          ],
        },
      ],
    };
  }

  const jobMatch = clean.match(/^\/job\/([^/]+)$/);
  if (jobMatch) {
    const job = JOB_BY_SLUG.get(jobMatch[1]);
    if (job) {
      const url = `${origin}/job/${job.slug}`;
      return {
        title: `${job.name} 직업 안내 | ${SITE_NAME}`,
        description: `${job.name}(${job.description}) 직업 특징 안내 페이지입니다.`,
        canonical: url,
        robots: 'noindex, follow',
        ogType: 'article',
        ogImage: resolveOgImage(origin, DEFAULT_OG_IMAGE_PATH),
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
    canonical: `${origin}/`,
    robots: 'noindex, follow',
    ogType: 'website',
    ogImage: resolveOgImage(origin, DEFAULT_OG_IMAGE_PATH),
    jsonLd: [],
  };
}
