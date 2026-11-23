import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { CouponItem } from '../types/coupon';
import { copyCouponCode } from '../utils/clipboard';
import { CouponStatusBadge } from './CouponStatusBadge';

interface CouponCopyCardProps {
  gameName: string;
  coupon: CouponItem;
}

export function CouponCopyCard({ gameName, coupon }: CouponCopyCardProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = window.setTimeout(() => setCopyState('idle'), 2400);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    const result = await copyCouponCode(coupon.code);
    if (result.ok) {
      setCopyState('copied');
      return;
    }
    setCopyState('manual');
    if (codeRef.current && typeof window !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(codeRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const isExpired = coupon.status === 'EXPIRED';

  return (
    <article
      className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
        isExpired
          ? 'border-white/[0.06] bg-[#121A29]/75'
          : 'border-white/10 bg-[#192236]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#A5B0C3]">{gameName}</span>
        <CouponStatusBadge status={coupon.status} />
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080D18] px-4 py-3">
          <div className="text-[11px] font-medium text-[#A5B0C3]">쿠폰 코드</div>
          <code
            ref={codeRef}
            className={`mt-0.5 block select-all truncate font-mono text-base font-bold tracking-wider sm:text-lg ${
              isExpired ? 'text-[#778294] line-through' : 'text-[#F5F7FF]'
            }`}
          >
            {coupon.code}
          </code>
        </div>

        {!isExpired && (
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-transform active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6F9] sm:min-w-[144px] ${
              copyState === 'copied'
                ? 'bg-[#30D69A] text-[#080D18]'
                : 'bg-[#7064FF] text-[#F5F7FF] hover:bg-[#5E52EE]'
            }`}
            aria-live="polite"
          >
            {copyState === 'copied' ? (
              <>
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>쿠폰 복사</span>
              </>
            )}
          </button>
        )}
      </div>

      {copyState === 'manual' && (
        <p className="mt-2 text-xs text-[#26C6F9]" role="status">
          자동 복사가 제한된 브라우저입니다. 선택된 코드를 길게 눌러 복사해 주세요.
        </p>
      )}

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-white/[0.06] pt-3 text-xs sm:grid-cols-3">
        <div>
          <dt className="text-[#778294]">보상</dt>
          <dd className="mt-0.5 font-medium text-[#F5F7FF]">{coupon.reward}</dd>
        </div>
        <div>
          <dt className="text-[#778294]">마지막 확인일</dt>
          <dd className="mt-0.5 font-mono tabular-nums text-[#A5B0C3]">
            {coupon.verifiedAt}
          </dd>
        </div>
        <div>
          <dt className="text-[#778294]">만료일</dt>
          <dd className="mt-0.5 font-mono tabular-nums text-[#A5B0C3]">
            {coupon.expiresAt || '별도 공지 시까지'}
          </dd>
        </div>
      </dl>
    </article>
  );
}
