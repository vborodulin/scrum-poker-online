import { spacesSchemas } from '@chpokify/api-schemas';
import { SPACE_PARTICIPANT_ROLE } from '@chpokify/models-types';
import { Router } from 'express';

import { authMiddleware } from '@core/middleware/auth';
import { validateMiddleware } from '@core/middleware/validate';

import { spacesControllers } from '@spaces/controllers';
import { kanbanRouter } from '@spaces/kanban/routes';
import { spacesMiddlewares } from '@spaces/middlewares';
import { participantsRouter } from '@spaces/participants/routes';
import { storiesRouter } from '@spaces/stories/routes';
import { teamsRouter } from '@spaces/teams/routes';

const spacesRouter = Router();

spacesRouter.post(
  '/',
  authMiddleware(),
  validateMiddleware(spacesSchemas.createReqSchema),
  spacesControllers.create
);

spacesRouter.get(
  '/list/me',
  authMiddleware(),
  spacesControllers.getMyList
);

spacesRouter.post(
  '/invite/validate',
  validateMiddleware(spacesSchemas.validateInviteReqSchema),
  spacesControllers.inviteValidate
);

spacesRouter.post(
  '/invite/accept',
  authMiddleware(),
  validateMiddleware(spacesSchemas.inviteAcceptReqSchema),
  spacesControllers.inviteAccept
);

spacesRouter.use(
  '/:spaceId',
  authMiddleware(),
  spacesMiddlewares.withSpace('params'),
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.PLAYER)
);

spacesRouter.get(
  '/:spaceId',
  spacesControllers.get
);

spacesRouter.patch(
  '/:spaceId',
  validateMiddleware(spacesSchemas.updateReqSchema),
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.ADMIN),
  spacesControllers.update
);

spacesRouter.delete(
  '/:spaceId',
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.ADMIN),
  spacesControllers.remove
);

spacesRouter.post(
  '/:spaceId/invite',
  spacesMiddlewares.checkHasRole(SPACE_PARTICIPANT_ROLE.ADMIN),
  spacesControllers.inviteGen
);

spacesRouter.get(
  '/:spaceId/stat',
  spacesControllers.getStat
);

spacesRouter.use(
  '/:spaceId/teams',
  teamsRouter
);

spacesRouter.use(
  '/:spaceId/participants',
  participantsRouter
);

spacesRouter.use(
  '/:spaceId/stories',
  storiesRouter
);

spacesRouter.use(
  '/:spaceId/kanban',
  kanbanRouter
);

export {
  spacesRouter,
};
