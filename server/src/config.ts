import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 3001),
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/capture_the_block',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  BOARD_SIZE: 40,
  TILE_COUNT: 40 * 40,
  COOLDOWN_MS: 3000,
  FLUSH_INTERVAL_MS: 5000,
  LEADERBOARD_BROADCAST_MS: 750,
  MAX_CLAIMS_PER_SEC: 10,
  NAME_MIN: 1,
  NAME_MAX: 16,
};

export const PALETTE = [
  '#FF5470', '#FF8A3D', '#FFC93C', '#F5E663', '#9BE55A',
  '#4ADE80', '#2DD4BF', '#34D3EB', '#3BA9FF', '#5B8DEF',
  '#7C7CFF', '#A66BFF', '#D86BFF', '#FF6BD6', '#FF7AA8',
  '#FF9F40', '#C0F03C', '#5EEAD4', '#6EE7F9', '#B388FF',
];
