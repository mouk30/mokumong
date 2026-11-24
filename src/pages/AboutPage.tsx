import { ArrowLeft, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { AppLink } from '../router';

export function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
      <nav aria-label="경로" className="flex items-center gap-1.5 text-xs text-[#A5B0C3]">
        <AppLink href="/" className="hover:text-[#F5F7FF]">
          홈
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-[#778294]" aria-hidden="true" />
        <span className="font-medium text-[#F5F7FF]">서비스 소개</span>
      </nav>

      <article className="mt-4 rounded-3xl border border-white/[0.08] bg-[#121A29] p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/mokumong-cat-mage-logo_52587fb5_28f50208.png"
            alt="모쿠몽 마스코트 로고"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div>
            <div className="font-mono text-xs font-bold text-[#26C6F9]">ABOUT MOKUMONG</div>
            <h1 className="text-2xl font-extrabold text-[#F5F7FF] sm:text-3xl">
              모쿠몽 서비스 소개 및 쿠폰 검증 기준
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#A5B0C3]">
          모쿠몽(seoulkr.xyz)은 모바일게임 이용자가 원하는 게임의 쿠폰 정보를
          빠르게 검색하고, 확인된 쿠폰 코드를 원터치로 복사할 수 있도록 구성된
          모바일게임 쿠폰 허브입니다.
        </p>

        <section className="mt-6 space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#F5F7FF]">
            <ShieldCheck className="h-5 w-5 text-[#30D69A]" aria-hidden="true" />
            <span>투명한 쿠폰 상태 표기 원칙</span>
          </h2>
          <ul className="space-y-2.5 text-xs leading-relaxed text-[#A5B0C3]">
            <li className="rounded-xl border border-white/[0.06] bg-[#192236] p-3.5">
              <strong className="text-[#30D69A]">사용 가능 확인</strong> — 실제 입력 가능
              여부와 보상·확인일이 검증된 코드만 복사 카드에 노출합니다.
            </li>
            <li className="rounded-xl border border-white/[0.06] bg-[#192236] p-3.5">
              <strong className="text-[#26C6F9]">확인 필요 / 원문 참고</strong> — 검증된
              신규 코드가 아직 없는 게임은 임의의 가상 코드를 생성하지 않고 0개로
              정직하게 표기합니다.
            </li>
            <li className="rounded-xl border border-white/[0.06] bg-[#192236] p-3.5">
              <strong className="text-[#A5B0C3]">만료 확인</strong> — 기간이 종료된
              코드는 만료 상태로 구분하여 불필요한 입력 시도를 줄입니다.
            </li>
          </ul>
        </section>

        <section className="mt-6 space-y-2.5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#F5F7FF]">
            <CheckCircle2 className="h-5 w-5 text-[#26C6F9]" aria-hidden="true" />
            <span>주요 제공 기능</span>
          </h2>
          <p className="text-sm leading-relaxed text-[#A5B0C3]">
            회원가입이나 로그인 절차 없이 한글·영문·초성 검색으로 게임을 즉시 찾을 수
            있으며, 장르별 쿠폰 등록 안내와 모바일 친화적 원터치 복사를 지원합니다.
          </p>
        </section>

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
