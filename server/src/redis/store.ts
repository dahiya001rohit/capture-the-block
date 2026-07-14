import { redis, KEYS } from './client';
import { config } from '../config';
import type { TileState, LeaderboardRow, Player } from '../types';

export async function getPlayer(id: string): Promise<Player | null> {
  const h = await redis.hgetall(KEYS.player(id));
  if (!h.name || !h.color) return null;
  return { id, name: h.name, color: h.color };
}

export async function setPlayer(p: Player): Promise<void> {
  await redis.hset(KEYS.player(p.id), { name: p.name, color: p.color });
}

export function getCooldownRemaining(playerId: string): Promise<number> {
  return redis.pttl(KEYS.cooldown(playerId)).then((t) => Math.max(t, 0));
}

async function namesFor(ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const pipe = redis.pipeline();
  ids.forEach((id) => pipe.hget(KEYS.player(id), 'name'));
  const res = await pipe.exec();
  return new Map(ids.map((id, i) => [id, (res?.[i]?.[1] as string) ?? id]));
}

export async function getBoardSnapshot(): Promise<(TileState | null)[]> {
  const raw = await redis.hgetall(KEYS.board);
  const owners = [...new Set(Object.values(raw).map((v) => v.split('|')[0]!))];
  const names = await namesFor(owners);
  const board: (TileState | null)[] = new Array(config.TILE_COUNT).fill(null);
  for (const [idx, val] of Object.entries(raw)) {
    const [ownerId, color] = val.split('|') as [string, string];
    board[Number(idx)] = { ownerId, color, name: names.get(ownerId) ?? ownerId };
  }
  return board;
}

export async function getTopLeaderboard(): Promise<{ top10: LeaderboardRow[]; totalClaimed: number }> {
  const [flat, totalClaimed] = await Promise.all([
    redis.zrevrange(KEYS.leaderboard, 0, 9, 'WITHSCORES'),
    redis.hlen(KEYS.board),
  ]);
  const ids: string[] = [];
  for (let i = 0; i < flat.length; i += 2) ids.push(flat[i]!);
  const pipe = redis.pipeline();
  ids.forEach((id) => pipe.hgetall(KEYS.player(id)));
  const res = await pipe.exec();
  const top10 = ids.map((id, i) => {
    const h = (res?.[i]?.[1] ?? {}) as Record<string, string>;
    return { id, name: h.name ?? id, color: h.color ?? '#888', tiles: Number(flat[i * 2 + 1]) };
  });
  return { top10, totalClaimed };
}

export async function getAndClearDirty(): Promise<number[]> {
  const [members] = await redis.multi().smembers(KEYS.dirty).del(KEYS.dirty).exec()
    .then((r) => [r?.[0]?.[1] ?? []] as [string[]]);
  return members.map(Number);
}

export async function getTiles(idxs: number[]): Promise<{ idx: number; ownerId: string; color: string }[]> {
  if (idxs.length === 0) return [];
  const vals = await redis.hmget(KEYS.board, ...idxs.map(String));
  return idxs.flatMap((idx, i) => {
    const v = vals[i];
    if (!v) return [];
    const [ownerId, color] = v.split('|') as [string, string];
    return [{ idx, ownerId, color }];
  });
}

export async function boardIsEmpty(): Promise<boolean> {
  return (await redis.hlen(KEYS.board)) === 0;
}

export async function hydrateBoard(tiles: { idx: number; tile: TileState }[]): Promise<void> {
  if (tiles.length === 0) return;
  const pipe = redis.pipeline();
  const counts = new Map<string, number>();
  for (const { idx, tile } of tiles) {
    pipe.hset(KEYS.board, idx, `${tile.ownerId}|${tile.color}`);
    counts.set(tile.ownerId, (counts.get(tile.ownerId) ?? 0) + 1);
  }
  for (const [id, n] of counts) pipe.zadd(KEYS.leaderboard, n, id);
  await pipe.exec();
}
