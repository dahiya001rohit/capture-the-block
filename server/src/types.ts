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

// C -> S
export interface ClaimPayload {
  idx: number;
}

export interface NameUpdatePayload {
  name: string;
}

// S -> C
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

export interface LeaderboardPayload {
  top10: LeaderboardRow[];
  totalClaimed: number;
}

export interface OnlinePayload {
  count: number;
}

export interface PlayerRenamedPayload {
  id: string;
  name: string;
}
