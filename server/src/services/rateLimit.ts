import redis from "../config/redis";

export async function withinRateLimit(
  key: string,
  limit: number,
  windowSec: number
) {
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  return count <= limit;
}
