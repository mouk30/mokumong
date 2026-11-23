import { Search } from 'lucide-react';
import { AppLink } from '../router';

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <div className="rounded-3xl border border-white/[0.08] bg-[#121A29] p-8">
        <div className="font-mono text-sm font-bold text-[#26C6F9]">404</div>
        <h1 className="mt-2 text-2xl font-extrabold text-[#F5F7FF]">
          요청하신 페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#A5B0C3]">
          주소가 변경되었거나 존재하지 않는 게임 번호입니다. 모쿠몽 메인
          검색창에서 원하는 게임 이름을 직접 입력해 보세요.
        </p>
        <div className="mt-6 flex justify-center">
          <AppLink
            href="/"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#7064FF] px-6 text-sm font-bold text-[#F5F7FF] hover:bg-[#5E52EE]"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>쿠폰 검색 홈으로</span>
          </AppLink>
        </div>
      </div>
    </main>
  );
}
