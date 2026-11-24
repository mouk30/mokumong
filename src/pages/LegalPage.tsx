import { ArrowLeft, ChevronRight } from 'lucide-react';
import { AppLink } from '../router';

interface LegalPageProps {
  mode: 'privacy' | 'terms';
}

export function LegalPage({ mode }: LegalPageProps) {
  const isPrivacy = mode === 'privacy';
  const title = isPrivacy ? '개인정보처리방침' : '이용약관';

  return (
    <main className="mx-auto max-w-3xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
      <nav aria-label="경로" className="flex items-center gap-1.5 text-xs text-[#A5B0C3]">
        <AppLink href="/" className="hover:text-[#F5F7FF]">
          홈
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-[#778294]" aria-hidden="true" />
        <span className="font-medium text-[#F5F7FF]">{title}</span>
      </nav>

      <article className="mt-4 rounded-3xl border border-white/[0.08] bg-[#121A29] p-5 sm:p-8">
        <div className="font-mono text-xs font-bold text-[#26C6F9]">
          {isPrivacy ? 'PRIVACY POLICY' : 'TERMS OF SERVICE'} · 2026-09-30
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-[#F5F7FF] sm:text-3xl">
          모쿠몽 {title}
        </h1>

        {isPrivacy ? (
          <div className="mt-5 space-y-5 text-sm leading-relaxed text-[#A5B0C3]">
            <section className="space-y-1.5">
              <h2 className="text-base font-bold text-[#F5F7FF]">1. 개인정보 수집 여부</h2>
              <p>
                모쿠몽(seoulkr.xyz)은 회원가입, 로그인, 결제, 댓글 기능을 제공하지
                않으며 이용자의 이름·이메일·전화번호·게임 계정 정보 등 개인식별정보를
                별도로 수집하거나 저장하지 않습니다.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="text-base font-bold text-[#F5F7FF]">2. 검색 및 클립보드 동작</h2>
              <p>
                게임명 검색과 쿠폰 코드 복사는 이용자 브라우저 내부에서만 동작하며
                검색어나 클립보드 내용이 별도 회원 데이터베이스로 전송되지 않습니다.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="text-base font-bold text-[#F5F7FF]">3. 외부 링크 이동</h2>
              <p>
                각 게임 페이지에 연결된 외부 출처 또는 이벤트 링크를 클릭해 외부 사이트로
                이동하는 경우 해당 사이트의 개인정보처리방침이 적용됩니다.
              </p>
            </section>
          </div>
        ) : (
          <div className="mt-5 space-y-5 text-sm leading-relaxed text-[#A5B0C3]">
            <section className="space-y-1.5">
              <h2 className="text-base font-bold text-[#F5F7FF]">1. 서비스 목적</h2>
              <p>
                본 약관은 모쿠몽(seoulkr.xyz)이 제공하는 모바일게임 쿠폰 정보 검색,
                확인 상태 안내 및 코드 복사 편의 기능의 이용 조건을 규정합니다.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="text-base font-bold text-[#F5F7FF]">2. 쿠폰 정보의 정확성</h2>
              <p>
                쿠폰 코드의 유효 여부, 보상 구성, 만료 시점은 각 게임 개발사·배급사의
                정책에 따라 예고 없이 변경되거나 조기 종료될 수 있으며, 모쿠몽은
                확인일 기준으로 상태를 안내합니다.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="text-base font-bold text-[#F5F7FF]">3. 지식재산권</h2>
              <p>
                사이트에 표기된 각 게임의 명칭과 상표 권리는 해당 저작권자에게 귀속되며,
                본 사이트는 정보 안내 목적으로만 게임명을 표기합니다.
              </p>
            </section>
          </div>
        )}

        <div className="mt-8 border-t border-white/[0.08] pt-5">
          <AppLink
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#7064FF] px-5 text-sm font-bold text-[#F5F7FF] hover:bg-[#5E52EE]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>쿠폰 검색 홈으로</span>
          </AppLink>
        </div>
      </article>
    </main>
  );
}
