import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './pool';
import type { TileState } from '../types';

export async function runMigrations(): Promise<void> {
  const sql = readFileSync(join(__dirname, 'migrations.sql'), 'utf8');
  await pool.query(sql);
}

export async function upsertPlayer(id: string, name: string, color: string): Promise<void> {
  await pool.query(
    `INSERT INTO players (id, name, color) VALUES ($1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
    [id, name, color],
  );
}

export async function upsertTiles(batch: { idx: number; ownerId: string; color: string }[]): Promise<void> {
  if (batch.length === 0) return;
  const values: string[] = [];
  const params: (number | string)[] = [];
  batch.forEach((t, i) => {
    values.push(`($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3}, now())`);
    params.push(t.idx, t.ownerId, t.color);
  });
  await pool.query(
    `INSERT INTO tiles (idx, owner_id, color, updated_at) VALUES ${values.join(', ')}
     ON CONFLICT (idx) DO UPDATE SET
       owner_id = EXCLUDED.owner_id, color = EXCLUDED.color, updated_at = EXCLUDED.updated_at`,
    params,
  );
}

export async function loadAllTiles(): Promise<{ idx: number; tile: TileState }[]> {
  const { rows } = await pool.query(
    `SELECT t.idx, t.owner_id, t.color, p.name
     FROM tiles t JOIN players p ON p.id = t.owner_id`,
  );
  return rows.map((r) => ({
    idx: r.idx,
    tile: { ownerId: r.owner_id, color: r.color, name: r.name },
  }));
}
