import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { config } from './config';
import { app as httpRouter } from './http';
import { runMigrations, loadAllTiles } from './db/repo';
import { boardIsEmpty, hydrateBoard } from './redis/store';
import { redis } from './redis/client';
import { attachGateway } from './gateway';
import { startFlusher, stopFlusher } from './flusher';
import { pool } from './db/pool';

async function main(): Promise<void> {
  await runMigrations();

  if (await boardIsEmpty()) {
    const tiles = await loadAllTiles();
    await hydrateBoard(tiles);
    console.log(`[boot] hydrated ${tiles.length} tiles from postgres`);
  }

  const app = express();
  app.use(httpRouter);
  const server = createServer(app);
  const io = new Server(server, { cors: { origin: config.corsOrigin } });

  attachGateway(io);
  startFlusher();

  server.listen(config.port, () => {
    console.log(`[boot] listening on :${config.port}`);
  });

  // keep free-tier host awake
  const selfUrl = process.env.SELF_URL;
  if (selfUrl) {
    setInterval(() => {
      fetch(`${selfUrl}/health`).catch(() => {});
    }, 8 * 60 * 1000);
  }

  const shutdown = async (): Promise<void> => {
    console.log('[shutdown] flushing and closing...');
    io.close();
    server.close();
    await stopFlusher();
    await pool.end();
    redis.disconnect();
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  console.error('[boot] fatal:', err);
  process.exit(1);
});
