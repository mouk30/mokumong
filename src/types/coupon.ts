export type GameCategory =
  | 'RPG'
  | 'MMORPG'
  | '방치형'
  | '전략'
  | '수집형'
  | '퍼즐'
  | '기타';

export type CouponStatus = 'VERIFIED' | 'UNVERIFIED' | 'EXPIRED' | 'UNKNOWN';

export type AuditGroup = 'A' | 'B' | 'C' | 'D';

export interface CouponItem {
  id: string;
  code: string;
  reward: string;
  status: CouponStatus;
  verifiedAt: string;
  expiresAt?: string;
  sourceNote?: string;
}

export interface GameEntry {
  id: number;
  name: string;
  rawName: string;
  aliases: string[];
  category: GameCategory;
  image: string | null;
  lastCheckedAt: string;
  coupons: CouponItem[];
  sourceUrl?: string;
  auditGroup: AuditGroup;
  auditReason: string;
  indexable: boolean;
  canonicalTargetId?: number;
  redeemGuide?: string[];
}

export interface InsightSection {
  heading: string;
  paragraphs: string[];
  points?: string[];
}

export interface InsightArticle {
  slug: string;
  number: string;
  shortTitle: string;
  title: string;
  description: string;
  keywords: string[];
  audience: string;
  examples: string;
  lastModified: string;
  sections: InsightSection[];
}

export interface JobGuide {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  detail: string;
  input: string;
  lastModified: string;
}
