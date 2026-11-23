import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import type { GameCategory } from '../types/coupon';

interface GameIconProps {
  src: string | null;
  name: string;
  category: GameCategory;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-12 w-12 rounded-xl',
  md: 'h-14 w-14 rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl',
  lg: 'h-20 w-20 rounded-2xl sm:h-24 sm:w-24',
};

export function GameIcon({ src, name, category, size = 'md' }: GameIconProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${SIZE_CLASSES[size]} flex shrink-0 flex-col items-center justify-center border border-white/10 bg-[#121A29] text-[#A5B0C3]`}
        aria-label={`${name} (${category}) 기본 아이콘`}
      >
        <Gamepad2 className="h-5 w-5 text-[#7064FF]" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={`${SIZE_CLASSES[size]} shrink-0 overflow-hidden border border-white/10 bg-[#121A29]`}
    >
      <img
        src={src}
        alt={`${name} 게임 아이콘`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
