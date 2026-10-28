import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
// eslint-disable-next-line import-helpers/order-imports
import helmet from 'helmet';

import '@core/lib/prom';

import { passport } from '@core/lib/passport';
import {
  metricsMiddleware,
  shutdownMiddleware,
  localeMiddleware,
  successMiddleware,
  notFoundMiddleware,
  errorMiddleware,
} from '@core/middleware';
import { credentialsIncludeMiddleware } from '@core/middleware/creadentialsInclude';
import { sessionMiddleware } from '@core/middleware/sessionMiddleware';
import { TAppRequest, TAppResponse } from '@core/types';

import { router } from '@routes';

// const RATE_LIMIT_MS = 60 * 1000;
// const RATE_LIMIT_MAX = 400;
const BODY_SIZE = '1mb';

const app = express();

// settings
app.enable('json escape');
app.set('x-powered-by', 'chokify');
app.set('trust proxy', true);

// middleware pipeline

app.use(Sentry.Handlers.requestHandler({
  ip: true,
  user: ['_id', 'email', 'username'],
}));
app.use(Sentry.Handlers.tracingHandler());

app.use(
  cors({
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: true,
    credentials: true,
  })
);

app.use(
  credentialsIncludeMiddleware
);

app.use(helmet());

app.use(bodyParser.json(
  {
    strict: true,
    limit: BODY_SIZE,
    verify(req: TAppRequest, _: TAppResponse, buf: Buffer, encoding: BufferEncoding) {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding);
      }
    },
  }
));
app.use(cookieParser());

app.use(shutdownMiddleware);
app.use(metricsMiddleware);
app.use(localeMiddleware);

// rate limiter
/* app.use(rateLimitMiddleware({
  windowMs: RATE_LIMIT_MS,
  max: RATE_LIMIT_MAX,
})); */

// config session
app.use(sessionMiddleware);

// passport settings
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', router);

app.use(successMiddleware);

// error middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export {
  app,
};
