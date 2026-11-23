import { AlertCircle, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import type { CouponStatus } from '../types/coupon';

interface CouponStatusBadgeProps {
  status: CouponStatus;
}

const STATUS_CONFIG: Record<
  CouponStatus,
  { label: string; colorClass: string; Icon: typeof CheckCircle2 }
> = {
  VERIFIED: {
    label: '사용 가능 확인',
    colorClass: 'text-[#30D69A]',
    Icon: CheckCircle2,
  },
  UNVERIFIED: {
    label: '확인 필요',
    colorClass: 'text-[#26C6F9]',
    Icon: HelpCircle,
  },
  EXPIRED: {
    label: '만료 확인',
    colorClass: 'text-[#778294]',
    Icon: Clock,
  },
  UNKNOWN: {
    label: '미확인',
    colorClass: 'text-[#A5B0C3]',
    Icon: AlertCircle,
  },
};

export function CouponStatusBadge({ status }: CouponStatusBadgeProps) {
  const { label, colorClass, Icon } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${colorClass}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
