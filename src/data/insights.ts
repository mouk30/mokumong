import type { InsightArticle, JobGuide } from '../types/coupon';

export const INSIGHTS: InsightArticle[] = [
  {
    slug: 'subculture-rpg',
    number: '01',
    shortTitle: '서브컬처·수집형 RPG',
    title: '서브컬처·수집형 RPG 쿠폰 확인 가이드',
    description:
      '캐릭터 모집권과 육성 재화 쿠폰 사용 시 확인해야 할 만료일, 계정 연동, 우편함 수령 기준을 정리했습니다.',
    keywords: ['모바일게임쿠폰', '수집형 RPG', '서브컬처 게임', '쿠폰 입력'],
    audience: '캐릭터 수집과 초반 육성 재화를 효율적으로 확보하려는 이용자',
    examples: '애니모, 림버스 컴퍼니, 스타세일러 등 수집형·턴제 RPG',
    lastModified: '2026-09-08',
    sections: [
      {
        heading: '수집형 RPG 쿠폰 확인 포인트',
        paragraphs: [
          '수집형 RPG는 모집권, 행동력, 육성 재료처럼 초반 진행 속도에 영향을 주는 보상이 많습니다. 쿠폰 코드는 대소문자와 하이픈(-)을 구분하는 경우가 많아 원터치 복사 후 그대로 붙여넣는 것이 안전합니다.',
          '만료 기간이 짧은 방송 기념·업데이트 쿠폰이 잦으므로 모쿠몽의 상태 표기(사용 가능 확인 / 확인 필요 / 만료 확인)와 마지막 확인일을 먼저 살펴보세요.',
        ],
      },
      {
        heading: '등록 전 체크사항',
        paragraphs: [
          '일부 게임은 튜토리얼 완료 이후에 우편함 및 설정 내 쿠폰 입력 메뉴가 열립니다.',
        ],
        points: [
          '계정 ID(UID)와 서버가 정확히 선택되어 있는지 확인하세요.',
          '코드 앞뒤 공백이 들어가지 않도록 복사 버튼을 사용하세요.',
          '등록 완료 안내가 뜨면 게임 내 우편함 수령 기한을 함께 확인하세요.',
        ],
      },
    ],
  },
  {
    slug: 'mmorpg-large-rpg',
    number: '02',
    shortTitle: 'MMORPG·대형 RPG',
    title: 'MMORPG 모바일게임 쿠폰 등록 및 서버 확인 안내',
    description:
      '서버와 캐릭터 단위로 지급되는 MMORPG 쿠폰의 수령 방식과 주의사항을 정리했습니다.',
    keywords: ['MMORPG 쿠폰', '모바일게임 쿠폰', '서버 확인'],
    audience: '신규 서버 오픈 및 사전예약 보상을 수령하려는 MMORPG 이용자',
    examples: '루나(LUNAR) 에버소울, DK모바일 리본, 기적의 검, 꿈의 여행자',
    lastModified: '2026-09-08',
    sections: [
      {
        heading: '계정 vs 캐릭터 단위 지급 구분',
        paragraphs: [
          'MMORPG 쿠폰은 계정당 1회만 적용되는 경우가 많습니다. 부캐릭터나 테스트 서버에 먼저 입력하면 본 캐릭터에서 재사용할 수 없으므로 등록 전 서버와 캐릭터를 꼭 확인하세요.',
        ],
        points: [
          'iOS 환경에서는 인게임 입력창 대신 공식 웹 쿠폰 페이지를 이용해야 하는 경우가 많습니다.',
          '사전예약 개인 쿠폰은 1회용 코드이므로 공용 쿠폰과 구분해 보관하세요.',
        ],
      },
    ],
  },
  {
    slug: 'shooting-battle-royale',
    number: '03',
    shortTitle: '액션·서바이벌',
    title: '액션·서바이벌 모바일게임 쿠폰 및 시즌 코드 안내',
    description:
      '시즌제 액션·서바이벌 게임에서 제공되는 리딤 코드의 사용 기간과 보상 확인 방법을 안내합니다.',
    keywords: ['액션 게임 쿠폰', '서바이벌 쿠폰', '리딤 코드'],
    audience: '짧은 플레이와 시즌 보상을 빠르게 챙기려는 이용자',
    examples: '후더덕 서바이벌, 탕탕특공대, WOS: 화이트 아웃 서바이벌',
    lastModified: '2026-09-08',
    sections: [
      {
        heading: '시즌 전환 및 지역 코드 주의',
        paragraphs: [
          '액션·서바이벌 장르는 글로벌 원빌드와 한국 서버가 분리되어 운영되기도 합니다. 글로벌 영문 코드가 국내 서버에서 미지원일 수 있으므로 적용 대상과 확인일을 함께 검토하세요.',
        ],
      },
    ],
  },
  {
    slug: 'casual-puzzle-sandbox',
    number: '04',
    shortTitle: '방치형·퍼즐·캐주얼',
    title: '방치형 키우기·퍼즐 모바일게임 쿠폰 활용 가이드',
    description:
      '방치형 키우기와 퍼즐 게임의 공용 쿠폰 코드 복사 및 보상 수령 방법을 정리했습니다.',
    keywords: ['방치형 게임 쿠폰', '키우기 쿠폰', '퍼즐 게임 쿠폰'],
    audience: '부담 없이 빠르게 쿠폰을 찾아 입력하려는 방치형·퍼즐 이용자',
    examples: '메이플 키우기, 아처캐슬 키우기, 가십하버, 티니핑 매직매치',
    lastModified: '2026-09-08',
    sections: [
      {
        heading: '방치형 게임 쿠폰 특징',
        paragraphs: [
          '방치형 키우기 게임은 오픈 기념·다운로드 달성·주간 점검 보상 등 공용 코드가 비교적 자주 배포됩니다. 쿠폰 메뉴가 화면 우측 상단 톱니바퀴(설정) 내부에 있는 경우가 많습니다.',
        ],
        points: [
          '보유 한도가 정해진 재화(하트, 던전 열쇠 등)는 소모 직전에 등록하면 손실을 줄일 수 있습니다.',
          '만료된 코드는 재사용되지 않으므로 만료 상태를 확인하고 활성 코드만 복사하세요.',
        ],
      },
    ],
  },
];

export const INSIGHT_BY_SLUG = new Map(INSIGHTS.map((i) => [i.slug, i]));

// Preserve existing /job/:slug sitemap URLs cleanly (noindex/supporting archive pages)
export const JOB_GUIDES: JobGuide[] = [
  {
    slug: 'wolsik-gisa',
    number: '01',
    name: '월식 기사',
    category: 'MMORPG',
    description: '중추 / 근거리 공방 밸런스 · 0티어(S)',
    detail:
      '일식 수호자로 전직합니다. 빛과 그림자의 태세를 전환하고 자체 방어막과 경직 면역으로 보스전 안정성을 극대화하는 무과금 추천 직업입니다.',
    input: '캐릭터 생성 화면에서 선택',
    lastModified: '2026-09-08',
  },
  {
    slug: 'ogong',
    number: '02',
    name: '오공',
    category: 'MMORPG',
    description: '곤 / 근거리 브루저 · 1티어(A)',
    detail:
      '원전사로 전직한 뒤 고유 분신과 적 방어력 파쇄를 활용합니다. 곤을 휘두르며 진형을 파고드는 묵직한 육탄전이 특징입니다.',
    input: '캐릭터 생성 화면에서 선택',
    lastModified: '2026-09-08',
  },
  {
    slug: 'demon-hunter',
    number: '03',
    name: '데몬헌터',
    category: 'MMORPG',
    description: '비도·체술 / 기동 타격형 · 2티어(B)',
    detail:
      '우사로 전직해 배후 기습과 허공 돌파를 사용합니다. 수동 조작에서 입체적인 기동전이 살아나며 자동 사냥은 세팅 보완이 필요합니다.',
    input: '캐릭터 생성 화면에서 선택',
    lastModified: '2026-09-08',
  },
  {
    slug: 'asura',
    number: '04',
    name: '아수라',
    category: 'MMORPG',
    description: '신·마 혈통 / 마법 폭딜러 · 2티어(B)',
    detail:
      '리퍼 전직 후 신과 마의 혈통을 각성해 폭주 모드에 들어갑니다. 치명타와 공격력 세팅이 갖춰질수록 순간 폭딜이 강해지는 딜러입니다.',
    input: '캐릭터 생성 화면에서 선택',
    lastModified: '2026-09-08',
  },
  {
    slug: 'jeoseung',
    number: '05',
    name: '저승사자',
    category: 'MMORPG',
    description: '부검 / 원거리 견제형 전사 · 1티어(A)',
    detail:
      '명행자로 전직하면 시성체 비승으로 공간을 도약합니다. 적정 거리를 유지할수록 피해량이 높아지는 변칙적인 원거리 전투가 매력입니다.',
    input: '캐릭터 생성 화면에서 선택',
    lastModified: '2026-09-08',
  },
  {
    slug: 'soul-keeper',
    number: '06',
    name: '소울 키퍼',
    category: 'MMORPG',
    description: '성상의 / 원거리 마법 딜러 · 0티어(S)',
    detail:
      '영혼 인도자로 전직해 영혼 구역을 장악합니다. 타겟팅 없는 다인 광역 타격으로 초반 퀘스트를 수월하게 진행할 수 있습니다.',
    input: '캐릭터 생성 화면에서 선택',
    lastModified: '2026-09-08',
  },
];

export const JOB_BY_SLUG = new Map(JOB_GUIDES.map((j) => [j.slug, j]));
