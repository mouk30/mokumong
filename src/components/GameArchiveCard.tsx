import { ChevronRight } from 'lucide-react';
import { ALL_COUPONS_LINK_URL, getVerifiedCoupons } from '../data/games';
import { AppLink } from '../router';
import type { GameEntry } from '../types/coupon';
import { GameIcon } from './GameIcon';

interface GameArchiveCardProps {
  game: GameEntry;
}

export function GameArchiveCard({ game }: GameArchiveCardProps) {
  const verifiedCount = getVerifiedCoupons(game).length;

  return (
    <article className="group flex items-center justify-between gap-3.5 rounded-2xl border border-white/[0.08] bg-[#192236] p-4 transition-colors hover:border-[#7064FF]/60 hover:bg-[#1E2942]">
      <AppLink
        href={`/game/${game.id}`}
        className="flex min-w-0 flex-1 items-center gap-3.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7064FF]"
      >
        <GameIcon src={game.image} name={game.name} category={game.category} size="md" />
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-[15px] font-bold text-[#F5F7FF] group-hover:text-[#26C6F9]">
            {game.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#A5B0C3]">
            <span>{game.category}</span>
            <span aria-hidden="true" className="text-[#778294]">·</span>
            <span
              className={`font-semibold tabular-nums ${
                verifiedCount > 0 ? 'text-[#30D69A]' : 'text-[#A5B0C3]'
              }`}
            >
              확인된 쿠폰 {verifiedCount}개
            </span>
          </div>
          <div className="font-mono text-[11px] tabular-nums text-[#778294]">
            확인일 {game.lastCheckedAt}
          </div>
        </div>
      </AppLink>

      <a
        href={ALL_COUPONS_LINK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-[#121A29] px-3 text-xs font-semibold text-[#F5F7FF] transition-colors hover:border-[#7064FF]/60 hover:bg-[#7064FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6F9]"
        aria-label={`${game.name} 쿠폰 보기`}
      >
        <span>쿠폰 보기</span>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </article>
  );
}
