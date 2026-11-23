import { ArrowLeft, ChevronRight } from 'lucide-react';
import { AppLink } from '../router';
import type { JobGuide } from '../types/coupon';

interface JobDetailPageProps {
  job: JobGuide;
}

export function JobDetailPage({ job }: JobDetailPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
      <nav aria-label="경로" className="flex items-center gap-1.5 text-xs text-[#A5B0C3]">
        <AppLink href="/" className="hover:text-[#F5F7FF]">
          홈
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-[#778294]" aria-hidden="true" />
        <span className="font-medium text-[#F5F7FF]">{job.name} 안내</span>
      </nav>

      <article className="mt-4 rounded-3xl border border-white/[0.08] bg-[#121A29] p-5 sm:p-8">
        <div className="font-mono text-xs font-bold text-[#26C6F9]">
          ARCHIVE {job.number} · {job.category}
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-[#F5F7FF] sm:text-3xl">
          {job.name}
        </h1>
        <p className="mt-2 text-sm font-semibold text-[#30D69A]">{job.description}</p>
        <p className="mt-4 text-sm leading-relaxed text-[#A5B0C3]">{job.detail}</p>
        <p className="mt-4 text-xs text-[#778294]">선택 위치: {job.input}</p>

        <div className="mt-7 border-t border-white/[0.08] pt-5">
          <AppLink
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#7064FF] px-5 text-sm font-bold text-[#F5F7FF] hover:bg-[#5E52EE]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>모쿠몽 쿠폰 검색으로 이동</span>
          </AppLink>
        </div>
      </article>
    </main>
  );
}
