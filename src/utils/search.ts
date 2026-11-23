import type { GameEntry } from '../types/coupon';

const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const CHOSEONG_SET = new Set(CHOSEONG);

export function getChoseong(text: string): string {
  let result = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const idx = Math.floor((code - 0xac00) / 588);
      result += CHOSEONG[idx];
    } else if (CHOSEONG_SET.has(ch)) {
      result += ch;
    } else if (!/\s/.test(ch)) {
      result += ch.toLowerCase();
    }
  }
  return result;
}

export function isPureChoseongQuery(query: string): boolean {
  const compact = query.replace(/\s+/g, '');
  if (!compact) return false;
  return [...compact].every((ch) => CHOSEONG_SET.has(ch));
}

export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[\s:\-_.·()!?[\]]+/g, '');
}

export function scoreGameMatch(game: GameEntry, rawQuery: string): number {
  const query = rawQuery.trim();
  if (!query) return 0;

  const qLower = query.toLowerCase();
  const qNorm = normalizeText(query);
  const nameLower = game.name.toLowerCase();
  const nameNorm = normalizeText(game.name);

  if (nameLower === qLower || nameNorm === qNorm) return 1000;
  if (nameLower.startsWith(qLower) || nameNorm.startsWith(qNorm)) return 800;
  if (nameLower.includes(qLower) || nameNorm.includes(qNorm)) return 600;

  // Choseong matching
  if (isPureChoseongQuery(query)) {
    const targetCho = getChoseong(game.name);
    const qCho = query.replace(/\s+/g, '');
    if (targetCho.startsWith(qCho)) return 520;
    if (targetCho.includes(qCho)) return 460;
  }

  // English / alternative aliases matching
  for (const alias of game.aliases) {
    const aLower = alias.toLowerCase();
    const aNorm = normalizeText(alias);
    if (aLower === qLower || aNorm === qNorm) return 750;
    if (aLower.startsWith(qLower) || aNorm.startsWith(qNorm)) return 550;
    if (aLower.includes(qLower) || aNorm.includes(qNorm)) return 420;
    if (isPureChoseongQuery(query)) {
      const aliasCho = getChoseong(alias);
      const qCho = query.replace(/\s+/g, '');
      if (aliasCho.includes(qCho)) return 360;
    }
  }

  // Fallback raw name / category
  if (game.rawName.toLowerCase().includes(qLower)) return 250;
  if (game.category.toLowerCase() === qLower) return 180;

  return 0;
}

export function searchGames(
  games: GameEntry[],
  query: string,
  options?: { includeNonIndexable?: boolean }
): GameEntry[] {
  const trimmed = query.trim();
  const pool = options?.includeNonIndexable
    ? games
    : games.filter((g) => g.indexable);

  if (!trimmed) return pool;

  const scored: Array<{ game: GameEntry; score: number }> = [];
  for (const game of pool) {
    // Also search across non-indexable entries only if query doesn't match indexable, or include indexable priority
    const score = scoreGameMatch(game, trimmed);
    if (score > 0) {
      scored.push({
        game,
        score: score + (game.coupons.some((c) => c.status === 'VERIFIED') ? 50 : 0),
      });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.game.id - b.game.id;
  });

  return scored.map((item) => item.game);
}
