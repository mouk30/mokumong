import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const legacyJs = fs.readFileSync(
  path.join(root, 'public/assets/aistudio/index-DUYHzOUY_1ef61f7c.js'),
  'utf8'
);

function extractArray(name) {
  const start = legacyJs.indexOf(`${name}=[`);
  if (start < 0) throw new Error(`Missing ${name}`);
  let i = start + name.length + 1;
  let depth = 0;
  let inStr = false;
  let q = '';
  let esc = false;
  for (; i < legacyJs.length; i++) {
    const ch = legacyJs[i];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (ch === '\\') {
        esc = true;
        continue;
      }
      if (ch === q) inStr = false;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') {
        inStr = true;
        q = ch;
      } else if (ch === '[') {
        depth++;
      } else if (ch === ']') {
        depth--;
        if (depth === 0) {
          return vm.runInNewContext(legacyJs.slice(start + name.length + 1, i + 1));
        }
      }
    }
  }
  throw new Error(`Unclosed ${name}`);
}

const ka = extractArray('ka');

const PREFIX_PATTERNS = [
  /^방치형\s*액션\s*RPG\s*핸드폰게임추천\s*/i,
  /^휴대폰게임추천\s*방치형\s*액션\s*RPG\s*/i,
  /^방치형\s*핸드폰게임\s*추천\s*/i,
  /^방치형\s*모바일게임\s*추천\s*/i,
  /^방치형\s*모바일\s*게임\s*추천\s*/i,
  /^방치형\s*RPG\s*게임\s*추천\s*/i,
  /^방치형\s*RPG\s*모바일게임추천\s*/i,
  /^방치형\s*RPG\s*모바일게임\s*/i,
  /^방치형\s*RPG\s*핸드폰게임\s*추천\s*/i,
  /^방치형\s*RPG\s*삼국지\s*모바일게임\s*/i,
  /^방치형\s*RPG\s*게임추천\s*/i,
  /^방치형\s*RPG\s*게임순위\s*/i,
  /^방치형\s*RPG\s*게임\s*/i,
  /^방치형\s*RPG\s*/i,
  /^방치형RPG\s*게임\s*추천\s*/i,
  /^방치형RPG게임\s*추천\s*/i,
  /^방치형RPG게임순위\s*/i,
  /^방치형RPG게임\s*/i,
  /^방치형RPG\s*/i,
  /^방치형\s*모바일게임추천\s*/i,
  /^방치형\s*모바일게임\s*/i,
  /^방치형모바일게임추천\s*/i,
  /^방치형모바일게임\s*/i,
  /^방치형모바일RPG\s*/i,
  /^방치형\s*타이쿤\s*모바일게임\s*/i,
  /^방치형\s*전략\s*rpg\s*/i,
  /^방치형전략rpg\s*/i,
  /^방치형\s*클리커\s*게임\s*/i,
  /^방치형클리커게임\s*/i,
  /^방치형키우기게임\s*/i,
  /^방치형\s*MMORPG\s*게임\s*/i,
  /^방치형\s*게임\s*추천\s*/i,
  /^방치형게임\s*추천\s*/i,
  /^방치형게임\s*/i,
  /^모바일방치형게임\s*/i,
  /^3D\s*방치형\s*RPG\s*게임\s*/i,
  /^천신\s*후속작,\s*실시간\s*방치형\s*RPG\s*/i,
  /^화제의\s*게임!\s*방치형RPG\s*/i,
  /^와이파이필요없는\s*방치형\s*모바일게임\s*/i,
  /^힐링\s*방치형\s*모바일게임\s*/i,
  /^힐링\s*방치형게임\s*/i,
  /^심심할때\s*할\s*만한\s*게임\s*추천\s*방치형\s*RPG\s*/i,
  /^심심할때할만한\s*게임\s*방치형\s*RPG\s*/i,
  /^심심할때할만한게임\s*방치형\s*RPG\s*/i,
  /^심심할때할만한\s*방치형\s*RPG\s*모바일게임\s*/i,
  /^심심할때\s*할만한게임추천\s*모바일\s*MMORPG\s*/i,
  /^할만한\s*모바일게임추천\s*방치형\s*RPG\s*/i,
  /^할만한휴대폰게임추천\s*방치형\s*RPG\s*/i,
  /^할만한\s*방치형\s*RPG\s*모바일게임\s*/i,
  /^할만한게임추천\s*수집형\s*RPG\s*/i,
  /^모바일게임순위\s*높은\s*방치형\s*RPG\s*/i,
  /^모바일게임\s*추천\s*/i,
  /^모바일RPG게임추천\s*/i,
  /^모바일rpg게임\s*/i,
  /^모바일\s*MMORPG\s*게임\s*/i,
  /^모바일MMORPG\s*/i,
  /^모바일\s*수집형RPG\s*/i,
  /^모바일\s*RPG\s*/i,
  /^신작\s*무협\s*MMORPG\s*모바일게임\s*/i,
  /^신작\s*방치형\s*RPG\s*모바일게임추천\s*/i,
  /^신작\s*방치형\s*RPG\s*/i,
  /^신작\s*모바일\s*게임\s*/i,
  /^신작\s*모바일게임\s*/i,
  /^신작\s*MMORPG\s*/i,
  /^신작\s*턴제\s*RPG\s*/i,
  /^신작\s*턴제수집형RPG\s*/i,
  /^신작\s*머지게임\s*/i,
  /^신작\s*SLG\s*/i,
  /^신작게임추천\s*방치형\s*RPG\s*/i,
  /^신작RPG게임\s*/i,
  /^새로나온게임추천\s*수집형\s*RPG\s*/i,
  /^새로나온\s*방치형\s*게임\s*추천\s*/i,
  /^인기게임순위\s*수집형\s*RPG\s*/i,
  /^구글인기게임순위\s*/i,
  /^폰게임추천\s*수집형\s*RPG\s*/i,
  /^폰게임추천\s*방치형\s*RPG\s*/i,
  /^폰게임추천\s*/i,
  /^핸드폰게임추천\s*/i,
  /^전략RPG게임추천\s*SLG\s*모바일게임\s*/i,
  /^전략\s*RPG\s*방치형게임\s*/i,
  /^좀비\s*전략\s*시뮬레이션\s*모바일게임\s*/i,
  /^추리\s*RPG\s*모바일게임\s*/i,
  /^판타지\s*모험\s*RPG\s*모바일게임\s*/i,
  /^모험\s*MMORPG\s*게임\s*추천\s*/i,
  /^무협\s*MMORPG\s*/i,
  /^자동화에\s*진심인\s*게임,\s*mmorpg\s*/i,
  /^MMORPG게임\s*추천\s*/i,
  /^MMOSLG\s*모바일게임\s*/i,
  /^삼국지게임추천\s*/i,
  /^퍼즐게임추천\s*/i,
  /^요즘할만한게임추천\s*/i,
  /^웹툰\s*나\s*혼자\s*만렙\s*귀환자\s*원작\s*모바일게임,\s*/i,
  /^넷마블\s*신작\s*MMORPG\s*/i,
];

const SUFFIX_PATTERNS = [
  /\s*공식\s*카페\s*신규$/i,
  /\s*공식\s*카페$/i,
  /\s*직업\s*추천부터$/i,
  /\s*직접\s*플레이해\s*본\s*후기,\s*사용\s*가능한$/i,
  /\s*플레이$/i,
];

function cleanGameName(raw) {
  let s = raw.trim();
  for (const re of PREFIX_PATTERNS) {
    s = s.replace(re, '');
  }
  for (const re of SUFFIX_PATTERNS) {
    s = s.replace(re, '');
  }
  s = s.trim();
  if (s === '기적의검') return '기적의 검';
  if (s === '메이플키우기') return '메이플 키우기';
  if (s.startsWith('바람의나라 연')) return '바람의나라: 연';
  if (s.includes('사과게임 플러스')) return '사과게임 플러스';
  if (s === '여전사 키우기' || s === '헌터 키우기') return s;
  return s || raw.trim();
}

function mapCategory(rawCategory, cleanName, rawName) {
  const combined = `${rawCategory} ${cleanName} ${rawName}`;
  if (/퍼즐|매치|머지|사과게임|가십하버|플로리스트/.test(combined)) return '퍼즐';
  if (rawCategory === '수집형' || /포켓몬|드래곤빌리지|수집형/.test(combined)) return '수집형';
  if (rawCategory === 'MMORPG' || /MMORPG/i.test(combined)) return 'MMORPG';
  if (rawCategory === '전략' || /디펜스|SLG|스테이트 오브 서바이벌|인피니티 킹덤|삼국지 천하결전/.test(combined)) return '전략';
  if (/키우기|방치형|타이쿤|스낵바|오늘도 환생|어쩌다 멋진 마왕/.test(combined)) return '방치형';
  if (rawCategory === '액션' || /배틀그라운드|피파|프로야구|FC\(피파\)|탕탕특공대|서바이벌|후더덕|소울나이트|닌자/.test(combined)) return '기타';
  if (rawCategory === 'RPG') return 'RPG';
  return '기타';
}

const IMAGE_OVERRIDES = {
  277: '/assets/aistudio/animo-coupon_6c2c57ff_e2176203.png',
  276: '/assets/aistudio/maple-story-idle-coupon_b2ea5344_e07c6ee1.png',
  24: '/assets/aistudio/maple-story-idle-coupon_b2ea5344_e07c6ee1.png',
  90: '/assets/aistudio/maple-story-idle-coupon_b2ea5344_e07c6ee1.png',
  275: '/assets/aistudio/hudeodeok-survival-coupon_33eb5518_ffe7c492.jpg',
};

function mapImage(id, category) {
  if (IMAGE_OVERRIDES[id]) return IMAGE_OVERRIDES[id];
  switch (category) {
    case 'MMORPG':
      return '/assets/aistudio/card-mmorpg_51a24582_ff2ee593.png';
    case '전략':
      return '/assets/aistudio/card-strategy_9155dc80_d0110024.png';
    case '수집형':
      return '/assets/aistudio/card-collection_b8cbc57b_ea053600.png';
    case '기타':
      return '/assets/aistudio/card-action_08a8662b_9452fd1c.png';
    case 'RPG':
    case '방치형':
    case '퍼즐':
    default:
      return '/assets/aistudio/card-rpg_e1783d1b_d335d0cc.png';
  }
}

const ALIAS_MAP = {
  '애니모': ['ANIMO', 'Animo', '애니모 쿠폰'],
  '메이플 키우기': ['MapleStory Idle', 'Maple Idle', '메이플스토리 키우기'],
  '후더덕 서바이벌': ['Huduck Survival', 'Hudeodeok Survival'],
  '림버스 컴퍼니': ['Limbus Company'],
  '나 혼자만 레벨업 어라이즈': ['Solo Leveling Arise', 'SLA', '나혼렙'],
  '쿠키런 킹덤': ['Cookie Run Kingdom', 'CRK', '쿠킹덤'],
  '쿠키런 오븐스매시': ['Cookie Run OvenSmash'],
  '탕탕특공대': ['Survivor.io'],
  'WOS: 화이트 아웃 서바이벌': ['Whiteout Survival', '화이트아웃 서바이벌'],
  '라그나로크M 클래식': ['Ragnarok M Classic'],
  '스톤에이지 키우기': ['StoneAge Idle'],
  '루나(LUNAR) 에버소울': ['LUNAR Eversoul'],
  '로그W 리메인즈 오브 갓': ['Rogue W Remains of God'],
  '스테이트 오브 서바이벌': ['State of Survival', 'SOS'],
  '운빨존많겜': ['Lucky Defense'],
  '고양이 스낵바': ['Cat Snack Bar'],
  'FC(피파) 모바일': ['FC Mobile', 'FIFA Mobile', '피파모바일'],
  '피파모바일': ['FC Mobile', 'FIFA Mobile', 'FC 모바일'],
  '랜덤다이스2': ['Random Dice 2'],
  '배틀그라운드': ['PUBG Mobile', '배그 모바일', 'PUBG'],
  '브라운더스트 앤 퍼즐': ['Brown Dust & Puzzle'],
  '닌자 머스트 다이': ['Ninja Must Die'],
  '레전드 오브 슬라임': ['Legend of Slime'],
  '솔 인챈트': ['SOL Enchant', '솔인챈트'],
  '가십하버': ['Gossip Harbor'],
  '티니핑 매직매치': ['Teenieping Magic Match'],
  '열혈강호 넥스트': ['Yulgang Next'],
  '소울나이트': ['Soul Knight'],
  '데이브 더 다이버 모바일': ['Dave the Diver Mobile'],
  '드래곤빌리지3': ['Dragon Village 3'],
  '몬길 스타다이브': ['Mongil Star Dive'],
  '포켓몬 챔피언스': ['Pokemon Champions'],
};

// Explicit audit rules for Group D (out-of-scope PC/console/sale/news/duplicate guides)
const NON_COUPON_PATTERNS = [
  /팰월드/,
  /스팀\s*(여름\s*할인|생존\s*게임\s*할인|게임\s*깜짝\s*할인)/,
  /닌텐도\s*스위치\s*여름\s*세일/,
  /^GTA5$/i,
  /^GTA6/i,
  /오버워치2\s*넥슨\s*계정\s*연동/,
  /서브노티카2/,
  /콜\s*오브\s*듀티\s*모던워페어\s*4/,
  /모탈쉘\(셸\)2/,
  /비스트\s*오브\s*리인카네이션/,
  /사일런트힐\s*타운폴/,
  /크레이지\s*아케이드\s*서버\s*종료/,
  /메트로\s*타이핑\s*사이트/,
  /피파온라인4/,
  /메이플스토리\s*캐시샵\s*업데이트/,
  /메이플플래닛/,
  /제우스\s*오만의\s*신\s*직업\s*추천/,
  /배틀그라운드\s*(그래픽\s*설정|소식|PAYDAY)/,
  /스쿼드\s*모드$|초반\s*육성$|나인\s*코어|철\s*파밍용|나인\s*버는\s*방법|사전등록\s*보상|타락의\s*파편|영웅\s*무기\s*추천/,
];

// Canonical ID consolidation for duplicates
const DUPLICATE_CANONICAL = {
  24: 276,  // 메이플 키우기 -> 276
  90: 276,  // 메이플 키우기 -> 276
  53: 12,   // 솔 인챈트 -> 12
  205: 12,
  207: 12,
  212: 12,
  213: 12,
  245: 12,
  247: 12,
  251: 12,
  253: 12,
  255: 12,
  256: 12,
  257: 12,
  259: 12,
  260: 12,
  267: 12,
  177: 88,  // 쿠키런 킹덤 -> 88
  178: 88,
  244: 32,  // 쿠키런 키우기 -> 32
  101: 89,  // 탕탕특공대 -> 89
  118: 89,
  95: 62,   // 피파모바일 -> 62
  103: 62,
  160: 132, // 기적의 검 -> 132
  190: 132,
  161: 112, // 요괴사냥꾼 키우기 -> 112
  199: 8,   // 랜덤다이스2 -> 8
  252: 48,  // 포켓몬 챔피언스 -> 48
  269: 42,  // 몬길 스타다이브 -> 42
  271: 266, // 배틀그라운드 -> 266
  272: 266,
  273: 266,
  274: 266,
};

const audited = ka.map((item) => {
  const cleanName = cleanGameName(item.game);
  const category = mapCategory(item.category, cleanName, item.game);
  const lastCheckedAt = item.id >= 275 ? '2026-09-30' : '2026-09-08';

  const canonicalTargetId = DUPLICATE_CANONICAL[item.id];
  const isNonCoupon = NON_COUPON_PATTERNS.some((re) => re.test(item.game));

  let auditGroup = 'B';
  let auditReason = '모바일게임 쿠폰 안내 페이지(활성 쿠폰 코드 직접 검증 대기)';
  let indexable = true;

  if (canonicalTargetId) {
    auditGroup = 'D';
    auditReason = `중복 게임 항목 — 대표 페이지(/game/${canonicalTargetId})로 통합 권장`;
    indexable = false;
  } else if (isNonCoupon) {
    auditGroup = 'D';
    auditReason = 'PC·콘솔 정보/할인/공략 성격의 기존 유입 페이지(모바일 쿠폰 미대상)';
    indexable = false;
  }

  const aliases = Array.from(
    new Set([
      ...(ALIAS_MAP[cleanName] || []),
      ...(cleanName !== item.game ? [item.game] : []),
    ])
  );

  return {
    id: item.id,
    name: cleanName,
    rawName: item.game,
    aliases,
    category,
    image: mapImage(item.id, category),
    lastCheckedAt,
    coupons: [], // ZERO fabricated codes! Legacy IDs / slugs are NOT coupons.
    ...(item.sourceUrl ? { sourceUrl: item.sourceUrl } : {}),
    auditGroup,
    auditReason,
    indexable,
    ...(canonicalTargetId ? { canonicalTargetId } : {}),
  };
});

// Sort cleanly: 277, 276, 275 first (latest), then 1..274 ascending
audited.sort((a, b) => {
  if (a.id >= 275 && b.id >= 275) return b.id - a.id;
  if (a.id >= 275) return -1;
  if (b.id >= 275) return 1;
  return a.id - b.id;
});

fs.mkdirSync(path.join(root, 'src/data'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'src/data/games.json'),
  JSON.stringify(audited, null, 2) + '\n',
  'utf8'
);

// Generate operator CSV template for easy coupon management
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
const csvHeader = 'game_id,game_name,coupon_code,reward,status,verified_at,expires_at,source_note\n';
const sampleRows = audited
  .filter((g) => g.indexable)
  .slice(0, 15)
  .map((g) => `${g.id},"${g.name.replace(/"/g, '""')}",,,UNVERIFIED,${g.lastCheckedAt},,"실제 검증된 쿠폰 코드 입력 후 scripts/sync-coupons.ts 실행"`)
  .join('\n');
fs.writeFileSync(path.join(root, 'data/coupons-operator.csv'), csvHeader + sampleRows + '\n', 'utf8');

const summary = audited.reduce((acc, g) => {
  acc[g.auditGroup] = (acc[g.auditGroup] || 0) + 1;
  return acc;
}, {});
const catSummary = audited.reduce((acc, g) => {
  acc[g.category] = (acc[g.category] || 0) + 1;
  return acc;
}, {});
console.log('Audited games:', audited.length);
console.log('Audit groups:', summary);
console.log('Indexable count:', audited.filter((g) => g.indexable).length);
console.log('Category breakdown:', catSummary);
