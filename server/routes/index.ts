import { configRouter } from '@domains/config/routes';
import { retroSessionsRouter } from '@domains/retroSessions/routes';
import { statsRouter } from '@domains/stats/routes';
import { pokerSessionsRouter } from '@pokerSessions/routes';
import { Router } from 'express';

import { authRouter } from '@auth/routes';

import { metricsRouter } from '@metrics/routes';

import { spacesRouter } from '@spaces/routes';

import { usersRouter } from '@users/routes';

const router = Router();

router.use('/metrics', metricsRouter);
router.use('/stats', statsRouter);
router.use('/config', configRouter);
router.use('/auth', authRouter);
router.use('/spaces', spacesRouter);
router.use('/users', usersRouter);
router.use('/poker-sessions', pokerSessionsRouter);
router.use('/retro-sessions', retroSessionsRouter);

export { router };
