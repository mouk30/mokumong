import { AppLink } from '../router';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.08] bg-[#080D18] py-10 text-sm text-[#A5B0C3]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-md space-y-2">
          <div className="flex items-center gap-2">
            <img
              src="/favicon.svg"
              alt="모쿠몽"
              width={22}
              height={22}
              className="h-5.5 w-5.5 rounded-md"
            />
            <span className="font-bold text-[#F5F7FF]">모쿠몽</span>
            <span className="text-xs text-[#778294]">coupongame.best</span>
          </div>
          <p className="text-xs leading-relaxed text-[#A5B0C3]">
            모쿠몽은 모바일게임 쿠폰 코드를 빠르게 검색하고 원터치로 복사할 수
            있는 쿠폰 전용 허브입니다. 직접 확인되지 않은 코드는 임의로 생성하지
            않으며 상태와 확인일을 투명하게 표기합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium">
          <AppLink href="/" className="hover:text-[#F5F7FF]">
            홈 · 쿠폰 검색
          </AppLink>
          <AppLink href="/insights" className="hover:text-[#F5F7FF]">
            장르별 쿠폰 가이드
          </AppLink>
          <a
            href="/sitemap.xml"
            className="hover:text-[#F5F7FF]"
          >
            사이트맵
          </a>
        </div>
      </div>
    </footer>
  );
}
