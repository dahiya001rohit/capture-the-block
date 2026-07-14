import { useCallback, useRef } from 'react';
import { useStore } from '../../state/store';
import { Tile } from './Tile';

interface Props {
  onClaim: (idx: number) => void;
}

export function Board({ onClaim }: Props) {
  const board = useStore((s) => s.board);
  const youId = useStore((s) => s.you?.id);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (idx: number) => {
      const s = useStore.getState();
      if (s.board[idx]?.ownerId === s.you?.id) return;
      if (Date.now() < s.cooldownUntil) {
        const el = gridRef.current?.children[idx] as HTMLElement | undefined;
        if (el) {
          el.style.filter = 'brightness(1.9)';
          setTimeout(() => { el.style.filter = ''; }, 140);
        }
        return;
      }
      onClaim(idx);
    },
    [onClaim],
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-[min(638px,90vw,76vh)] max-w-full items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.04em] text-[#555555]">
          capture/the/block · sector 7
        </span>
        <span className="font-mono text-[11px] text-[#8E8E8E]">40 × 40</span>
      </div>

      <div className="rounded-md border border-[#1A1A1A] bg-[#080808] p-1.5">
        <div
          ref={gridRef}
          className="grid w-[min(626px,88vw,74vh)] grid-cols-[repeat(40,1fr)] gap-[2px]"
        >
          {board.map((tile, idx) => (
            <Tile
              key={idx}
              idx={idx}
              tile={tile}
              isMine={!!tile && tile.ownerId === youId}
              onClick={handleClick}
            />
          ))}
        </div>
      </div>

      <span className="font-mono text-[11px] text-[#555555]">
        click any tile to claim · stealing allowed
      </span>
    </div>
  );
}
