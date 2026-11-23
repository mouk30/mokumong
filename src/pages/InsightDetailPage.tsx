import { ArrowLeft, ChevronRight } from 'lucide-react';
import { AppLink } from '../router';
import type { InsightArticle } from '../types/coupon';

interface InsightDetailPageProps {
  article: InsightArticle;
}

export function InsightDetailPage({ article }: InsightDetailPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
      <nav aria-label="경로" className="flex items-center gap-1.5 text-xs text-[#A5B0C3]">
        <AppLink href="/" className="hover:text-[#F5F7FF]">
          홈
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-[#778294]" aria-hidden="true" />
        <AppLink href="/insights" className="hover:text-[#F5F7FF]">
          쿠폰 가이드
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-[#778294]" aria-hidden="true" />
        <span className="truncate font-medium text-[#F5F7FF]">
          {article.shortTitle}
        </span>
      </nav>

      <article className="mt-4 rounded-3xl border border-white/[0.08] bg-[#121A29] p-5 sm:p-8">
        <div className="font-mono text-xs font-bold text-[#26C6F9]">
          GUIDE {article.number} · {article.lastModified}
        </div>
        <h1 className="mt-2 text-2xl font-extrabold leading-snug text-[#F5F7FF] sm:text-3xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#A5B0C3]">
          {article.description}
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-white/[0.06] bg-[#080D18]/70 p-4 text-xs sm:grid-cols-2">
          <div>
            <dt className="text-[#778294]">추천 대상</dt>
            <dd className="mt-1 font-medium text-[#F5F7FF]">{article.audience}</dd>
          </div>
          <div>
            <dt className="text-[#778294]">관련 게임 예시</dt>
            <dd className="mt-1 font-medium text-[#F5F7FF]">{article.examples}</dd>
          </div>
        </dl>

        <div className="mt-7 space-y-6">
          {article.sections.map((section) => (
            <section key={section.heading} className="space-y-2.5">
              <h2 className="text-lg font-bold text-[#F5F7FF]">{section.heading}</h2>
              {section.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-sm leading-relaxed text-[#A5B0C3]"
                >
                  {p}
                </p>
              ))}
              {section.points && (
                <ul className="space-y-1.5 pt-1 text-sm text-[#F5F7FF]">
                  {section.points.map((pt, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl border border-white/[0.06] bg-[#192236] px-3.5 py-2.5 text-xs leading-relaxed text-[#A5B0C3]"
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-8 border-t border-white/[0.08] pt-5">
          <AppLink
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#7064FF] px-5 text-sm font-bold text-[#F5F7FF] hover:bg-[#5E52EE]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>쿠폰 검색으로 돌아가기</span>
          </AppLink>
        </div>
      </article>
    </main>
  );
}
