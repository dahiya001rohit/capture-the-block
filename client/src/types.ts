export interface Player {
  id: string;
  name: string;
  color: string;
}

export interface TileState {
  ownerId: string;
  color: string;
  name: string;
}

export interface LeaderboardRow {
  id: string;
  name: string;
  color: string;
  tiles: number;
}

export interface LeaderboardPayload {
  top10: LeaderboardRow[];
  totalClaimed: number;
}

export interface InitPayload {
  you: Player;
  board: (TileState | null)[];
  leaderboard: LeaderboardPayload;
  online: number;
  cooldownRemaining: number;
}

export interface TilePayload {
  idx: number;
  ownerId: string;
  color: string;
  name: string;
}

export interface ClaimRejectedPayload {
  idx: number;
  reason: 'cooldown' | 'self' | 'bad_idx';
  ttl?: number;
}

export const BOARD_SIZE = 40;
export const TILE_COUNT = 1600;
export const NAME_MAX = 16;
export const COOLDOWN_MS = 3000;

export const PALETTE = [
  '#FF5470', '#FF8A3D', '#FFC93C', '#F5E663', '#9BE55A',
  '#4ADE80', '#2DD4BF', '#34D3EB', '#3BA9FF', '#5B8DEF',
  '#7C7CFF', '#A66BFF', '#D86BFF', '#FF6BD6', '#FF7AA8',
  '#FF9F40', '#C0F03C', '#5EEAD4', '#6EE7F9', '#B388FF',
];
