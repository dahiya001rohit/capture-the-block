import { create } from 'zustand';
import { TILE_COUNT } from '../types';
import type { Player, TileState, LeaderboardRow, InitPayload } from '../types';

interface CtbState {
  you: Player | null;
  board: (TileState | null)[];
  top10: LeaderboardRow[];
  totalClaimed: number;
  online: number;
  cooldownUntil: number;
  connected: boolean;

  applyInit: (init: InitPayload) => void;
  setTile: (idx: number, tile: TileState | null) => void;
  setLeaderboard: (top10: LeaderboardRow[], totalClaimed: number) => void;
  setOnline: (count: number) => void;
  setCooldownUntil: (ts: number) => void;
  setConnected: (connected: boolean) => void;
  setMyName: (name: string) => void;
  applyRename: (id: string, name: string) => void;
}

export const useStore = create<CtbState>((set) => ({
  you: null,
  board: new Array(TILE_COUNT).fill(null),
  top10: [],
  totalClaimed: 0,
  online: 0,
  cooldownUntil: 0,
  connected: false,

  applyInit: (init) =>
    set({
      you: init.you,
      board: init.board,
      top10: init.leaderboard.top10,
      totalClaimed: init.leaderboard.totalClaimed,
      online: init.online,
      cooldownUntil: init.cooldownRemaining > 0 ? Date.now() + init.cooldownRemaining : 0,
      connected: true,
    }),

  setTile: (idx, tile) =>
    set((s) => {
      const board = s.board.slice();
      board[idx] = tile;
      return { board };
    }),

  setLeaderboard: (top10, totalClaimed) => set({ top10, totalClaimed }),
  setOnline: (online) => set({ online }),
  setCooldownUntil: (cooldownUntil) => set({ cooldownUntil }),
  setConnected: (connected) => set({ connected }),

  setMyName: (name) =>
    set((s) => (s.you ? { you: { ...s.you, name } } : {})),

  applyRename: (id, name) =>
    set((s) => ({
      you: s.you && s.you.id === id ? { ...s.you, name } : s.you,
      top10: s.top10.map((r) => (r.id === id ? { ...r, name } : r)),
      board: s.board.map((t) => (t && t.ownerId === id ? { ...t, name } : t)),
    })),
}));

export const myTileCount = (s: CtbState): number => {
  if (!s.you) return 0;
  const row = s.top10.find((r) => r.id === s.you!.id);
  if (row) return row.tiles;
  let n = 0;
  for (const t of s.board) if (t && t.ownerId === s.you.id) n++;
  return n;
};
