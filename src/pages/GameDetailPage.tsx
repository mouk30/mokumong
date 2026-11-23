import { ArrowLeft, ChevronRight, ExternalLink, Info, Ticket } from 'lucide-react';
import { CouponCopyCard } from '../components/CouponCopyCard';
import { GameArchiveCard } from '../components/GameArchiveCard';
import { GameIcon } from '../components/GameIcon';
import { GAME_BY_ID, getRelatedGames, getVerifiedCoupons } from '../data/games';
import { AppLink } from '../router';
import type { GameEntry } from '../types/coupon';

interface GameDetailPageProps {
  game: GameEntry;
}

export function GameDetailPage({ game }: GameDetailPageProps) {
  const verifiedCoupons = getVerifiedCoupons(game);
  const relatedGames = getRelatedGames(game, 6);
  const canonicalTarget = game.canonicalTargetId
    ? GAME_BY_ID.get(game.canonicalTargetId)
    : undefined;

  const isLegacyNonCoupon = game.auditGroup === 'D';

  return (
    <main className="mx-auto max-w-4xl px-4 pb-14 pt-5 sm:px-6 sm:pt-8">
      {/* Breadcrumb */}
      <nav aria-label="경로" className="flex items-center gap-1.5 text-xs text-[#A5B0C3]">
        <AppLink href="/" className="hover:text-[#F5F7FF]">
          홈
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-[#778294]" aria-hidden="true" />
        <AppLink href="/#games" className="hover:text-[#F5F7FF]">
          게임 쿠폰
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-[#778294]" aria-hidden="true" />
        <span className="truncate font-medium text-[#F5F7FF]">{game.name}</span>
      </nav>

      {/* Game Header Card */}
      <section className="mt-4 rounded-3xl border border-white/[0.08] bg-[#121A29] p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <GameIcon src={game.image} name={game.name} category={game.category} size="lg" />
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#A5B0C3]">
                <span className="font-semibold text-[#26C6F9]">{game.category}</span>
                <span aria-hidden="true" className="text-[#778294]">·</span>
                <span className="font-mono tabular-nums">
                  확인일 {game.lastCheckedAt}
                </span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#F5F7FF] sm:text-3xl">
                {isLegacyNonCoupon && !canonicalTarget
                  ? `${game.name} 안내`
                  : `${game.name} 쿠폰 코드`}
              </h1>
              <p className="text-xs font-semibold tabular-nums text-[#A5B0C3] sm:text-sm">
                확인된 쿠폰{' '}
                <span
                  className={
                    verifiedCoupons.length > 0 ? 'text-[#30D69A]' : 'text-[#F5F7FF]'
                  }
                >
                  {verifiedCoupons.length}개
                </span>
              </p>
            </div>
          </div>

          <AppLink
            href="/"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-[#192236] px-4 text-xs font-semibold text-[#F5F7FF] hover:border-[#7064FF]/60 sm:self-center"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>다른 게임 찾기</span>
          </AppLink>
        </div>
      </section>

      {/* Duplicate or Non-Coupon Audit Notice (Group D) */}
      {isLegacyNonCoupon && (
        <section className="mt-5 rounded-2xl border border-[#7064FF]/40 bg-[#192236] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#26C6F9]" aria-hidden="true" />
            <div className="space-y-2 text-sm">
              <p className="font-bold text-[#F5F7FF]">
                {canonicalTarget
                  ? `중복 페이지 안내 — 대표 ${canonicalTarget.name} 페이지가 있습니다.`
                  : '안내 전용 기존 페이지입니다.'}
              </p>
              <p className="text-xs leading-relaxed text-[#A5B0C3]">
                {game.auditReason}. 기존 검색 URL을 보존하기 위해 페이지는 유지되며,
                검색 노출 품질 유지를 위해 색인에서 제외(noindex) 처리되어 있습니다.
              </p>
              {canonicalTarget && (
                <AppLink
                  href={`/game/${canonicalTarget.id}`}
                  className="inline-flex min-h-[44px] items-center rounded-xl bg-[#7064FF] px-4 text-xs font-bold text-[#F5F7FF] hover:bg-[#5E52EE]"
                >
                  {canonicalTarget.name} 대표 페이지로 이동 →
                </AppLink>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Coupon Codes List */}
      <section aria-labelledby="coupon-list-heading" className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-[#7064FF]" aria-hidden="true" />
            <h2 id="coupon-list-heading" className="text-lg font-bold text-[#F5F7FF]">
              쿠폰 코드 목록
            </h2>
          </div>
          <span className="font-mono text-xs tabular-nums text-[#A5B0C3]">
            총 {game.coupons.length}건
          </span>
        </div>

        {game.coupons.length > 0 ? (
          <div className="mt-3.5 space-y-3">
            {game.coupons.map((coupon) => (
              <CouponCopyCard key={coupon.id} gameName={game.name} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="mt-3.5 rounded-2xl border border-white/[0.08] bg-[#121A29] p-5 sm:p-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#A5B0C3]">
                상태: 확인 필요 / 직접 검증된 코드 없음
              </div>
              <p className="text-base font-bold text-[#F5F7FF]">
                현재 확인된 활성 쿠폰 코드가 없습니다.
              </p>
              <p className="text-xs leading-relaxed text-[#A5B0C3]">
                모쿠몽은 실제 사용 가능 여부가 확인되지 않은 임의의 문자열이나
                게시글 번호를 쿠폰 코드로 표시하지 않습니다. 신규 쿠폰이 확인되면
                이 영역에 원터치 복사 카드가 추가됩니다.
              </p>
            </div>

            {game.sourceUrl && (
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <a
                  href={game.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-[#192236] px-4 text-xs font-semibold text-[#26C6F9] hover:border-[#26C6F9]/50"
                >
                  <span>원문 출처 게시글 확인하기</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Short Coupon Redemption Guide */}
      {!isLegacyNonCoupon && (
        <section
          aria-labelledby="redeem-guide-heading"
          className="mt-8 rounded-2xl border border-white/[0.08] bg-[#121A29] p-5 sm:p-6"
        >
          <h2 id="redeem-guide-heading" className="text-base font-bold text-[#F5F7FF]">
            {game.name} 쿠폰 입력 방법
          </h2>
          <ol className="mt-3 grid grid-cols-1 gap-3 text-xs leading-relaxed text-[#A5B0C3] sm:grid-cols-3">
            <li className="rounded-xl border border-white/[0.06] bg-[#080D18]/70 p-3.5">
              <div className="font-mono text-xs font-bold text-[#26C6F9]">STEP 01</div>
              <p className="mt-1 font-semibold text-[#F5F7FF]">쿠폰 코드 복사</p>
              <p className="mt-1">
                사용 가능한 쿠폰이 있을 경우 [쿠폰 복사] 버튼을 눌러 클립보드에
                저장하세요.
              </p>
            </li>
            <li className="rounded-xl border border-white/[0.06] bg-[#080D18]/70 p-3.5">
              <div className="font-mono text-xs font-bold text-[#26C6F9]">STEP 02</div>
              <p className="mt-1 font-semibold text-[#F5F7FF]">설정 · 쿠폰 메뉴 이동</p>
              <p className="mt-1">
                게임 실행 후 우측 상단 설정(톱니바퀴) 또는 공식 웹 쿠폰 교환 페이지에
                접속하세요.
              </p>
            </li>
            <li className="rounded-xl border border-white/[0.06] bg-[#080D18]/70 p-3.5">
              <div className="font-mono text-xs font-bold text-[#26C6F9]">STEP 03</div>
              <p className="mt-1 font-semibold text-[#F5F7FF]">코드 입력 및 우편함 확인</p>
              <p className="mt-1">
                대소문자와 공백 없이 붙여넣기 후 게임 내 우편함에서 보상을
                수령하세요.
              </p>
            </li>
          </ol>
        </section>
      )}

      {/* Related Games */}
      <section aria-labelledby="related-games-heading" className="mt-10">
        <h2 id="related-games-heading" className="text-lg font-bold text-[#F5F7FF]">
          관련 모바일게임 쿠폰
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {relatedGames.map((related) => (
            <GameArchiveCard key={related.id} game={related} />
          ))}
        </div>
      </section>
    </main>
  );
}
