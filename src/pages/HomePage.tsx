import { useMemo, useRef, useState } from 'react';
import { BookOpen, Info, Search, Ticket, X } from 'lucide-react';
import { CouponCopyCard } from '../components/CouponCopyCard';
import { GameArchiveCard } from '../components/GameArchiveCard';
import {
  ALL_COUPONS_LINK_URL,
  CATEGORIES,
  GAMES,
  getFeaturedSuggestions,
  getRecentVerifiedCoupons,
} from '../data/games';
import { INSIGHTS } from '../data/insights';
import { AppLink } from '../router';
import type { GameCategory } from '../types/coupon';
import { searchGames } from '../utils/search';

export function HomePage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'전체' | GameCategory>('전체');
  const [onlyWithCoupons, setOnlyWithCoupons] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const indexableGames = useMemo(() => GAMES.filter((g) => g.indexable), []);
  const recentVerified = useMemo(() => getRecentVerifiedCoupons(6), []);
  const suggestions = useMemo(() => getFeaturedSuggestions(), []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchGames(GAMES, query, { includeNonIndexable: false });
  }, [query]);

  const filteredGames = useMemo(() => {
    const base = query.trim() ? searchResults : indexableGames;
    return base.filter((g) => {
      if (selectedCategory !== '전체' && g.category !== selectedCategory) return false;
      if (onlyWithCoupons && !g.coupons.some((c) => c.status === 'VERIFIED')) return false;
      return true;
    });
  }, [indexableGames, onlyWithCoupons, query, searchResults, selectedCategory]);

  const displayedGames = useMemo(() => {
    if (query.trim() || selectedCategory !== '전체') return filteredGames;
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, query, selectedCategory, visibleCount]);

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    setSelectedCategory('전체');
    searchInputRef.current?.focus();
  };

  const handleClearSearch = () => {
    setQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:pt-8">
      {/* Compact Hero + Above-the-Fold Mobile Search */}
      <section
        id="search"
        aria-labelledby="hero-heading"
        className="rounded-3xl border border-white/[0.08] bg-[#121A29] p-5 sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h1
              id="hero-heading"
              className="text-2xl font-extrabold leading-snug tracking-tight text-[#F5F7FF] sm:text-4xl sm:leading-tight"
            >
              모바일게임 쿠폰,
              <br />
              찾고 바로 복사하세요.
            </h1>
            <p className="text-sm leading-relaxed text-[#A5B0C3] sm:text-base">
              원하는 게임을 검색하고 쿠폰 코드를 한 번에 복사하세요. 게임별 쿠폰
              정보와 유효 상태를 편리하게 확인할 수 있습니다.
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#080D18]/70 px-4 py-3 lg:flex">
            <img
              src="/assets/aistudio/mokumong-cat-mage-logo_52587fb5_28f50208.png"
              alt="모쿠몽 마스코트"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div className="text-xs">
              <div className="font-bold text-[#F5F7FF]">등록된 모바일게임</div>
              <div className="mt-0.5 font-mono text-lg font-bold tabular-nums text-[#26C6F9]">
                {indexableGames.length}개
              </div>
            </div>
          </div>
        </div>

        {/* Primary Search Bar */}
        <div className="mt-5">
          <label htmlFor="game-search-input" className="sr-only">
            어떤 게임 쿠폰을 찾으세요?
          </label>
          <div className="relative flex items-center">
            <Search
              className="pointer-events-none absolute left-4 h-5 w-5 text-[#26C6F9]"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              id="game-search-input"
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="어떤 게임 쿠폰을 찾으세요? (한글 · 영문 · 초성 검색)"
              autoComplete="off"
              className="h-13 w-full rounded-2xl border border-[#7064FF]/40 bg-[#080D18] pl-12 pr-12 text-sm text-[#F5F7FF] placeholder:text-[#778294] focus:border-[#26C6F9] focus:outline-none focus:ring-2 focus:ring-[#26C6F9]/30 sm:h-14 sm:text-base"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="검색어 삭제"
                className="absolute right-1.5 flex h-11 w-11 items-center justify-center rounded-xl text-[#A5B0C3] hover:bg-white/5 hover:text-[#F5F7FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6F9]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Suggested Queries */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#778294]">추천 검색</span>
            {suggestions.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSuggestionClick(term)}
                className="min-h-[36px] rounded-xl border border-white/[0.08] bg-[#192236] px-3 text-xs font-medium text-[#A5B0C3] transition-colors hover:border-[#7064FF]/60 hover:text-[#F5F7FF]"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Instant Search Feedback */}
          {query.trim() && (
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#080D18]/80 p-4">
              <div className="flex items-center justify-between text-xs text-[#A5B0C3]">
                <span>
                  <strong className="text-[#F5F7FF]">&ldquo;{query.trim()}&rdquo;</strong>{' '}
                  검색 결과
                </span>
                <span className="font-mono tabular-nums text-[#26C6F9]">
                  {searchResults.length}개
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm font-semibold text-[#F5F7FF]">
                    일치하는 게임이 없습니다.
                  </p>
                  <p className="mt-1 text-xs text-[#A5B0C3]">
                    게임명 띄어쓰기를 줄이거나 초성(예: ㅁㅇㅍ, ㅋㅋㄹ) 또는 영문명으로 다시 검색해 보세요.
                  </p>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {searchResults.slice(0, 6).map((game) => (
                    <div
                      key={game.id}
                      className="flex min-h-[52px] items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-[#121A29] px-3.5 py-2 text-sm hover:border-[#7064FF]/60"
                    >
                      <AppLink
                        href={`/game/${game.id}`}
                        className="min-w-0 flex-1 truncate font-semibold text-[#F5F7FF] hover:text-[#26C6F9]"
                      >
                        {game.name}
                      </AppLink>
                      <a
                        href={ALL_COUPONS_LINK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] shrink-0 items-center rounded-lg bg-[#7064FF]/15 px-3 text-xs font-semibold text-[#26C6F9] transition-colors hover:bg-[#7064FF] hover:text-[#F5F7FF]"
                      >
                        쿠폰 보기
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Latest Verified Coupons Section (Strict Honesty) */}
      <section aria-labelledby="recent-verified-heading" className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-[#30D69A]" aria-hidden="true" />
            <h2
              id="recent-verified-heading"
              className="text-lg font-bold text-[#F5F7FF] sm:text-xl"
            >
              최근 확인 쿠폰
            </h2>
          </div>
          <span className="font-mono text-xs tabular-nums text-[#A5B0C3]">
            검증 완료 {recentVerified.length}건
          </span>
        </div>

        {recentVerified.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {recentVerified.map(({ game, coupon }) => (
              <CouponCopyCard key={coupon.id} gameName={game.name} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#121A29] p-4 sm:p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#26C6F9]" aria-hidden="true" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-[#F5F7FF]">
                현재 직접 검증 완료된 활성 쿠폰 코드가 등록 대기 중입니다.
              </p>
              <p className="text-xs leading-relaxed text-[#A5B0C3]">
                모쿠몽은 확인되지 않은 가상 쿠폰 코드를 임의로 생성하지 않습니다.
                아래 게임별 쿠폰 페이지에서 원문 출처 링크와 마지막 확인일을 바로
                조회할 수 있으며, 실제 코드가 확인되는 대로 원터치 복사 카드가
                제공됩니다.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Category Filter + Full Game Archive */}
      <section id="games" aria-labelledby="archive-heading" className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="archive-heading" className="text-lg font-bold text-[#F5F7FF] sm:text-xl">
              게임별 쿠폰 목록
            </h2>
            <p className="mt-0.5 text-xs text-[#A5B0C3]">
              카테고리를 선택해 모바일게임별 쿠폰 페이지로 바로 이동하세요.
            </p>
          </div>

          <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 self-start rounded-xl border border-white/[0.08] bg-[#121A29] px-3.5 text-xs font-medium text-[#A5B0C3] hover:text-[#F5F7FF]">
            <input
              type="checkbox"
              checked={onlyWithCoupons}
              onChange={(e) => setOnlyWithCoupons(e.target.checked)}
              className="h-4 w-4 rounded accent-[#7064FF]"
            />
            <span>확인된 쿠폰 있는 게임만 보기</span>
          </label>
        </div>

        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="게임 카테고리 필터"
          className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto pb-1"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-xl px-4 text-xs font-semibold transition-colors sm:text-sm ${
                  active
                    ? 'bg-[#7064FF] text-[#F5F7FF]'
                    : 'border border-white/[0.08] bg-[#121A29] text-[#A5B0C3] hover:border-white/20 hover:text-[#F5F7FF]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {displayedGames.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#121A29] px-5 py-10 text-center">
            <p className="text-sm font-semibold text-[#F5F7FF]">
              조건에 맞는 게임이 없습니다.
            </p>
            <p className="mt-1 text-xs text-[#A5B0C3]">
              필터를 해제하거나 전체 카테고리에서 게임을 찾아보세요.
            </p>
            {onlyWithCoupons && (
              <button
                type="button"
                onClick={() => setOnlyWithCoupons(false)}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-[#7064FF] px-4 text-xs font-semibold text-[#F5F7FF]"
              >
                전체 게임 보기
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {displayedGames.map((game) => (
                <GameArchiveCard key={game.id} game={game} />
              ))}
            </div>

            {!query.trim() &&
              selectedCategory === '전체' &&
              visibleCount < filteredGames.length && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(filteredGames.length)}
                    className="inline-flex min-h-[48px] items-center rounded-xl border border-white/10 bg-[#121A29] px-6 text-sm font-semibold text-[#F5F7FF] transition-colors hover:border-[#7064FF]/60 hover:bg-[#192236]"
                  >
                    나머지 {filteredGames.length - visibleCount}개 게임 더 보기
                  </button>
                </div>
              )}
          </>
        )}
      </section>

      {/* Genre Coupon Guides */}
      <section aria-labelledby="guides-heading" className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#26C6F9]" aria-hidden="true" />
            <h2 id="guides-heading" className="text-lg font-bold text-[#F5F7FF]">
              장르별 쿠폰 사용 안내
            </h2>
          </div>
          <AppLink
            href="/insights"
            className="text-xs font-semibold text-[#26C6F9] hover:underline"
          >
            전체 보기
          </AppLink>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INSIGHTS.map((item) => (
            <AppLink
              key={item.slug}
              href={`/insights/${item.slug}`}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#121A29] p-4 transition-colors hover:border-[#7064FF]/60"
            >
              <div>
                <div className="font-mono text-xs font-semibold text-[#26C6F9]">
                  GUIDE {item.number}
                </div>
                <h3 className="mt-1.5 text-sm font-bold text-[#F5F7FF]">
                  {item.shortTitle}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#A5B0C3]">
                  {item.description}
                </p>
              </div>
              <span className="mt-3 text-xs font-semibold text-[#7064FF]">
                가이드 보기 →
              </span>
            </AppLink>
          ))}
        </div>
      </section>

      {/* Crawl-friendly index for Yeti & Googlebot ensuring all indexable /game/:id pages are linked in SSR HTML */}
      <section
        aria-label="등록 모바일게임 색인"
        className="mt-12 rounded-2xl border border-white/[0.06] bg-[#121A29]/60 p-4 sm:p-5"
      >
        <h2 className="text-xs font-bold text-[#A5B0C3]">
          전체 모바일게임 쿠폰 색인 ({indexableGames.length}개)
        </h2>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-[#778294]">
          {indexableGames.map((game) => (
            <AppLink
              key={game.id}
              href={`/game/${game.id}`}
              className="hover:text-[#F5F7FF]"
            >
              {game.name}
            </AppLink>
          ))}
        </div>
      </section>
    </main>
  );
}
