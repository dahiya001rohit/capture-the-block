import { useEffect, useRef } from 'react';
import { useStore } from '../../state/store';
import { COOLDOWN_MS } from '../../types';

export function Cooldown() {
  const cooldownUntil = useStore((s) => s.cooldownUntil);
  const color = useStore((s) => s.you?.color ?? '#34D3EB');
  const barRef = useRef<HTMLDivElement>(null);
  const txtRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const rem = cooldownUntil - Date.now();
      const bar = barRef.current;
      const txt = txtRef.current;
      if (rem <= 0) {
        if (bar) bar.style.width = '0%';
        if (txt) { txt.textContent = 'ready'; txt.style.color = '#555555'; }
        return;
      }
      if (bar) bar.style.width = `${(rem / COOLDOWN_MS) * 100}%`;
      if (txt) { txt.textContent = `${(rem / 1000).toFixed(1)}s`; txt.style.color = '#F5F5F5'; }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [cooldownUntil]);

  return (
    <div className="rounded-[10px] border border-[#1A1A1A] bg-[#0A0A0A] px-4 py-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.04em] text-[#555555]">cooldown</span>
        <span ref={txtRef} className="font-mono text-[13px] font-semibold text-[#555555]">
          ready
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-sm bg-[#161616]">
        <div
          ref={barRef}
          className="h-full rounded-sm"
          style={{ width: '0%', backgroundColor: color }}
        />
      </div>
    </div>
  );
}
