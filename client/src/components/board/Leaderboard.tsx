import { useLayoutEffect, useRef } from 'react';
import { useStore, myTileCount } from '../../state/store';

export function Leaderboard() {
  const top10 = useStore((s) => s.top10);
  const you = useStore((s) => s.you);
  const myCount = useStore(myTileCount);
  const listRef = useRef<HTMLDivElement>(null);
  const prevTops = useRef(new Map<string, number>());

  // FLIP: slide rows to their new position when ranks change
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = list.querySelectorAll<HTMLElement>('[data-id]');
    rows.forEach((el) => {
      const id = el.dataset.id!;
      const top = el.getBoundingClientRect().top;
      const prev = prevTops.current.get(id);
      if (prev !== undefined && prev !== top) {
        el.style.transform = `translateY(${prev - top}px)`;
        el.style.transition = 'none';
        requestAnimationFrame(() => {
          el.style.transition = 'transform 220ms cubic-bezier(0.77,0,0.175,1)';
          el.style.transform = '';
        });
      }
      prevTops.current.set(id, top);
    });
  }, [top10]);

  const myIdx = you ? top10.findIndex((r) => r.id === you.id) : -1;
  const myRank = myIdx >= 0 ? String(myIdx + 1).padStart(2, '0') : '—';

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#1A1A1A] bg-[#0A0A0A]">
      <div className="flex justify-between border-b border-[#1A1A1A] px-4 pb-[11px] pt-[13px]">
        <span className="font-mono text-[11px] tracking-[0.04em] text-[#555555]">leaderboard</span>
        <span className="font-mono text-[11px] text-[#555555]">tiles</span>
      </div>

      <div ref={listRef} className="py-1">
        {top10.map((p, i) => (
          <div key={p.id} data-id={p.id} className="flex items-center gap-2.5 px-4 py-1.5">
            <span className="w-4 flex-none font-mono text-[11px] text-[#555555]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="h-2.5 w-2.5 flex-none rounded-[2px]"
              style={{ backgroundColor: p.color }}
            />
            <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-[#F5F5F5]">
              {p.name}
            </span>
            <span className="font-mono text-[13px] font-semibold text-[#F5F5F5]">
              {p.tiles.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#1A1A1A] bg-[#0D0D0D]">
        <div className="flex items-center gap-2.5 px-4 py-[9px]">
          <span className="w-4 flex-none font-mono text-[11px] text-[#8E8E8E]">{myRank}</span>
          <span
            className="h-2.5 w-2.5 flex-none rounded-[2px] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.85)]"
            style={{ backgroundColor: you?.color ?? '#1A1A1A' }}
          />
          <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-[#F5F5F5]">
            {you?.name ?? '…'} <span className="text-[#555555]">(you)</span>
          </span>
          <span className="font-mono text-[13px] font-semibold text-[#F5F5F5]">
            {myCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
