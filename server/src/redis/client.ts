import { readFileSync } from 'fs';
import { join } from 'path';
import Redis from 'ioredis';
import { config } from '../config';

export const KEYS = {
  board: 'ctb:board',
  leaderboard: 'ctb:lb',
  dirty: 'ctb:dirty',
  cooldown: (playerId: string) => `ctb:cd:${playerId}`,
  player: (playerId: string) => `ctb:player:${playerId}`,
};

export const redis = new Redis(config.redisUrl);

redis.defineCommand('claim', {
  numberOfKeys: 4,
  lua: readFileSync(join(__dirname, 'claim.lua'), 'utf8'),
});

export type ClaimResult = ['ok', string] | ['cooldown', number] | ['self'];

// claim(cooldownKey, boardKey, lbKey, dirtyKey, idx, playerId, color, cooldownMs)
export function runClaim(playerId: string, idx: number, color: string): Promise<ClaimResult> {
  return (redis as any).claim(
    KEYS.cooldown(playerId), KEYS.board, KEYS.leaderboard, KEYS.dirty,
    idx, playerId, color, config.COOLDOWN_MS,
  );
}
