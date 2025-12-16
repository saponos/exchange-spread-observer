import { redisClient } from '../api/redisClient';
import { MAX_SPREADS_COUNT, KEY } from '../lib/const';
import { SpreadType } from '../lib/types';

export async function saveSpread(spreadPercentage: number, timestamp: number): Promise<SpreadType> {
  const spread: SpreadType = { spread: spreadPercentage, timestamp };
  await redisClient.lPush(KEY, JSON.stringify(spread));
  await redisClient.lTrim(KEY, 0, MAX_SPREADS_COUNT - 1);

  return spread;
}

export async function getRecentSpreads(): Promise<SpreadType[]> {
  const items = await redisClient.lRange(KEY, 0, MAX_SPREADS_COUNT - 1);

  return items.map((raw) => JSON.parse(raw) as SpreadType);
}
