/* eslint-disable */
// must be first: other modules read process.env at import time
import './env';
/* eslint-enable */

import { usersInSessions } from '@pokerSessions/components/UsersInSessions';
import { io, socketConnect } from '@socket';
import config from 'config';
import http from 'http';
import path from 'path';

import { db } from '@core/lib/db';
import { log } from '@core/lib/logger';
import { configurePassport } from '@core/lib/passport';
import { redis } from '@core/lib/redis';

/* eslint-disable */
import { app } from './app';

// register mongoose models
import '@models/user';
import '@models/space';
import '@models/pokerSession';
import '@models/kanban';
import '@models/story';
import '@models/customer';
import '@models/pokerCardDeck';
import '@models/retroSession';
import '@models/retroTemplate';
import '@models/retroCard';
import '@models/retroRelations';
import { sentryInit } from '@core/lib/sentry';

/* eslint-enable */

http.globalAgent.maxSockets = Infinity;
// @ts-ignore
global.__rootdir__ = path.resolve(__dirname, '../');

sentryInit(app);

const ADDRESS = process.env.APP_ADDRESS as string;
const PORT = Number(process.env.APP_PORT);
const SHUTDOWN_TIME = config.get('app.shutdownTime') as number;

let isShuttingDown = false;

const shutdown = async (signal: NodeJS.Signals) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  app.enable('closing');

  log.warn({
    methodName: 'shutdown',
    signal,
  }, 'shutting down');

  global.setTimeout(() => {
    log.error('could not close connections in time, forcing shut down');
    process.exit(1);
  }, SHUTDOWN_TIME).unref();

  try {
    // disconnects all sockets and closes http server (waits for in-flight requests)
    await new Promise<void>((resolve) => {
      io.close(() => resolve());
    });
    log.warn('closed out remaining connections');

    await db.mongoose.connection.close();
    await redis.quit();

    process.exit(0);
  } catch (err) {
    log.error({
      err,
      methodName: 'shutdown',
    }, 'shutdown failed');
    process.exit(1);
  }
};

const main = async () => {
  await db.connect();
  await usersInSessions.restoreTimers();
  const httpServer = http.createServer(app);

  configurePassport();

  socketConnect(httpServer);
  log.info({ methodName: 'main' }, 'socket connected');

  await new Promise<void>((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(PORT, ADDRESS, () => {
      httpServer.off('error', reject);
      resolve();
    });
  });

  log.info({
    methodName: 'main',
    address: ADDRESS,
    port: PORT,
  }, 'server is listening');

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

main()
  .catch((err) => {
    log.error({
      err,
      methodName: 'main',
    }, 'unhandled error');
    process.exit(1);
  });
