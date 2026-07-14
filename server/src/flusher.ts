import { config } from './config';
import { getAndClearDirty, getTiles } from './redis/store';
import { upsertTiles } from './db/repo';

let timer: NodeJS.Timeout | null = null;
let flushing = false;

export async function flushOnce(): Promise<void> {
  if (flushing) return;
  flushing = true;
  try {
    const dirty = await getAndClearDirty();
    if (dirty.length > 0) {
      const tiles = await getTiles(dirty);
      await upsertTiles(tiles);
    }
  } catch (err) {
    console.error('[flusher] flush failed:', err);
  } finally {
    flushing = false;
  }
}

export function startFlusher(): void {
  timer = setInterval(flushOnce, config.FLUSH_INTERVAL_MS);
}

export async function stopFlusher(): Promise<void> {
  if (timer) clearInterval(timer);
  timer = null;
  await flushOnce();
}
