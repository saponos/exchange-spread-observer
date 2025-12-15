import { redisClient } from '../api/redisClient';
import { MAX_SPREADS_COUNT, KEY } from '../lib/const';

export async function saveSpread(spread: number, timestamp: number): Promise<void> {
  await redisClient.lPush(KEY, JSON.stringify({ spread, timestamp }));
  await redisClient.lTrim(KEY, 0, MAX_SPREADS_COUNT - 1);
}

export async function getRecentSpreads(): Promise<{ spread: number; timestamp: number }[]> {
  const items = await redisClient.lRange(KEY, 0, MAX_SPREADS_COUNT - 1);

  return items.map((raw) => JSON.parse(raw) as { spread: number; timestamp: number });
}
