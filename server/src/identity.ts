import { randomUUID } from 'crypto';
import { PALETTE, config } from './config';
import type { Player } from './types';

export function createPlayer(): Player {
  const id = `anon-${randomUUID().replace(/-/g, '').slice(0, 8)}`;
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]!;
  return { id, name: id, color };
}

const ID_RE = /^anon-[0-9a-f]{8}$/;

export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && ID_RE.test(id);
}

export function sanitizeName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  if (trimmed.length < config.NAME_MIN || trimmed.length > config.NAME_MAX) return null;
  return trimmed;
}
