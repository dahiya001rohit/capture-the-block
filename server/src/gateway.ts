import type { Server, Socket } from 'socket.io';
import { config } from './config';
import { createPlayer, isValidId, sanitizeName } from './identity';
import { runClaim } from './redis/client';
import {
  getPlayer, setPlayer, getBoardSnapshot, getTopLeaderboard, getCooldownRemaining,
} from './redis/store';
import { upsertPlayer } from './db/repo';
import type { Player, ClaimPayload, NameUpdatePayload } from './types';

let leaderboardDirty = false;

async function resolvePlayer(socket: Socket): Promise<Player> {
  const authId = socket.handshake.auth?.id;
  if (isValidId(authId)) {
    const existing = await getPlayer(authId);
    if (existing) return existing;
  }
  const fresh = createPlayer();
  await setPlayer(fresh);
  await upsertPlayer(fresh.id, fresh.name, fresh.color);
  return fresh;
}

function overRateLimit(socket: Socket): boolean {
  const now = Date.now();
  if (now - (socket.data.windowStart ?? 0) > 1000) {
    socket.data.windowStart = now;
    socket.data.claimCount = 0;
  }
  socket.data.claimCount += 1;
  return socket.data.claimCount > config.MAX_CLAIMS_PER_SEC;
}

export function attachGateway(io: Server): void {
  io.on('connection', async (socket: Socket) => {
    const player = await resolvePlayer(socket);
    socket.data.player = player;

    io.emit('online', { count: io.of('/').sockets.size });

    const [board, leaderboard, cooldownRemaining] = await Promise.all([
      getBoardSnapshot(), getTopLeaderboard(), getCooldownRemaining(player.id),
    ]);
    socket.emit('init', {
      you: player, board, leaderboard, online: io.of('/').sockets.size, cooldownRemaining,
    });

    socket.on('claim', async (payload: ClaimPayload) => {
      if (overRateLimit(socket)) {
        socket.disconnect(true);
        return;
      }
      const idx = payload?.idx;
      if (!Number.isInteger(idx) || idx < 0 || idx >= config.TILE_COUNT) {
        socket.emit('claim:rejected', { idx, reason: 'bad_idx' });
        return;
      }
      const me: Player = socket.data.player;
      const result = await runClaim(me.id, idx, me.color);
      if (result[0] === 'ok') {
        io.emit('tile', { idx, ownerId: me.id, color: me.color, name: me.name });
        leaderboardDirty = true;
      } else if (result[0] === 'cooldown') {
        socket.emit('claim:rejected', { idx, reason: 'cooldown', ttl: result[1] });
      } else {
        socket.emit('claim:rejected', { idx, reason: 'self' });
      }
    });

    socket.on('name:update', async (payload: NameUpdatePayload) => {
      const name = sanitizeName(payload?.name);
      if (!name) return;
      const me: Player = socket.data.player;
      me.name = name;
      await setPlayer(me);
      await upsertPlayer(me.id, me.name, me.color);
      io.emit('player:renamed', { id: me.id, name });
      leaderboardDirty = true;
    });

    socket.on('disconnect', () => {
      io.emit('online', { count: io.of('/').sockets.size });
    });
  });

  setInterval(async () => {
    if (!leaderboardDirty) return;
    leaderboardDirty = false;
    io.emit('leaderboard', await getTopLeaderboard());
  }, config.LEADERBOARD_BROADCAST_MS);
}
