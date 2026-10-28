import { pokerSessionsSchemas } from '@chpokify/api-schemas';
import { SPACE_PARTICIPANT_ROLE } from '@chpokify/models-types';
import { pokerCardDecksRouter } from '@pokerCardDecks/routes';
import { pokersSessionsMiddlewares } from '@pokerSessions/middlewares';
import { Router } from 'express';

import { authMiddleware } from '@core/middleware/auth';
import { validateMiddleware } from '@core/middleware/validate';

import { spacesMiddlewares } from '@spaces/middlewares';

import { pokerSessionsControllers } from './controllers';
import { moderateRouter } from './moderate/routes';
import { playRouter } from './play/routes';

const pokerSessionsRouter = Router();

pokerSessionsRouter.post(
  '/',
  authMiddleware(),
  validateMiddleware(pokerSessionsSchemas.createSchema),
  spacesMiddlewares.withSpace('body'),
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.ADMIN),
  pokerSessionsControllers.create
);

pokerSessionsRouter.post(
  '/invite/validate',
  validateMiddleware(pokerSessionsSchemas.validateInviteReqSchema),
  pokerSessionsControllers.inviteValidate
);

pokerSessionsRouter.use(
  '/spaces/:spaceId',
  authMiddleware(),
  spacesMiddlewares.withSpace('params')
);

pokerSessionsRouter.get(
  '/spaces/:spaceId',
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.PLAYER),
  pokerSessionsControllers.getList
);

pokerSessionsRouter.use(
  '/spaces/:spaceId/card-decks',
  pokerCardDecksRouter
);

pokerSessionsRouter.use(
  '/:pokerSessionId',
  authMiddleware(),
  pokersSessionsMiddlewares.withSession,
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.PLAYER)
);

pokerSessionsRouter.get(
  '/:pokerSessionId',
  pokerSessionsControllers.get
);

pokerSessionsRouter.get(
  '/:pokerSessionId/rating/modal',
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.ADMIN),
  pokerSessionsControllers.openRatingModal
);

pokerSessionsRouter.post(
  '/:pokerSessionId/rating/modal',
  validateMiddleware(pokerSessionsSchemas.setRatingSchema),
  pokerSessionsControllers.setRatingModal
);

pokerSessionsRouter.post(
  '/:pokerSessionId/in-session',
  pokerSessionsControllers.setInSession
);

pokerSessionsRouter.post(
  '/:pokerSessionId/out-session',
  pokerSessionsControllers.leaveSession
);

pokerSessionsRouter.post(
  '/:pokerSessionId/invite',
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.ADMIN),
  validateMiddleware(pokerSessionsSchemas.inviteGenSchema),
  pokerSessionsControllers.inviteGen
);

pokerSessionsRouter.get(
  '/:pokerSessionId/export/csv',
  pokerSessionsControllers.exportCSV
);

pokerSessionsRouter.use(
  '/:pokerSessionId/moderate',
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.ADMIN),
  moderateRouter
);

pokerSessionsRouter.use(
  '/:pokerSessionId/play',
  playRouter
);

export {
  pokerSessionsRouter,
};
