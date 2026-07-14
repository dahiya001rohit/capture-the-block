import { memo, useEffect, useRef } from 'react';
import type { TileState } from '../../types';

interface Props {
  idx: number;
  tile: TileState | null;
  isMine: boolean;
  onClick: (idx: number) => void;
}

function TileBase({ idx, tile, isMine, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prevOwner = useRef<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const owner = tile?.ownerId ?? null;
    if (mounted.current && owner && owner !== prevOwner.current) {
      const el = ref.current;
      if (el) {
        el.classList.remove('animate-claim', 'animate-flip');
        void el.offsetWidth; // restart animation
        el.classList.add(isMine ? 'animate-claim' : 'animate-flip');
      }
    }
    prevOwner.current = owner;
    mounted.current = true;
  }, [tile?.ownerId, isMine]);

  return (
    <div
      ref={ref}
      className="aspect-square cursor-pointer rounded-[1px] border transition-[background-color,filter,box-shadow] duration-150 hover:brightness-125 hover:outline hover:outline-1 hover:-outline-offset-1 hover:outline-[rgba(245,245,245,0.4)]"
      title={tile ? tile.name : undefined}
      onClick={() => onClick(idx)}
      style={{
        backgroundColor: tile ? tile.color : '#0E0E0E',
        borderColor: tile ? 'transparent' : '#161616',
        boxShadow: isMine ? 'inset 0 0 0 1.5px rgba(255,255,255,0.85)' : undefined,
      }}
    />
  );
}

export const Tile = memo(TileBase);
