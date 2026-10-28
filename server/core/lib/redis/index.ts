import Redis from 'ioredis';

import { log } from '@core/lib/logger';

const redis = new Redis({
  host: process.env.REDIS_HOST as string,
  port: Number.parseInt(process.env.REDIS_PORT as string, 10),
});

redis.on('connect', () => {
  log.info({ methodName: 'redis.connect' }, 'redis connected');
});

redis.on('error', (err) => {
  log.error({
    err,
    methodName: 'redis.connect',
  }, 'redis error');
});

export { redis };
