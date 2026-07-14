import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { config } from './config';
import { getBoardSnapshot, getTopLeaderboard } from './redis/store';

export const app = Router();

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get('/board', async (_req: Request, res: Response) => {
  const [board, leaderboard] = await Promise.all([getBoardSnapshot(), getTopLeaderboard()]);
  res.json({ board, leaderboard });
});
