import { ChevronRight } from 'lucide-react';
import { INSIGHTS } from '../data/insights';
import { AppLink } from '../router';

export function InsightsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
      <nav aria-label="경로" className="flex items-center gap-1.5 text-xs text-[#A5B0C3]">
        <AppLink href="/" className="hover:text-[#F5F7FF]">
          홈
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-[#778294]" aria-hidden="true" />
        <span className="font-medium text-[#F5F7FF]">쿠폰 가이드</span>
      </nav>

      <header className="mt-4 space-y-2">
        <h1 className="text-2xl font-extrabold text-[#F5F7FF] sm:text-3xl">
          장르별 모바일게임 쿠폰 사용 가이드
        </h1>
        <p className="text-sm text-[#A5B0C3]">
          장르별 쿠폰 등록 위치, 서버 확인 방법, 만료 기준 등 실전 활용 팁을
          정리했습니다.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {INSIGHTS.map((article) => (
          <AppLink
            key={article.slug}
            href={`/insights/${article.slug}`}
            className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#121A29] p-5 transition-colors hover:border-[#7064FF]/60"
          >
            <div>
              <span className="font-mono text-xs font-bold text-[#26C6F9]">
                GUIDE {article.number}
              </span>
              <h2 className="mt-2 text-lg font-bold text-[#F5F7FF]">
                {article.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#A5B0C3]">
                {article.description}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
              <span className="font-mono tabular-nums text-[#778294]">
                {article.lastModified}
              </span>
              <span className="font-semibold text-[#7064FF]">자세히 보기 →</span>
            </div>
          </AppLink>
        ))}
      </div>
    </main>
  );
}
