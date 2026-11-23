import { Search } from 'lucide-react';
import { AppLink, useRouter } from '../router';

interface HeaderProps {
  onFocusSearch?: () => void;
}

export function Header({ onFocusSearch }: HeaderProps) {
  const { pathname, navigate } = useRouter();

  const handleQuickSearch = () => {
    if (pathname === '/' && onFocusSearch) {
      onFocusSearch();
      return;
    }
    navigate('/#search');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080D18]/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <AppLink
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg py-1 pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7064FF]"
          aria-label="모쿠몽 홈으로 이동"
        >
          <img
            src="/favicon.svg"
            alt="모쿠몽 로고"
            width={30}
            height={30}
            className="h-7.5 w-7.5 shrink-0 rounded-lg"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-[#F5F7FF]">
              모쿠몽
            </span>
            <span className="hidden text-xs font-medium text-[#A5B0C3] sm:inline">
              모바일게임 쿠폰
            </span>
          </div>
        </AppLink>

        <nav
          aria-label="주요 메뉴"
          className="hidden items-center gap-6 text-sm font-medium md:flex"
        >
          <AppLink
            href="/"
            className={`whitespace-nowrap transition-colors ${
              pathname === '/'
                ? 'text-[#F5F7FF]'
                : 'text-[#A5B0C3] hover:text-[#F5F7FF]'
            }`}
          >
            쿠폰 검색
          </AppLink>
          <AppLink
            href="/#games"
            className="whitespace-nowrap text-[#A5B0C3] transition-colors hover:text-[#F5F7FF]"
          >
            전체 게임
          </AppLink>
          <AppLink
            href="/insights"
            className={`whitespace-nowrap transition-colors ${
              pathname.startsWith('/insights')
                ? 'text-[#F5F7FF]'
                : 'text-[#A5B0C3] hover:text-[#F5F7FF]'
            }`}
          >
            쿠폰 가이드
          </AppLink>
        </nav>

        <div className="flex items-center gap-2">
          <AppLink
            href="/insights"
            className="flex min-h-[44px] items-center rounded-xl px-3 text-xs font-medium text-[#A5B0C3] transition-colors hover:text-[#F5F7FF] md:hidden"
          >
            가이드
          </AppLink>
          <button
            type="button"
            onClick={handleQuickSearch}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-[#121A29] px-3.5 text-xs font-semibold text-[#F5F7FF] transition-colors hover:border-[#7064FF]/60 hover:bg-[#192236] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7064FF]"
            aria-label="게임 검색창으로 이동"
          >
            <Search className="h-4 w-4 text-[#26C6F9]" aria-hidden="true" />
            <span className="whitespace-nowrap">게임 찾기</span>
          </button>
        </div>
      </div>
    </header>
  );
}
