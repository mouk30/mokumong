import rawGames from './games.json';
import type { CouponItem, GameCategory, GameEntry } from '../types/coupon';

export const ALL_COUPONS_LINK_URL = 'https://lite.tiktok.com/t/ZS9PyuX3FDAbo-3RoRI/';

export const GAMES: GameEntry[] = rawGames as GameEntry[];

export const GAME_BY_ID: Map<number, GameEntry> = new Map(
  GAMES.map((game) => [game.id, game])
);

export const CATEGORIES: Array<'전체' | GameCategory> = [
  '전체',
  'RPG',
  'MMORPG',
  '방치형',
  '전략',
  '수집형',
  '퍼즐',
  '기타',
];

export interface RecentVerifiedCoupon {
  game: GameEntry;
  coupon: CouponItem;
}

export function getVerifiedCoupons(game: GameEntry): CouponItem[] {
  return game.coupons.filter((c) => c.status === 'VERIFIED');
}

export function getRecentVerifiedCoupons(limit = 8): RecentVerifiedCoupon[] {
  const items: RecentVerifiedCoupon[] = [];
  for (const game of GAMES) {
    for (const coupon of game.coupons) {
      if (coupon.status === 'VERIFIED' && coupon.code.trim().length > 0) {
        items.push({ game, coupon });
      }
    }
  }
  items.sort((a, b) => b.coupon.verifiedAt.localeCompare(a.coupon.verifiedAt));
  return items.slice(0, limit);
}

export function getRelatedGames(target: GameEntry, limit = 6): GameEntry[] {
  const sameCategory = GAMES.filter(
    (g) => g.id !== target.id && g.indexable && g.category === target.category
  );
  const others = GAMES.filter(
    (g) => g.id !== target.id && g.indexable && g.category !== target.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getFeaturedSuggestions(): string[] {
  return [
    '메이플 키우기',
    '애니모',
    '후더덕 서바이벌',
    '쿠키런 킹덤',
    '림버스 컴퍼니',
    '솔 인챈트',
  ];
}
