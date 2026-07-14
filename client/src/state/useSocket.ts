import { useEffect } from 'react';
import { socket, persistId, claim, rename } from '../socket';
import { useStore } from './store';
import { COOLDOWN_MS } from '../types';
import type {
  InitPayload, TilePayload, ClaimRejectedPayload, LeaderboardPayload, TileState,
} from '../types';

// previous tile values for optimistic claims awaiting server confirmation
const pending = new Map<number, TileState | null>();

export function claimTile(idx: number): void {
  const s = useStore.getState();
  if (!s.you) return;
  pending.set(idx, s.board[idx]);
  s.setTile(idx, { ownerId: s.you.id, color: s.you.color, name: s.you.name });
  s.setCooldownUntil(Date.now() + COOLDOWN_MS);
  claim(idx);
}

export function renameMe(name: string): void {
  rename(name);
}

export function useSocket(): void {
  useEffect(() => {
    const s = useStore.getState();

    socket.on('init', (init: InitPayload) => {
      persistId(init.you.id);
      pending.clear();
      s.applyInit(init);
    });

    socket.on('tile', (t: TilePayload) => {
      pending.delete(t.idx);
      s.setTile(t.idx, { ownerId: t.ownerId, color: t.color, name: t.name });
    });

    socket.on('claim:rejected', (r: ClaimRejectedPayload) => {
      const prev = pending.get(r.idx);
      if (prev !== undefined) {
        pending.delete(r.idx);
        s.setTile(r.idx, prev);
      }
      // server always wins: real ttl on cooldown, no cooldown otherwise
      if (r.reason === 'cooldown') s.setCooldownUntil(Date.now() + (r.ttl ?? 0));
      else s.setCooldownUntil(0);
    });

    socket.on('leaderboard', (lb: LeaderboardPayload) =>
      s.setLeaderboard(lb.top10, lb.totalClaimed));
    socket.on('online', (o: { count: number }) => s.setOnline(o.count));
    socket.on('player:renamed', (p: { id: string; name: string }) =>
      s.applyRename(p.id, p.name));
    socket.on('disconnect', () => s.setConnected(false));

    socket.connect();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);
}
