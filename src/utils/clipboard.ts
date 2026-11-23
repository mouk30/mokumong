export interface CopyResult {
  ok: boolean;
  method: 'clipboard' | 'fallback' | 'manual';
}

export async function copyCouponCode(code: string): Promise<CopyResult> {
  const value = code.trim();
  if (!value) return { ok: false, method: 'manual' };

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return { ok: true, method: 'clipboard' };
    } catch {
      // Fallback below when permissions / insecure context blocks clipboard API
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, value.length);
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (copied) {
        return { ok: true, method: 'fallback' };
      }
    } catch {
      // Ignore and fall back to manual selection cue
    }
  }

  return { ok: false, method: 'manual' };
}
