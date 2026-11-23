import fs from 'node:fs';
import path from 'node:path';
import type { CouponItem, CouponStatus, GameEntry } from '../src/types/coupon';

const VALID_STATUSES = new Set<CouponStatus>([
  'VERIFIED',
  'UNVERIFIED',
  'EXPIRED',
  'UNKNOWN',
]);

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

const root = process.cwd();
const csvPath = path.join(root, 'data/coupons-operator.csv');
const gamesPath = path.join(root, 'src/data/games.json');

if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found:', csvPath);
  process.exit(1);
}

const games: GameEntry[] = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
const gameMap = new Map(games.map((g) => [g.id, g]));

const lines = fs
  .readFileSync(csvPath, 'utf8')
  .split(/\r?\n/)
  .filter((line) => line.trim().length > 0);

const [, ...rows] = lines;
let updatedCount = 0;

for (const row of rows) {
  const [idStr, , codeRaw, rewardRaw, statusRaw, verifiedAtRaw, expiresAtRaw, sourceNoteRaw] =
    parseCsvLine(row);
  const gameId = Number(idStr);
  const game = gameMap.get(gameId);
  if (!game) continue;

  const code = (codeRaw || '').trim();
  if (!code) continue;

  // Guard against accidental Naver blog IDs or placeholder slugs
  if (/^\d{10,14}$/.test(code) || /-(COUPON|IDLE|SURVIVAL)$/i.test(code)) {
    console.warn(`Skipping suspected placeholder/blog ID "${code}" for game #${gameId}`);
    continue;
  }

  const status: CouponStatus = VALID_STATUSES.has(statusRaw as CouponStatus)
    ? (statusRaw as CouponStatus)
    : 'UNVERIFIED';

  const coupon: CouponItem = {
    id: `${gameId}-${code.toLowerCase()}`,
    code,
    reward: rewardRaw || '보상 확인 필요',
    status,
    verifiedAt: verifiedAtRaw || game.lastCheckedAt,
    ...(expiresAtRaw ? { expiresAt: expiresAtRaw } : {}),
    ...(sourceNoteRaw ? { sourceNote: sourceNoteRaw } : {}),
  };

  const existingIdx = game.coupons.findIndex((c) => c.code === code);
  if (existingIdx >= 0) {
    game.coupons[existingIdx] = coupon;
  } else {
    game.coupons.unshift(coupon);
  }

  game.lastCheckedAt = coupon.verifiedAt;
  const hasVerified = game.coupons.some((c) => c.status === 'VERIFIED');
  const allExpired =
    game.coupons.length > 0 && game.coupons.every((c) => c.status === 'EXPIRED');

  if (hasVerified) {
    game.auditGroup = 'A';
    game.auditReason = '실제 사용 가능 확인된 쿠폰 보유';
    game.indexable = true;
  } else if (allExpired) {
    game.auditGroup = 'C';
    game.auditReason = '만료된 쿠폰 이력 아카이브';
  }
  updatedCount++;
}

fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2) + '\n', 'utf8');
console.log(`Synced ${updatedCount} coupon entries into src/data/games.json.`);
